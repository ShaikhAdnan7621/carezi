// src/app/api/cear/[id]/replies/route.js
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

		// Get query parameters for pagination
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const pageSize = parseInt(searchParams.get("pageSize") || "10");
		const skip = (page - 1) * pageSize;

		// 1. Get total reply count for the main post
		const totalReplies = await Cear.countDocuments({
			isReply: true,
			parentId: id,
			deletedAt: null
		});

		// 2. Find replies to the post (10 replies with pagination)
		const replies = await Cear.find({
			isReply: true,
			parentId: id,
			deletedAt: null
		})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(pageSize)
			.populate("postedBy", "name profilePic")
			.lean();

		// Get reply IDs for queries
		const replyIds = replies.map(reply => reply._id);

		// 3. Get like counts for all replies in one query
		const likeCounts = await CearLike.aggregate([
			{ $match: { cearId: { $in: replyIds } } },
			{ $group: { _id: "$cearId", count: { $sum: 1 } } }
		]);

		// Create a map of reply ID to like count
		const likeCountMap = {};
		likeCounts.forEach(item => {
			likeCountMap[item._id.toString()] = item.count;
		});

		// 4. Get nested reply counts for each reply
		const nestedReplyCounts = await Cear.aggregate([
			{ $match: { isReply: true, parentId: { $in: replyIds }, deletedAt: null } },
			{ $group: { _id: "$parentId", count: { $sum: 1 } } }
		]);

		// Create a map of reply ID to nested reply count
		const replyCountMap = {};
		nestedReplyCounts.forEach(item => {
			replyCountMap[item._id.toString()] = item.count;
		});

		// 5. Check which replies the current user has liked
		const userLikes = await CearLike.find({
			cearId: { $in: replyIds },
			userId
		}).lean();

		const userLikedMap = {};
		userLikes.forEach(like => {
			userLikedMap[like.cearId.toString()] = true;
		});
		
		// 6. Get latest likes for each reply with detailed user info
		const latestLikesPromises = replyIds.map(replyId =>
			CearLike.find({ cearId: replyId })
				.sort({ createdAt: -1 })
				.limit(5)
				.populate("userId", "name profilePic bio profileUrl")
				.lean()
		);
		
		const latestLikesResults = await Promise.all(latestLikesPromises);
		
		// Create a map of reply ID to latest likes
		const latestLikesMap = {};
		replyIds.forEach((replyId, index) => {
			latestLikesMap[replyId.toString()] = latestLikesResults[index];
		});

		// We're not fetching nested replies, just using the counts

		// 7. Combine all data for the response
		const repliesWithDetails = replies.map(reply => {
			const replyId = reply._id.toString();
			return {
				...reply,
				likeCount: likeCountMap[replyId] || 0,
				replyCount: replyCountMap[replyId] || 0,
				isLiked: !!userLikedMap[replyId],
				latestLikes: latestLikesMap[replyId] || []
			};
		});

		return NextResponse.json({
			success: true,
			replies: repliesWithDetails,
			totalReplyCount: totalReplies,
			pagination: {
				page,
				pageSize,
				totalReplies,
				totalPages: Math.ceil(totalReplies / pageSize)
			}
		});

	} catch (error) {
		console.error("Error fetching replies:", error);
		return NextResponse.json(
			{ success: false, error: error.message || "Failed to fetch replies" },
			{ status: 500 }
		);
	}
}
