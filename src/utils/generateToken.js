// utils/generateToken.js

import dbConnect from '@/lib/dbConnect';
import { jwtVerify, SignJWT } from 'jose';
import users from '@/models/usermodles';

const generateToken = async (payload, options = {}) => {
	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const token = await new SignJWT(payload)
			.setProtectedHeader({ alg: 'HS256' }) // <--- Add this line
			.setExpirationTime(options.expiresIn || '1d')
			.sign(secret);
		return token;
	} catch (error) {
		throw new Error('Error generating token: ' + error.message);
	}
};

export default generateToken;

export const regenerateAccessToken = async (refreshToken) => {
	try {
		await dbConnect();
		console.log("hello");
		const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(process.env.JWT_SECRET));
		console.log(payload)
		const userId = payload.userId;
		console.log(
			"userId", userId,
			"\npayload", payload
		)
		const user = await users.findById({ _id: userId });
		if (!user) {
			throw new Error('User not found');
		}
		if (user.refreshToken !== refreshToken) {
			throw new Error('Invalid refresh token');
		}
		if (user.refreshTokenExpiration < Date.now()) {
			throw new Error('Refresh token has expired');
		}
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const accessToken = await new SignJWT({ userId })
			.setProtectedHeader({ alg: 'HS256' }) // <--- Add this line
			.setExpirationTime('1d')
			.sign(secret);

		console.log("--------------------\n acess toekn", accessToken)
		return accessToken;
	} catch (error) {
		console.error('Error regenerating access token:', error);
		throw error;
	}
};