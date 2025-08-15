"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, ArrowRight, Calendar, Briefcase, GraduationCap, Book, Users, Edit2, Award, Building, Globe, CheckCircle2, ExternalLink, Share2, BookOpen, Target, TrendingUp, BriefcaseMedical, Star, MapPin, } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import EditProfessionalDialog from "@/components/pageComponents/professionalprofile/EditProfessionalDialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// Enhanced Loading Component
const ProfileSkeleton = () => (
	<div className="min-h-screen ">
		<div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
			{/* Header Skeleton */}
			<Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
				<CardContent className="p-8">
					<div className="flex flex-col lg:flex-row items-start gap-8">
						<Skeleton className="h-32 w-32 rounded-full flex-shrink-0" />
						<div className="flex-1 space-y-4 w-full">
							<Skeleton className="h-10 w-3/4" />
							<Skeleton className="h-6 w-full" />
							<Skeleton className="h-6 w-2/3" />
							<div className="flex gap-4">
								<Skeleton className="h-10 w-32" />
								<Skeleton className="h-10 w-32" />
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Stats Skeleton */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{[1, 2, 3, 4].map((i) => (
					<Card key={i} className="p-6">
						<Skeleton className="h-12 w-12 rounded-lg mb-4" />
						<Skeleton className="h-6 w-20 mb-2" />
						<Skeleton className="h-4 w-16" />
					</Card>
				))}
			</div>

			{/* Content Skeleton */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-6">
					{[1, 2, 3].map((i) => (
						<Card key={i} className="p-6">
							<Skeleton className="h-6 w-40 mb-4" />
							<div className="space-y-3">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</div>
						</Card>
					))}
				</div>
				<div className="space-y-6">
					{[1, 2].map((i) => (
						<Card key={i} className="p-6">
							<Skeleton className="h-6 w-32 mb-4" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-2/3" />
							</div>
						</Card>
					))}
				</div>
			</div>
		</div>
	</div>
)

// Enhanced Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color, bgColor, trend }) => (
	<Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${bgColor} group cursor-pointer`}>
		<CardContent className="p-6">
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<p className={`text-sm font-medium ${color} opacity-80`}>{label}</p>
					<div className="flex items-baseline space-x-2">
						<span className={`text-2xl font-bold ${color}`}>{value}</span>
						{trend && (
							<span className={`text-xs ${color} opacity-70 flex items-center gap-1`}>
								<TrendingUp className="h-3 w-3" />
								{trend}
							</span>
						)}
					</div>
				</div>
				<div className={`p-3 rounded-full bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform`}>
					<Icon className={`h-6 w-6 ${color}`} />
				</div>
			</div>
		</CardContent>
	</Card>
)

// Enhanced Section Card Component
const SectionCard = ({ icon: Icon, title, children, className = "", headerColor = "text-gray-700" }) => (
	<Card
		className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm ${className}`}
	>
		<CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
			<CardTitle className={`flex items-center gap-3 text-xl ${headerColor}`}>
				<div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100">
					<Icon className="h-5 w-5 text-blue-600" />
				</div>
				{title}
			</CardTitle>
		</CardHeader>
		<CardContent className="p-6">{children}</CardContent>
	</Card>
)

