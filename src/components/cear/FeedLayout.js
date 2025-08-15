"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PostCard from "./PostCard"
import { MessageSquare, TrendingUp, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"

export default function FeedLayout({ posts, onReply, currentUserId, isLoading = false, pagination = null, onFilterChange = () => { }, onPageChange = () => { } }) {
	// Local filter state
	const [searchQuery, setSearchQuery] = useState("")
	const [sortBy, setSortBy] = useState("createdAt")

	// Handle filter application
	const applyFilters = () => {
		onFilterChange({
			search: searchQuery,
			sortBy: sortBy
		})
	}
	if (isLoading) {
		return (
			<div className="space-y-6 max-w-2xl mx-auto">
				{[...Array(3)].map((_, i) => (
					<Card key={i} className="animate-pulse">
						<CardContent className="p-6">
							<div className="flex items-center gap-3 mb-4">
								<div className="h-10 w-10 bg-gray-200 rounded-full"></div>
								<div className="space-y-2">
									<div className="h-4 bg-gray-200 rounded w-24"></div>
									<div className="h-3 bg-gray-200 rounded w-16"></div>
								</div>
							</div>
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 rounded w-full"></div>
								<div className="h-4 bg-gray-200 rounded w-3/4"></div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		)
	}

	if (!posts.length) {
		return (
			<Card className="max-w-2xl mx-auto">
				<CardContent className="flex flex-col items-center justify-center py-12 text-center">
					<MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
					<p className="text-gray-600 mb-4">Be the first to share something with the community!</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-6 max-w-2xl mx-auto">
			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2">
								<TrendingUp className="h-4 w-4" />
								<span>{pagination?.totalPosts || posts.length} posts in your feed</span>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							{/* Search */}
							<div className="relative flex-1 min-w-[200px]">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search posts..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-8"
								/>
							</div>

							{/* Sort */}
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-[140px]">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="createdAt">Latest</SelectItem>
									<SelectItem value="likeCount">Most liked</SelectItem>
								</SelectContent>
							</Select>

							{/* Apply button */}
							<Button size="sm" onClick={applyFilters}>
								<Filter className="h-4 w-4 mr-1" /> Filter
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<Separator />

			{/* Posts */}
			{posts.map((post, index) => (
				<div key={post._id}>
					{console.log(post)}
					<PostCard post={post} onReplyClicked={onReply} currentUserId={currentUserId} />
				</div>
			))}

			{/* Pagination */}
			{pagination && pagination.totalPages > 1 && (
				<div className="flex items-center justify-between pt-4">
					<span className="text-sm text-muted-foreground">
						Page {pagination.page} of {pagination.totalPages}
					</span>

					<div className="flex gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(pagination.page - 1)}
							disabled={pagination.page <= 1}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>

						{Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
							// Calculate page numbers to show
							let pageNum;
							if (pagination.totalPages <= 5) {
								// Show all pages if 5 or fewer
								pageNum = i + 1;
							} else if (pagination.page <= 3) {
								// Near start
								pageNum = i + 1;
							} else if (pagination.page >= pagination.totalPages - 2) {
								// Near end
								pageNum = pagination.totalPages - 4 + i;
							} else {
								// Middle
								pageNum = pagination.page - 2 + i;
							}

							return (
								<Button
									key={i}
									variant={pageNum === pagination.page ? "default" : "outline"}
									size="sm"
									onClick={() => onPageChange(pageNum)}
								>
									{pageNum}
								</Button>
							);
						})}

						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(pagination.page + 1)}
							disabled={pagination.page >= pagination.totalPages}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
