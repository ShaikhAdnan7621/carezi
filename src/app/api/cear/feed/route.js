
// src/app/api/cear/feed/route.js
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cear from "@/models/cear/cearmodles";
import CearLike from "@/models/cear/cearlikemodles";
import User from "@/models/usermodles"; // Import User model to ensure it's registered
import { getUserFromCookies } from "@/utils/getUserFromCookies";

export async function GET(request) {
	try {
		await dbConnect();

		const uuser = await getUserFromCookies(request);
		const userId = uuser?.userId || null;
		if (!userId) {
			return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 })
		}
		console.log("User ID:", userId)

		// Get query parameters
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const pageSize = parseInt(searchParams.get("pageSize") || "10");

		// Get filter parameters
		const sortBy = searchParams.get("sortBy") || "createdAt";
		const sortOrder = searchParams.get("sortOrder") || "desc";
		const searchQuery = searchParams.get("search") || "";
		const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
		const searchUserId = searchParams.get("userId") || null;


		// Calculate skip for pagination
		const skip = (page - 1) * pageSize;

		// Get showMine parameter
		const showMine = searchParams.get("showMine") === "true";

		// Build filter query
		const filterQuery = {
			isReply: false,
			deletedAt: null
		};

		// Add search query if provided
		if (searchQuery) {
			filterQuery.content = { $regex: searchQuery, $options: 'i' };
		}

		// Add tags filter if provided
		if (tags.length > 0) {
			filterQuery.tags = { $in: tags };
		}

		// Handle user filtering
		if (showMine) {
			// Show only current user's posts
			filterQuery.postedBy = userId;
		} else if (searchUserId) {
			// Use $and to combine conditions: posts by searchUserId AND not by current userId
			filterQuery.$and = [
				{ postedBy: searchUserId },
				{ postedBy: { $ne: userId } }
			];
		} else {
			// Just exclude current user's posts
			filterQuery.postedBy = { $ne: userId };
		}

		// Build sort object
		const sortObject = {};
		sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

		// Query posts with filters
		const posts = await Cear.find(filterQuery)
			.sort(sortObject)
			.skip(skip)
			.limit(pageSize)
			.populate("postedBy", "name profilePic")
			.lean();

		const totalPosts = await Cear.countDocuments(filterQuery);

		// Get post IDs for like queries
		const postIds = posts.map(post => post._id);

		// Get like counts for all posts in one query
		const likeCounts = await CearLike.aggregate([
			{ $match: { cearId: { $in: postIds } } },
			{ $group: { _id: "$cearId", count: { $sum: 1 } } }
		]);
		
		// Get reply counts for all posts in one query
		const replyCounts = await Cear.aggregate([
			{ $match: { isReply: true, parentId: { $in: postIds }, deletedAt: null } },
			{ $group: { _id: "$parentId", count: { $sum: 1 } } }
		]);

		// Create a map of post ID to like count
		const likeCountMap = {};
		likeCounts.forEach(item => {
			likeCountMap[item._id.toString()] = item.count;
		});
		
		// Create a map of post ID to reply count
		const replyCountMap = {};
		replyCounts.forEach(item => {
			replyCountMap[item._id.toString()] = item.count;
		});

		// Get latest 5 likes for each post
		const latestLikesPromises = postIds.map(postId =>
			CearLike.find({ cearId: postId })
				.sort({ createdAt: -1 })
				.limit(5)
				.populate("userId", "name profilePic bio profileUrl")
				.lean()
		);

		const latestLikesResults = await Promise.all(latestLikesPromises);

		// Create a map of post ID to latest likes
		const latestLikesMap = {};
		postIds.forEach((postId, index) => {
			latestLikesMap[postId.toString()] = latestLikesResults[index];
		});

		// Add like counts, reply counts, and latest likes to posts
		const postsWithLikes = posts.map(post => {
			const postId = post._id.toString();
			return {
				...post,
				likeCount: likeCountMap[postId] || 0,
				replyCount: replyCountMap[postId] || 0,
				latestLikes: latestLikesMap[postId] || []
			};
		});

		// Get available tags for filters
		const availableTags = await Cear.distinct('tags', { isReply: false, deletedAt: null });

		return NextResponse.json({
			success: true,
			posts: postsWithLikes,
			pagination: {
				page,
				pageSize,
				totalPosts,
				totalPages: Math.ceil(totalPosts / pageSize)
			},
			filters: {
				sortBy,
				sortOrder,
				search: searchQuery,
				tags,
				userId: searchUserId,
				availableTags
			},
			user: {
				id: userId
			}
		});

	} catch (error) {
		console.error("Error fetching posts:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to fetch posts" },
			{ status: 500 }
		);
	}
}

