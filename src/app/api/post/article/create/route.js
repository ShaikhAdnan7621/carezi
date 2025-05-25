// src\app\api\post\article\create\route.js

import { getUserFromCookies } from "@/utils/getUserFromCookies";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import articleposts from "@/models/post/articlepostmodles";
 

export async function POST(request) {
	try {
		await dbConnect();
		console.log("hello atrical poost rout hited here ")
		console.log("check 1")

		const body = await request.json();
		const { title, content } = body;
		const accessToken = request.cookies.get('accessToken')?.value;
		if (!accessToken) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		console.log("check #")

		console.log("check 2")
		const user = await getUserFromCookies(request);
		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		console.log("check 3")

		// Validate article content
		if (!title || title.trim().length === 0) {
			return NextResponse.json({ message: 'Title is required' }, { status: 400 });
		}

		if (!content || content.trim().length === 0) {
			return NextResponse.json({ message: 'Content is required' }, { status: 400 });
		}

		if (title.length > 200) {
			return NextResponse.json({ message: 'Title is too long' }, { status: 400 });
		}

		if (content.length > 50000) {
			return NextResponse.json({ message: 'Content is too long' }, { status: 400 });
		}

		const newPost = new articleposts({
			postBy: user.userId,
			title: title.trim(),
			content: content.trim(),
			createdAt: new Date()
		});

		const savedPost = await newPost.save();
		return NextResponse.json({ 
			message: "Article posted successfully",
			postId: savedPost._id 
		}, { status: 201 });

	} catch (error) {
		console.error("Error creating article post:", error);
		return NextResponse.json({ 
			message: 'Failed to create article',
			error: error.message 
		}, { status: 500 });
	}

}