// src\app\api\auth\signup\route.js

import { NextResponse } from 'next/server';
import users from '@/models/usermodles';
import dbConnect from '@/lib/dbConnect';
import { z } from 'zod';
import { hashPassword } from '@/utils/hashpassword';

const userSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[!@#$%^&*(),.?":{|}<>])/,
            'Password must contain at least one special character'
        ),
});

// Check if email exists
const checkEmailExists = async (email) => {
	return await users.findOne({ email });
};


// Create new user
const createUser = async (userData) => {
	const hashedPassword = await hashPassword(userData.password);
	const user = new users({
		...userData,
		password: hashedPassword,
	});
	return user.save();
};


export async function POST(request) {
	try {
		await dbConnect();
 		const body = await request.json();
		const validatedData = userSchema.parse(body);
 		const existingUser = await checkEmailExists(validatedData.email);

		if (existingUser) {
			return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
		}

		await createUser(validatedData);

		return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
	} catch (error) {
 		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: error.errors[0].message },
				{ status: 400 }
			);
		}

		console.error('Signup error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
