// src\app\api\admin\professional\application\getapplications\route.js

import { NextResponse } from 'next/server';
import users from '@/models/usermodles';
import dbConnect from '@/lib/dbConnect';

export async function GET(request) {
	try {
		await dbConnect();
		const adminToken = request.cookies.get('adminToken')?.value;
		if (!adminToken) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		// professionalApplication.status = 'pending'; 
		const applicants = await users.find({
			'professionalApplication.status': 'pending'
		});

		return NextResponse.json({ message: 'Applications fetched successfully', applicants }, { status: 200 });
	} catch (error) {
		console.error('Admin applications API error:', error);
		return NextResponse.json({ message: 'Failed to fetch applications' }, { status: 500 });
	}
}
