"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import axios from "axios"
import { Briefcase, AlertCircle, Mail, Phone, Star, ChevronLeft, GraduationCap, Award, Calendar, Clock, Languages, Stethoscope, Building2, BookOpen, CheckCircle2, Globe, MessageSquare, MapPin, TrendingUp, Shield, Heart, Share2, ExternalLink, Linkedin, Twitter, Facebook, Instagram, BriefcaseMedical, } from "lucide-react"

// Utility Functions
const getProficiencyLevel = (proficiency) => {
	switch (proficiency?.toLowerCase()) {
		case "expert":
			return 95
		case "advanced":
			return 80
		case "intermediate":
			return 65
		case "conversational":
			return 50
		case "basic":
			return 30
		case "native":
			return 100
		default:
			return 50
	}
}

const getProficiencyColor = (proficiency) => {
	switch (proficiency?.toLowerCase()) {
		case "expert":
			return "bg-emerald-500"
		case "advanced":
			return "bg-blue-500"
		case "intermediate":
			return "bg-yellow-500"
		case "conversational":
			return "bg-orange-500"
		case "basic":
			return "bg-red-500"
		case "native":
			return "bg-purple-500"
		default:
			return "bg-gray-500"
	}
}

const formatDate = (dateString) => {
	if (!dateString) return "N/A"
	try {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
		})
	} catch (error) {
		return "Invalid Date"
	}
}

const calculateExperience = (startDate, endDate) => {
	if (!startDate) return "N/A"
	try {
		const start = new Date(startDate)
		const end = endDate ? new Date(endDate) : new Date()
		const years = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365))
		const months = Math.floor(
			((end.getTime() - start.getTime()) % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30),
		)
		return `${years}y ${months}m`
	} catch (error) {
		return "N/A"
	}
}

const calculateTotalExperience = (experiences) => {
	if (!experiences || experiences.length === 0) return "0+ Years"

	let totalMonths = 0
	experiences.forEach((exp) => {
		if (exp.startDate) {
			const start = new Date(exp.startDate)
			const end = exp.endDate ? new Date(exp.endDate) : new Date()
			const months = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
			totalMonths += months
		}
	})

	const years = Math.floor(totalMonths / 12)
	return `${years}+ Years`
}

const getInitials = (name) => {
	if (!name) return "P"
	return name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.slice(0, 2)
		.toUpperCase()
}

