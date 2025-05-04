// src\app\api\admin\professional\application\review

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import users from '@/models/usermodles';
import professionals from '@/models/professionalmodles'

export async function POST(request) {
	try {
		await dbConnect();
		const { userId, approved } = await request.json();
		const adminToken = request.cookies.get('adminToken')?.value;
		if (!adminToken) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const user = await users.findById({ _id: userId });
		if (!user) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 });
		}
		if (approved) {
			const updates = {
				'professionalApplication.status': 'approved',
				isProfessional: true
			};
			await users.findByIdAndUpdate({ _id: userId }, updates);
			const professional = new professionals({
				userId: userId,
				professionType: user.professionalApplication.professionType,
				contactDetails: user.professionalApplication.contactDetails,
			});
			await professional.save();
			return NextResponse.json({ message: 'Application approved successfully' }, { status: 200 });
		}

		await users.findByIdAndUpdate({ _id: userId }, { 'professionalApplication.status': 'rejected' });
		
		return NextResponse.json({ message: 'Application rejected successfully' }, { status: 200 });
	} catch (error) {
		console.error("Error processing application:", error);
		return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
	}
}

