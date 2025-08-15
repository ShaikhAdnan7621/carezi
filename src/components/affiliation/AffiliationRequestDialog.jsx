"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
	Building2, User, Calendar, DollarSign, FileText, Clock, X, 
	Mail, Phone, GraduationCap, Briefcase, Award, Star, MapPin 
} from "lucide-react"
import Image from "next/image"

export default function AffiliationRequestDialog({ isOpen, onClose, request, readOnly = false }) {
	if (!request) return null

	const professional = request.professionalId
	const user = professional?.userId

	const getStatusColor = (status) => {
		switch (status) {
			case "approved": return "bg-green-100 text-green-800 border-green-200"
			case "rejected": return "bg-red-100 text-red-800 border-red-200"
			case "withdrawn": return "bg-gray-100 text-gray-800 border-gray-200"
			default: return "bg-yellow-100 text-yellow-800 border-yellow-200"
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
			<DialogContent className="max-w-4xl max-h-[90vh] p-0">
				<DialogHeader className="p-6 pb-0">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-2xl font-bold">Application Details</DialogTitle>
						<Button variant="ghost" size="icon" onClick={onClose}>
							<X className="w-4 h-4" />
						</Button>
					</div>
				</DialogHeader>

				<ScrollArea className="max-h-[calc(90vh-100px)]">
					<div className="p-6 space-y-6">
						{/* Status & Basic Info */}
						<div className="flex items-center justify-between">
							<Badge className={getStatusColor(request.status)} size="lg">
								{request.status.charAt(0).toUpperCase() + request.status.slice(1)}
							</Badge>
							<span className="text-sm text-gray-500">
								Applied on {formatDate(request.submittedAt)}
							</span>
						</div>

						{/* Professional Profile */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<User className="w-5 h-5" />
									Professional Profile
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Basic Info */}
								<div className="flex items-start gap-6">
									<div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
										{user?.profilePic ? (
											<Image
												src={user.profilePic}
												alt={user.name}
												width={80}
												height={80}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center">
												<User className="w-10 h-10 text-gray-400" />
											</div>
										)}
									</div>
									<div className="flex-1">
										<h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
										<p className="text-lg text-blue-600 font-medium">{professional?.professionType}</p>
										{user?.bio && (
											<p className="text-gray-600 mt-2 leading-relaxed">{user.bio}</p>
										)}
									</div>
								</div>

								{/* Contact Information */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-3">
										<h4 className="font-semibold text-gray-800">Contact Details</h4>
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<Mail className="w-4 h-4 text-blue-500" />
												<span className="text-sm">{professional?.contactDetails?.email}</span>
											</div>
											{professional?.contactDetails?.phone && (
												<div className="flex items-center gap-2">
													<Phone className="w-4 h-4 text-green-500" />
													<span className="text-sm">{professional.contactDetails.phone}</span>
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Education */}
								{professional?.education?.length > 0 && (
									<div>
										<h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
											<GraduationCap className="w-4 h-4" />
											Education
										</h4>
										<div className="space-y-3">
											{professional.education.map((edu, index) => (
												<div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
													<div className="flex justify-between items-start">
														<div>
															<h5 className="font-medium text-purple-900">{edu.degree}</h5>
															<p className="text-purple-700">{edu.institution}</p>
															{edu.specialization && (
																<p className="text-sm text-purple-600">Specialization: {edu.specialization}</p>
															)}
														</div>
														{edu.year && (
															<Badge variant="outline" className="text-purple-700">
																{edu.year}
															</Badge>
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Experience */}
								{professional?.experience?.length > 0 && (
									<div>
										<h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
											<Briefcase className="w-4 h-4" />
											Experience
										</h4>
										<div className="space-y-3">
											{professional.experience.map((exp, index) => (
												<div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
													<div className="flex justify-between items-start mb-2">
														<div>
															<h5 className="font-medium text-blue-900">{exp.role}</h5>
															<p className="text-blue-700">{exp.organization}</p>
															{exp.department && (
																<p className="text-sm text-blue-600">Department: {exp.department}</p>
															)}
														</div>
														<div className="text-right">
															{exp.isCurrent && (
																<Badge className="bg-green-100 text-green-800 mb-1">Current</Badge>
															)}
															<p className="text-xs text-blue-600">
																{exp.startDate && formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
															</p>
														</div>
													</div>
													{exp.description && (
														<p className="text-sm text-blue-700">{exp.description}</p>
													)}
												</div>
											))}
										</div>
									</div>
								)}

								{/* Skills */}
								{professional?.skills?.length > 0 && (
									<div>
										<h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
											<Star className="w-4 h-4" />
											Skills
										</h4>
										<div className="flex flex-wrap gap-2">
											{professional.skills.map((skill, index) => (
												<Badge 
													key={index} 
													variant="outline" 
													className={`${
														skill.proficiency === 'expert' ? 'bg-green-50 text-green-700 border-green-200' :
														skill.proficiency === 'intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200' :
														'bg-gray-50 text-gray-700 border-gray-200'
													}`}
												>
													{skill.name} ({skill.proficiency})
												</Badge>
											))}
										</div>
									</div>
								)}

								{/* Certifications */}
								{professional?.certifications?.length > 0 && (
									<div>
										<h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
											<Award className="w-4 h-4" />
											Certifications
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											{professional.certifications.map((cert, index) => (
												<div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
													<h5 className="font-medium text-orange-900">{cert.name}</h5>
													<p className="text-orange-700 text-sm">{cert.issuedBy}</p>
													{cert.year && (
														<p className="text-xs text-orange-600">Year: {cert.year}</p>
													)}
												</div>
											))}
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Application Details */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<FileText className="w-5 h-5" />
									Application Details
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-gray-500">Requested Role</label>
										<p className="font-semibold text-lg">{request.requestedRole}</p>
									</div>
									{request.requestedDepartment && (
										<div>
											<label className="text-sm font-medium text-gray-500">Department</label>
											<p className="font-semibold text-lg">{request.requestedDepartment}</p>
										</div>
									)}
									<div>
										<label className="text-sm font-medium text-gray-500">Work Type</label>
										<p className="font-semibold text-lg capitalize">{request.workType}</p>
									</div>
									{request.expectedSalary && (
										<div>
											<label className="text-sm font-medium text-gray-500">Expected Salary</label>
											<p className="font-semibold text-lg text-green-600">${request.expectedSalary.toLocaleString()}</p>
										</div>
									)}
								</div>

								<Separator />

								<div>
									<label className="text-sm font-medium text-gray-500">Cover Letter</label>
									<div className="mt-2 p-4 bg-gray-50 rounded-lg border">
										<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{request.coverLetter}</p>
									</div>
								</div>

								{request.rejectionReason && (
									<div>
										<label className="text-sm font-medium text-red-600">Rejection Reason</label>
										<div className="mt-2 p-4 bg-red-50 rounded-lg border border-red-200">
											<p className="text-red-700">{request.rejectionReason}</p>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Timeline */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Clock className="w-5 h-5" />
									Timeline
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
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}