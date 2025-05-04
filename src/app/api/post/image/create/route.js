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
        const newPost = new imageposts({
            postBy: user.userId,
            imageUrl,
            caption,
        });
        await newPost.save();
        return NextResponse.json({ message: "Image post saved successfully" });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}