// src\app\api\post\question\create\route.js 

import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect'
import questionposts from "@/models/post/questionpostmodles";
import { getUserFromCookies } from "@/utils/getUserFromCookies";


export async function POST(request) {
	try {
		await dbConnect();
		const body = await request.json();

		const accessToken = request.cookies.get('accessToken')?.value;
		if (!accessToken) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const user = await getUserFromCookies(request);
		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		// Validate question content
		if (!body.question || body.question.trim().length === 0) {
			return NextResponse.json({ message: 'Question content is required' }, { status: 400 });
		}

		if (body.question.length > 5000) { // Add reasonable limit
			return NextResponse.json({ message: 'Question is too long' }, { status: 400 });
		}

		const newPost = new questionposts({
			question: body.question.trim(),
			postBy: user.userId,
			createdAt: new Date()
		});

		const savedPost = await newPost.save();
		return NextResponse.json({ 
			message: 'Question posted successfully',
			postId: savedPost._id 
		}, { status: 201 });

	} catch (error) {
		console.error("Error creating question post:", error);
		return NextResponse.json({ 
			message: 'Failed to create post',
			error: error.message 
		}, { status: 500 });
	}
}