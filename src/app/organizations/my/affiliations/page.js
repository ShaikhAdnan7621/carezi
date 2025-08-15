"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

import { Users, Search, CheckCircle, XCircle, Clock, Filter } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import ApplicationReviewDialog from "@/components/affiliation/ApplicationReviewDialog"
import ProfessionalCard from "@/components/affiliation/ProfessionalCard"
import Loading from "@/components/ui/loading"

export default function OrganizationAffiliations() {
	const [requests, setRequests] = useState([])
	const [loading, setLoading] = useState(true)
	const [selectedRequest, setSelectedRequest] = useState(null)
	const [filters, setFilters] = useState({
		status: "all",
		search: ""
	})
	const [stats, setStats] = useState({
		pending: 0,
		approved: 0,
		rejected: 0,
		total: 0
	})

	const fetchRequests = async () => {
		try {
			setLoading(true)

			const params = new URLSearchParams()
			if (filters.status && filters.status !== "all") params.append("status", filters.status)

			const response = await axios.get(`/api/affiliation/organization/my?${params}`)

			setRequests(response.data.data)

			// Calculate stats
			const pending = response.data.data.filter(r => r.status === "pending").length
			const approved = response.data.data.filter(r => r.status === "approved").length
			const rejected = response.data.data.filter(r => r.status === "rejected").length

			setStats({
				pending,
				approved,
				rejected,
				total: response.data.data.length
			})
		} catch (error) {
			toast.error("Failed to fetch requests")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchRequests()
	}, [filters.status])

	const getStatusColor = (status) => {
		switch (status) {
			case "approved": return "bg-green-100 text-green-800"
			case "rejected": return "bg-red-100 text-red-800"
			case "withdrawn": return "bg-gray-100 text-gray-800"
			default: return "bg-yellow-100 text-yellow-800"
		}
	}

	const filteredRequests = requests.filter(request =>
		request.professionalId?.userId?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
		request.requestedRole?.toLowerCase().includes(filters.search.toLowerCase()) ||
		request.professionalId?.professionType?.toLowerCase().includes(filters.search.toLowerCase())
	)

	return (
		<div className="min-h-screen">
			<div className="max-w-7xl mx-auto space-y-8 my-6">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Application Management</h1>
					<p className="text-gray-600 text-lg">Review and manage professional applications to join your organization</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-amber-100 font-medium">Pending Review</p>
									<p className="text-4xl font-bold">{stats.pending}</p>
								</div>
								<div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
									<Clock className="w-6 h-6" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-green-100 font-medium">Approved</p>
									<p className="text-4xl font-bold">{stats.approved}</p>
								</div>
								<div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
									<CheckCircle className="w-6 h-6" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-red-100 font-medium">Rejected</p>
									<p className="text-4xl font-bold">{stats.rejected}</p>
								</div>
								<div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
									<XCircle className="w-6 h-6" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-blue-100 font-medium">Total Applications</p>
									<p className="text-4xl font-bold">{stats.total}</p>
								</div>
								<div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
									<Users className="w-6 h-6" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
					<CardContent className="p-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
									<Input
										placeholder="Search by name, role, or profession..."
										value={filters.search}
										onChange={(e) => setFilters({ ...filters, search: e.target.value })}
										className="pl-12 h-12 border-green-200 focus:border-green-400 focus:ring-green-200 rounded-xl bg-green-50/50"
									/>
								</div>
							</div>
							<Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
								<SelectTrigger className="w-full md:w-56 h-12 border-green-200 focus:border-green-400 focus:ring-green-200 rounded-xl bg-green-50/50">
									<div className="flex items-center gap-2">
										<Filter className="w-4 h-4 text-green-500" />
										<SelectValue placeholder="Filter by status" />
									</div>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Applications</SelectItem>
									<SelectItem value="pending">Pending Review</SelectItem>
									<SelectItem value="approved">Approved</SelectItem>
									<SelectItem value="rejected">Rejected</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Applications List */}
				<div>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl sm:text-2xl font-bold text-gray-900">Applications ({filteredRequests.length})</h2>
						{filteredRequests.length > 0 && (
							<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
								{filteredRequests.filter(r => r.status === 'pending').length} pending review
							</Badge>
						)}
					</div>

					{loading ? (
						<div className="text-center py-16">
							<div className="flex items-center justify-center gap-3 text-green-600 ">
								<span className="text-green-700 font-medium">Loading applications</span>
								<Loading className="w-8 h-8" />
							</div>
						</div>
					) : filteredRequests.length === 0 ? (
						<Card className="bg-white/80 backdrop-blur-sm border-green-200">
							<CardContent className="text-center py-16">
								<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Users className="w-8 h-8 text-green-500" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
								<p className="text-gray-600">No applications match your current filters. Try adjusting your search criteria.</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-6">
							{filteredRequests.map((request) => (
								<ProfessionalCard
									key={request._id}
									request={request}
									onReview={() => setSelectedRequest(request)}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Review Dialog */}
			<ApplicationReviewDialog
				isOpen={!!selectedRequest}
				onClose={() => setSelectedRequest(null)}
				request={selectedRequest}
				onUpdate={fetchRequests}
			/>
		</div>
	)
}