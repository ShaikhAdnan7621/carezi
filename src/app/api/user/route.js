// src\app\api\user\route.js

// get data form cookies token and return the user data by gatting data of the mongodb 
import { NextResponse } from 'next/server';
import users from '@/models/usermodles';
import dbConnect from '@/lib/dbConnect';
import { getUserFromCookies } from '@/utils/getUserFromCookies';
import { uploadFileToCloudinary } from '@/lib/cloudinary';
 


export async function GET(request) {
	try {
		await dbConnect();
		const { userId } = await getUserFromCookies(request);
		// only get user need infor not sensitive info/
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
		// Step 1: Connect to the database
		await dbConnect();

		// Step 2: Parse the form data
		const formData = await request.formData();
		const userId = formData.get('userId');
		const name = formData.get('name');
		const bio = formData.get('bio');
		const profilePic = formData.get('profilePic');

		// Step 3: Validate that userId, name, and bio are provided (profilePic is optional)
		console.log('Received userId:', userId);
		console.log('Received name:', name);
		console.log('Received bio:', bio);
		console.log('Received profilePic:', profilePic);
 

		// Step 4: Find the user by userId
		const user = await users.findById(userId).select('-password -refreshToken');
		if (!user) {
			return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
		}

		// Step 5: Handle profilePic upload if provided
		let profilePicUrl = user.profilePic; // Keep the existing profile picture if no new file is provided
		if (profilePic && profilePic instanceof File) {
			// Upload the new profile picture to Cloudinary or any other cloud service
			try {
				const buffer = Buffer.from(await profilePic.arrayBuffer()); // Convert the file to buffer
				const result = await uploadFileToCloudinary(buffer, 'profile_pics');
				profilePicUrl = result; // The URL of the uploaded profile picture
			} catch (error) {
				console.error('Error uploading profile picture:', error);
				return new NextResponse(
					JSON.stringify({ message: 'Error uploading profile picture', details: error.message }),
					{ status: 500 }
				);
			}
		}

		// Step 6: Update the user profile with the new data 
		const updates = {};

		// Conditionally update fields only if they are provided (not null or undefined)
		if (name) updates.name = name;
		if (bio) updates.bio = bio;
		if (profilePicUrl) updates.profilePic = profilePicUrl; // Always update profilePic if a new URL is provided

		// Now, update the user document
		await users.findByIdAndUpdate(userId, updates);

		return new NextResponse(JSON.stringify({ message: 'User updated successfully' }), { status: 200 });


	} catch (error) {
		console.error('Error occurred while updating user:', error);
		return new NextResponse(
			JSON.stringify({ message: 'Error updating user', details: error.message }),
			{ status: 500 }
		);
	}
}
