// src/app/api/cear/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cear from "@/models/cear/cearmodles";
import CearLike from "@/models/cear/cearlikemodles";
import { getUserFromCookies } from "@/utils/getUserFromCookies";
import mongoose from "mongoose";




export async function GET(request, { params }) {
	try {
		await dbConnect();

		// Get user ID from cookies for authentication
		const user = await getUserFromCookies(request);
		const userId = user?.userId || null;

		if (!userId) {
			return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
		}

		// Get post ID from params
		const { id } = params;

		// Validate ID format
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json({ success: false, error: 'Invalid post ID' }, { status: 400 });
		}

		// Find the post
		const post = await Cear.findById(id)
			.populate("postedBy", "name profilePic")
			.lean();

		if (!post) {
			return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
		}

		// Get like count
		const likeCount = await CearLike.countDocuments({ cearId: id });

		// Check if current user has liked the post
		const userLike = await CearLike.findOne({ cearId: id, userId });

		// Get latest 5 likes with detailed user information
		const latestLikes = await CearLike.find({ cearId: id })
			.sort({ createdAt: -1 })
			.limit(5)
			.populate("userId", "name profilePic bio profileUrl")
			.lean();
			
		// Get reply count
		const replyCount = await Cear.countDocuments({
			isReply: true,
			parentId: id,
			deletedAt: null
		});

		// Add like info and reply count to post
		const postWithLikes = {
			...post,
			likeCount,
			isLiked: !!userLike,
			latestLikes,
			replyCount // Include the reply count in the response
		};

		return NextResponse.json({
			success: true,
			post: postWithLikes
		});

	} catch (error) {
		console.error("Error fetching post:", error);
		return NextResponse.json(
			{ success: false, error: error.message || "Failed to fetch post" },
			{ status: 500 }
		);
	}
}
