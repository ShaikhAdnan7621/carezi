"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import axios from "axios"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Heart, Moon, Utensils, UserCircle, ShieldCheck, Building, Droplet, TrendingUp, Ruler, Weight, Stethoscope, Sparkles, PhoneCall, FileText, AlertTriangle, CheckCircle2, XCircle, Clock, Send, Loader2, Edit3, Camera, Phone, Calendar, Plus, BarChart3, Pill, } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"
import EditUserDialog from "@/components/pageComponents/user/EditUserDialog"


// Enhanced Loading Component
const ProfileSkeleton = () => (
	<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
		<div className="container mx-auto px-4 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				{/* Sidebar Skeleton */}
				<div className="lg:col-span-1 space-y-6">
					<Card className="p-6">
						<div className="flex flex-col items-center space-y-4">
							<div className="h-32 w-32 bg-gray-200 rounded-full animate-pulse"></div>
							<div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
							<div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
						</div>
					</Card>
					{[1, 2].map((i) => (
						<Card key={i} className="p-6">
							<div className="space-y-4">
								<div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
								<div className="h-20 bg-gray-200 rounded animate-pulse"></div>
							</div>
						</Card>
					))}
				</div>

				{/* Main Content Skeleton */}
				<div className="lg:col-span-3 space-y-6">
					<Card className="p-6">
						<div className="space-y-6">
							<div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
								))}
							</div>
							<div className="space-y-4">
								{[1, 2, 3].map((i) => (
									<div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
								))}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	</div>
)

// Enhanced Stats Card Component
const StatsCard = ({ icon: Icon, label, value, unit, color, gradient, trend }) => (
	<Card
		className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${gradient}`}
	>
		<CardContent className="p-3 sm:p-2 lg:p-3">
			<div className="flex items-center justify-between">
				<div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
					<p className={`text-xs sm:text-sm font-medium ${color} opacity-80 truncate`}>{label}</p>
					<div className="flex items-baseline space-x-1">
						<span className={`text-lg sm:text-xl lg:text-2xl font-bold ${color} truncate`}>{value}</span>
						{unit && <span className={`text-xs sm:text-sm ${color} opacity-70 flex-shrink-0`}>{unit}</span>}
					</div>
					{trend && (
						<div className="flex items-center space-x-1">
							<TrendingUp className={`h-2 w-2 sm:h-3 sm:w-3 ${color} opacity-70`} />
							<span className={`text-xs ${color} opacity-70 truncate`}>{trend}</span>
						</div>
					)}
				</div>
				<div className={`p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm flex-shrink-0`}>
					<Icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${color}`} />
				</div>
			</div>
		</CardContent>
	</Card>
)

