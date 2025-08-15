"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, Clock, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import Image from "next/image"
import Loading from "@/components/ui/loading"

export default function MyApplications() {
	const [requests, setRequests] = useState([])
	const [loading, setLoading] = useState(true)
	const [filter, setFilter] = useState('all')

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const res = await axios.get('/api/affiliation/professional/my')
				console.log('API Response:', res.data)
				setRequests(res.data.data || [])
			} catch (error) {
				console.error('Fetch error:', error.response?.data || error.message)
				toast.error(error.response?.data?.error || "Failed to fetch applications")
			} finally {
				setLoading(false)
			}
		}
		fetchRequests()
	}, [])

	const getStatusColor = (status) => {
		switch (status) {
			case "approved": return "bg-green-50 text-green-700 border-green-200"
			case "rejected": return "bg-red-50 text-red-700 border-red-200"
			case "withdrawn": return "bg-gray-50 text-gray-700 border-gray-200"
			default: return "bg-amber-50 text-amber-700 border-amber-200"
		}
	}

	const getStatusIcon = (status) => {
		switch (status) {
			case "approved": return <CheckCircle className="w-5 h-5 text-green-600" />
			case "rejected": return <XCircle className="w-5 h-5 text-red-600" />
			default: return <Clock className="w-5 h-5 text-amber-600" />
		}
	}

	if (loading) {
		return (
			<div className="text-center py-16">
				<div className="flex items-center justify-center gap-3 text-green-600 ">
					<span className="text-green-700 font-medium">Loading your applications</span>
					<Loading className="w-8 h-8" />
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50/30 to-emerald-50/30 py-6">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
					<p className="text-gray-600">Track your organization affiliation requests</p>
				</div>

				{/* Filter Tabs */}
				<div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6">
					<div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-green-100 w-full">
						{['all', 'pending', 'approved', 'rejected'].map(status => (
							<button
								key={status}
								onClick={() => setFilter(status)}
								className={`px-4 py-2 rounded-lg font-medium transition-all duration-200  flex gap-2 items-center justify-center ${filter === status
										? 'bg-green-600 text-white shadow-sm'
										: 'text-gray-600 hover:bg-green-50'
									}`}
							>
								<span className=" text-sm sm:text-base">
									{status.charAt(0).toUpperCase() + status.slice(1)}
								</span>
								<span className="text-xs opacity-75">
									({status === 'all' ? requests.length : requests.filter(r => r.status === status).length})
								</span>
							</button>
						))}
					</div>
				</div>
				{(() => {
					const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter)
					return filteredRequests.length === 0 ? (
						<Card className="bg-white/80 backdrop-blur-sm border-green-200">
							<CardContent className="text-center py-16 ">
								<div className="   rounded-full flex items-center justify-center mx-auto mb-4">
									<Building2 className="w-8 h-8  " />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
								<p className="text-gray-600">{"You haven't applied to any organizations yet."}</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{filteredRequests.map((request) => (
								<Card key={request._id} className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300">
									<CardContent className="p-6">
										<div className="flex items-start gap-4 flex-col md:flex-row">
											<div className="w-16 h-16 rounded-xl overflow-hidden bg-green-50 border-2 border-green-200">
												{request.organizationId?.profilePic ? (
													<Image
														src={request.organizationId.profilePic}
														alt={request.organizationId.name}
														width={64}
														height={64}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center">
														<Building2 className="w-8 h-8 text-green-400" />
													</div>
												)}
											</div>

											<div className="flex-1">
												<div className="flex items-start justify-between mb-3">
													<div>
														<h3 className="font-bold text-lg text-gray-900">{request.organizationId?.name || 'Organization'}</h3>
														<p className="text-green-600 font-medium">{request.requestedRole}</p>
														{request.requestedDepartment && (
															<p className="text-sm text-gray-500">{request.requestedDepartment}</p>
														)}
													</div>
													<div className="flex items-center gap-2">
														{getStatusIcon(request.status)}
														<Badge className={`${getStatusColor(request.status)} font-medium px-3 py-1`}>
															{request.status.charAt(0).toUpperCase() + request.status.slice(1)}
														</Badge>
													</div>
												</div>

												<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
													<div>
														<span className="text-sm text-gray-500">Work Type</span>
														<p className="font-medium capitalize">{request.workType}</p>
													</div>
													{request.expectedSalary && (
														<div>
															<span className="text-sm text-gray-500">Expected Salary</span>
															<p className="font-medium">${request.expectedSalary.toLocaleString()}</p>
														</div>
													)}
													<div>
														<span className="text-sm text-gray-500">Applied</span>
														<p className="font-medium">{new Date(request.submittedAt).toLocaleDateString()}</p>
													</div>
													{request.reviewedAt && (
														<div>
															<span className="text-sm text-gray-500">Reviewed</span>
															<p className="font-medium">{new Date(request.reviewedAt).toLocaleDateString()}</p>
														</div>
													)}
												</div>

												{request.coverLetter && (
													<div className="mb-4 p-3 bg-gray-50 rounded-lg border">
														<p className="text-sm font-medium text-gray-700 mb-2">Cover Letter:</p>
														<p className="text-sm text-gray-600 line-clamp-3">{request.coverLetter}</p>
													</div>
												)}

												{request.status === 'approved' && (
													<div className="p-3 bg-green-50 rounded-lg border border-green-200">
														<p className="text-sm font-medium text-green-800">🎉 Congratulations! Your application has been approved.</p>
													</div>
												)}
												{request.rejectionReason && (
													<div className="p-3 bg-red-50 rounded-lg border border-red-200">
														<p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
														<p className="text-sm text-red-700">{request.rejectionReason}</p>
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)
				})()}
			</div>
		</div>
	)
}