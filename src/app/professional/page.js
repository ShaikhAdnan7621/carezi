"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AlertCircle, Search, MapPin, Briefcase } from "lucide-react"
import Link from "next/link"

const ProfessionalCard = ({ professional }) => {
	return (
		<Card className="group transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg bg-white/90 backdrop-blur-md rounded-xl border border-green-200 h-[380px] flex flex-col shadow-md">
			<CardHeader className="text-center pt-6 pb-4">
				<Avatar className="h-20 w-20 mx-auto mb-4 border-4 border-green-200 shadow-md transition-transform duration-300 group-hover:scale-105">
					<AvatarImage
						src={professional.userId?.profilePic || "/placeholder.svg"}
						alt={professional.userId?.name}
					/>
					<AvatarFallback className="bg-green-200 text-green-700 font-semibold">
						{professional.userId?.name?.split(" ").map(n => n[0]).join("")}
					</AvatarFallback>
				</Avatar>

				<h3 className="font-semibold text-lg text-green-900 mb-2 line-clamp-1">
					{professional.userId?.name || "Unknown"}
				</h3>

				<Badge variant={"secondary"} className="bg-green-100 hover:bg-green-200 text-green-700 inline-flex items-center space-x-1 mx-auto px-3 py-1 rounded-full text-xs font-medium max-w-[140px] truncate transition-colors duration-200">
					<Briefcase className="w-4 h-4" />
					<span>{professional.professionType || "Professional"}</span>
				</Badge>
			</CardHeader>

			<CardContent className="flex-1 px-6 pb-4">
				<div className="space-y-3 h-full flex flex-col">
					<p className="text-gray-700 text-sm line-clamp-3 flex-1">
						{professional.profileSummary?.bio || "No bio available"}
					</p>

					<div className="h-6 flex items-center">
						{professional.userId?.location ? (
							<div className="flex items-center text-sm text-green-600 font-medium ">
								<MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
								<span className="truncate">{professional.userId.location}</span>
							</div>
						) : (
							<div className="text-sm text-gray-400">Location not specified</div>
						)}
					</div>
				</div>
			</CardContent>

			<CardFooter className="pt-0 px-6 pb-6">
				<Link href={`/professional/profile/${professional._id}`} className="w-full">
					<Button className="w-full bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300">
						View Profile
					</Button>
				</Link>
			</CardFooter>
		</Card>
	)
}

export default function ProfessionalsPage() {
	const [professionals, setProfessionals] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [searchTerm, setSearchTerm] = useState("")

	useEffect(() => {
		const fetchProfessionals = async () => {
			setLoading(true)
			try {
				const response = await axios.get("/api/professional/suggestion", {
					params: { search: searchTerm }
				})
				setProfessionals(response.data.data || [])
				setError(null)
			} catch (err) {
				setError(err.response?.data?.error || "Failed to load professionals")
			} finally {
				setLoading(false)
			}
		}

		const debounceTimer = setTimeout(fetchProfessionals, 500)
		return () => clearTimeout(debounceTimer)
	}, [searchTerm])

	return (
		<div className="min-h-screen bg-green-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-10 max-w-lg mx-auto">
					<h1 className="text-4xl font-extrabold text-green-900 mb-6">
						Healthcare Professionals
					</h1>
					<div className="relative max-w-md mx-auto">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
						<Input
							placeholder="Search professionals..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-12 h-12 border border-green-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-300 transition"
						/>
					</div>
				</div>

				{/* Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
					{loading ? (
						Array.from({ length: 8 }).map((_, idx) => (
							<Card
								key={idx}
								className="animate-pulse bg-white/90 border border-green-200 rounded-xl shadow"
							>
								<CardContent className="p-6">
									<div className="flex justify-center mb-4">
										<div className="h-20 w-20 bg-green-200 rounded-full" />
									</div>
									<div className="space-y-3">
										<div className="h-4 bg-green-200 rounded w-3/4 mx-auto" />
										<div className="h-4 bg-green-200 rounded w-1/2 mx-auto" />
										<div className="h-10 bg-green-200 rounded w-full mt-4" />
									</div>
								</CardContent>
							</Card>
						))
					) : professionals.length > 0 ? (
						professionals.map(professional => (
							<ProfessionalCard key={professional._id} professional={professional} />
						))
					) : (
						<div className="col-span-full text-center py-12">
							<AlertCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
							<p className="text-green-600">No professionals found</p>
							{searchTerm && (
								<Button
									onClick={() => setSearchTerm("")}
									variant="outline"
									className="mt-4 border-green-600 text-green-600 hover:bg-green-50"
								>
									Clear Search
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
