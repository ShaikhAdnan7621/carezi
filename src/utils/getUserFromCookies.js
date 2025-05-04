// utils/getUserFromCookies.js

import { jwtVerify } from 'jose';

export const getUserFromCookies = async (request) => {
	const accessToken = request.cookies.get('accessToken')?.value;
	if (!accessToken) {
		return null;
	}

	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const { payload } = await jwtVerify(accessToken, secret);
		return payload;
	} catch (error) {
		console.error('Error verifying access token:', error);
		return null; // Explicitly return null on error
	}
};
