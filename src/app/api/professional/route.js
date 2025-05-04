
// src\app\api\professional\route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getUserFromCookies } from '@/utils/getUserFromCookies';
import professionals from '@/models/professionalmodles';



export async function GET(request) {
	try {
		await dbConnect();
		const { userId } = await getUserFromCookies(request);
		if (!userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const professional = await professionals.findOne({  userId });
		if (!professional) {
			return NextResponse.json({ message: 'Professional not found' }, { status: 404 });
		}
		console.log(professional);
		return NextResponse.json({ message: 'Professional found', professional }, { status: 200 });

	} catch (error) {
		console.error(error);
		return NextResponse.error();
	}
}