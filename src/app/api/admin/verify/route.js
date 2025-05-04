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
		
		console.log("debug 1✅", body.adminPassword)

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
			return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
		}
		const isValidPassword = await comparePassword(body.adminPassword, admin.adminpass);
		if (!isValidPassword) {
			return NextResponse.json({ message: 'Incorrect Password' }, { status: 401 });
		}
		console.log("routed hitted here ✅✅")

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