// src\app\api\auth\login\route.js

import { NextResponse } from 'next/server';
import { z } from 'zod';
import users from '@/models/usermodles';
import dbConnect from '@/lib/dbConnect';
import { comparePassword } from '@/utils/hashpassword';
import generateToken from '@/utils/generateToken';


const loginUserSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(
			/^(?=.*[!@#$%^&*(),.?":{|}<>])/,
			'Password must contain at least one special character'
		),
});

export async function POST(request) {
	try {
		await dbConnect();

		const { email, password } = await request.json();

		const validation = loginUserSchema.safeParse({ email, password });
		if (!validation.success) {
			return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
		}
		const user = await users.findOne({ email });
 		if (!user) { return NextResponse.json({ error: 'User not found' }, { status: 404 }); }
		const passwordMatch = await comparePassword(password, user.password);
		if (!passwordMatch) { return NextResponse.json({ error: 'Incorrect password' }, { status: 401 }); }

		const accessToken = await generateToken({ userId: user._id, email: user.email }, { expiresIn: '1d' });
		const refreshToken = await generateToken({ userId: user._id, email: user.email }, { expiresIn: '7d' });
		const updates = {
			refreshToken: refreshToken,
		};
 
		await users.findByIdAndUpdate(user._id, updates, { new: true });

		const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });

		response.cookies.set('accessToken', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 86400,
			path: '/',
		});

		response.cookies.set('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 604800,
			path: '/',
		});

		console.log("login sucessfully")
		return response;
	} catch (error) {
		console.error('Login API error:', error);
		return NextResponse.json({ message: 'Login failed' }, { status: 500 });
	}
}
