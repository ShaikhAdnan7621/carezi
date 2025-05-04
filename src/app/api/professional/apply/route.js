import multer from 'multer';
import { uploadFileToCloudinary } from '@/lib/cloudinary';
import users from '@/models/usermodles';
import dbConnect from '@/lib/dbConnect';
import { z } from 'zod';
import { NextResponse } from 'next/server';

// Configure Multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage }).array('verificationDocuments');

// Define the schema with zod
const applicationSchema = z.object({
  professionType: z.string().min(1, { message: 'Profession type is required' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
  email: z.string().email({ message: 'Email must be valid' }),
  userId: z.string().min(1, { message: 'User ID is required' }),
});

export async function POST(req) {
  await dbConnect();

  try {
    // Parse multipart form-data using Multer
    await new Promise((resolve, reject) => {
      upload(req, {}, (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // Parse the form data
    const formData = await req.formData();
    const professionType = formData.get('professionType');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const userId = formData.get('userId');
    const files = formData.getAll('verificationDocuments');

    // Validate the input data with zod
    const validationResult = applicationSchema.safeParse({
      professionType,
      phone,
      email,
      userId,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      return await uploadFileToCloudinary(buffer, 'professional_applications');
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    // Prepare application data
    const applicationData = {
      professionType,
      contactDetails: { phone, email },
      verificationDocuments: uploadedUrls,
    };

    // Check if the user exists
    const user = await users.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user's professional application data
    await users.findByIdAndUpdate(userId, { professionalApplication: applicationData });

    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json({ error: 'Failed to submit application', details: error.message }, { status: 500 });
  }
}
