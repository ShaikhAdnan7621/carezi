"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, User, CheckCircle, XCircle, X } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import Image from "next/image"

export default function ReviewRequestDialog({ isOpen, onClose, request, onUpdate }) {
	const [rejectionReason, setRejectionReason] = useState("")
	const [loading, setLoading] = useState(false)

	const handleApprove = async () => {
		try {
			setLoading(true)
			console.log('Approving request:', request._id)
			console.log('Request data:', request)
			
			const requestData = {
				status: "approved",
				createAffiliation: true
			};
			console.log('Sending request:', requestData);
			const response = await axios.put(`/api/affiliation/${request._id}`, requestData)
			
			console.log('Approval response:', response.data)
			toast.success("Application approved successfully!")
			onUpdate()
			onClose()
		} catch (error) {
			console.error('Approval error:', error)
			toast.error(error.response?.data?.error || "Failed to approve application")
		} finally {
			setLoading(false)
		}
	}

	const handleReject = async () => {
		if (!rejectionReason.trim()) {
			toast.error("Please provide a reason for rejection")
			return
		}

		try {
			setLoading(true)
			await axios.put(`/api/affiliation/${request._id}`, {
				status: "rejected",
				rejectionReason
			})

			toast.success("Application rejected")
			onUpdate()
			onClose()
			setRejectionReason("")
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to reject application")
		} finally {
			setLoading(false)
		}
	}

	if (!request) return null

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
				<DialogHeader className="pb-6">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-2xl font-bold text-green-800">Review Application</DialogTitle>
					</div>
				</DialogHeader>

				<div className="space-y-8">
					{/* Professional Profile */}
					<Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
						<CardHeader className="pb-4">
							<CardTitle className="flex items-center gap-3 text-green-800">
								<div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
									<User className="w-5 h-5 text-green-600" />
								</div>
								Who is this person?
							</CardTitle>
						</CardHeader>
						<CardContent>
							{/* Basic Profile */}
							<div className="flex items-start gap-6 mb-8">
								<div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
									{request.professionalProfilePic ? (
										<Image
											src={request.professionalProfilePic}
											alt={request.professionalName}
											width={96}
											height={96}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<User className="w-12 h-12 text-gray-400" />
										</div>
									)}
								</div>
								<div className="flex-1">
									<h2 className="text-2xl font-bold text-gray-900 mb-2">
										{request.professionalName || "Name not provided"}
									</h2>
									<div className="space-y-2 mb-4">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium text-gray-500">Email:</span>
											<span className="text-gray-700">{request.professionalEmail || "Not provided"}</span>
										</div>
										{request.professionalPhone && (
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium text-gray-500">Phone:</span>
												<span className="text-gray-700">{request.professionalPhone}</span>
											</div>
										)}
										{request.professionalLocation && (
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium text-gray-500">Location:</span>
												<span className="text-gray-700">{request.professionalLocation}</span>
											</div>
										)}
									</div>
									{request.professionType && (
										<div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200">
											<span className="text-sm font-semibold text-green-800">{request.professionType}</span>
										</div>
									)}
								</div>
							</div>

							{/* Professional Background */}
							<div className="space-y-6">
								{/* Bio Section */}
								{request.professionalBio && (
									<div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
										<h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
											<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
											About This Professional
										</h4>
										<p className="text-blue-800 leading-relaxed">{request.professionalBio}</p>
									</div>
								)}

								{/* Experience Section */}
								{request.experienceSummary && (
									<div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
										<h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
											<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
											Professional Experience
										</h4>
										<p className="text-purple-800">{request.experienceSummary}</p>
									</div>
								)}

								{/* Skills Section */}
								{request.skills?.length > 0 && (
									<div className="p-5 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100">
										<h4 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
											<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
											Core Skills & Competencies
										</h4>
										<div className="flex flex-wrap gap-2">
											{request.skills.map((skill, index) => (
												<Badge key={index} className="bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors px-3 py-1">
													{skill}
												</Badge>
											))}
										</div>
									</div>
								)}

								{/* No additional info message */}
								{!request.professionalBio && !request.experienceSummary && (!request.skills || request.skills.length === 0) && (
									<div className="p-5 rounded-xl bg-gray-50 border border-gray-200 text-center">
										<p className="text-gray-500 italic">No additional professional information provided</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Application Summary */}
					<Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
						<CardHeader className="pb-4">
							<CardTitle className="text-green-800 text-xl">Application Summary</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="p-4 rounded-xl bg-green-50 border border-green-100">
									<label className="text-sm font-medium text-green-600 uppercase tracking-wide">Requested Role</label>
									<p className="font-semibold text-gray-800 mt-1">{request.requestedRole}</p>
								</div>
								{request.requestedDepartment && (
									<div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
										<label className="text-sm font-medium text-blue-600 uppercase tracking-wide">Department</label>
										<p className="font-semibold text-gray-800 mt-1">{request.requestedDepartment}</p>
									</div>
								)}
								<div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
									<label className="text-sm font-medium text-purple-600 uppercase tracking-wide">Work Type</label>
									<p className="font-semibold text-gray-800 mt-1 capitalize">{request.workType}</p>
								</div>
								<div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
									<label className="text-sm font-medium text-indigo-600 uppercase tracking-wide">Employee Type</label>
									<p className="font-semibold text-gray-800 mt-1 capitalize">{request.employeeType || 'New Employee'}</p>
								</div>
								{request.actualStartDate && (
									<div className="p-4 rounded-xl bg-teal-50 border border-teal-100">
										<label className="text-sm font-medium text-teal-600 uppercase tracking-wide">Actual Start Date</label>
										<p className="font-semibold text-gray-800 mt-1">{new Date(request.actualStartDate).toLocaleDateString()}</p>
									</div>
								)}
								{request.expectedSalary && (
									<div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
										<label className="text-sm font-medium text-orange-600 uppercase tracking-wide">Expected Salary</label>
										<p className="font-semibold text-gray-800 mt-1">${request.expectedSalary.toLocaleString()}</p>
									</div>
								)}
							</div>

							<Separator className="bg-green-200" />

							<div>
								<label className="text-sm font-medium text-green-600 uppercase tracking-wide mb-3 block">Cover Letter</label>
								<div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 max-h-40 overflow-y-auto">
									<p className="text-gray-700 leading-relaxed">{request.coverLetter}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Review Actions */}
					<Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
						<CardHeader className="pb-4">
							<CardTitle className="text-green-800 text-xl">Review Decision</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div>
								<Label htmlFor="rejectionReason" className="text-sm font-medium text-gray-700 mb-2 block">Rejection Reason (if rejecting)</Label>
								<Textarea
									id="rejectionReason"
									value={rejectionReason}
									onChange={(e) => setRejectionReason(e.target.value)}
									placeholder="Provide a detailed reason for rejection..."
									rows={4}
									className="border-green-200 focus:border-green-400 focus:ring-green-200 rounded-xl"
								/>
							</div>

							<div className="flex flex-col sm:flex-row gap-4">
								<Button
									onClick={handleApprove}
									disabled={loading}
									className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
								>
									<CheckCircle className="w-5 h-5 mr-2" />
									{loading ? "Processing..." : "Approve Application"}
								</Button>
								<Button
									onClick={handleReject}
									disabled={loading || !rejectionReason.trim()}
									className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
								>
									<XCircle className="w-5 h-5 mr-2" />
									{loading ? "Processing..." : "Reject Application"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	)
}