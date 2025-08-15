import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import organizationModel from '@/models/organizationmodles';

import User from '@/models/usermodles';
import { getUserFromCookies } from '@/utils/getUserFromCookies';

export async function POST(request) {
	try {

		// get tokens form cookies and verify user and verify if user is admin
		const user = await getUserFromCookies(request);
		console.log(user)
		// now check thee user form exist in mongod db database and user have isadmin true or not 
		const adminuser = await User.findById(user.userId);
		console.log('adminuser', adminuser);
		const isAdmin = adminuser?.isAdmin || false;

		// validate admin here 

		if (!isAdmin) {
			return new NextResponse(
				JSON.stringify({ message: 'Unauthorized access' }),
				{ status: 401 }
			);
		}

		await dbConnect();

		const data = await request.json();
		console.log("data", data)

		const { organizationId, status, reviewNotes, rejectionReason } = data;
		console.log('Received data:', { organizationId, status, reviewNotes, rejectionReason });

		if (!organizationId || !status) {
			return new NextResponse(
				JSON.stringify({ message: 'Missing required fields' }),
				{ status: 400 }
			);
		}

		// Validate rejection reason for rejected status
		if (status === 'rejected' && !rejectionReason) {
			return new NextResponse(
				JSON.stringify({ message: 'Rejection reason is required when rejecting an organization' }),
				{ status: 400 }
			);
		}

		// Update organization status
		const updateData = {
			status,
			reviewedAt: new Date(),
			reviewNotes: reviewNotes || '',
			isProfileActive: status === 'approved',
			rejectionReason: status === 'rejected' ? rejectionReason : null
		};

		const organization = await organizationModel.findByIdAndUpdate(
			organizationId,
			updateData,
			{ new: true }
		).populate('userId');

		if (!organization) {
			return new NextResponse(
				JSON.stringify({ message: 'Organization not found' }),
				{ status: 404 }
			);
		}

		// Update user's organization application status if needed
		if (organization.userId) {
			await User.findByIdAndUpdate(
				organization.userId._id,
				{ 'organizationStatus': status }
			);
		}

		return new NextResponse(
			JSON.stringify({
				message: `Organization ${status === 'approved' ? 'approved' : 'rejected'}`,
				organization
			}),
			{ status: 200 }
		);

	} catch (error) {
		console.error('Error reviewing organization:', error);
		return new NextResponse(
			JSON.stringify({
				message: 'Error reviewing organization',
				error: error.message
			}),
			{ status: 500 }
		);
	}
}
