

// src\app\api\uploadimage\route.js

import { NextResponse } from 'next/server';
import { uploadFileToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
	try {
		const formData = await request.formData();
		const file = formData.get('file');
		const folder = formData.get('folder') || 'default_folder'; // Get folder from request or use default
		const buffer = Buffer.from(await file.arrayBuffer());
		const result = await uploadFileToCloudinary(buffer, folder);
		const url = result;
		return new NextResponse(JSON.stringify({ url }), { status: 200 });
	} catch (error) {
		return new NextResponse(JSON.stringify({ message: 'Error uploading image' }), { status: 500 });
	}
}
