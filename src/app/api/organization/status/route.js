
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import organizations from '@/models/organizationmodles';

export async function GET(req) {
	try {
		await dbConnect();

		const { searchParams } = new URL(req.url);
		const userId = searchParams.get('userId');

		if (!userId) {
			return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
		}

		const organization = await organizations.findOne({ userId }).sort({ createdAt: -1 });

		return NextResponse.json({
			_id: organization?._id || null,
			status: organization?.status || 'inactive',
			name: organization?.name || 'No Organization',
			facilityType: organization?.facilityType || 'Unknown',
		}, { status: 200 });
		
	} catch (error) {
		console.error('Error fetching organization status:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
