export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import organizations from '@/models/organizationmodles';
import { getUserFromCookies } from '@/utils/getUserFromCookies';

export async function GET(request) {
	try {
		await dbConnect();

		const user = await getUserFromCookies(request);
		const userId = user?.userId || null;

		if (!userId) {
			return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
		}

		console.log('Fetching organization profile for user:', userId);

		const organization = await organizations.findOne({ userId: userId });

		if (!organization) {
			return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
		}

		return NextResponse.json(organization);

	} catch (error) {
		console.error('Error fetching organization:', error);
		return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
	}
}