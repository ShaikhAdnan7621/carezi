// src\app\api\post\text\create\route.js

import { getUserFromCookies } from "@/utils/getUserFromCookies";
import { NextResponse } from "next/server"
import textposts from "@/models/post/textpostmodles";
import dbConnect from "@/lib/dbConnect";

export async function POST(request) {
	try {
		await dbConnect();
		const body = await request.json();
		const accessToken = request.cookies.get('accessToken')?.value;
		if (!accessToken) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const user = await getUserFromCookies(request);
		console.log(user.userId)
		console.log(body)

		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const newPost = new textposts({
			postBy: user.userId,
			content: body.content,
		});
		await newPost.save();


		return NextResponse.json({ message: "Hello Adnan Post Has Bin Saved" })
	} catch (error) {
		console.log(error.message)
		return (NextResponse.json({ message: "something want rong", error: error }, { status: 500 }))
	}
}