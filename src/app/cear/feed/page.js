"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FeedLayout from "@/components/cear/FeedLayout"
import CreateCearForm from "@/components/cear/CreateCearForm"

export default function FeedPage({ searchParams }) {
	const router = useRouter()
	const [posts, setPosts] = useState([])
	const [currentUserId, setCurrentUserId] = useState(null)
	const [pagination, setPagination] = useState({
		page: Number(searchParams.page) || 1,
		pageSize: 10,
		totalPosts: 0,
		totalPages: 1
	})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Convert searchParams object to URL string
	const searchParamsString = new URLSearchParams(searchParams).toString()

	// Fetch posts with current filters
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true)
				const response = await fetch(`/api/cear/feed?${searchParamsString}`)

				if (!response.ok) {
					throw new Error("Failed to fetch posts")
				}

				const data = await response.json()
				setPosts(data.posts)
				setCurrentUserId(data.user.id)
				setPagination(data.pagination)
				setError(null)
			} catch (err) {
				console.error("Error fetching posts:", err)
				setError("Failed to load posts. Please try again.")
			} finally {
				setLoading(false)
			}
		}

		fetchPosts()
	}, [searchParamsString])

	// Handle filter changes
	const handleFilterChange = (filters) => {
		const params = new URLSearchParams(searchParams)

		if (filters.search) {
			params.set("search", filters.search)
		} else {
			params.delete("search")
		}

		if (filters.sortBy) {
			params.set("sortBy", filters.sortBy)
		}

		params.set("page", "1")
		router.push(`?${params.toString()}`)
	}

	// Handle page changes
	const handlePageChange = (newPage) => {
		const params = new URLSearchParams(searchParams)
		params.set("page", newPage.toString())
		router.push(`?${params.toString()}`)
	}

	// Handle post creation
	const handlePostCreated = () => {
		const params = new URLSearchParams(searchParams)
		params.set("page", "1")
		router.push(`?${params.toString()}`)
	}
	
	// Handle like toggled
	const handleLikeToggled = (postId, isLiked) => {
		setPosts(prevPosts => 
			prevPosts.map(post => {
				if (post._id === postId) {
					return {
						...post,
						likeCount: isLiked ? post.likeCount + 1 : post.likeCount - 1,
						isLiked
					}
				}
				return post
			})
		)
	}

	const handleReply = (post) => {
		console.log("Reply to post:", post)
	}

	return (
		<div className="container mx-auto py-6">
			<div className="mb-8 max-w-2xl mx-auto">
				<CreateCearForm onPostCreated={handlePostCreated} />
			</div>

			<FeedLayout
				posts={posts}
				onReply={handleReply}
				onLikeToggled={handleLikeToggled}
				currentUserId={currentUserId}
				isLoading={loading}
				pagination={pagination}
				onFilterChange={handleFilterChange}
				onPageChange={handlePageChange}
			/>

			{error && (
				<div className="bg-red-50 text-red-700 p-4 rounded-md mt-6">
					{error}
				</div>
			)}
		</div>
	)
}
