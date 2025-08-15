"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Share2, MoreHorizontal, Hash, AtSign, HelpCircle, Eye, EyeOff, Calendar, Edit, Trash2, ImageIcons, ImageIcon, Loader2, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import axios from "axios"
import ImageCarousel from "@/components/ui/image-carousel"
import MarkdownView from "../MarkdownView"
import Link from "next/link"


export default function PostCard({ post, onLikeToggled, onReplyClicked, currentUserId = "USER_ID" }) {
	const [likesCount, setLikesCount] = useState(post.likeCount || 0)
	const [liked, setLiked] = useState(post.isLiked || false)
	const [isLiking, setIsLiking] = useState(false)
	const [showLikesDialog, setShowLikesDialog] = useState(false)
	const [likedUsers, setLikedUsers] = useState([])
	const [loadingLikes, setLoadingLikes] = useState(false)
	const [likesPagination, setLikesPagination] = useState({ page: 1, limit: 10, totalLikes: 0, totalPages: 1, hasMore: false })

	// Helper to parse stringified JSON fields if necessary
	const parsedPost = useMemo(() => {
		let parsedPostedBy = post.postedBy
		let parsedTags = post.tags
		let parsedMentions = post.mentions

		try {
			if (typeof post.postedBy === "string") {
				// Attempt to parse if it's a string that looks like an object
				parsedPostedBy = JSON.parse(post.postedBy.replace(/(\w+):/g, '"$1":'))
			}
		} catch (e) {
			console.warn("Could not parse post.postedBy string:", post.postedBy)
			parsedPostedBy = { name: "Unknown User", profilePic: "/placeholder.svg" } // Fallback
		}

		try {
			if (typeof post.tags === "string") {
				parsedTags = JSON.parse(post.tags)
			}
		} catch (e) {
			console.warn("Could not parse post.tags string:", post.tags)
			parsedTags = [] // Fallback
		}

		try {
			if (typeof post.mentions === "string") {
				parsedMentions = JSON.parse(post.mentions)
			}
		} catch (e) {
			console.warn("Could not parse post.mentions string:", post.mentions)
			parsedMentions = [] // Fallback
		}

		return { ...post, postedBy: parsedPostedBy, tags: parsedTags, mentions: parsedMentions }
	}, [post])

	async function toggleLike() {
		if (isLiking) return
		setIsLiking(true)
		try {
			const response = await axios.post("/api/cear/like", {
				cearId: parsedPost._id
			})

			if (response.data.success) {
				setLiked(response.data.liked)
				setLikesCount((c) => (response.data.liked ? c + 1 : c - 1))
				if (onLikeToggled) onLikeToggled(parsedPost._id, response.data.liked)
			}
		} catch (err) {
			console.error("Error toggling like", err)
		} finally {
			setIsLiking(false)
		}
	}

	async function fetchLikedUsers(page = 1, append = false) {
		if (likesCount === 0) return

		setLoadingLikes(true)
		try {
			const response = await axios.get(`/api/cear/${parsedPost._id}/likes?page=${page}&limit=10`)
			if (response.data) {
				if (append) {
					setLikedUsers(prev => [...prev, ...response.data.likes])
				} else {
					setLikedUsers(response.data.likes)
				}
				setLikesPagination(response.data.pagination)
			}
		} catch (err) {
			console.error("Error fetching liked users", err)
		} finally {
			setLoadingLikes(false)
		}
	}

	const handleShowLikes = async () => {
		if (likesCount === 0) return

		setShowLikesDialog(true)
		if (likedUsers.length === 0) {
			// First use the latestLikes from post props if available
			if (parsedPost.latestLikes && parsedPost.latestLikes.length > 0) {
				setLikedUsers(parsedPost.latestLikes)
				setLikesPagination(prev => ({
					...prev,
					totalLikes: likesCount,
					hasMore: likesCount > parsedPost.latestLikes.length
				}))
			} else {
				await fetchLikedUsers(1, false)
			}
		}
	}

	const handleLoadMoreLikes = async () => {
		if (likesPagination.hasMore) {
			const nextPage = likesPagination.page + 1
			await fetchLikedUsers(nextPage, true)
		}
	}

	const formatDate = (date) => {
		const now = new Date()
		const postDate = new Date(date)
		const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60))

		if (diffInHours < 1) return "Just now"
		if (diffInHours < 24) return `${diffInHours}h ago`
		if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
		return postDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
	}

	const getVisibilityIcon = (visibility) => {
		switch (visibility) {
			case "public":
				return <Eye className="h-3 w-3 text-gray-500" />
			case "private":
				return <EyeOff className="h-3 w-3 text-gray-500" />
			case "connections":
				return <EyeOff className="h-3 w-3 text-gray-500" />
			default:
				return <Eye className="h-3 w-3 text-gray-500" />
		}
	}

	const isOwner = parsedPost.postedBy._id === currentUserId
	const hasAttachments = parsedPost.attachment && parsedPost.attachment.length > 0

	return (
		<TooltipProvider>
			<Card className="w-full mx-auto shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<Avatar className="h-11 w-11 border-2 border-blue-400">
								<AvatarImage src={parsedPost.postedBy.profilePic || "/placeholder.svg"} alt={parsedPost.postedBy.name} />
								<AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
									{parsedPost.postedBy.name?.charAt(0)?.toUpperCase() || "U"}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<div className="flex items-center gap-2">
									<h4 className="font-semibold text-base text-gray-900">{parsedPost.postedBy.name}</h4>
									{parsedPost.isEdited && (
										<Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600">
											<Edit className="h-2.5 w-2.5 mr-1" />
											Edited
										</Badge>
									)}
								</div>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Calendar className="h-3 w-3" />
									<span>{formatDate(parsedPost.createdAt)}</span>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className="flex items-center gap-1">
												{getVisibilityIcon(parsedPost.visibility)}
												<span className="capitalize">{parsedPost.visibility}</span>
											</span>
										</TooltipTrigger>
										<TooltipContent>
											<p>Visibility: {parsedPost.visibility}</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</div>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
									<MoreHorizontal className="h-4 w-4 text-gray-500" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								<DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
									<Share2 className="h-4 w-4" />
									Share
								</DropdownMenuItem>
								{isOwner && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
											<Edit className="h-4 w-4" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem className="flex items-center gap-2 text-destructive cursor-pointer">
											<Trash2 className="h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardHeader>

				<CardContent className="space-y-4 px-6 pb-6">
					<Link href={`/cear/${parsedPost._id}`} className="space-y-4">
						{hasAttachments && (
							<div className=" pt-2">
								{parsedPost.attachment.length > 0 && (
									<div className="space-y-2">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<ImageIcon className="h-4 w-4" />
											<span>
												{parsedPost.attachment.length} image{parsedPost.attachment.length > 1 ? "s" : ""}
											</span>
										</div>
										<div className="carousel-container">
											<ImageCarousel images={parsedPost.attachment} />
										</div>
									</div>
								)}
								<Separator className="my-4" />
							</div>
						)}

						{/* Content */}
						<div className="prose prose-sm max-w-none text-gray-800">
							<MarkdownView
								content={parsedPost.content}
								showControls={false}
								truncate={true}
								maxLines={3}
								hasImages={hasAttachments}
							/>
						</div>

						{/* Question */}
						{parsedPost.haveQuestion && parsedPost.question && (
							<div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg shadow-sm">
								<div className="flex items-center gap-2 mb-2">
									<HelpCircle className="h-5 w-5 text-blue-600" />
									<span className="text-sm font-semibold text-blue-800">Question</span>
								</div>
								<p className="text-blue-700 text-base">{parsedPost.question}</p>
							</div>
						)}
					</Link>

					{/* Tags */}
					{parsedPost.tags && parsedPost.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 pt-2">
							{parsedPost.tags.map((tag, index) => (
								<Badge key={index} variant="secondary" className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700">
									<Hash className="h-2.5 w-2.5 mr-1" />
									{tag}
								</Badge>
							))}
						</div>
					)}

					{/* Mentions */}
					{parsedPost.mentions && parsedPost.mentions.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{parsedPost.mentions.map((mention, index) => (
								<Badge key={index} variant="outline" className="text-xs px-2.5 py-1 border-blue-200 text-blue-700">
									<AtSign className="h-2.5 w-2.5 mr-1" />
									{mention.name || mention}
								</Badge>
							))}
						</div>
					)}

					{/* Actions */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="flex items-center">
								<Button
									variant="ghost"
									size="sm"
									onClick={toggleLike}
									disabled={isLiking}
									className={`gap-2 text-gray-600 hover:bg-gray-100 ${liked ? "text-red-600 hover:text-red-700" : ""}`}
								>
									<Heart className={`h-4 w-4 transition-colors ${liked ? "fill-red-600" : ""}`} />
									<span
										className={`font-medium ${likesCount > 0 ? "cursor-pointer hover:underline" : ""}`}
										onClick={(e) => {
											if (likesCount > 0) {
												e.stopPropagation()
												handleShowLikes()
											}
										}}
									>
										{likesCount}
									</span>
								</Button>
							</div>

							<Link href={`/cear/${parsedPost._id}`}>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onReplyClicked && onReplyClicked(parsedPost)}
									className="gap-2 text-gray-600 hover:bg-gray-100"
								>
									<MessageCircle className="h-4 w-4" />
									<span className="font-medium">{post.replyCount || 0}</span>
								</Button>
							</Link>
							<Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:bg-gray-100">
								<Share2 className="h-4 w-4" />
								<span className="font-medium">Share</span>
							</Button>
						</div>

						{parsedPost.isReply && (
							<Link href={`/cear/${parsedPost.parentId}`}>
								<Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100">
									Reply
								</Badge>
							</Link>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Likes Dialog */}
			<Dialog open={showLikesDialog} onOpenChange={setShowLikesDialog}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Liked by {likesPagination.totalLikes > 0 ? `(${likesPagination.totalLikes})` : ''}</DialogTitle>
					</DialogHeader>
					<div className="max-h-[60vh] overflow-y-auto py-4">
						{likedUsers.length > 0 ? (
							<div className="space-y-4">
								{likedUsers.map((user) => (
									<div key={user._id} className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-md">
										<Avatar className="h-10 w-10 border border-gray-200">
											<AvatarImage src={user.userId?.profilePic || "/placeholder.svg"} alt={user.userId?.name || "User"} />
											<AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
												{(user.userId?.name || "U").charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<Link
												href={user.userId?.profileUrl || `/profile/${user.userId?._id}`}
												className="font-medium text-sm hover:underline"
											>
												{user.userId?.name || "Unknown User"}
											</Link>
											{user.userId?.bio && (
												<p className="text-xs text-gray-500 line-clamp-1">{user.userId.bio}</p>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-gray-500">
								No likes yet
							</div>
						)}

						{loadingLikes && (
							<div className="flex justify-center items-center py-4">
								<Loader2 className="h-5 w-5 animate-spin text-gray-500" />
								<span className="ml-2 text-sm text-gray-500">Loading...</span>
							</div>
						)}
					</div>

					{likesPagination.hasMore && !loadingLikes && (
						<DialogFooter>
							<Button
								variant="outline"
								className="w-full"
								onClick={handleLoadMoreLikes}
							>
								<ChevronDown className="h-4 w-4 mr-2" />
								Show More
							</Button>
						</DialogFooter>
					)}
				</DialogContent>
			</Dialog>
		</TooltipProvider>
	)
}