// src/app/api/cear/like/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CearLike from "@/models/cear/cearlikemodles";
import { getUserFromCookies } from "@/utils/getUserFromCookies";
import User from "@/models/usermodles";

export async function POST(request) {
  try {
    await dbConnect();

    const user = await getUserFromCookies(request);
    if (!user || !user.userId) {
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
    }
    
    // Get request body
    const body = await request.json();
    const { cearId } = body;
    const userId = user.userId;
    
    if (!cearId) {
      return NextResponse.json({ success: false, error: 'Missing cearId' }, { status: 400 });
    }
    
    // Check if user already liked the post
    const existingLike = await CearLike.findOne({ cearId, userId });
    
    if (existingLike) {
      // Unlike: Remove the like
      await CearLike.deleteOne({ _id: existingLike._id });
      return NextResponse.json({ success: true, liked: false });
    } else {
      // Like: Add a new like
      const newLike = new CearLike({
        cearId,
        userId,
      });
      await newLike.save();
      return NextResponse.json({ success: true, liked: true });
    }
    
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to toggle like" },
      { status: 500 }
    );
  }
}