// Enhanced Health Issue Card
const HealthIssueCard = ({ issue, index }) => {
	const severityConfig = {
		Severe: {
			color: "border-red-500 bg-red-50",
			badge: "bg-red-100 text-red-800",
			icon: "text-red-500",
		},
		Moderate: {
			color: "border-yellow-500 bg-yellow-50",
			badge: "bg-yellow-100 text-yellow-800",
			icon: "text-yellow-500",
		},
		Mild: {
			color: "border-green-500 bg-green-50",
			badge: "bg-green-100 text-green-800",
			icon: "text-green-500",
		},
	}

	const config = severityConfig[issue.severity] || severityConfig.Mild

	return (
		<Card className={`border-l-4 hover:shadow-lg transition-all duration-300 ${config.color}`}>
			<CardContent className="p-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center space-x-3">
						<div className={`p-2 rounded-full bg-white shadow-sm`}>
							<Stethoscope className={`h-5 w-5 ${config.icon}`} />
						</div>
						<div>
							<h4 className="text-lg font-semibold text-gray-900">{issue.condition}</h4>
							<p className="text-sm text-gray-500">Diagnosed: {new Date(issue.diagnosedDate).toLocaleDateString()}</p>
						</div>
					</div>
					<Badge className={config.badge}>{issue.severity}</Badge>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div className="flex items-center space-x-2">
						<Activity className="h-4 w-4 text-gray-400" />
						<span className="text-sm text-gray-600">Status: {issue.status}</span>
					</div>
				</div>

				{issue.medications?.length > 0 && (
					<div className="mt-4 pt-4 border-t border-gray-200">
						<h5 className="font-medium mb-3 flex items-center space-x-2">
							<Pill className="h-4 w-4 text-blue-500" />
							<span>Current Medications</span>
						</h5>
						<div className="grid gap-2">
							{issue.medications.map((med, idx) => (
								<div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border">
									<div>
										<span className="font-medium text-gray-900">{med.name}</span>
										<p className="text-sm text-gray-500">{med.dosage}</p>
									</div>
									<Badge variant="outline">{med.frequency}</Badge>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

// Enhanced Lifestyle Card
const LifestyleCard = ({ icon: Icon, title, data, color, bgColor }) => (
	<Card className={`hover:shadow-lg transition-all duration-300 border-0 ${bgColor}`}>
		<CardHeader className="pb-4">
			<CardTitle className={`flex items-center space-x-2 ${color}`}>
				<Icon className="h-5 w-5" />
				<span>{title}</span>
			</CardTitle>
		</CardHeader>
		<CardContent className="space-y-4">
			{data ? (
				<div className="space-y-3">
					{Object.entries(data).map(([key, value]) => (
						<div key={key} className="flex items-center justify-between">
							<span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
							<Badge variant="outline" className={`${color} bg-white/50`}>
								{Array.isArray(value) ? value.join(", ") : value}
							</Badge>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-4 text-gray-500">
					<Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
					<p className="text-sm">No data available</p>
				</div>
			)}
		</CardContent>
	</Card>
)

// Main Enhanced Profile Component
export default function ProfilePage() {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [activeTab, setActiveTab] = useState("overview")
	const [organizationdetails, setOrganizationDetails] = useState({})

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios.get("/api/user")
				setUser(response.data)
			} catch (error) {
				console.error("Error fetching user:", error)
				toast.error("Failed to load profile")
			} finally {
				setLoading(false)
			}
		}
		fetchUser()
	}, [])

	useEffect(() => {
		const checkApplicationStatus = async () => {
			if (user?._id) {
				try {
					const response = await axios.get("/api/organization/status", {
						params: { userId: user._id },
					})
					setOrganizationDetails({
						_id: response.data._id,
						name: response.data.name,
						facilityType: response.data.facilityType,
						status: response.data.status,
					})
				} catch (error) {
					console.error("Error checking application status:", error)
				}
			}
		}
		checkApplicationStatus()
	}, [user])

	if (loading) {
		return <ProfileSkeleton />
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="p-8 text-center">
					<AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
					<p className="text-gray-600">Unable to load your profile information.</p>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen ">
			<div className="container mx-auto   py-4 sm:py-8">
				<div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 ">
					{/* Enhanced Mobile-First Sidebar */}
					<div className="lg:col-span-1 space-y-4 sm:space-y-6">
						{/* Mobile Profile Card */}
						<Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
							<CardContent className="p-4 sm:p-6">
								<div className="flex flex-row lg:flex-col items-center lg:text-center space-x-4 lg:space-x-0 lg:space-y-4">
									<div className="relative group flex-shrink-0">
										<Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-32 lg:w-32 ring-2 lg:ring-4 ring-blue-100 shadow-lg transition-all duration-300 group-hover:ring-blue-200">
											<AvatarImage src={user.profilePic || "/Logo.svg"} alt="Profile Picture" />
											<AvatarFallback className="text-sm sm:text-lg lg:text-2xl bg-gradient-to-br from-blue-100 to-emerald-100 text-blue-700">
												{user.name
													?.split(" ")
													.map((n) => n[0])
													.join("")
													.toUpperCase() || <UserCircle />}
											</AvatarFallback>
										</Avatar>
										<Button
											size="sm"
											className="absolute -bottom-1 -right-1 lg:bottom-0 lg:right-0 rounded-full w-6 h-6 lg:w-8 lg:h-8 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
										>
											<Camera className="h-3 w-3 lg:h-4 lg:w-4" />
										</Button>
									</div>

									<div className="flex-1 lg:flex-none space-y-1 lg:space-y-2 min-w-0">
										<h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{user.name}</h1>
										<p className="text-xs sm:text-sm text-gray-500 truncate">
											@{user.name?.toLowerCase().replace(/\s+/g, "")}
										</p>
										<p className="text-gray-600 text-xs sm:text-sm line-clamp-2 lg:line-clamp-none">
											{user.bio || "No bio added yet"}
										</p>

										<div className="flex flex-wrap gap-1 lg:gap-2 lg:justify-center">
											<Badge variant={user.isEmailVerified ? "default" : "destructive"} className="text-xs">
												{user.isEmailVerified ? (
													<>
														<CheckCircle2 className="h-2 w-2 lg:h-3 lg:w-3 mr-1" />
														<span className="">Verified</span>
													</>
												) : (
													<>
														<XCircle className="h-2 w-2 lg:h-3 lg:w-3 mr-1" />
														<span className="">Unverified</span>
													</>
												)}
											</Badge>
											{user.isProfessional && (
												<Badge className="bg-emerald-100 text-emerald-700 text-xs">
													<ShieldCheck className="h-2 w-2 lg:h-3 lg:w-3 mr-1" />
													<span className="">Professional</span>
												</Badge>
											)}
										</div>


										<EditUserDialog user={user} setUser={setUser} className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700" />

									</div>
								</div>
							</CardContent>
						</Card>

						{/* Mobile-Optimized Organization Card */}
						<Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
							<CardHeader className="pb-2 sm:pb-4">
								<CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
									<Building className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
									<span>Organization</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								{organizationdetails?.status ? (
									<div className="space-y-3 sm:space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-xs sm:text-sm text-gray-600">Status</span>
											<Badge
												variant={
													organizationdetails.status === "approved"
														? "default"
														: organizationdetails.status === "rejected"
															? "destructive"
															: "secondary"
												}
												className="text-xs"
											>
												{organizationdetails.status === "approved" ? (
													<CheckCircle2 className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
												) : organizationdetails.status === "rejected" ? (
													<XCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
												) : (
													<Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
												)}
												<span className="capitalize">{organizationdetails.status}</span>
											</Badge>
										</div>

										{organizationdetails.status === "approved" && (
											<>
												<Separator />
												<div className="space-y-2 sm:space-y-3">
													<div className="flex items-start justify-between gap-2">
														<span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Name</span>
														<span className="text-xs sm:text-sm font-medium text-right break-words">
															{organizationdetails.name}
														</span>
													</div>
													<div className="flex items-center justify-between">
														<span className="text-xs sm:text-sm text-gray-600">Type</span>
														<Badge variant="outline" className="text-xs">
															{organizationdetails.facilityType}
														</Badge>
													</div>
												</div>
												<Button variant="outline" size="sm" className="w-full text-xs sm:text-sm" asChild>
													<Link href={`/organizations/my`}>
														<Building className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
														<span className="hidden sm:inline">View Organization</span>
														<span className="sm:hidden">View Org</span>
													</Link>
												</Button>
											</>
										)}
									</div>
								) : (
									<div className="text-center space-y-2 sm:space-y-3">
										<div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
											<Building className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mx-auto mb-2" />
											<p className="text-xs sm:text-sm text-gray-600">Register your healthcare organization</p>
										</div>
										<OrganizationApplicationDialog
											user={user}
											setUser={setUser}
											setOrganizationDetails={setOrganizationDetails}
										/>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Mobile-Optimized Professional Card */}
						<Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
							<CardHeader className="pb-2 sm:pb-4">
								<CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
									<Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
									<span>Professional</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								{user.isProfessional ? (
									<div className="space-y-3 sm:space-y-4">
										<div className="flex items-center space-x-2">
											<Badge className="bg-emerald-100 text-emerald-700 text-xs">
												<ShieldCheck className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
												<span className="hidden sm:inline">Verified Professional</span>
												<span className="sm:hidden">Verified</span>
											</Badge>
										</div>
										<div className="p-2 sm:p-3 bg-emerald-50 rounded-lg">
											<div className="flex items-start justify-between gap-2">
												<span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Profession</span>
												<span className="text-xs sm:text-sm font-medium capitalize text-right break-words">
													{user.professionalApplication?.professionType}
												</span>
											</div>
										</div>
										<Button variant="outline" size="sm" className="w-full text-xs sm:text-sm" asChild>
											<Link href="/professional/my">
												<FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
												<span className="hidden sm:inline">View Professional Profile</span>
												<span className="sm:hidden">View Profile</span>
											</Link>
										</Button>
									</div>
								) : user.professionalApplication ? (
									<div className="space-y-3 sm:space-y-4">
										<Badge
											variant={
												user.professionalApplication.status === "pending"
													? "secondary"
													: user.professionalApplication.status === "approved"
														? "default"
														: "destructive"
											}
											className="text-xs"
										>
											{user.professionalApplication.status === "pending" ? (
												<Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
											) : user.professionalApplication.status === "approved" ? (
												<CheckCircle2 className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
											) : (
												<XCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
											)}
											Application {user.professionalApplication.status}
										</Badge>
										<div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
											<div className="flex items-start justify-between gap-2">
												<span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Applied as</span>
												<span className="text-xs sm:text-sm font-medium capitalize text-right break-words">
													{user.professionalApplication.professionType}
												</span>
											</div>
										</div>
									</div>
								) : (
									<div className="text-center space-y-2 sm:space-y-3">
										<div className="p-3 sm:p-4 bg-emerald-50 rounded-lg">
											<Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500 mx-auto mb-2" />
											<p className="text-xs sm:text-sm text-gray-600">Register as a healthcare professional</p>
										</div>
										<ProfessionalApplicationDialog user={user} setUser={setUser} />
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Enhanced Mobile-First Main Content */}
					<div className="lg:col-span-3">
						<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
							<CardHeader className="border-b bg-gradient-to-r from-blue-50 to-emerald-50 p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
									<div>
										<CardTitle className="text-xl sm:text-2xl text-gray-900">Health Dashboard</CardTitle>
										<p className="text-gray-600 mt-1 text-sm sm:text-base">
											Comprehensive overview of your health information
										</p>
									</div>
									<EditUserDialog user={user} setUser={setUser} className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700" />
								</div>
							</CardHeader>

							<CardContent className="p-3 sm:p-6">
								<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
									<TabsList className="grid w-full grid-cols-4 bg-gray-100 h-auto p-1">
										<TabsTrigger
											value="overview"
											className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-1.5 text-xs sm:text-sm"
										>
											<BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
											<span className="hidden sm:inline">Overview</span>
											<span className="sm:hidden text-xs">Over</span>
										</TabsTrigger>
										<TabsTrigger
											value="health"
											className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-1.5 text-xs sm:text-sm"
										>
											<Heart className="h-3 w-3 sm:h-4 sm:w-4" />
											<span className="hidden sm:inline">Health</span>
											<span className="sm:hidden text-xs">Health</span>
										</TabsTrigger>
										<TabsTrigger
											value="lifestyle"
											className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-1.5 text-xs sm:text-sm"
										>
											<Activity className="h-3 w-3 sm:h-4 sm:w-4" />
											<span className="hidden sm:inline">Lifestyle</span>
											<span className="sm:hidden text-xs">Life</span>
										</TabsTrigger>
										<TabsTrigger
											value="records"
											className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-1.5 text-xs sm:text-sm"
										>
											<FileText className="h-3 w-3 sm:h-4 sm:w-4" />
											<span className="hidden sm:inline">Records</span>
											<span className="sm:hidden text-xs">Rec</span>
										</TabsTrigger>
									</TabsList>

									{/* Overview Tab */}
									<TabsContent value="overview" className="space-y-6">
										{/* Mobile-Responsive Vital Stats Grid */}
										{user.vitalStats && (
											<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
												{user.vitalStats.bloodType && (
													<StatsCard
														icon={Droplet}
														label="Blood Type"
														value={user.vitalStats.bloodType}
														color="text-red-700"
														gradient="bg-gradient-to-br from-red-50 to-red-100"
													/>
												)}
												{user.vitalStats.height && (
													<StatsCard
														icon={Ruler}
														label="Height"
														value={user.vitalStats.height}
														unit="cm"
														color="text-blue-700"
														gradient="bg-gradient-to-br from-blue-50 to-blue-100"
													/>
												)}
												{user.vitalStats.weight && (
													<StatsCard
														icon={Weight}
														label="Weight"
														value={user.vitalStats.weight}
														unit="kg"
														color="text-green-700"
														gradient="bg-gradient-to-br from-green-50 to-green-100"
													/>
												)}
												{user.vitalStats.bmi && (
													<StatsCard
														icon={TrendingUp}
														label="BMI"
														value={user.vitalStats.bmi}
														color="text-purple-700"
														gradient="bg-gradient-to-br from-purple-50 to-purple-100"
														trend="Normal range"
													/>
												)}
											</div>
										)}

										{/* Mobile-Responsive Quick Actions */}
										<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
											<Card className="p-3 sm:p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-blue-100">
												<div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0 text-center sm:text-left">
													<div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
														<Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
													</div>
													<div className="min-w-0">
														<p className="font-medium text-blue-900 text-xs sm:text-sm truncate">Book Appointment</p>
														<p className="text-xs text-blue-600 truncate">Schedule checkup</p>
													</div>
												</div>
											</Card>

											<Card className="p-3 sm:p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
												<div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0 text-center sm:text-left">
													<div className="p-2 bg-emerald-600 rounded-lg flex-shrink-0">
														<Pill className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
													</div>
													<div className="min-w-0">
														<p className="font-medium text-emerald-900 text-xs sm:text-sm truncate">Medications</p>
														<p className="text-xs text-emerald-600 truncate">Manage prescriptions</p>
													</div>
												</div>
											</Card>

											<Card className="p-3 sm:p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-purple-100">
												<div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0 text-center sm:text-left">
													<div className="p-2 bg-purple-600 rounded-lg flex-shrink-0">
														<FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
													</div>
													<div className="min-w-0">
														<p className="font-medium text-purple-900 text-xs sm:text-sm truncate">Lab Results</p>
														<p className="text-xs text-purple-600 truncate">View reports</p>
													</div>
												</div>
											</Card>

											<Card className="p-3 sm:p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-orange-50 to-orange-100">
												<div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0 text-center sm:text-left">
													<div className="p-2 bg-orange-600 rounded-lg flex-shrink-0">
														<PhoneCall className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
													</div>
													<div className="min-w-0">
														<p className="font-medium text-orange-900 text-xs sm:text-sm truncate">Emergency</p>
														<p className="text-xs text-orange-600 truncate">Quick contact</p>
													</div>
												</div>
											</Card>
										</div>

										{/* Recent Activity */}
										{/* TODO make it dinamic */}
										<Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100">
											<CardHeader>
												<CardTitle className="flex items-center space-x-2">
													<Activity className="h-5 w-5 text-blue-600" />
													<span>Recent Activity</span>
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="space-y-3">
													<div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
														<div className="p-2 bg-blue-100 rounded-full">
															<Calendar className="h-4 w-4 text-blue-600" />
														</div>
														<div className="flex-1">
															<p className="font-medium text-gray-900">Last checkup completed</p>
															<p className="text-sm text-gray-500">2 weeks ago</p>
														</div>
													</div>
													<div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
														<div className="p-2 bg-green-100 rounded-full">
															<Pill className="h-4 w-4 text-green-600" />
														</div>
														<div className="flex-1">
															<p className="font-medium text-gray-900">Medication reminder set</p>
															<p className="text-sm text-gray-500">3 days ago</p>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									</TabsContent>

									{/* Health Tab */}
									<TabsContent value="health" className="space-y-6">
										{user.vitalStats?.healthIssues?.length > 0 ? (
											<div className="space-y-6">
												<div className="flex items-center justify-between">
													<h3 className="text-xl font-semibold text-gray-900">Health Conditions</h3>
													<Badge variant="outline">{user.vitalStats.healthIssues.length} conditions</Badge>
												</div>
												<div className="grid gap-6">
													{user.vitalStats.healthIssues.map((issue, index) => (
														<HealthIssueCard key={index} issue={issue} index={index} />
													))}
												</div>
											</div>
										) : (
											<Card className="p-8 text-center border-0 bg-gradient-to-br from-green-50 to-emerald-50">
												<Heart className="h-12 w-12 text-green-500 mx-auto mb-4" />
												<h3 className="text-lg font-semibold text-gray-900 mb-2">Great Health!</h3>
												<p className="text-gray-600">No health conditions recorded. Keep up the good work!</p>
											</Card>
										)}

										{/* Emergency Contact */}
										{user.vitalStats?.emergencyContact && (
											<Card className="border-0 bg-gradient-to-r from-red-50 to-pink-50">
												<CardHeader>
													<CardTitle className="flex items-center space-x-2 text-red-700">
														<PhoneCall className="h-5 w-5" />
														<span>Emergency Contact</span>
													</CardTitle>
												</CardHeader>
												<CardContent className="space-y-3">
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div className="flex items-center space-x-3">
															<UserCircle className="h-5 w-5 text-red-600" />
															<div>
																<p className="font-medium">{user.vitalStats.emergencyContact.name}</p>
																<p className="text-sm text-gray-600">{user.vitalStats.emergencyContact.relation}</p>
															</div>
														</div>
														<div className="flex items-center space-x-3">
															<Phone className="h-5 w-5 text-red-600" />
															<p className="font-medium">{user.vitalStats.emergencyContact.phone}</p>
														</div>
													</div>
												</CardContent>
											</Card>
										)}
									</TabsContent>

									{/* Lifestyle Tab */}
									<TabsContent value="lifestyle" className="space-y-6">
										{user.vitalStats?.lifestyle ? (
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<LifestyleCard
													icon={Activity}
													title="Exercise"
													data={user.vitalStats.lifestyle.exercise}
													color="text-blue-700"
													bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
												/>
												<LifestyleCard
													icon={Utensils}
													title="Diet & Nutrition"
													data={user.vitalStats.lifestyle.diet}
													color="text-green-700"
													bgColor="bg-gradient-to-br from-green-50 to-green-100"
												/>
												<LifestyleCard
													icon={Moon}
													title="Sleep Pattern"
													data={user.vitalStats.lifestyle.sleepPattern}
													color="text-purple-700"
													bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
												/>
												<LifestyleCard
													icon={Heart}
													title="Stress Level"
													data={{ level: user.vitalStats.lifestyle.stressLevel }}
													color="text-pink-700"
													bgColor="bg-gradient-to-br from-pink-50 to-pink-100"
												/>
											</div>
										) : (
											<Card className="p-8 text-center border-0 bg-gradient-to-br from-blue-50 to-emerald-50">
												<Activity className="h-12 w-12 text-blue-500 mx-auto mb-4" />
												<h3 className="text-lg font-semibold text-gray-900 mb-2">Track Your Lifestyle</h3>
												<p className="text-gray-600 mb-4">
													Add information about your exercise, diet, sleep, and stress levels.
												</p>
												<Button className="bg-gradient-to-r from-blue-600 to-emerald-600">
													<Plus className="h-4 w-4 mr-2" />
													Add Lifestyle Data
												</Button>
											</Card>
										)}

										{/* Interests */}
										{user.vitalStats?.interests?.length > 0 && (
											<Card className="border-0 bg-gradient-to-r from-yellow-50 to-orange-50">
												<CardHeader>
													<CardTitle className="flex items-center space-x-2 text-orange-700">
														<Sparkles className="h-5 w-5" />
														<span>Interests & Hobbies</span>
													</CardTitle>
												</CardHeader>
												<CardContent>
													<div className="flex flex-wrap gap-2">
														{user.vitalStats.interests.map((interest, index) => (
															<Badge
																key={index}
																variant="outline"
																className="bg-white/50 hover:bg-white/80 transition-colors"
															>
																{interest}
															</Badge>
														))}
													</div>
												</CardContent>
											</Card>
										)}
									</TabsContent>

									{/* Records Tab */}
									<TabsContent value="records" className="space-y-6">
										{user.vitalStats?.checkups?.length > 0 ? (
											<div className="space-y-6">
												<div className="flex items-center justify-between">
													<h3 className="text-xl font-semibold text-gray-900">Medical Checkups</h3>
													<Badge variant="outline">{user.vitalStats.checkups.length} records</Badge>
												</div>
												<div className="grid gap-6">
													{user.vitalStats.checkups.map((checkup, index) => (
														<Card
															key={index}
															className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-50 to-indigo-50"
														>
															<CardContent className="p-6">
																<div className="flex items-start justify-between mb-4">
																	<div className="flex items-center space-x-3">
																		<div className="p-3 bg-blue-600 rounded-lg">
																			<Stethoscope className="h-6 w-6 text-white" />
																		</div>
																		<div>
																			<h4 className="text-lg font-semibold text-gray-900">
																				{checkup.type || "General Checkup"}
																			</h4>
																			<p className="text-sm text-gray-600">
																				{checkup.date
																					? new Date(checkup.date).toLocaleDateString()
																					: "Date not specified"}
																			</p>
																		</div>
																	</div>
																	<Badge variant="outline" className="bg-white/50">
																		Completed
																	</Badge>
																</div>

																<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																	{checkup.doctor && (
																		<div className="flex items-center space-x-2">
																			<UserCircle className="h-4 w-4 text-blue-600" />
																			<span className="text-sm">
																				<span className="font-medium">Doctor:</span> {checkup.doctor}
																			</span>
																		</div>
																	)}
																	{checkup.nextAppointment && (
																		<div className="flex items-center space-x-2">
																			<Calendar className="h-4 w-4 text-green-600" />
																			<span className="text-sm">
																				<span className="font-medium">Next:</span>{" "}
																				{new Date(checkup.nextAppointment).toLocaleDateString()}
																			</span>
																		</div>
																	)}
																</div>

																{checkup.notes && (
																	<div className="mt-4 p-3 bg-white/50 rounded-lg">
																		<p className="text-sm text-gray-700">{checkup.notes}</p>
																	</div>
																)}
															</CardContent>
														</Card>
													))}
												</div>
											</div>
										) : (
											<Card className="p-8 text-center border-0 bg-gradient-to-br from-purple-50 to-indigo-50">
												<FileText className="h-12 w-12 text-purple-500 mx-auto mb-4" />
												<h3 className="text-lg font-semibold text-gray-900 mb-2">No Medical Records</h3>
												<p className="text-gray-600 mb-4">Start tracking your medical checkups and appointments.</p>
												<Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
													<Plus className="h-4 w-4 mr-2" />
													Add Medical Record
												</Button>
											</Card>
										)}
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}

// Professional Application Dialog (keeping original functionality)
const ProfessionalApplicationDialog = ({ user, setUser }) => {
	const [professionalApplication, setProfessionalApplication] = useState({
		professionType: "",
		contactDetails: { phone: "" },
		verificationDocuments: [],
	})
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const data = new FormData()
			data.append("professionType", professionalApplication.professionType)
			data.append("phone", professionalApplication.contactDetails.phone)
			data.append("email", user.email)
			data.append("userId", user._id)
			professionalApplication.verificationDocuments.forEach((file) => data.append("verificationDocuments", file))

			const response = await axios.post("/api/professional/apply", data)
			if (response.status === 200) {
				const userResponse = await axios.get("/api/user")
				setUser(userResponse.data)
				toast.success("Professional application submitted successfully!")
			}
		} catch (error) {
			console.error("Error submitting application:", error)
			toast.error("Failed to submit application")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog>
			<DialogTrigger className={cn(buttonVariants({ variant: "default" }), "w-full")}>
				<Stethoscope className="h-4 w-4 mr-2" />
				Become Professional
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2">
						<Stethoscope className="h-5 w-5 text-emerald-600" />
						<span>Professional Application</span>
					</DialogTitle>
					<DialogDescription>Apply to become a verified healthcare professional on our platform.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-2 block">Profession Type *</label>
							<Select
								value={professionalApplication.professionType}
								onValueChange={(value) => setProfessionalApplication((prev) => ({ ...prev, professionType: value }))}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Select your profession" />
								</SelectTrigger>
								<SelectContent className="max-h-[300px]">
									<SelectItem value="doctor">Doctor</SelectItem>
									<SelectItem value="nurse">Nurse</SelectItem>
									<SelectItem value="pharmacist">Pharmacist</SelectItem>
									<SelectItem value="therapist">Therapist</SelectItem>
									<SelectItem value="dentist">Dentist</SelectItem>
									<SelectItem value="physiotherapist">Physiotherapist</SelectItem>
									<SelectItem value="psychiatrist">Psychiatrist</SelectItem>
									<SelectItem value="nutritionist">Nutritionist</SelectItem>
									<SelectItem value="optometrist">Optometrist</SelectItem>
									<SelectItem value="paramedic">Paramedic</SelectItem>
									<SelectItem value="radiologist">Radiologist</SelectItem>
									<SelectItem value="surgeon">Surgeon</SelectItem>
									<SelectItem value="midwife">Midwife</SelectItem>
									<SelectItem value="lab_technician">Lab Technician</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">Phone Number *</label>
							<Input
								type="tel"
								placeholder="Enter your phone number"
								value={professionalApplication.contactDetails.phone}
								onChange={(e) =>
									setProfessionalApplication((prev) => ({
										...prev,
										contactDetails: { ...prev.contactDetails, phone: e.target.value },
									}))
								}
								required
							/>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">Verification Documents *</label>
							<Input
								type="file"
								multiple
								accept="application/pdf, image/*"
								onChange={(e) =>
									setProfessionalApplication((prev) => ({
										...prev,
										verificationDocuments: Array.from(e.target.files),
									}))
								}
								className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
								required
							/>
							<p className="text-xs text-gray-500 mt-1">Upload your professional license and certifications</p>
						</div>
					</div>

					<DialogFooter>
						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Submitting...
								</>
							) : (
								<>
									<Send className="h-4 w-4 mr-2" />
									Submit Application
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

// Organization Application Dialog (keeping original functionality)
const OrganizationApplicationDialog = ({ user, setUser, setOrganizationDetails }) => {
	const [organizationApplication, setOrganizationApplication] = useState({
		name: "",
		facilityType: "",
		contactDetails: {
			phone: "",
			email: "",
			address: { city: "", state: "", country: "" },
		},
		verificationDocuments: [],
	})
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const formData = new FormData()
			formData.append("name", organizationApplication.name)
			formData.append("facilityType", organizationApplication.facilityType)
			formData.append("userId", user._id)
			formData.append("phone", organizationApplication.contactDetails.phone)
			formData.append("email", organizationApplication.contactDetails.email)
			formData.append("city", organizationApplication.contactDetails.address.city)
			formData.append("state", organizationApplication.contactDetails.address.state)
			formData.append("country", organizationApplication.contactDetails.address.country)

			organizationApplication.verificationDocuments.forEach((file) => {
				formData.append("verificationDocuments", file)
			})

			const response = await axios.post("/api/organization/apply", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})

			if (response.status === 200) {
				toast.success("Organization application submitted successfully!")
				setOrganizationDetails({
					status: "pending",
					name: organizationApplication.name,
					facilityType: organizationApplication.facilityType,
				})
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Error submitting application")
			console.error("Error:", error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog>
			<DialogTrigger className={cn(buttonVariants({ variant: "default" }), "w-full")}>
				<Building className="h-4 w-4 mr-2" />
				Register Organization
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2">
						<Building className="h-5 w-5 text-blue-600" />
						<span>Organization Registration</span>
					</DialogTitle>
					<DialogDescription>
						Register your healthcare organization to manage it through our platform.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="text-sm font-medium mb-2 block">Organization Name *</label>
							<Input
								placeholder="Enter organization name"
								value={organizationApplication.name}
								onChange={(e) => setOrganizationApplication((prev) => ({ ...prev, name: e.target.value }))}
								required
							/>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">Facility Type *</label>
							<Select
								value={organizationApplication.facilityType}
								onValueChange={(value) => setOrganizationApplication((prev) => ({ ...prev, facilityType: value }))}
								required
							>
								<SelectTrigger>
									<SelectValue placeholder="Select facility type" />
								</SelectTrigger>
								<SelectContent className="max-h-[300px]">
									<SelectItem value="clinic">Clinic</SelectItem>
									<SelectItem value="hospital">Hospital</SelectItem>
									<SelectItem value="diagnostic">Diagnostic Center</SelectItem>
									<SelectItem value="pharmacy">Pharmacy</SelectItem>
									<SelectItem value="urgent_care">Urgent Care</SelectItem>
									<SelectItem value="rehabilitation">Rehabilitation Center</SelectItem>
									<SelectItem value="therapy">Therapy Center</SelectItem>
									<SelectItem value="surgery_center">Surgery Center</SelectItem>
									<SelectItem value="specialty_center">Specialty Center</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">Phone Number *</label>
							<Input
								type="tel"
								placeholder="Enter phone number"
								value={organizationApplication.contactDetails.phone}
								onChange={(e) =>
									setOrganizationApplication((prev) => ({
										...prev,
										contactDetails: { ...prev.contactDetails, phone: e.target.value },
									}))
								}
								required
							/>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">Email Address *</label>
							<Input
								type="email"
								placeholder="Enter email address"
								value={organizationApplication.contactDetails.email}
								onChange={(e) =>
									setOrganizationApplication((prev) => ({
										...prev,
										contactDetails: { ...prev.contactDetails, email: e.target.value },
									}))
								}
								required
							/>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">City *</label>
							<Input
								placeholder="Enter city"
								value={organizationApplication.contactDetails.address.city}
								onChange={(e) =>
									setOrganizationApplication((prev) => ({
										...prev,
										contactDetails: {
											...prev.contactDetails,
											address: { ...prev.contactDetails.address, city: e.target.value },
										},
									}))
								}
								required
							/>
						</div>

						<div>
							<label className="text-sm font-medium mb-2 block">State/Province *</label>
							<Input
								placeholder="Enter state/province"
								value={organizationApplication.contactDetails.address.state}
								onChange={(e) =>
									setOrganizationApplication((prev) => ({
										...prev,
										contactDetails: {
											...prev.contactDetails,
											address: { ...prev.contactDetails.address, state: e.target.value },
										},
									}))
								}
								required
							/>
						</div>
					</div>

					<div>
						<label className="text-sm font-medium mb-2 block">Country *</label>
						<Input
							placeholder="Enter country"
							value={organizationApplication.contactDetails.address.country}
							onChange={(e) =>
								setOrganizationApplication((prev) => ({
									...prev,
									contactDetails: {
										...prev.contactDetails,
										address: { ...prev.contactDetails.address, country: e.target.value },
									},
								}))
							}
							required
						/>
					</div>

					<div>
						<label className="text-sm font-medium mb-2 block">Verification Documents *</label>
						<Input
							type="file"
							multiple
							accept="application/pdf, image/*"
							onChange={(e) =>
								setOrganizationApplication((prev) => ({
									...prev,
									verificationDocuments: Array.from(e.target.files),
								}))
							}
							className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
							required
						/>
						<p className="text-xs text-gray-500 mt-1">Upload business license and registration documents</p>
					</div>

					<DialogFooter>
						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Submitting...
								</>
							) : (
								<>
									<Send className="h-4 w-4 mr-2" />
									Submit Application
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
