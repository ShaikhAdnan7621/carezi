// src\app\api\userdatafornav\route.js

// get data form cookies token and return the user data by gatting data of the mongodb 
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import users from '@/models/usermodles';
import professionals from '@/models/professionalmodles';
import organizations from '@/models/organizationmodles';
import dbConnect from '@/lib/dbConnect';
import { getUserFromCookies } from '@/utils/getUserFromCookies';
import { uploadFileToCloudinary } from '@/lib/cloudinary';
import * as z from "zod";
import { userSchema } from "@/lib/validations/user";
import organizationmodles from '@/models/organizationmodles';
import professionalmodles from '@/models/professionalmodles';

export async function GET(request) {
	try {
		await dbConnect();

		const { userId } = await getUserFromCookies(request);
		if (!userId) {
			return new NextResponse(JSON.stringify({ message: 'Authentication required' }), { status: 401 });
		}

		// 1. Fetch base user data with selected fields
		const user = await users.findById(userId)
			.select('name email profilePic isProfessional isAdmin professionalApplication.status')
			.lean();
		if (!user) {
			return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
		}

		// 2. Fetch professional data if the user is a professional
		let professionalProfile = null;
		if (user.isProfessional) {
			professionalProfile = await professionalmodles.findOne({ userId })
				.select('professionType profileSummary.headline experience.organizationId experience.organization experience.role')
				.lean();
		} else {
			console.log("GET /api/userdatafornav: User is not a professional. Skipping professional profile fetch.");
		}

		const managedOrganizations = await organizationmodles.find({ userId })
			.select('_id name facilityType profilePic status isProfileActive')
			.lean();

		// 4. Combine all data into a single response object
		const responseData = {
			...user,
			professionalProfile,
			managedOrganizations,
		};

		return new NextResponse(JSON.stringify(responseData), { status: 200 });

	} catch (error) {
		console.error('Error fetching user navigation data:', error);
		return new NextResponse(JSON.stringify({ message: 'Error fetching user data' }), { status: 500 });
	}
}
