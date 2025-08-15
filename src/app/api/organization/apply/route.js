import multer from 'multer';
import { uploadFileToCloudinary } from '@/lib/cloudinary';
import users from '@/models/usermodles';
import organizations from '@/models/organizationmodles';
import dbConnect from '@/lib/dbConnect';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const storage = multer.memoryStorage();
const upload = multer({ storage }).array('verificationDocuments');

const applicationSchema = z.object({
  name: z.string().min(1, { message: 'Organization name is required' }),
  facilityType: z.string().min(1, { message: 'Facility type is required' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
  email: z.string().email({ message: 'Email must be valid' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  userId: z.string().min(1, { message: 'User ID is required' }),
});

export async function POST(req) {
  await dbConnect();

  try {
    // Check if user already has a pending application
    const formData = await req.formData();
    const userId = formData.get('userId');
    
    const existingApplication = await organizations.findOne({ 
      userId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You already have a pending or approved organization application' },
        { status: 400 }
      );
    }

    // Validate form data
    const validationResult = applicationSchema.safeParse({
      name: formData.get('name'),
      facilityType: formData.get('facilityType'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      city: formData.get('city'),
      state: formData.get('state'),
      country: formData.get('country'),
      userId: userId,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const files = formData.getAll('verificationDocuments');
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Verification documents are required' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      return await uploadFileToCloudinary(buffer, 'organization_applications');
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    const organization = new organizations({
      userId: userId,
      status: 'pending',
      name: formData.get('name'),
      facilityType: formData.get('facilityType'),
      contactDetails: {
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: {
          city: formData.get('city'),
          state: formData.get('state'),
          country: formData.get('country'),
        }
      },
      verificationDocuments: uploadedUrls,
    });

    await organization.save();

    // Update user record to mark organization application
    await users.findByIdAndUpdate(userId, {
      $set: { hasOrganizationApplication: true }
    });

    return NextResponse.json(
      { message: 'Organization application submitted successfully', status: 'pending' },
      { status: 200 }
    );
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json(
      { error: 'Failed to submit application', details: error.message },
      { status: 500 }
    );
  }
}