// Loading Skeleton Component
const LoadingSkeleton = () => (
	<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="animate-pulse">
				{/* Hero Skeleton */}
				<Card className="mb-8 overflow-hidden border-0 shadow-xl bg-white/90">
					<CardContent className="p-8">
						<div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
							<div className="h-32 w-32 bg-gray-200 rounded-full"></div>
							<div className="flex-1 space-y-4">
								<div className="h-8 bg-gray-200 rounded w-3/4"></div>
								<div className="h-4 bg-gray-200 rounded w-1/2"></div>
								<div className="h-20 bg-gray-200 rounded w-full"></div>
								<div className="flex gap-4">
									<div className="h-4 bg-gray-200 rounded w-32"></div>
									<div className="h-4 bg-gray-200 rounded w-32"></div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Content Skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-8">
						{[1, 2, 3].map((i) => (
							<Card key={i} className="shadow-lg border-0">
								<CardHeader className="bg-gray-50 border-b">
									<div className="h-6 bg-gray-200 rounded w-48"></div>
								</CardHeader>
								<CardContent className="p-6">
									<div className="space-y-4">
										{[1, 2, 3].map((j) => (
											<div key={j} className="h-16 bg-gray-200 rounded"></div>
										))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
					<div className="space-y-6">
						{[1, 2, 3].map((i) => (
							<Card key={i} className="shadow-lg border-0">
								<CardHeader className="bg-gray-50 border-b">
									<div className="h-6 bg-gray-200 rounded w-32"></div>
								</CardHeader>
								<CardContent className="p-4">
									<div className="space-y-3">
										{[1, 2, 3].map((j) => (
											<div key={j} className="h-8 bg-gray-200 rounded"></div>
										))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	</div>
)

// Empty State Component
const EmptyState = ({ icon: Icon, title, description }) => (
	<div className="text-center py-8">
		<Icon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
		<h3 className="text-lg font-medium text-gray-500 mb-2">{title}</h3>
		<p className="text-gray-400">{description}</p>
	</div>
)

// Main Component
export default function ProfessionalProfilePage() {
	const { id } = useParams()
	const [profile, setProfile] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setLoading(true)
				setError(null)
				console.log("Fetching profile for ID:", id)

				const params = { id }
				const response = await axios.get("/api/professional/get/findbyId/", { params })

				if (response.status === 200 && response.data) {
					setProfile(response.data)
				} else {
					setError("Profile not found")
				}
			} catch (err) {
				console.error("Error fetching profile:", err)
				setError(err.response?.data?.error || err.message || "Failed to load profile")
			} finally {
				setLoading(false)
			}
		}

		if (id) {
			fetchProfile()
		} else {
			setError("No profile ID provided")
			setLoading(false)
		}
	}, [id])

	// Handle share functionality
	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: `${profile?.userId?.name || profile?.profileSummary?.headline} - Professional Profile`,
					text: profile?.profileSummary?.bio || "Check out this professional profile",
					url: window.location.href,
				})
			} catch (err) {
				console.log("Error sharing:", err)
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href)
			alert("Profile link copied to clipboard!")
		}
	}



	if (loading) {
		return <LoadingSkeleton />
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100 gap-4">
				<AlertCircle className="h-16 w-16 text-red-600" />
				<h1 className="text-2xl font-bold text-red-600">Error Loading Profile</h1>
				<p className="text-xl font-medium text-red-600 text-center max-w-md">{error}</p>
				<div className="flex gap-4 mt-4">
					<Button onClick={() => window.location.reload()} variant="outline">
						Try Again
					</Button>
					<Button onClick={() => window.history.back()} variant="outline">
						Go Back
					</Button>
				</div>
			</div>
		)
	}

	if (!profile) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 gap-4">
				<AlertCircle className="h-16 w-16 text-gray-400" />
				<h1 className="text-2xl font-bold text-gray-600">Professional Not Found</h1>
				<p className="text-gray-500">{"This professional profile doesn't exist or has been removed."}</p>
				<div className="flex gap-3">
					<Button onClick={() => window.history.back()} variant="outline">
						Go Back
					</Button>
					<Button asChild className="bg-emerald-600 hover:bg-emerald-700">
						<a href="/professional">Browse Professionals</a>
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="mt-6">
			<Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden mb-8 ">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-emerald-600/5 to-blue-600/5"></div>
				<CardContent className="relative pt-6 sm:p-6">
					<div className="flex flex-col lg:flex-row items-start gap-8">
						{/* Avatar Section */}
						<div className="relative group">
							<Avatar className="h-32 w-32 rounded-2xl ring-4 ring-blue-200 shadow-2xl border-4 border-white group-hover:ring-blue-300 transition-all duration-300">
								<AvatarImage src={profile?.userId?.profilePic || "/placeholder.svg"} className="rounded-2xl" />
								<AvatarFallback className="text-2xl bg-gradient-to-br from-blue-100 to-emerald-100 text-blue-700 rounded-2xl">
									{profile?.userId?.name
										?.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase() || "P"}
								</AvatarFallback>
							</Avatar>
							<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
								<CheckCircle2 className="h-4 w-4 text-white" />
							</div>
						</div>

						{/* Profile Info */}
						<div className="flex-1  ">
							<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
								<div className="space-y-2">
									<h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
										<span className="mr-3 capitalize">{profile?.userId?.name}</span>
									</h1>
									<h2 className="text-xl lg:text-2xl text-gray-600 font-medium">
										{profile?.profileSummary?.headline || "Healthcare Professional"}
									</h2>
									<div className="flex items-center gap-2">
										<Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
											{profile?.professionType || "Professional"}
										</Badge>
										{profile.professionType && (
											<Badge
												variant="secondary"
												className="bg-emerald-100 text-emerald-700 border-emerald-200 font-semibold"
											>
												<BriefcaseMedical className="h-5 w-5 mr-2" />
												{profile.professionType}
											</Badge>
										)}
										<Badge variant="outline" className="border-green-300 text-green-700">
											<CheckCircle2 className="h-3 w-3 mr-1" />
											Verified
										</Badge>
									</div>
								</div>

								<div className="flex gap-3">
									<Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
										<Share2 className="w-4 h-4 mr-2" />
										Share
									</Button>
								</div>
							</div>

							{/* Bio */}
							<p className="text-gray-700 text-lg leading-relaxed max-w-4xl mt-6">
								{profile?.profileSummary?.bio || "No bio available"}
							</p>

							<div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
								{profile.userId?.email && (
									<div className="flex items-center gap-2">
										<Mail className="h-4 w-4 text-emerald-600" />
										<span className="text-gray-700">{profile.userId.email}</span>
									</div>
								)}
								{profile.contactDetails?.email && !profile.userId?.email && (
									<div className="flex items-center gap-2">
										<Mail className="h-4 w-4 text-emerald-600" />
										<span className="text-gray-700">{profile.contactDetails.email}</span>
									</div>
								)}
								{profile.userId?.phone && (
									<div className="flex items-center gap-2">
										<Phone className="h-4 w-4 text-emerald-600" />
										<span className="text-gray-700">{profile.userId.phone}</span>
									</div>
								)}
								{profile.contactDetails?.phone && !profile.userId?.phone && (
									<div className="flex items-center gap-2">
										<Phone className="h-4 w-4 text-emerald-600" />
										<span className="text-gray-700">{profile.contactDetails.phone}</span>
									</div>
								)}
								<div className="flex items-center gap-2">
									<Star className="h-4 w-4 text-yellow-500 fill-current" />
									<span className="text-gray-700">{calculateTotalExperience(profile.experience)}</span>
								</div>
								{profile.userId?.location && (
									<div className="flex items-center gap-2">
										<MapPin className="h-4 w-4 text-emerald-600" />
										<span className="text-gray-700">{profile.userId.location}</span>
									</div>
								)}
							</div>


							{/* Social Links */}
							<div className="flex flex-wrap gap-4 mt-4">
								{profile.socialMediaLinks?.linkedin && (
									<a
										href={profile.socialMediaLinks.linkedin}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300 group"
									>
										<Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
										<span className="font-medium">LinkedIn</span>
										<ExternalLink className="h-3 w-3 opacity-50" />
									</a>
								)}
								{profile.socialMediaLinks?.twitter && (
									<a
										href={profile.socialMediaLinks.twitter}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-all duration-300 group"
									>
										<Twitter className="h-4 w-4 group-hover:scale-110 transition-transform" />
										<span className="font-medium">Twitter</span>
										<ExternalLink className="h-3 w-3 opacity-50" />
									</a>
								)}
								{profile.socialMediaLinks?.facebook && (
									<a
										href={profile.socialMediaLinks.facebook}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-300 group"
									>
										<Facebook className="h-4 w-4 group-hover:scale-110 transition-transform" />
										<span className="font-medium">Facebook</span>
										<ExternalLink className="h-3 w-3 opacity-50" />
									</a>
								)}
								{profile.socialMediaLinks?.instagram && (
									<a
										href={profile.socialMediaLinks.instagram}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-all duration-300 group"
									>
										<Instagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
										<span className="font-medium">Instagram</span>
										<ExternalLink className="h-3 w-3 opacity-50" />
									</a>
								)}

							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-8">
					{/* Education */}
					<Card className="shadow-lg border-0">
						<CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-emerald-100 rounded-lg">
									<GraduationCap className="h-5 w-5 text-emerald-600" />
								</div>
								<h2 className="text-2xl font-bold text-gray-800">Education</h2>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							{profile.education && profile.education.length > 0 ? (
								<div className="space-y-6">
									{profile.education.map((edu, index) => (
										<div key={edu._id || index} className="relative">
											{index !== profile.education.length - 1 && (
												<div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-emerald-200 to-transparent"></div>
											)}
											<div className="flex gap-4">
												<div className="flex-shrink-0">
													<div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
														<Award className="h-5 w-5 text-emerald-600" />
													</div>
												</div>
												<div className="flex-1">
													<div className="flex items-start justify-between mb-2">
														<div>
															<h3 className="font-semibold text-lg text-gray-800">{edu.degree || "Degree"}</h3>
															<p className="text-emerald-600 font-medium">{edu.institution || "Institution"}</p>
														</div>
														{edu.year && (
															<Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
																{edu.year}
															</Badge>
														)}
													</div>
													{edu.specialization && (
														<p className="text-gray-600">Specialization: {edu.specialization}</p>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<EmptyState
									icon={GraduationCap}
									title="No Education Information"
									description="Education details have not been added yet."
								/>
							)}
						</CardContent>
					</Card>

					{/* Experience */}
					<Card className="shadow-lg border-0">
						<CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-blue-100 rounded-lg">
									<Briefcase className="h-5 w-5 text-blue-600" />
								</div>
								<h2 className="text-2xl font-bold text-gray-800">Professional Experience</h2>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							{profile.experience && profile.experience.length > 0 ? (
								<div className="space-y-6">
									{profile.experience.map((exp, index) => (
										<div key={exp._id || index} className="relative">
											{index !== profile.experience.length - 1 && (
												<div className="absolute left-6 top-16 w-0.5 h-20 bg-gradient-to-b from-blue-200 to-transparent"></div>
											)}
											<div className="flex gap-4">
												<div className="flex-shrink-0">
													<div
														className={`w-12 h-12 rounded-full flex items-center justify-center ${exp.isCurrent ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
															}`}
													>
														<Building2 className="h-5 w-5" />
													</div>
												</div>
												<div className="flex-1">
													<div className="flex items-start justify-between mb-2">
														<div>
															<h3 className="font-semibold text-lg text-gray-800">{exp.role || "Position"}</h3>
															<p className="text-blue-600 font-medium">{exp.organization || "Organization"}</p>
															{exp.department && <p className="text-gray-600 text-sm">{exp.department}</p>}
														</div>
														<div className="text-right">
															{exp.isCurrent && (
																<Badge className="bg-green-100 text-green-700 border-green-200 mb-1">Current</Badge>
															)}
															<p className="text-sm text-gray-500">
																{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
															</p>
															<p className="text-xs text-gray-400">
																{calculateExperience(exp.startDate, exp.endDate)}
															</p>
														</div>
													</div>
													{exp.description && <p className="text-gray-600 text-sm mt-2">{exp.description}</p>}
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<EmptyState
									icon={Briefcase}
									title="No Experience Information"
									description="Professional experience details have not been added yet."
								/>
							)}
						</CardContent>
					</Card>

					{/* Skills */}
					<Card className="shadow-lg border-0">
						<CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-purple-100 rounded-lg">
									<BookOpen className="h-5 w-5 text-purple-600" />
								</div>
								<h2 className="text-2xl font-bold text-gray-800">Core Skills & Expertise</h2>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							{profile.skills && profile.skills.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{profile.skills.map((skill, index) => (
										<div key={skill._id || index} className="space-y-2">
											<div className="flex items-center justify-between">
												<span className="font-medium text-gray-800">{skill.name || "Skill"}</span>
												<Badge
													variant="outline"
													className={`${getProficiencyColor(skill.proficiency)} text-white border-0 capitalize`}
												>
													{skill.proficiency || "intermediate"}
												</Badge>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className={`h-2 rounded-full transition-all duration-500 ${getProficiencyColor(skill.proficiency)}`}
													style={{ width: `${getProficiencyLevel(skill.proficiency)}%` }}
												></div>
											</div>
										</div>
									))}
								</div>
							) : (
								<EmptyState
									icon={BookOpen}
									title="No Skills Information"
									description="Skills and expertise have not been added yet."
								/>
							)}
						</CardContent>
					</Card>

					{/* Certifications */}
					{profile.certifications && profile.certifications.length > 0 && (
						<Card className="shadow-lg border-0">
							<CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-yellow-100 rounded-lg">
										<Shield className="h-5 w-5 text-yellow-600" />
									</div>
									<h2 className="text-2xl font-bold text-gray-800">Certifications</h2>
								</div>
							</CardHeader>
							<CardContent className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{profile.certifications.map((cert, index) => (
										<div key={cert._id || index} className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
											<h3 className="font-semibold text-gray-800">{cert.name}</h3>
											<p className="text-yellow-600 text-sm">{cert.issuer}</p>
											{cert.date && <p className="text-gray-500 text-xs mt-1">{formatDate(cert.date)}</p>}
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Research Projects */}
					{profile.researchProjects && profile.researchProjects.length > 0 && (
						<Card className="shadow-lg border-0">
							<CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-teal-100 rounded-lg">
										<TrendingUp className="h-5 w-5 text-teal-600" />
									</div>
									<h2 className="text-2xl font-bold text-gray-800">Research Projects</h2>
								</div>
							</CardHeader>
							<CardContent className="p-6">
								<div className="space-y-4">
									{profile.researchProjects.map((project, index) => (
										<div key={project._id || index} className="p-4 border border-teal-200 rounded-lg bg-teal-50">
											<h3 className="font-semibold text-gray-800">{project.title}</h3>
											{project.description && <p className="text-gray-600 text-sm mt-2">{project.description}</p>}
											{project.status && (
												<Badge variant="outline" className="mt-2 bg-teal-100 text-teal-700 border-teal-200">
													{project.status}
												</Badge>
											)}
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Languages */}
					<Card className="shadow-lg border-0">
						<CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-orange-100 rounded-lg">
									<Languages className="h-5 w-5 text-orange-600" />
								</div>
								<h3 className="text-xl font-bold text-gray-800">Languages</h3>
							</div>
						</CardHeader>
						<CardContent className="p-4">
							{profile.languages && profile.languages.length > 0 ? (
								<div className="space-y-3">
									{profile.languages.map((lang, index) => (
										<div key={lang._id || index} className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Globe className="h-4 w-4 text-gray-500" />
												<span className="font-medium">{lang.name || "Language"}</span>
											</div>
											<Badge
												variant="outline"
												className={`${getProficiencyColor(lang.proficiency)} text-white border-0 capitalize text-xs`}
											>
												{lang.proficiency || "basic"}
											</Badge>
										</div>
									))}
								</div>
							) : (
								<EmptyState icon={Languages} title="No Languages" description="Language information not available." />
							)}
						</CardContent>
					</Card>

					{/* Consultation Availability */}
					{console.debug("Profile Consultation Details:", profile.consultationDetails)}
					{console.debug("Consultation Hours:", profile.consultationDetails?.hours)}

					{profile.consultationDetails && (
						<Card className="shadow-lg border-0">
							<CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-green-100 rounded-lg">
										<Clock className="h-5 w-5 text-green-600" />
									</div>
									<h3 className="text-xl font-bold text-gray-800">Consultation Hours</h3>
								</div>
							</CardHeader>

							<CardContent className="p-4 space-y-4">
								{/* Availability Status */}
								<div className="flex items-center gap-2">
									<div className={`w-3 h-3 rounded-full ${{
										high: 'bg-green-500',
										moderate: 'bg-yellow-500',
										low: 'bg-orange-500',
										unavailable: 'bg-gray-400'
									}[profile.consultationDetails.availability || 'moderate']}`} />
									<span className="text-sm font-medium capitalize">
										{profile.consultationDetails.availability || 'moderate'} Availability
									</span>
								</div>

								{/* Fee Range */}
								{(profile.consultationDetails.fee?.minimum != null || profile.consultationDetails.fee?.maximum != null) && (
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">Consultation Fee</span>
										<span className="font-medium">
											{profile.consultationDetails.fee?.minimum && `₹${profile.consultationDetails.fee.minimum}`}
											{profile.consultationDetails.fee?.minimum && profile.consultationDetails.fee?.maximum && ` - `}
											{profile.consultationDetails.fee?.maximum && `₹${profile.consultationDetails.fee.maximum}`}
										</span>
									</div>
								)}

								{/* Weekly Schedule */}
								<div className="space-y-2">
									<h4 className="text-sm font-semibold text-gray-700 mb-3">Weekly Schedule</h4>
									{Array.isArray(profile.consultationDetails.hours) && profile.consultationDetails.hours.length > 0 ? (
										<div className="space-y-2">
											{profile.consultationDetails.hours.map((slot, index) => (
												<div key={slot.day || index} className="py-2 px-3 border border-gray-200 rounded-lg">
													<div className="flex items-center justify-between">
														<span className="text-sm font-medium capitalize text-gray-800">
															{slot.day || `Day ${index + 1}`}
														</span>
														<div className="flex items-center gap-1">
															{slot.isAvailable ? (
																<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
																	Available
																</Badge>
															) : (
																<Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 text-xs">
																	Unavailable
																</Badge>
															)}
														</div>
													</div>
													
													{slot.isAvailable && (
														<div className="mt-2 space-y-1">
															{slot.morning?.isActive && (
																<div className="flex items-center gap-2 text-xs">
																	<span className="text-blue-600 font-medium">Morning:</span>
																	<span className="text-gray-600">
																		{slot.morning.startTime} - {slot.morning.endTime}
																	</span>
																</div>
															)}
															{slot.evening?.isActive && (
																<div className="flex items-center gap-2 text-xs">
																	<span className="text-orange-600 font-medium">Evening:</span>
																	<span className="text-gray-600">
																		{slot.evening.startTime} - {slot.evening.endTime}
																	</span>
																</div>
															)}
															{!slot.morning?.isActive && !slot.evening?.isActive && (
																<span className="text-xs text-gray-500">Available (time flexible)</span>
															)}
														</div>
													)}
												</div>
											))}
										</div>
									) : (
										<div className="text-center py-4">
											<Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
											<p className="text-gray-500 text-sm">No schedule information available</p>
										</div>
									)}
								</div>

								<Separator className="my-4" />

								<Button asChild className="w-full bg-green-600 hover:bg-green-700">
									<Link href={`/professional/profile/${id}/appointments`}>
										<Calendar className="h-4 w-4 mr-2" />
										Schedule Appointment
									</Link>
								</Button>
							</CardContent>
						</Card>
					)}



					<Card className="shadow-lg border-0">
						<CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-gray-100 rounded-lg">
									<TrendingUp className="h-5 w-5 text-gray-600" />
								</div>
								<h3 className="text-xl font-bold text-gray-800">Quick Stats</h3>
							</div>
						</CardHeader>
						<CardContent className="p-4">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Total Experience</span>
									<span className="font-semibold">{calculateTotalExperience(profile.experience)}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Specializations</span>
									<span className="font-semibold">{profile.skills?.length || 0}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Languages</span>
									<span className="font-semibold">{profile.languages?.length || 0}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Education</span>
									<span className="font-semibold">{profile.education?.length || 0}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Current Role</span>
									<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
										{profile.experience?.some((exp) => exp.isCurrent) ? "Active" : "Available"}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Contact Card */}
					<Card className="shadow-lg border-0">
						<CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-indigo-100 rounded-lg">
									<Heart className="h-5 w-5 text-indigo-600" />
								</div>
								<h3 className="text-xl font-bold text-gray-800">Get in Touch</h3>
							</div>
						</CardHeader>
						<CardContent className="p-4 space-y-3">
							<Button variant="outline" className="w-full justify-start">
								<MessageSquare className="h-4 w-4 mr-2" />
								Send Message
							</Button>
							<Button variant="outline" className="w-full justify-start">
								<Phone className="h-4 w-4 mr-2" />
								Call Now
							</Button>
							<Button variant="outline" className="w-full justify-start">
								<ExternalLink className="h-4 w-4 mr-2" />
								View Full Profile
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
