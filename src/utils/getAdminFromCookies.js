// utils/getAdminFromCookies.js
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const getAdminFromCookies = async (request) => {
	const cookiesstore = cookies();
	const adminToken = cookiesstore.get('adminToken')?.value;
	if (!adminToken) {
		return null;
	}

	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const { payload } = await jwtVerify(adminToken, secret);
		return payload; // Contains admin data (userId, email, isAdmin, etc.)
	} catch (error) {
		console.error('Error verifying admin token:', error);
		return null;
	}
};
