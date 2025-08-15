"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FeedLayout from "@/components/cear/FeedLayout"
import CreateCearForm from "@/components/cear/CreateCearForm"

export default function MyPostsClient({ searchParams }) {
	const router = useRouter()

	const params = new URLSearchParams(searchParams)
	params.set("showMine", "true") // always show mine

	const [posts, setPosts] = useState([])
	const [currentUserId, setCurrentUserId] = useState(null)
	const [pagination, setPagination] = useState({
		page: 1,
		pageSize: 10,
		totalPosts: 0,
		totalPages: 1,
	})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true)
				const response = await fetch(`/api/cear/feed?${params.toString()}`)

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
	}, [params.toString()])

	const handleFilterChange = (filters) => {
		const newParams = new URLSearchParams(params.toString())

		if (filters.search) {
			newParams.set("search", filters.search)
		} else {
			newParams.delete("search")
		}

		if (filters.sortBy) {
			newParams.set("sortBy", filters.sortBy)
		}

		newParams.set("page", "1")
		newParams.set("showMine", "true")

		router.push(`?${newParams.toString()}`)
	}

	const handlePageChange = (newPage) => {
		const newParams = new URLSearchParams(params.toString())
		newParams.set("page", newPage.toString())
		newParams.set("showMine", "true")
		router.push(`?${newParams.toString()}`)
	}

	const handlePostCreated = () => {
		const newParams = new URLSearchParams(params.toString())
		newParams.set("page", "1")
		newParams.set("showMine", "true")
		router.push(`?${newParams.toString()}`)
	}

	const handleReply = (post) => {
		console.log("Reply to post:", post)
	}

	return (
		<div className="container mx-auto py-6">
			<h1 className="text-2xl font-bold mb-6 text-center">My Posts</h1>
			<div className="mb-8 max-w-2xl mx-auto">
				<CreateCearForm onPostCreated={handlePostCreated} />
			</div>

			<FeedLayout
				posts={posts}
				onReply={handleReply}
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
