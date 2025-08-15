// src\app\admin\verify\route.js

import { NextResponse } from 'next/server';
import users from '@/models/usermodles';
import dbConnect from '@/lib/dbConnect';
import { comparePassword, hashPassword } from '@/utils/hashpassword';
import generateToken from '@/utils/generateToken';
import { getUserFromCookies } from '@/utils/getUserFromCookies';


export async function POST(request) {
	try {

		await dbConnect();
		const body = await request.json();
		if (!body.adminPassword) {
			return NextResponse.json({ message: 'Admin Password is required' }, { status: 400 });
		}


		// get information form token 
		const accessToken = request.cookies.get('accessToken')?.value;
		if (!accessToken) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const user = await getUserFromCookies(request);

		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const admin = await users.findOne({ _id: user.userId });
		if (!admin) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 });
		}


		if (!admin.adminpass) {
			return NextResponse.json({ message: 'Admin password not set' }, { status: 401 });
		}
 
		const isValidPassword = await comparePassword(body.adminPassword, admin.adminpass);

		console.log("Is Valid Password:", isValidPassword);
		if (!isValidPassword) {
			return NextResponse.json({ message: 'Invalid admin password' }, { status: 401 });
		}

		// Update user to be admin if not already
		if (!admin.isAdmin) {
			await users.updateOne(
				{ _id: admin._id },
				{ $set: { isAdmin: true } }
			);
		}

		const adminToken = await generateToken({ userId: admin._id, email: admin.email, isAdmin: true }, { expiresIn: '1d' });
		const response = NextResponse.json({ message: 'Admin Verified' }, { status: 200 });
		response.cookies.set('adminToken', adminToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 86400,
			path: '/',
		});
		return response;

	} catch (error) {
		console.error('Admin Verify API error:', error);
		return NextResponse.json({ message: 'Admin Verification Failed' }, { status: 500 });
	}
}