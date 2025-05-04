// src\app\api\auth\refreshtoken\route.js

import users from '@/models/usermodles';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import generateToken from '@/utils/generateToken';
import { comparePassword } from '@/utils/hashpassword';

export async function POST(request) {
    try {
		console.log("-------------------------------------\nRefresh Token Route Hitted\n-------------------------------------")
        await dbConnect();
        const refreshToken = request.cookies.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.json({ error: 'Refresh token not found' }, { status: 401 });
        }

        const user = await users.findOne({ refreshToken });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }


        const accessToken = await generateToken({ userId: user._id, email: user.email }, { expiresIn: '1d' });

        const response = NextResponse.json({ message: 'Token refreshed successfully', accessToken }, { status: 200 });
        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400,
            path: '/',
        });
		console.log("refresh token sucessfully\n-------------------------------------")
        return response;
    } catch (error) {
        console.error('Refresh token API error:', error);
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
    }
}
