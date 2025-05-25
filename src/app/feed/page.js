"use client"
import CreatPostFromTriger from '@/components/feed/CreatPostFrom'
import MarkdownView from '@/components/view';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ImageIcon, FileText, MessageCircleQuestion, LetterText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";

export default function page() {
	return (
		<TooltipProvider>
			<div className="pt-5">
				<CreatPostFromTriger />
				<Feed />
			</div>
		</TooltipProvider>
	)
}

const Feed = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedPost, setSelectedPost] = useState(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const postsPerPage = 12;

	const fetchPosts = async (pageNum) => {
		try {
			const skip = (pageNum - 1) * postsPerPage;
			const response = await axios.post('/api/post/all/read', { 
				limit: postsPerPage, 
				skip 
			});
			return response.data.data;
		} catch (error) {
			console.error('Error fetching posts:', error);
			throw error;
		}
	};

	useEffect(() => {
		const fetchInitialPosts = async () => {
			setLoading(true);
			setError(null);
			try {
				const initialPosts = await fetchPosts(1);
				setPosts(initialPosts);
				setHasMore(initialPosts.length === postsPerPage);
			} catch (error) {
				setError('Failed to load posts.');
			} finally {
				setLoading(false);
			}
		};

		fetchInitialPosts();
	}, []);

	const loadMore = async () => {
		if (loadingMore) return;
		
		setLoadingMore(true);
		try {
			const nextPage = page + 1;
			const newPosts = await fetchPosts(nextPage);
			
			if (newPosts.length > 0) {
				setPosts(currentPosts => [...currentPosts, ...newPosts]);
				setPage(nextPage);
				setHasMore(newPosts.length === postsPerPage);
			} else {
				setHasMore(false);
			}
		} catch (error) {
			console.error('Error loading more posts:', error);
		} finally {
			setLoadingMore(false);
		}
	};

	if (loading) {
		return (
			<div className='w-full space-y-4'>
				{[1, 2, 3].map((i) => (
					<Card key={i} className='p-4'>
						<div className='flex items-center space-x-4'>
							<Skeleton className='h-12 w-12 rounded-full' />
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[200px]' />
								<Skeleton className='h-4 w-[150px]' />
							</div>
						</div>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className='w-full'>
			<div className='mt-4 mb-4 max-w-[600px] mx-auto space-y-4'>
				{posts.map((post) => (
						<Card 
							key={post._id} 
							className="cursor-pointer hover:shadow-md transition-shadow"
							onClick={() => setSelectedPost(post)}
						>
						<CardHeader className='pb-4'>
							<div className='flex justify-between items-start'>
								<div className='flex items-center space-x-3'>
									<Avatar>
										<AvatarImage src={post.postBy.profilePic} alt={post.postBy.name} />
										<AvatarFallback>{post.postBy.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<div>
										<p className='font-semibold'>{post.postBy.name}</p>
										<p className='text-sm text-muted-foreground'>{post.postBy.bio}</p>
									</div>
								</div>
								<PostTypeIndicator post={post} />
							</div>
						</CardHeader>
						<Separator className="mb-4" />
						<CardContent>
							{post.question && <MarkdownView content={post.question} />}
							{post.content && !post.imageUrl && !post.title && (
								<MarkdownView content={post.content} />
							)}
							{post.imageUrl && (
								<div className='space-y-3'>
									<div className='relative rounded-lg overflow-hidden'>
										<img 
											src={post.imageUrl} 
											alt="Post Image" 
											className="object-cover w-full h-full"
										/>
									</div>
									{post.caption && <MarkdownView content={post.caption} />}
								</div>
							)}
							{post.title && post.content && (
								<article className='prose prose-zinc dark:prose-invert max-w-none'>
									<h1 className='text-2xl font-bold tracking-tight mb-4'>{post.title}</h1>
									<MarkdownView content={post.content} />
								</article>
							)}
						</CardContent>
					</Card>
				))}
				
				{hasMore && (
					<div className="flex justify-center py-4">
						<Button 
							variant="outline" 
							onClick={loadMore} 
							disabled={loadingMore}
							className="w-full max-w-[200px]"
						>
							{loadingMore ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Loading...
								</>
							) : (
								'Load More'
							)}
						</Button>
					</div>
				)}
			</div>

			<Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					{selectedPost && (
						<>
							<DialogHeader>
								<div className='flex items-center space-x-3 mb-4'>
									<Avatar>
										<AvatarImage src={selectedPost.postBy.profilePic} alt={selectedPost.postBy.name} />
										<AvatarFallback>{selectedPost.postBy.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<div>
										<p className='font-semibold'>{selectedPost.postBy.name}</p>
										<p className='text-sm text-muted-foreground'>{selectedPost.postBy.bio}</p>
									</div>
								</div>
								{selectedPost.title && (
									<DialogTitle className="text-2xl font-bold">
										{selectedPost.title}
									</DialogTitle>
								)}
							</DialogHeader>
							
							<div className="mt-4">
								{selectedPost.question && <MarkdownView content={selectedPost.question} />}
								{selectedPost.content && !selectedPost.imageUrl && !selectedPost.title && (
									<MarkdownView content={selectedPost.content} />
								)}
								{selectedPost.imageUrl && (
									<div className='space-y-3'>
										<div className='relative aspect-video rounded-lg overflow-hidden'>
											<img 
												src={selectedPost.imageUrl} 
												alt="Post Image" 
												className="object-contain w-full h-full"
											/>
										</div>
										{selectedPost.caption && <MarkdownView content={selectedPost.caption} />}
									</div>
								)}
								{selectedPost.title && selectedPost.content && (
									<article className='prose prose-zinc dark:prose-invert max-w-none'>
										<MarkdownView content={selectedPost.content} />
									</article>
								)}
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

const PostTypeIndicator = ({ post }) => {
	const types = [
		{ condition: post.question, badge: 'Q', tooltip: 'Question Post' },
		{ condition: post.content && !post.imageUrl && !post.title, badge: 'T', tooltip: 'Text Post' },
		{ condition: post.imageUrl, badge: 'I', tooltip: 'Image Post' },
		{ condition: post.title && post.content, badge: 'A', tooltip: 'Article' }
	];

	const activeType = types.find(type => type.condition);

	if (!activeType) return null;

	return (
		<Tooltip>
			<TooltipTrigger>
				<Badge variant="secondary" className="px-2 py-1 font-medium">
					{activeType.badge}
				</Badge>
			</TooltipTrigger>
			<TooltipContent>
				{activeType.tooltip}
			</TooltipContent>
		</Tooltip>
	);
};