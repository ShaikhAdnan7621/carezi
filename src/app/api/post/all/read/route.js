// src/app/api/post/all/read/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import textposts from '@/models/post/textpostmodles';
import imageposts from '@/models/post/imagepostmodles';
import articaposts from '@/models/post/articalpostmodles';
import questionposts from '@/models/post/questionpostmodles'; // Fix the import to match the correct variable name
import users from '@/models/usermodles'; // Add this line to import the users model
import { all } from 'axios';

export async function POST(request) {
    try {
        await dbConnect();
        const { limit, skip } = await request.json();
		console.log(limit, skip)
        // Fetch posts from all types
        const textPosts = await textposts.find({}).populate('postBy', 'name bio profilePic').limit(limit).skip(skip).sort({ createdAt: -1 }).lean();
        const imagePosts = await imageposts.find({}).populate('postBy', 'name bio profilePic').limit(limit).skip(skip).sort({ createdAt: -1 }).lean();
        const articlePosts = await articaposts.find({}).populate('postBy', 'name bio profilePic').limit(limit).skip(skip).sort({ createdAt: -1 }).lean();
        const questionPosts = await questionposts.find({}).populate('postBy', 'name bio profilePic').limit(limit).skip(skip).sort({ createdAt: -1 }).lean();

        // Combine and sort all posts
        const allPosts = [...textPosts, ...imagePosts, ...questionPosts, ...articlePosts];
        allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
console.log(allPosts)
        return NextResponse.json({ data: allPosts });
    } catch (error) {
        console.error('Error fetching all posts:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}