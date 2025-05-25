// src\app\api\post\image\create\route.js 
import { getUserFromCookies } from "@/utils/getUserFromCookies";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import imageposts from "@/models/post/imagepostmodles"; // Make sure you have this model

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { imageUrl, caption } = body;
        const accessToken = request.cookies.get('accessToken')?.value;
        if (!accessToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const user = await getUserFromCookies(request);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Validate image URL and caption
        if (!imageUrl || !imageUrl.trim()) {
            return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
        }

        if (caption && caption.length > 1000) {
            return NextResponse.json({ message: 'Caption is too long' }, { status: 400 });
        }

        const newPost = new imageposts({
            postBy: user.userId,
            imageUrl: imageUrl.trim(),
            caption: caption ? caption.trim() : '',
            createdAt: new Date()
        });

        const savedPost = await newPost.save();
        return NextResponse.json({ 
            message: "Image posted successfully",
            postId: savedPost._id 
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating image post:", error);
        return NextResponse.json({ 
            message: 'Failed to create image post',
            error: error.message 
        }, { status: 500 });
    }
}