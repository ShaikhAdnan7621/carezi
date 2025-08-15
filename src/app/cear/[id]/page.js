"use client"

import React, { useEffect, useState } from 'react';
import PostCard from '@/components/cear/PostCard';
import CreateCearForm from '@/components/cear/CreateCearForm';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator"


export default function CearDetailPage({ params }) {
	const { id } = params;
	const [post, setPost] = useState(null);
	const [replies, setReplies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalReplyCount, setTotalReplyCount] = useState(0);
	const [pagination, setPagination] = useState({
		page: 1,
		pageSize: 10,
		totalPages: 1
	});

	// Load Cear + replies
	useEffect(() => {
		async function loadPost() {
			setLoading(true);
			try {
				// First fetch just the post
				const postRes = await axios.get(`/api/cear/${id}`);
				setPost(postRes.data.post);

				// Fetch replies with pagination
				const repliesRes = await axios.get(`/api/cear/${id}/replies?page=${pagination.page}&pageSize=${pagination.pageSize}`);
				setReplies(repliesRes.data.replies || []);
				setTotalReplyCount(repliesRes.data.totalReplyCount || 0);

				// Update pagination
				if (repliesRes.data.pagination) {
					setPagination({
						page: repliesRes.data.pagination.page,
						pageSize: repliesRes.data.pagination.pageSize,
						totalPages: repliesRes.data.pagination.totalPages
					});
				}
			} catch (error) {
				console.error("Error loading post:", error);
				setPost(null);
				setReplies([]);
			} finally {
				setLoading(false);
			}
		}
		loadPost();
	}, [id, pagination.page, pagination.pageSize]);

	// Handle page change
	const handlePageChange = (newPage) => {
		setPagination(prev => ({
			...prev,
			page: newPage
		}));
	};

	// Handle post creation
	// Handle post creation
	const handlePostCreated = (newPost) => {
		if (newPost) {
			// Add the new reply to the top of the list
			setReplies(prevReplies => [newPost, ...prevReplies]);

			// Update the total reply count
			setTotalReplyCount(prevCount => prevCount + 1);

			// Make sure we're on the first page to see the new reply
			setPagination(prev => ({
				...prev,
				page: 1
			}));
		} else {
			// If no post data is returned, just refresh the page
			setPagination(prev => ({
				...prev,
				page: 1
			}));
		}
	};





	if (loading) return <p className="text-center py-10">Loading...</p>;
	if (!post) return <p className="text-center py-10">Post not found.</p>;

	return (
		<div className="max-w-3xl mx-auto py-8 space-y-6">
			<PostCard post={post} />
			<Card className="space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
				<CardHeader className="border-b pb-4">
					<CardTitle>
						<h3 className="text-xl font-semibold text-gray-800">Replies ({totalReplyCount})</h3>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">Write a Reply</h3>
					<CreateCearForm isReply parentId={id} onPostCreated={handlePostCreated} />

					<Separator className="my-2" />

					<div className="space-y-4">
						{totalReplyCount === 0 && (
							<p className="text-gray-500 text-center py-4">No replies yet. Be the first to reply!</p>
						)}
						{replies.map((reply) => (
							<div key={reply._id} className="mb-6">
								<PostCard post={reply} />
							</div>
						))}
					</div>

					{/* Pagination */}
					{pagination.totalPages > 1 && (
						<div className="flex justify-center items-center gap-2 pt-4">
							<button
								className={`px-3 py-1 rounded ${pagination.page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
								onClick={() => handlePageChange(pagination.page - 1)}
								disabled={pagination.page === 1}
							>
								Previous
							</button>

							<span className="text-sm text-gray-600">
								Page {pagination.page} of {pagination.totalPages}
							</span>

							<button
								className={`px-3 py-1 rounded ${pagination.page === pagination.totalPages ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
								onClick={() => handlePageChange(pagination.page + 1)}
								disabled={pagination.page === pagination.totalPages}
							>
								Next
							</button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
