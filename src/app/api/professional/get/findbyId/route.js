// src\app\api\professional\get\findbyId
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getUserFromCookies } from '@/utils/getUserFromCookies';
import professionals from '@/models/professionalmodles';
import users from  '@/models/usermodles'
import organizationModel from '@/models/organizationmodles' // Adjust path if needed

export async function GET(request) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const professionalId = searchParams.get('id');

		if (!professionalId) {
			return NextResponse.json({ error: 'Professional ID is required' }, { status: 400 });
		}

        const professional = await professionals
			.findById(professionalId)
            .populate('userId', 'name email phone profilePic'); // Add any other fields you need

		if (!professional) {
			return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
		}
  
		return NextResponse.json(professional);

	} catch (error) {
		console.error(error);
		return NextResponse.error();
	}
}
