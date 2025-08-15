// src\app\api\user\route.js

// get data form cookies token and return the user data by gatting data of the mongodb 
import { NextResponse } from 'next/server';
import users from '@/models/usermodles';
import dbConnect from '@/lib/dbConnect';
import { getUserFromCookies } from '@/utils/getUserFromCookies';
import { uploadFileToCloudinary } from '@/lib/cloudinary';
import * as z from "zod";
import { userSchema } from "@/lib/validations/user";
 
export async function GET(request) {
	try {
		await dbConnect();
		const { userId } = await getUserFromCookies(request);

		const user = await users.findById(userId).select('-password -refreshToken -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires -failedLoginAttempts -adminpass');
		if (!user) {
			return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
		}

		return new NextResponse(JSON.stringify(user), { status: 200 });
	} catch (error) {
		return new NextResponse(JSON.stringify({ message: 'Error fetching users' }), { status: 500 });
	}
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { userId } = await getUserFromCookies(request);
    console.log('Updating user:', userId);
    
    const formData = await request.formData();
    const updateData = {
      name: formData.get('name'),
      email: formData.get('email'),
      bio: formData.get('bio'),
    };

    // Handle vital stats
    const vitalStatsString = formData.get('vitalStats');
    if (vitalStatsString) {
      const vitalStats = JSON.parse(vitalStatsString);
      
      // Clean up vitalStats object by removing empty values
      const cleanVitalStats = {
        bloodType: vitalStats.bloodType || undefined,
        allergies: vitalStats.allergies || [],
        height: vitalStats.height || undefined,
        weight: vitalStats.weight || undefined,
        age: vitalStats.age || undefined,
        bmi: vitalStats.bmi || undefined,
        checkups: vitalStats.checkups || [],
        healthIssues: vitalStats.healthIssues || [],
        interests: vitalStats.interests || [],
        emergencyContact: {
          name: vitalStats.emergencyContact?.name || undefined,
          relation: vitalStats.emergencyContact?.relation || undefined,
          phone: vitalStats.emergencyContact?.phone || undefined
        },
        lifestyle: {
          exercise: {
            frequency: vitalStats.lifestyle?.exercise?.frequency || undefined,
            preferredActivities: vitalStats.lifestyle?.exercise?.preferredActivities || []
          },
          diet: {
            status: vitalStats.lifestyle?.diet?.status || undefined,
            restrictions: vitalStats.lifestyle?.diet?.restrictions || [],
            preferredDiet: vitalStats.lifestyle?.diet?.preferredDiet || undefined
          },
          sleepPattern: {
            hoursPerDay: vitalStats.lifestyle?.sleepPattern?.hoursPerDay || undefined,
            quality: vitalStats.lifestyle?.sleepPattern?.quality || undefined
          },
          stressLevel: vitalStats.lifestyle?.stressLevel || undefined
        }
      };

      // Remove undefined values recursively
      const removeEmpty = (obj) => {
        Object.keys(obj).forEach(key => {
          if (obj[key] && typeof obj[key] === 'object') {
            removeEmpty(obj[key]);
            if (Object.keys(obj[key]).length === 0) {
              delete obj[key];
            }
          } else if (obj[key] === undefined || obj[key] === '') {
            delete obj[key];
          }
        });
        return obj;
      };

      const cleanedVitalStats = removeEmpty(cleanVitalStats);
      if (Object.keys(cleanedVitalStats).length > 0) {
        updateData.vitalStats = cleanedVitalStats;
      }
    }

    console.log('Update data:', JSON.stringify(updateData, null, 2));

    // Handle profile picture
    const profilePicFile = formData.get('profilePic');
    if (profilePicFile instanceof Blob) {
      const bytes = await profilePicFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadedUrl = await uploadFileToCloudinary(buffer, {
        folder: 'profile-pictures',
        resource_type: 'auto'
      });
      if (uploadedUrl) {
        updateData.profilePic = uploadedUrl;
      }
    } else if (profilePicFile === "null") {
      updateData.profilePic = null;
    }

    // Only update if we have fields to update
    if (Object.keys(updateData).length === 0) {
		console.log("nor fields provided for update");
      return new Response(
        JSON.stringify({ message: 'No fields provided for update' }), 
        { status: 400 }
      );
    }

    // Update user with only modified fields
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { 
        new: true, 
        runValidators: true,
        // Only return non-sensitive fields
        select: '-password -refreshToken -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires -failedLoginAttempts -adminpass'
      }
    );

    if (!updatedUser) {
      console.log('User not found:', userId);
      return new Response(
        JSON.stringify({ message: 'User not found' }), 
        { status: 404 }
      );
    }

    console.log('User updated successfully');
    return new Response(JSON.stringify(updatedUser), { status: 200 });
    
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          message: "Validation failed", 
          errors: error.flatten().fieldErrors 
        }), 
        { status: 400 }
      );
    }
    return new Response(
      JSON.stringify({ 
        message: 'Error updating user', 
        error: error.message 
      }), 
      { status: 500 }
    );
  }
}