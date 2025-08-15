"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
	User, CheckCircle, XCircle, Mail, Phone, GraduationCap, 
	Briefcase, Award, Star, MapPin, Calendar, DollarSign, FileText, Clock
} from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import Image from "next/image"

export default function ApplicationReviewDialog({ isOpen, onClose, request, onUpdate }) {
	const [rejectionReason, setRejectionReason] = useState("")
	const [loading, setLoading] = useState(false)

	const handleApprove = async () => {
		try {
			setLoading(true)
			await axios.put(`/api/affiliation/${request._id}`, {
				status: "approved",
				createAffiliation: true
			})

			toast.success("Application approved successfully!")
			onUpdate()
			onClose()
		} catch (error) {
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

	const professional = request.professionalId
	const user = professional?.userId

	const getStatusColor = (status) => {
		switch (status) {
			case "approved": return "bg-green-50 text-green-700 border-green-200"
			case "rejected": return "bg-red-50 text-red-700 border-red-200"
			case "withdrawn": return "bg-gray-50 text-gray-700 border-gray-200"
			default: return "bg-amber-50 text-amber-700 border-amber-200"
		}
	}

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-5xl max-h-[95vh] p-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
				<DialogHeader className="p-6 pb-0">
					<div className="flex items-center justify-between">
						<div>
							<DialogTitle className="text-2xl font-bold text-gray-900">Application Review</DialogTitle>
							<p className="text-gray-600 mt-1">Comprehensive professional profile and application details</p>
						</div>
						<Badge className={`${getStatusColor(request.status)} font-medium px-4 py-2`}>
							{request.status.charAt(0).toUpperCase() + request.status.slice(1)}
						</Badge>
					</div>
				</DialogHeader>

				<ScrollArea className="max-h-[calc(95vh-120px)]">
					<div className="p-6 space-y-6">
						{/* Professional Profile Header */}
						<Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
							<CardContent className="p-6">
								<div className="flex items-start gap-6">
									<div className="w-24 h-24 rounded-2xl overflow-hidden bg-green-50 border-2 border-green-200 shadow-sm">
										{user?.profilePic ? (
											<Image
												src={user.profilePic}
												alt={user.name}
												width={96}
												height={96}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center">
												<User className="w-12 h-12 text-green-400" />
											</div>
										)}
									</div>
									<div className="flex-1">
										<h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
										<p className="text-lg text-green-600 font-semibold mb-3">{professional?.professionType}</p>
										{user?.bio && (
											<p className="text-gray-600 leading-relaxed mb-4">{user.bio}</p>
										)}
										<div className="flex flex-wrap gap-4 text-sm">
											<div className="flex items-center gap-2">
												<Mail className="w-4 h-4 text-green-500" />
												<span className="text-gray-700">{professional?.contactDetails?.email}</span>
											</div>
											{professional?.contactDetails?.phone && (
												<div className="flex items-center gap-2">
													<Phone className="w-4 h-4 text-green-500" />
													<span className="text-gray-700">{professional.contactDetails.phone}</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Education */}
							{professional?.education?.length > 0 && (
								<Card className="bg-white/80 backdrop-blur-sm border-green-200">
									<CardHeader className="pb-4">
										<CardTitle className="flex items-center gap-2 text-green-800">
											<GraduationCap className="w-5 h-5" />
											Education
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{professional.education.map((edu, index) => (
											<div key={index} className="p-4 bg-green-50 rounded-xl border border-green-100">
												<div className="flex justify-between items-start mb-2">
													<div>
														<h4 className="font-semibold text-green-900">{edu.degree}</h4>
														<p className="text-green-700">{edu.institution}</p>
														{edu.specialization && (
															<p className="text-sm text-green-600">Specialization: {edu.specialization}</p>
														)}
													</div>
													{edu.year && (
														<Badge variant="outline" className="text-green-700 border-green-300">
															{edu.year}
														</Badge>
													)}
												</div>
											</div>
										))}
									</CardContent>
								</Card>
							)}

							{/* Experience */}
							{professional?.experience?.length > 0 && (
								<Card className="bg-white/80 backdrop-blur-sm border-green-200">
									<CardHeader className="pb-4">
										<CardTitle className="flex items-center gap-2 text-green-800">
											<Briefcase className="w-5 h-5" />
											Experience
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{professional.experience.map((exp, index) => (
											<div key={index} className="p-4 bg-green-50 rounded-xl border border-green-100">
												<div className="flex justify-between items-start mb-2">
													<div>
														<h4 className="font-semibold text-green-900">{exp.role}</h4>
														<p className="text-green-700">{exp.organization}</p>
														{exp.department && (
															<p className="text-sm text-green-600">Department: {exp.department}</p>
														)}
													</div>
													<div className="text-right">
														{exp.isCurrent && (
															<Badge className="bg-green-100 text-green-800 mb-1">Current</Badge>
														)}
														<p className="text-xs text-green-600">
															{exp.startDate && formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
														</p>
													</div>
												</div>
												{exp.description && (
													<p className="text-sm text-green-700 mt-2">{exp.description}</p>
												)}
											</div>
										))}
									</CardContent>
								</Card>
							)}

							{/* Skills */}
							{professional?.skills?.length > 0 && (
								<Card className="bg-white/80 backdrop-blur-sm border-green-200">
									<CardHeader className="pb-4">
										<CardTitle className="flex items-center gap-2 text-green-800">
											<Star className="w-5 h-5" />
											Skills & Competencies
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex flex-wrap gap-2">
											{professional.skills.map((skill, index) => (
												<Badge 
													key={index} 
													className={`${
														skill.proficiency === 'expert' ? 'bg-green-100 text-green-800 border-green-300' :
														skill.proficiency === 'intermediate' ? 'bg-blue-100 text-blue-800 border-blue-300' :
														'bg-gray-100 text-gray-800 border-gray-300'
													} px-3 py-1`}
												>
													{skill.name} ({skill.proficiency})
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>
							)}

							{/* Certifications */}
							{professional?.certifications?.length > 0 && (
								<Card className="bg-white/80 backdrop-blur-sm border-green-200">
									<CardHeader className="pb-4">
										<CardTitle className="flex items-center gap-2 text-green-800">
											<Award className="w-5 h-5" />
											Certifications
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{professional.certifications.map((cert, index) => (
											<div key={index} className="p-3 bg-green-50 rounded-lg border border-green-100">
												<h4 className="font-semibold text-green-900">{cert.name}</h4>
												<p className="text-green-700 text-sm">{cert.issuedBy}</p>
												{cert.year && (
													<p className="text-xs text-green-600">Year: {cert.year}</p>
												)}
											</div>
										))}
									</CardContent>
								</Card>
							)}
						</div>

						{/* Application Details */}
						<Card className="bg-white/80 backdrop-blur-sm border-green-200">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-green-800">
									<FileText className="w-5 h-5" />
									Application Details
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									<div className="p-4 bg-green-50 rounded-xl border border-green-100">
										<label className="text-sm font-medium text-green-600 uppercase tracking-wide">Requested Role</label>
										<p className="font-semibold text-gray-800 mt-1">{request.requestedRole}</p>
									</div>
									{request.requestedDepartment && (
										<div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
											<label className="text-sm font-medium text-blue-600 uppercase tracking-wide">Department</label>
											<p className="font-semibold text-gray-800 mt-1">{request.requestedDepartment}</p>
										</div>
									)}
									<div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
										<label className="text-sm font-medium text-purple-600 uppercase tracking-wide">Work Type</label>
										<p className="font-semibold text-gray-800 mt-1 capitalize">{request.workType}</p>
									</div>
									<div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
										<label className="text-sm font-medium text-indigo-600 uppercase tracking-wide">Employee Type</label>
										<p className="font-semibold text-gray-800 mt-1 capitalize">{request.employeeType || 'New Employee'}</p>
									</div>
									{request.actualStartDate && (
										<div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
											<label className="text-sm font-medium text-teal-600 uppercase tracking-wide">Actual Start Date</label>
											<p className="font-semibold text-gray-800 mt-1">{formatDate(request.actualStartDate)}</p>
										</div>
									)}
									{request.expectedSalary && (
										<div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
											<label className="text-sm font-medium text-orange-600 uppercase tracking-wide">Expected Salary</label>
											<p className="font-semibold text-gray-800 mt-1">${request.expectedSalary.toLocaleString()}</p>
										</div>
									)}
								</div>

								<Separator className="bg-green-200" />

								<div>
									<label className="text-sm font-medium text-green-600 uppercase tracking-wide mb-3 block">Cover Letter</label>
									<div className="p-6 bg-green-50 rounded-xl border border-green-100 max-h-40 overflow-y-auto">
										<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{request.coverLetter}</p>
									</div>
								</div>

								{request.rejectionReason && (
									<div>
										<label className="text-sm font-medium text-red-600 uppercase tracking-wide mb-3 block">Rejection Reason</label>
										<div className="p-4 bg-red-50 rounded-xl border border-red-200">
											<p className="text-red-700">{request.rejectionReason}</p>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Timeline */}
						<Card className="bg-white/80 backdrop-blur-sm border-green-200">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-green-800">
									<Clock className="w-5 h-5" />
									Application Timeline
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
										<div>
											<p className="font-medium">Application Submitted</p>
											<p className="text-sm text-gray-500">{formatDate(request.submittedAt)}</p>
										</div>
									</div>
									{request.reviewedAt && (
										<div className="flex items-center gap-3">
											<div className={`w-3 h-3 rounded-full ${
												request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
											}`}></div>
											<div>
												<p className="font-medium">Application {request.status}</p>
												<p className="text-sm text-gray-500">{formatDate(request.reviewedAt)}</p>
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Review Actions - Only show for pending applications */}
						{request.status === "pending" && (
							<Card className="bg-white/80 backdrop-blur-sm border-green-200">
								<CardHeader className="pb-4">
									<CardTitle className="text-green-800">Make Decision</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div>
										<label htmlFor="rejectionReason" className="text-sm font-medium text-gray-700 mb-2 block">
											Rejection Reason (required if rejecting)
										</label>
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
						)}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}