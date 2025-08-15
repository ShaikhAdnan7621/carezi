"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Briefcase, GraduationCap, CheckCircle, XCircle, Clock, Star } from "lucide-react"
import Image from "next/image"

export default function ProfessionalCard({ request, onReview }) {
	const professional = request.professionalId
	const user = professional?.userId

	const getStatusColor = (status) => {
		switch (status) {
			case "approved": return "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
			case "rejected": return "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
			case "withdrawn": return "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
			default: return "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
		}
	}


	const getLatestEducation = () => {
		if (!professional?.education?.length) return null
		return professional.education.sort((a, b) => (b.year || 0) - (a.year || 0))[0]
	}

	const getLatestExperience = () => {
		if (!professional?.experience?.length) return null
		return professional.experience.find(exp => exp.isCurrent) ||
			professional.experience.sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0))[0]
	}

	return (
		<Card className="group hover:shadow-xl transition-all duration-300 border border-green-100 bg-gradient-to-br from-white to-green-50/30">
			<CardContent className="p-6">
 					{/* Profile Section */}
					<div className="flex flex-col sm:flex-row items-start gap-4 ">
						<div className="relative">
							<div className="w-20 h-20 rounded-2xl overflow-hidden bg-green-50 border-2 border-green-200 shadow-sm">
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
										<User className="w-10 h-10 text-green-400" />
									</div>
								)}
							</div>
							<div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white shadow-sm ${request.status === 'pending' ? 'bg-amber-400' :
								request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
								}`}></div>
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between mb-3">
								<div>
									<h3 className="font-bold text-xl text-gray-900 mb-1">{user?.name}</h3>
									<p className="text-green-600 font-medium">{professional?.professionType}</p>
								</div>
							</div>

							{user?.bio && (
								<p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{user.bio}</p>
							)}

							{/* Quick Info */}
							<div className="grid grid-cols-2 gap-4 mb-4">
								<div className="space-y-2">
									<div className="flex items-center gap-2 text-sm">
										<Mail className="w-4 h-4 text-green-500" />
										<span className="text-gray-600 truncate">{professional?.contactDetails?.email}</span>
									</div>
									{professional?.contactDetails?.phone && (
										<div className="flex items-center gap-2 text-sm">
											<Phone className="w-4 h-4 text-green-500" />
											<span className="text-gray-600">{professional.contactDetails.phone}</span>
										</div>
									)}
								</div>
								<div className="space-y-2">
									{getLatestEducation() && (
										<div className="flex items-center gap-2 text-sm">
											<GraduationCap className="w-4 h-4 text-green-500" />
											<span className="text-gray-600 truncate">
												{getLatestEducation().degree}
											</span>
										</div>
									)}
									{getLatestExperience() && (
										<div className="flex items-center gap-2 text-sm">
											<Briefcase className="w-4 h-4 text-green-500" />
											<span className="text-gray-600 truncate">
												{getLatestExperience().role}
											</span>
										</div>
									)}
								</div>
							</div>

							{/* Application Summary */}
							<div className="bg-green-50 rounded-xl p-4 border border-green-100 w-full">
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="text-green-600 font-medium">Applied for</span>
										<p className="font-semibold text-gray-900">{request.requestedRole}</p>
									</div>
									<div>
										<span className="text-green-600 font-medium">Work Type</span>
										<p className="font-semibold text-gray-900 capitalize">{request.workType}</p>
									</div>
									<div>
										<span className="text-green-600 font-medium">Employee Type</span>
										<p className="font-semibold text-gray-900 capitalize">{request.employeeType || 'New Employee'}</p>
									</div>
									{request.requestedDepartment && (
										<div>
											<span className="text-green-600 font-medium">Department</span>
											<p className="font-semibold text-gray-900">{request.requestedDepartment}</p>
										</div>
									)}
									{request.actualStartDate && (
										<div>
											<span className="text-green-600 font-medium">Start Date</span>
											<p className="font-semibold text-gray-900">{new Date(request.actualStartDate).toLocaleDateString()}</p>
										</div>
									)}
									<div>
										<span className="text-green-600 font-medium">Applied</span>
										<p className="font-semibold text-gray-900">
											{new Date(request.submittedAt).toLocaleDateString()}
										</p>
									</div>
								</div>
							</div>

							{/* Skills Preview */}
							{professional?.skills?.length > 0 && (
								<div className="mt-4">
									<div className="flex items-center gap-2 mb-2">
										<Star className="w-4 h-4 text-green-500" />
										<span className="text-sm font-medium text-green-600">Key Skills</span>
									</div>
									<div className="flex flex-wrap gap-2">
										{professional.skills.slice(0, 4).map((skill, idx) => (
											<Badge key={idx} variant="secondary" className="bg-green-100 text-green-700 text-xs">
												{skill.name}
											</Badge>
										))}
										{professional.skills.length > 4 && (
											<Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
												+{professional.skills.length - 4}
											</Badge>
										)}
									</div>
								</div>
							)}
						</div>
					</div> 
			</CardContent>
			<CardFooter className="p-4 bg-green-50 border-t border-green-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
					<p className="text-xs text-gray-500">Last updated: {new Date(request.updatedAt).toLocaleDateString()}</p>
					<Badge className={`${getStatusColor(request.status)} font-medium px-3 py-1 hover:opacity-90 transition-opacity`}>
						{request.status.charAt(0).toUpperCase() + request.status.slice(1)}
					</Badge>
				</div>
				<div className="flex flex-col justify-center w-full sm:w-auto">
					{request.status === "pending" ? (
						<Button
							onClick={() => onReview(request)}
							className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto"
						>
							<Clock className="w-4 h-4 mr-2" />
							Review Application
						</Button>
					) : request.status === "approved" ? (
						<div className="flex items-center gap-2 text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-xl border border-green-200 justify-center sm:justify-start">
							<CheckCircle className="w-5 h-5" />
							Approved
						</div>
					) : (
						<div className="flex items-center gap-2 text-red-600 font-semibold bg-red-50 px-4 py-2 rounded-xl border border-red-200 justify-center sm:justify-start">
							<XCircle className="w-5 h-5" />
							Rejected
						</div>
					)}
				</div>
			</CardFooter>
		</Card>
	)
}