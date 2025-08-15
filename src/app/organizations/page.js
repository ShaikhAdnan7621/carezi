"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AlertCircle, Search, MapPin, Users, Building2 } from "lucide-react"
import Link from "next/link"

const OrganizationCard = ({ organization }) => {
	return (
		<Card className="flex flex-col group hover:shadow-xl transition-all duration-300 border border-green-100 bg-gradient-to-br from-green-50/50 to-emerald-50/30 hover:scale-[1.02] ">
			<CardHeader className="pb-3 flex-shrink-0">
				<div className="flex flex-col items-center text-center">
					<Avatar className="h-16 w-16 border-2 border-green-200 shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300">
						<AvatarImage
							src={organization.logo || "/placeholder.svg?height=64&width=64"}
							alt={organization.name}
						/>
						<AvatarFallback className="bg-green-100 text-green-700 text-sm font-medium">
							{organization.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
						</AvatarFallback>
					</Avatar>
					<h3 className="font-semibold text-base text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-green-700 transition-colors">{organization.name}</h3>
					<Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-2 py-1 group-hover:bg-green-200 transition-colors">
						{organization.facilityType}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="flex-1 flex flex-col justify-between pt-0 px-4">
				<p className="text-gray-600 text-xs line-clamp-2 mb-3 min-h-[2rem] group-hover:text-gray-700">
					{organization.summary?.bio || "Healthcare facility providing quality medical services."}
				</p>

				<div className="flex items-center justify-between text-xs text-gray-500 mb-3">
					<div className="flex items-center gap-1">
						<Users className="h-3 w-3 text-green-600 group-hover:text-green-700" />
						<span>{organization.departments?.length || 0} Depts</span>
					</div>
					{organization.contactDetails?.address?.city && (
						<div className="flex items-center gap-1">
							<MapPin className="h-3 w-3 text-green-600 group-hover:text-green-700" />
							<span className="truncate max-w-[70px]">{organization.contactDetails.address.city}</span>
						</div>
					)}
				</div>
			</CardContent>

			<CardFooter className="pt-0 px-4 pb-4">
				<Link href={`/organizations/profile/${organization._id}`} className="w-full">
					<Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white text-xs h-8 transition-transform duration-300 hover:scale-[1.02] hover:shadow-md">
						View Details
					</Button>
				</Link>
			</CardFooter>
		</Card>
	)
}

export default function OrganizationsPage() {
	const [organizations, setOrganizations] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [searchTerm, setSearchTerm] = useState("")

	useEffect(() => {
		const fetchOrganizations = async () => {
			setLoading(true)
			try {
				const response = await axios.get("/api/organization/suggestion", {
					params: { search: searchTerm }
				})
				setOrganizations(response.data.data || [])
				setError(null)
			} catch (err) {
				setError(err.response?.data?.error || "Failed to load organizations")
			} finally {
				setLoading(false)
			}
		}

		const debounceTimer = setTimeout(fetchOrganizations, 500)
		return () => clearTimeout(debounceTimer)
	}, [searchTerm])

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
				<div className="text-center space-y-4 bg-white p-8 rounded-lg shadow-sm border border-green-100">
					<AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
					<h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
					<p className="text-gray-600 text-sm">{error}</p>
					<Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
						Try Again
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
			<div className="container mx-auto px-4 py-6">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-2 mb-3">
						<Building2 className="h-8 w-8 text-green-600" />
						<h1 className="text-2xl font-bold text-gray-800">Healthcare Organizations</h1>
					</div>
					<p className="text-gray-600 text-sm mb-6">Connect with leading healthcare facilities</p>

					<div className="max-w-md mx-auto">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search organizations..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)} 
								className="pl-12 h-12 border border-green-200 rounded-lg shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-300 transition"

							/>
						</div>
					</div>
				</div>

				{/* Results count */}
				{!loading && (
					<div className="mb-4">
						<p className="text-sm text-gray-600 text-center">
							{organizations.length} organization{organizations.length !== 1 ? 's' : ''} found
						</p>
					</div>
				)}

				{/* Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{loading ? (
						Array.from({ length: 8 }).map((_, index) => (
							<Card key={index} className="h-[280px] animate-pulse border border-green-100 bg-green-50/30">
								<CardContent className="p-4 space-y-3 flex flex-col items-center">
									<div className="h-16 w-16 bg-green-200 rounded-full" />
									<div className="space-y-2 w-full">
										<div className="h-4 bg-green-200 rounded w-3/4 mx-auto" />
										<div className="h-3 bg-green-200 rounded w-1/2 mx-auto" />
										<div className="h-6 bg-green-200 rounded w-full mt-4" />
									</div>
								</CardContent>
							</Card>
						))
					) : organizations.length > 0 ? (
						organizations.map((org) => (
							<OrganizationCard key={org._id} organization={org} />
						))
					) : (
						<div className="col-span-full text-center py-12">
							<div className="bg-white p-8 rounded-lg shadow-sm border border-green-100 max-w-md mx-auto">
								<AlertCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
								<p className="text-gray-600 text-sm">No organizations found</p>
								{searchTerm && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => setSearchTerm("")}
										className="mt-3 border-green-200 text-green-700 hover:bg-green-50"
									>
										Clear search
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}