// src\app\api\post\question\create\route.js 

import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect'
import questionposts from "@/models/post/questionpostmodles";


export async function POST(request) {
	try {
		dbConnect()
		const body = await request.json();
		console.log(body)

		if (!accessToken) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const user = await getUserFromCookies(request);
		console.log(user.userId)
		console.log(body)

		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const newPost = new questionposts({
			question: body.question,
			postBy: user.userId,
		});

		const response = await newPost.save();
		console.log(response)

		if (response) {
			return NextResponse.json({ message: 'Question posted successfully' }, { status: 200 });
		} else {
			return NextResponse.json({ message: 'Failed to post question' }, { status: 500 });
		}

	}
	catch {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}