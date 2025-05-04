// src\app\api\post\text\read\route.js
import dbConnect from '@/lib/dbConnect';
import textposts from '@/models/post/textpostmodles'; 
import users from '@/models/usermodles'; // Add this line to import the users model
import { NextResponse } from 'next/server';

export async function POST(request) {
	try {
		await dbConnect();
		const body = await request.json();

		// Fetch posts along with user details
		const posts = await textposts.find({})
			.populate('postBy', 'name bio profilePic' ) 

		console.log(posts);
		return NextResponse.json(
			{ data: posts },
			{ status: 200 }
		);
	} 
	catch (error) {
		console.log(error.message)
		return NextResponse.json(
			{ error: error.message },
			{ status: 500 }
		);
	}
}