export default function EnhancedProfessionalProfile() {
	const [professional, setProfessional] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [activeTab, setActiveTab] = useState("experience")

	useEffect(() => {
		const getProfessionalData = async () => {
			setLoading(true)
			try {
				const response = await axios.get("/api/professional/get")
				if (response.status === 200) {
					console.log(response.data.professional)
					setProfessional(response.data.professional)
				} else {
					setError("Failed to fetch professional data")
				}
			} catch (error) {
				console.error("API Error:", error)
				setError(error)
				toast.error("Failed to load professional profile")
			} finally {
				setLoading(false)
			}
		}
		getProfessionalData()
	}, [])

	const handleSaveProfile = async (updatedData) => {
		try {
			const response = await axios.put("/api/professional/update", {
				ProfessionalId: professional._id,
				data: updatedData,
			})
			if (response.status === 200) {
				setProfessional(response.data.professional)
				toast.success("Profile updated successfully!")
			}
		} catch (error) {
			console.error("Error updating professional profile:", error)
			toast.error("Failed to update profile")
		}
	}

	if (loading) {
		return <ProfileSkeleton />
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

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="w-full max-w-md border-red-200 bg-red-50/80 backdrop-blur-sm">
					<CardContent className="p-8 text-center">
						<div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
							<span className="text-red-600 text-2xl">!</span>
						</div>
						<h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Profile</h2>
						<p className="text-red-600 mb-4">Failed to load profile data. Please try again later.</p>
						<Button variant="outline" onClick={() => window.location.reload()} className="border-red-300 text-red-700">
							Try Again
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (!professional) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
				<Card className="w-full max-w-md bg-gray-50/80 backdrop-blur-sm">
					<CardContent className="p-8 text-center">
						<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
							<Users className="h-8 w-8 text-gray-400" />
						</div>
						<h2 className="text-xl font-semibold text-gray-700 mb-2">No Profile Found</h2>
						<p className="text-gray-500">No profile data available</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	// Calculate stats
	const stats = [
		{
			icon: Award,
			label: "Experience",
			value: `${professional.experience?.length || 0}`,
			color: "text-blue-700",
			bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
			trend: "Years",
		},
		{
			icon: GraduationCap,
			label: "Education",
			value: `${professional.education?.length || 0}`,
			color: "text-emerald-700",
			bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
			trend: "Degrees",
		},
		{
			icon: Book,
			label: "Research",
			value: `${professional.researchProjects?.length || 0}`,
			color: "text-purple-700",
			bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
			trend: "Projects",
		},
		{
			icon: Target,
			label: "Skills",
			value: `${professional.skills?.length || 0}`,
			color: "text-orange-700",
			bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
			trend: "Listed",
		},
	]

	return (

		<div className=" space-y-6 mt-6" >
			{/* Enhanced Header Section */}
			<Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-emerald-600/5 to-blue-600/5"></div>
				<CardContent className="relative pt-6 sm:p-6">
					<div className="flex flex-col lg:flex-row items-start gap-8">
						{/* Avatar Section */}
						<div className="relative group">
							<Avatar className="h-32 w-32 rounded-2xl ring-4 ring-blue-200 shadow-2xl border-4 border-white group-hover:ring-blue-300 transition-all duration-300">
								<AvatarImage src={professional?.userId?.profilePic || "/placeholder.svg"} className="rounded-2xl" />
								<AvatarFallback className="text-2xl bg-gradient-to-br from-blue-100 to-emerald-100 text-blue-700 rounded-2xl">
									{professional?.userId?.name
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
						<div className="flex-1 space-y-6">
							<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
								<div className="space-y-2">

									<h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
										<span className="mr-3 capitalize">{professional?.userId?.name}</span>
										{professional.professionType && (
											<Badge
												variant="secondary"
												className="bg-emerald-100 text-emerald-700 border-emerald-200 font-semibold"
											>
												<BriefcaseMedical className="h-5 w-5 mr-2" />
												{professional.professionType}
											</Badge>
										)}
									</h1>
									<h2 className="text-xl lg:text-2xl text-gray-600 font-medium">
										{professional?.profileSummary?.headline || "Healthcare Professional"}
									</h2>
									<div className="flex items-center gap-2">
										<Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
											{professional?.professionType || "Professional"}
										</Badge>
										<Badge variant="outline" className="border-green-300 text-green-700">
											<CheckCircle2 className="h-3 w-3 mr-1" />
											Verified
										</Badge>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-3">
									<Button
										onClick={() => setIsEditDialogOpen(true)}
										className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
									>
										<Edit2 className="w-4 h-4 mr-2" />
										Edit Profile
									</Button>
									<Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
										<Share2 className="w-4 h-4 mr-2" />
										Share
									</Button>
								</div>
							</div>

							{/* Bio */}
							<p className="text-gray-700 text-lg leading-relaxed max-w-4xl">
								{professional?.profileSummary?.bio || "No bio available"}
							</p>

							<div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
								{professional.userId?.email && (
									<div className="flex items-center gap-2">
										<Mail className="h-4 w-4 text-emerald-600" />
										<span className="text-gray-700">{professional.userId.email}</span>
									</div>
								)}
								{professional.contactDetails?.email && !professional.userId?.email && (
									<div className="flex items-center gap-2">
										<Mail className="h-4 w-4 text-emerald-600" />
										<span className="text-gray-700">{professional.contactDetails.email}</span>
									</div>
								)}
								{professional.userId?.phone && (
									<div className="flex items-center gap-2">
										<Phone className="h-4 w-4 text-emerald-600" />
										<span className="text-gray-700">{professional.userId.phone}</span>
									</div>
								)}
								{professional.contactDetails?.phone && !professional.userId?.phone && (
									<div className="flex items-center gap-2">
										<Phone className="h-4 w-4 text-emerald-600" />
										<span className="text-gray-700">{professional.contactDetails.phone}</span>
									</div>
								)}
								<div className="flex items-center gap-2">
									<Star className="h-4 w-4 text-yellow-500 fill-current" />
									<span className="text-gray-700">{calculateTotalExperience(professional.experience)}</span>
								</div>
								{professional.userId?.location && (
									<div className="flex items-center gap-2">
										<MapPin className="h-4 w-4 text-emerald-600" />
										<span className="text-gray-700">{professional.userId.location}</span>
									</div>
								)}
							</div>

							{/* Social Links */}
							<div className="flex flex-wrap gap-4">
								{professional.socialMediaLinks?.linkedin && (
									<a
										href={professional.socialMediaLinks.linkedin}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300 group"
									>
										<Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
										<span className="font-medium">LinkedIn</span>
										<ExternalLink className="h-3 w-3 opacity-50" />
									</a>
								)}
								{professional.socialMediaLinks?.twitter && (
									<a
										href={professional.socialMediaLinks.twitter}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-all duration-300 group"
									>
										<Twitter className="h-4 w-4 group-hover:scale-110 transition-transform" />
										<span className="font-medium">Twitter</span>
										<ExternalLink className="h-3 w-3 opacity-50" />
									</a>
								)}
								{professional.socialMediaLinks?.facebook && (
									<a
										href={professional.socialMediaLinks.facebook}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-300 group"
									>
										<Facebook className="h-4 w-4 group-hover:scale-110 transition-transform" />
										<span className="font-medium">Facebook</span>
										<ExternalLink className="h-3 w-3 opacity-50" />
									</a>
								)}
								{professional.socialMediaLinks?.instagram && (
									<a
										href={professional.socialMediaLinks.instagram}
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

			{/* Stats Grid */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
				{stats.map((stat, index) => (
					<StatsCard key={index} {...stat} />
				))}
			</div>

			{/* Main Content with Tabs */}
			<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
				<CardContent className="p-0">
					<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
						<div className="border-b bg-gradient-to-r from-gray-50 to-white px-6 py-4">
							<TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 gap-2 bg-gray-100 min-h-fit">
								{/* <TabsTrigger value="overview" className="flex items-center gap-2 text-xs lg:text-sm px-3 py-2">
										<Users className="h-4 w-4" />
										<span className="hidden sm:inline">Overview</span>
									</TabsTrigger> */}
								<TabsTrigger value="experience" className="flex items-center gap-2 text-xs lg:text-sm px-3 py-2">
									<Briefcase className="h-4 w-4" />
									<span className="hidden sm:inline">Experience</span>
								</TabsTrigger>
								<TabsTrigger value="education" className="flex items-center gap-2 text-xs lg:text-sm px-3 py-2">
									<GraduationCap className="h-4 w-4" />
									<span className="hidden sm:inline">Education</span>
								</TabsTrigger>
								<TabsTrigger value="research" className="flex items-center gap-2 text-xs lg:text-sm px-3 py-2">
									<Book className="h-4 w-4" />
									<span className="hidden sm:inline">Research</span>
								</TabsTrigger>
								<TabsTrigger value="skills" className="flex items-center gap-2 text-xs lg:text-sm px-3 py-2">
									<Target className="h-4 w-4" />
									<span className="hidden sm:inline">Skills</span>
								</TabsTrigger>
								<TabsTrigger value="contact" className="flex items-center gap-2 text-xs lg:text-sm px-3 py-2">
									<Phone className="h-4 w-4" />
									<span className="hidden sm:inline">Contact</span>
								</TabsTrigger>
							</TabsList>
						</div>

						<div className="p-6">
							{/* Overview Tab */}
							{/* <TabsContent value="overview" className="space-y-6 mt-0">
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
										 
										<SectionCard icon={Users} title="Quick Information">
											<div className="space-y-4">
												<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
													<span className="text-gray-600">Profession</span>
													<Badge className="bg-blue-100 text-blue-700">
														{professional?.professionType || "Not specified"}
													</Badge>
												</div>
												<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
													<span className="text-gray-600">Total Experience</span>
													<span className="font-semibold">{professional.experience?.length || 0} positions</span>
												</div>
												<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
													<span className="text-gray-600">Education Level</span>
													<span className="font-semibold">{professional.education?.length || 0} degrees</span>
												</div>
												<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
													<span className="text-gray-600">Research Projects</span>
													<span className="font-semibold">{professional.researchProjects?.length || 0} projects</span>
												</div>
											</div>
										</SectionCard>

										<SectionCard icon={Clock} title="Recent Activity">
											<div className="space-y-4">
												<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
													<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
													<div>
														<p className="font-medium text-gray-900">Profile Updated</p>
														<p className="text-sm text-gray-500">2 days ago</p>
													</div>
												</div>
												<div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
													<div className="w-2 h-2 bg-green-500 rounded-full"></div>
													<div>
														<p className="font-medium text-gray-900">New Skill Added</p>
														<p className="text-sm text-gray-500">1 week ago</p>
													</div>
												</div>
												<div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
													<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
													<div>
														<p className="font-medium text-gray-900">Research Published</p>
														<p className="text-sm text-gray-500">2 weeks ago</p>
													</div>
												</div>
											</div>
										</SectionCard>
									</div>
								</TabsContent> */}

							{/* Experience Tab */}
							<TabsContent value="experience" className="space-y-6 mt-0">
								{professional.experience?.length > 0 ? (
									<div className="space-y-6">
										{professional.experience.map((exp, index) => (
											<Card
												key={index}
												className="border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300"
											>
												<CardContent className="p-6">
													<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
														<div>
															<h3 className="text-xl font-semibold text-gray-900">{exp.role}</h3>
															<p className="text-blue-600 font-medium flex items-center gap-2">
																<Building className="h-4 w-4" />
																{exp.organization} • {exp.department}
															</p>
														</div>
														<div className="flex items-center gap-2 text-gray-600">
															<Calendar className="h-4 w-4" />
															<span className="font-medium">
																{new Date(exp.startDate).getFullYear()} -{" "}
																{exp.isCurrent ? "Present" : new Date(exp.endDate).getFullYear()}
															</span>
															{exp.isCurrent && <Badge className="bg-green-100 text-green-700 ml-2">Current</Badge>}
														</div>
													</div>
													{exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
												</CardContent>
											</Card>
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
										<h3 className="text-lg font-semibold text-gray-700 mb-2">No Experience Listed</h3>
										<p className="text-gray-500">Add your professional experience to showcase your career journey.</p>
									</div>
								)}
							</TabsContent>

							{/* Education Tab */}
							<TabsContent value="education" className="space-y-6 mt-0">
								{professional.education?.length > 0 ? (
									<div className="space-y-6">
										{professional.education.map((edu, index) => (
											<Card
												key={index}
												className="border-l-4 border-emerald-500 hover:shadow-lg transition-all duration-300"
											>
												<CardContent className="p-6">
													<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
														<div className="space-y-2">
															<h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
															<p className="text-emerald-600 font-medium flex items-center gap-2">
																<GraduationCap className="h-4 w-4" />
																{edu.institution}
															</p>
															<p className="text-gray-600">Specialization: {edu.specialization}</p>
														</div>
														<div className="flex items-center gap-2 text-gray-600">
															<Calendar className="h-4 w-4" />
															<span className="font-medium">{edu.year}</span>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
										<h3 className="text-lg font-semibold text-gray-700 mb-2">No Education Listed</h3>
										<p className="text-gray-500">Add your educational background to highlight your qualifications.</p>
									</div>
								)}
							</TabsContent>

							{/* Research Tab */}
							<TabsContent value="research" className="space-y-6 mt-0">
								{professional.researchProjects?.length > 0 ? (
									<div className="space-y-6">
										{professional.researchProjects.map((project, index) => (
											<Card
												key={index}
												className="border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300"
											>
												<CardContent className="p-6">
													<div className="space-y-4">
														<div>
															<h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
															<p className="text-gray-700 leading-relaxed">{project.summary}</p>
														</div>
														<div className="flex flex-wrap gap-4 text-sm">
															<div className="flex items-center gap-2 text-purple-600">
																<BookOpen className="h-4 w-4" />
																<span className="font-medium">Field: {project.field}</span>
															</div>
															<div className="flex items-center gap-2 text-purple-600">
																<Building className="h-4 w-4" />
																<span className="font-medium">Associated with: {project.associatedWith}</span>
															</div>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
										<h3 className="text-lg font-semibold text-gray-700 mb-2">No Research Projects</h3>
										<p className="text-gray-500">
											Add your research projects to showcase your academic contributions.
										</p>
									</div>
								)}
							</TabsContent>

							{/* Skills Tab */}
							<TabsContent value="skills" className="space-y-6 mt-0">
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									{/* Skills */}
									<SectionCard icon={Target} title="Professional Skills">
										{professional?.skills && professional.skills.length > 0 ? (
											<div className="flex flex-wrap gap-3">
												{professional.skills.map((skill, index) => (
													<Badge
														key={skill._id || index}
														className="px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-all cursor-default text-sm"
													>
														{skill.name}
														<span className="ml-2 text-blue-600 opacity-75">• {skill.proficiency}</span>
													</Badge>
												))}
											</div>
										) : (
											<div className="text-center py-8">
												<Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
												<p className="text-gray-500">No skills listed</p>
											</div>
										)}
									</SectionCard>

									{/* Languages */}
									<SectionCard icon={Globe} title="Languages">
										{professional.languages && professional.languages.length > 0 ? (
											<div className="flex flex-wrap gap-3">
												{professional.languages.map((lang, index) => (
													<Badge
														key={index}
														variant="outline"
														className="px-4 py-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-all cursor-default text-sm"
													>
														{lang.name}
														<span className="ml-2 text-emerald-600 opacity-75">• {lang.proficiency}</span>
													</Badge>
												))}
											</div>
										) : (
											<div className="text-center py-8">
												<Globe className="h-12 w-12 text-gray-300 mx-auto mb-3" />
												<p className="text-gray-500">No languages listed</p>
											</div>
										)}
									</SectionCard>
								</div>
							</TabsContent>

							{/* Contact Tab */}
							<TabsContent value="contact" className="space-y-6 mt-0">
								<SectionCard icon={Phone} title="Contact Information">
									{professional.contactDetails ? (
										<div className="space-y-4">
											<div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
												<div className="p-2 bg-amber-200 rounded-lg">
													<Phone className="h-5 w-5 text-amber-700" />
												</div>
												<div>
													<p className="font-medium text-gray-900">Phone</p>
													<p className="text-gray-600">{professional.contactDetails.phone || "No phone number"}</p>
												</div>
											</div>
											<div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
												<div className="p-2 bg-blue-200 rounded-lg">
													<Mail className="h-5 w-5 text-blue-700" />
												</div>
												<div>
													<p className="font-medium text-gray-900">Email</p>
													<p className="text-gray-600">{professional.contactDetails.email || "No email"}</p>
												</div>
											</div>
										</div>
									) : (
										<div className="text-center py-8">
											<Phone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
											<p className="text-gray-500">No contact details available</p>
										</div>
									)}
								</SectionCard>
							</TabsContent>
						</div>
					</Tabs>
				</CardContent>
			</Card>

			{/* Similar Professionals Section */}
			{professional && <EnhancedSuggestion professional={professional} />}

			{/* Edit Dialog */}
			<EditProfessionalDialog
				isOpen={isEditDialogOpen}
				onClose={() => setIsEditDialogOpen(false)}
				professional={professional}
				onSave={handleSaveProfile}
			/>
		</div>
	)
}

// Enhanced Suggestion Component
const EnhancedSuggestion = ({ professional }) => {
	const [professionals, setProfessionals] = useState([])
	const [loading, setLoading] = useState(false)

	const fetchSimilarProfessionals = async () => {
		setLoading(true)
		try {
			const queryParams = new URLSearchParams({
				professionType: professional.professionType || "",
				skills:
					professional.skills
						?.map((s) => s.name)
						.filter(Boolean)
						.join(",") || "",
				specializations:
					professional.education
						?.map((e) => e.specialization)
						.filter(Boolean)
						.join(",") || "",
			})

			const response = await axios.get(`/api/professional/suggestion?${queryParams}`)
			if (response.status === 200 && response.data.success) {
				setProfessionals(response.data.professionals)
			}
		} catch (error) {
			console.error("Error fetching similar professionals:", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (professional?._id) {
			fetchSimilarProfessionals()
		}
	}, [professional?._id])

	return (
		<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
			<CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
				<CardTitle className="text-2xl flex items-center gap-3">
					<div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100">
						<Users className="h-6 w-6 text-blue-600" />
					</div>
					Similar Professionals
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<Card key={i} className="p-6">
								<div className="flex items-start gap-4">
									<Skeleton className="h-16 w-16 rounded-full" />
									<div className="space-y-2 flex-1">
										<Skeleton className="h-5 w-3/4" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-1/2" />
									</div>
								</div>
							</Card>
						))}
					</div>
				) : professionals && professionals.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{professionals.slice(0, 3).map((prof, index) => (
							<Card
								key={prof._id || index}
								className="hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg group"
							>
								<CardContent className="p-6">
									<div className="flex items-start gap-4">
										<Avatar className="h-16 w-16 ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all">
											<AvatarImage src={prof.userId?.profilePic || "/placeholder.svg"} />
											<AvatarFallback className="bg-gradient-to-br from-blue-100 to-emerald-100 text-blue-700">
												{prof.profileSummary?.headline?.[0] || prof.userId?.name?.[0] || "P"}
											</AvatarFallback>
										</Avatar>
										<div className="space-y-2 flex-1">
											<h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
												{prof.userId?.name || prof.profileSummary?.headline || "Professional"}
											</h3>
											<p className="text-gray-600 text-sm line-clamp-2">
												{prof.profileSummary?.bio || "No bio available"}
											</p>
											<div className="flex items-center justify-between">
												<Badge className="bg-blue-100 text-blue-700 text-xs">
													{prof.professionType || "Professional"}
												</Badge>
												<a
													href={`/professional/${prof._id}`}
													className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm group-hover:gap-2"
												>
													View Profile
													<ArrowRight className="h-3 w-3 transition-all" />
												</a>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-700 mb-2">No Similar Professionals Found</h3>
						<p className="text-gray-500">{`We couldn't find any professionals with similar backgrounds at the moment.`}</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
