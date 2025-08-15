
// src\app\api\professional\get\route.js
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getUserFromCookies } from '@/utils/getUserFromCookies';
import professionals from '@/models/professionalmodles';
import users from "@/models/usermodles";


export async function GET(request) {
	try {
		await dbConnect();
		const { userId } = await getUserFromCookies(request);
		if (!userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const professional = await professionals.findOne({  userId }).populate('userId');
		if (!professional) {
			return NextResponse.json({ message: 'Professional not found' }, { status: 404 });
		} 
		return NextResponse.json({ message: 'Professional found', professional }, { status: 200 });

	} catch (error) {
		console.error(error);
		return NextResponse.error();
	}
}