"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import {
	Edit2,
	User,
	Heart,
	Activity,
	AlertCircle,
	Phone,
	Plus,
	Trash2,
	ChevronLeft,
	ChevronRight,
	Save,
	X,
	Stethoscope,
	Droplet,
	Ruler,
	Weight,
	Calendar,
	Moon,
	Utensils,
	Shield,
	Sparkles,
	TrendingUp,
	ChevronDown,
	ChevronUp,
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Mobile-optimized Loading Component
const LoadingSpinner = () => (
	<div className="flex items-center justify-center p-2">
		<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
	</div>
)

// Mobile-optimized Form Section Component
const FormSection = ({ title, description, icon: Icon, children, className = "" }) => (
	<Card className={cn("border shadow-sm bg-white", className)}>
		<CardHeader className="pb-3 px-4 pt-4">
			<div className="flex items-start space-x-3">
				{Icon && (
					<div className="p-1.5 rounded-lg bg-primary/10 flex-shrink-0">
						<Icon className="h-4 w-4 text-primary" />
					</div>
				)}
				<div className="min-w-0 flex-1">
					<CardTitle className="text-base font-semibold leading-tight">{title}</CardTitle>
					{description && (
						<CardDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
							{description}
						</CardDescription>
					)}
				</div>
			</div>
		</CardHeader>
		<CardContent className="space-y-4 px-4 pb-4">{children}</CardContent>
	</Card>
)

// Mobile-optimized Input Field Component
const FormField = ({ label, description, required = false, children, className = "" }) => (
	<div className={cn("space-y-1.5", className)}>
		<div className="flex items-center justify-between">
			<label className="text-sm font-medium text-gray-900 leading-tight">
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</label>
			{description && <span className="text-xs text-muted-foreground">{description}</span>}
		</div>
		{children}
	</div>
)

// Mobile-optimized Health Issue Card
const HealthIssueCard = ({ issue, index, onUpdate, onDelete }) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const severityColors = {
		Mild: "bg-green-50 border-green-200 text-green-800",
		Moderate: "bg-yellow-50 border-yellow-200 text-yellow-800",
		Severe: "bg-red-50 border-red-200 text-red-800",
	}

	const statusColors = {
		Active: "bg-blue-50 border-blue-200 text-blue-800",
		"Under Treatment": "bg-purple-50 border-purple-200 text-purple-800",
		Resolved: "bg-gray-50 border-gray-200 text-gray-800",
	}

	return (
		<Card className="border-l-4 border-l-primary/30">
			<CardContent className="p-3">
				<div className="flex items-start justify-between mb-2">
					<div className="flex-1 min-w-0">
						<h4 className="font-medium text-gray-900 mb-1 text-sm leading-tight truncate">{issue.condition}</h4>
						<p className="text-xs text-muted-foreground">{new Date(issue.diagnosedDate).toLocaleDateString()}</p>
					</div>
					<div className="flex items-center space-x-1 ml-2">
						<Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 p-0">
							{isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onDelete(index)}
							className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
						>
							<Trash2 className="h-3 w-3" />
						</Button>
					</div>
				</div>

				<div className="flex flex-wrap gap-1.5 mb-2">
					<Badge className={cn("text-xs px-2 py-0.5", severityColors[issue.severity])}>{issue.severity}</Badge>
					<Badge className={cn("text-xs px-2 py-0.5", statusColors[issue.status])}>{issue.status}</Badge>
				</div>

				{isExpanded && (
					<div className="mt-3 pt-3 border-t space-y-3">
						<div className="space-y-3">
							<FormField label="Condition">
								<Input
									value={issue.condition}
									onChange={(e) => onUpdate(index, { ...issue, condition: e.target.value })}
									placeholder="Enter condition name"
									className="text-sm"
								/>
							</FormField>
							<FormField label="Diagnosed Date">
								<Input
									type="date"
									value={issue.diagnosedDate}
									onChange={(e) => onUpdate(index, { ...issue, diagnosedDate: e.target.value })}
									className="text-sm"
								/>
							</FormField>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<FormField label="Severity">
								<Select
									value={issue.severity}
									onValueChange={(value) => onUpdate(index, { ...issue, severity: value })}
								>
									<SelectTrigger className="text-sm">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Mild">Mild</SelectItem>
										<SelectItem value="Moderate">Moderate</SelectItem>
										<SelectItem value="Severe">Severe</SelectItem>
									</SelectContent>
								</Select>
							</FormField>
							<FormField label="Status">
								<Select value={issue.status} onValueChange={(value) => onUpdate(index, { ...issue, status: value })}>
									<SelectTrigger className="text-sm">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Active">Active</SelectItem>
										<SelectItem value="Under Treatment">Under Treatment</SelectItem>
										<SelectItem value="Resolved">Resolved</SelectItem>
									</SelectContent>
								</Select>
							</FormField>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

// Mobile-optimized Checkup Card
const CheckupCard = ({ checkup, index, onUpdate, onDelete }) => {
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<Card>
			<CardContent className="p-3">
				<div className="flex items-start justify-between mb-2">
					<div className="flex items-center space-x-2 flex-1 min-w-0">
						<div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
							<Stethoscope className="h-3 w-3 text-blue-600" />
						</div>
						<div className="min-w-0 flex-1">
							<h4 className="font-medium text-gray-900 text-sm leading-tight truncate">
								{checkup.type || "General Checkup"}
							</h4>
							<p className="text-xs text-muted-foreground">
								{checkup.date ? new Date(checkup.date).toLocaleDateString() : "No date"}
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-1 ml-2">
						<Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 p-0">
							{isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
						</Button>
						<Button variant="ghost" size="sm" onClick={() => onDelete(index)} className="h-8 w-8 p-0 text-red-600">
							<Trash2 className="h-3 w-3" />
						</Button>
					</div>
				</div>

				{isExpanded && (
					<div className="mt-3 pt-3 border-t space-y-3">
						<div className="grid grid-cols-2 gap-3">
							<FormField label="Date">
								<Input
									type="date"
									value={checkup.date?.split("T")[0]}
									onChange={(e) => onUpdate(index, { ...checkup, date: e.target.value })}
									className="text-sm"
								/>
							</FormField>
							<FormField label="Type">
								<Select value={checkup.type} onValueChange={(value) => onUpdate(index, { ...checkup, type: value })}>
									<SelectTrigger className="text-sm">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										{["General", "Dental", "Eye", "Specialist", "Physical", "Cardiology", "Dermatology"].map((type) => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormField>
						</div>
						<FormField label="Doctor">
							<Input
								value={checkup.doctor}
								onChange={(e) => onUpdate(index, { ...checkup, doctor: e.target.value })}
								placeholder="Enter doctor's name"
								className="text-sm"
							/>
						</FormField>
						<FormField label="Notes">
							<Textarea
								value={checkup.notes}
								onChange={(e) => onUpdate(index, { ...checkup, notes: e.target.value })}
								placeholder="Add any notes about this checkup"
								rows={2}
								className="text-sm"
							/>
						</FormField>
						<FormField label="Next Appointment">
							<Input
								type="date"
								value={checkup.nextAppointment?.split("T")[0]}
								onChange={(e) => onUpdate(index, { ...checkup, nextAppointment: e.target.value })}
								className="text-sm"
							/>
						</FormField>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

// Main Enhanced Edit User Dialog - Mobile Optimized
export default function EditUserDialog({ user, setUser }) {
	const [isOpen, setIsOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [activeTab, setActiveTab] = useState("basic")
	const [profileData, setProfileData] = useState({
		name: user.name || "",
		email: user.email || "",
		bio: user.bio || "",
		profilePic: null,
		vitalStats: {
			bloodType: user.vitalStats?.bloodType || "",
			allergies: user.vitalStats?.allergies || [],
			height: user.vitalStats?.height || "",
			weight: user.vitalStats?.weight || "",
			age: user.vitalStats?.age || "",
			bmi: user.vitalStats?.bmi || "",
			checkups: user.vitalStats?.checkups || [],
			healthIssues: user.vitalStats?.healthIssues || [],
			interests: Array.isArray(user.vitalStats?.interests)
				? user.vitalStats.interests
					.map((interest) =>
						typeof interest === "object" && interest.name
							? interest.name
							: typeof interest === "string"
								? interest
								: null,
					)
					.filter(Boolean)
				: [],
			lifestyle: {
				exercise: {
					frequency: user.vitalStats?.lifestyle?.exercise?.frequency || "",
					preferredActivities: user.vitalStats?.lifestyle?.exercise?.preferredActivities || [],
				},
				diet: {
					status: user.vitalStats?.lifestyle?.diet?.status || "",
					restrictions: user.vitalStats?.lifestyle?.diet?.restrictions || [],
					preferredDiet: user.vitalStats?.lifestyle?.diet?.preferredDiet || "",
				},
				sleepPattern: {
					hoursPerDay: user.vitalStats?.lifestyle?.sleepPattern?.hoursPerDay || "",
					quality: user.vitalStats?.lifestyle?.sleepPattern?.quality || "",
				},
				stressLevel: user.vitalStats?.lifestyle?.stressLevel || "",
			},
			emergencyContact: {
				name: user.vitalStats?.emergencyContact?.name || "",
				relation: user.vitalStats?.emergencyContact?.relation || "",
				phone: user.vitalStats?.emergencyContact?.phone || "",
			},
		},
	})

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const formData = new FormData()
			formData.append("name", profileData.name)
			formData.append("email", profileData.email)
			formData.append("bio", profileData.bio)

			if (profileData.profilePic === null) {
				formData.append("profilePic", "null")
			} else if (profileData.profilePic instanceof File) {
				formData.append("profilePic", profileData.profilePic)
			}

			const parseToNumberOrNull = (value) => {
				if (value === "" || value === null || value === undefined) return null
				const num = Number.parseFloat(value)
				return isNaN(num) ? null : num
			}

			const parseToIntOrNull = (value) => {
				if (value === "" || value === null || value === undefined) return null
				const num = Number.parseInt(value, 10)
				return isNaN(num) ? null : num
			}

			const vitalStatsData = {
				bloodType: profileData.vitalStats.bloodType,
				allergies: profileData.vitalStats.allergies,
				height: parseToNumberOrNull(profileData.vitalStats.height),
				weight: parseToNumberOrNull(profileData.vitalStats.weight),
				age: parseToIntOrNull(profileData.vitalStats.age),
				bmi: parseToNumberOrNull(profileData.vitalStats.bmi),
				checkups: profileData.vitalStats.checkups,
				healthIssues: profileData.vitalStats.healthIssues,
				interests: profileData.vitalStats.interests,
				lifestyle: profileData.vitalStats.lifestyle,
				emergencyContact: profileData.vitalStats.emergencyContact,
			}

			formData.append("vitalStats", JSON.stringify(vitalStatsData))

			const response = await axios.put("/api/user", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})

			if (response.status === 200) {
				setUser(response.data)
				setIsOpen(false)
				toast.success("Profile Updated!", {
					description: "Your health profile has been updated successfully.",
				})
			}
		} catch (error) {
			console.error("Error updating profile:", error.response?.data || error.message)
			toast.error("Update Failed", {
				description: error.response?.data?.message || "Please try again later.",
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const tabs = [
		{ id: "basic", label: "Basic", icon: User, color: "text-blue-600" },
		{ id: "vital-stats", label: "Vitals", icon: Heart, color: "text-red-600" },
		{ id: "health-issues", label: "Health", icon: AlertCircle, color: "text-orange-600" },
		{ id: "lifestyle", label: "Lifestyle", icon: Activity, color: "text-green-600" },
		{ id: "interests", label: "Interests", icon: Sparkles, color: "text-purple-600" },
		{ id: "emergency", label: "Emergency", icon: Phone, color: "text-red-600" },
	]

	const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
	const progress = ((currentTabIndex + 1) / tabs.length) * 100

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => setIsOpen(true)}
				className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white hover:text-white"
			>
				<Edit2 className="h-4 w-4 sm:mr-2" />
				<span className="hidden sm:inline">Edit Profile</span>
			</Button>

			<DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[800px] p-0 flex flex-col gap-0  ">
				{/* Mobile-optimized Header */}
				<div className="flex-none p-3 sm:p-4 border-b bg-white/80 backdrop-blur-sm">
					<DialogHeader>
						<div className="flex items-center justify-between">
							<div className="min-w-0 flex-1">
								<DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
									Edit Health Profile
								</DialogTitle>
								<p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
									Update your health information
								</p>
							</div>
							<div className="flex items-center space-x-2 ml-3 mr-8">
								<div className="text-right hidden sm:block">
									<p className="text-xs font-medium">
										{currentTabIndex + 1}/{tabs.length}
									</p>
									<p className="text-xs text-muted-foreground truncate max-w-20">{tabs[currentTabIndex].label}</p>
								</div>
								<div className="w-10 h-10 sm:w-12 sm:h-12 relative flex-shrink-0">
									<svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
										<path
											d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
											fill="none"
											stroke="#e5e7eb"
											strokeWidth="2"
										/>
										<path
											d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
											fill="none"
											stroke="#3b82f6"
											strokeWidth="2"
											strokeDasharray={`${progress}, 100`}
										/>
									</svg>
									<div className="absolute inset-0 flex items-center justify-center">
										<span className="text-xs font-semibold text-blue-600">{Math.round(progress)}%</span>
									</div>
								</div>
							</div>
						</div>
					</DialogHeader>
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
					{/* Mobile-optimized Tab Navigation */}
					<div className="flex-none px-2 sm:px-4 py-2 sm:py-3 bg-white/50">
						<TabsList className="grid w-full grid-cols-6 bg-gray-100/80 p-0.5 sm:p-1 rounded-lg sm:rounded-xl h-10 sm:h-12">
							{tabs.map((tab) => {
								const Icon = tab.icon
								return (
									<TabsTrigger
										key={tab.id}
										value={tab.id}
										className="flex   space-y-0.5 sm:space-y-0 sm:space-x-1.5 px-1 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
									>
										<Icon className={cn("h-3 w-3 sm:w-4", tab.color)} />
										<span className="font-medium leading-tight hidden sm:flex sm:leading-normal truncate max-w-12 sm:max-w-none">
											{tab.label}
										</span>
									</TabsTrigger>
								)
							})}
						</TabsList>
					</div>

					{/* Mobile-optimized Tab Content */}
					<div className="flex-1 overflow-y-auto px-2 sm:px-4 pb-3 sm:pb-4">
						{/* Basic Info Tab */}
						<TabsContent value="basic" className="space-y-4 mt-0">
							<FormSection title="Personal Information" description="Update your basic profile details" icon={User}>
								<div className="space-y-4">
									{/* Profile Picture - Mobile Optimized */}
									<div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
										<div className="flex flex-col items-center space-y-3">
											<Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-2 ring-blue-100">
												<AvatarImage
													src={profileData.profilePic ? URL.createObjectURL(profileData.profilePic) : user.profilePic}
													alt="Profile"
												/>
												<AvatarFallback className="text-lg sm:text-xl bg-gradient-to-br from-blue-100 to-emerald-100">
													{profileData.name
														?.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase() || <User />}
												</AvatarFallback>
											</Avatar>
											<div className="space-y-2 w-full max-w-xs">
												<Input
													type="file"
													accept="image/*"
													onChange={(e) => setProfileData((prev) => ({ ...prev, profilePic: e.target.files[0] }))}
													className="cursor-pointer file:cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-xs"
												/>
												{profileData.profilePic && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => setProfileData((prev) => ({ ...prev, profilePic: null }))}
														className="w-full text-red-600 hover:text-red-700 text-xs h-8"
													>
														<Trash2 className="h-3 w-3 mr-1" />
														Remove
													</Button>
												)}
											</div>
										</div>

										<div className="flex-1 w-full space-y-4">
											<FormField label="Full Name" required>
												<Input
													value={profileData.name}
													onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
													placeholder="Enter your full name"
													className="text-sm sm:text-base"
												/>
											</FormField>

											<FormField label="Bio" description={`${profileData.bio.length}/160`}>
												<Textarea
													value={profileData.bio}
													onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
													placeholder="Write a short bio about yourself"
													maxLength={160}
													rows={3}
													className="text-sm sm:text-base resize-none"
												/>
											</FormField>
										</div>
									</div>
								</div>
							</FormSection>
						</TabsContent>

						{/* Vital Stats Tab - Mobile Optimized */}
						<TabsContent value="vital-stats" className="space-y-4 mt-0">
							<FormSection
								title="Basic Vitals"
								description="Enter your basic health measurements"
								icon={Heart}
								className="from-red-50 to-pink-50"
							>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
									<div className="col-span-2 sm:col-span-1">
										<FormField label="Blood Type">
											<Select
												value={profileData.vitalStats.bloodType}
												onValueChange={(value) =>
													setProfileData((prev) => ({
														...prev,
														vitalStats: { ...prev.vitalStats, bloodType: value },
													}))
												}
											>
												<SelectTrigger className="bg-white text-sm">
													<SelectValue placeholder="Select" />
												</SelectTrigger>
												<SelectContent>
													{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
														<SelectItem key={type} value={type}>
															<div className="flex items-center space-x-2">
																<Droplet className="h-3 w-3 text-red-500" />
																<span>{type}</span>
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormField>
									</div>

									<FormField label="Height (cm)">
										<div className="relative">
											<Input
												type="number"
												value={profileData.vitalStats.height}
												onChange={(e) => {
													const height = Number.parseFloat(e.target.value)
													const weight = Number.parseFloat(profileData.vitalStats.weight)
													const bmi = weight && height ? (weight / ((height / 100) * (height / 100))).toFixed(1) : ""
													setProfileData((prev) => ({
														...prev,
														vitalStats: { ...prev.vitalStats, height: e.target.value, bmi },
													}))
												}}
												placeholder="Height"
												className="pl-8 bg-white text-sm"
											/>
											<Ruler className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
										</div>
									</FormField>

									<FormField label="Weight (kg)">
										<div className="relative">
											<Input
												type="number"
												value={profileData.vitalStats.weight}
												onChange={(e) => {
													const weight = Number.parseFloat(e.target.value)
													const height = Number.parseFloat(profileData.vitalStats.height)
													const bmi = weight && height ? (weight / ((height / 100) * (height / 100))).toFixed(1) : ""
													setProfileData((prev) => ({
														...prev,
														vitalStats: { ...prev.vitalStats, weight: e.target.value, bmi },
													}))
												}}
												placeholder="Weight"
												className="pl-8 bg-white text-sm"
											/>
											<Weight className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
										</div>
									</FormField>

									<FormField label="Age">
										<div className="relative">
											<Input
												type="number"
												min="0"
												max="120"
												value={profileData.vitalStats.age}
												onChange={(e) =>
													setProfileData((prev) => ({
														...prev,
														vitalStats: { ...prev.vitalStats, age: e.target.value },
													}))
												}
												placeholder="Age"
												className="pl-8 bg-white text-sm"
											/>
											<Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
										</div>
									</FormField>
								</div>

								{profileData.vitalStats.bmi && (
									<div className="mt-4 p-3 bg-white rounded-lg border">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<div className="p-1.5 bg-blue-100 rounded-lg">
													<TrendingUp className="h-4 w-4 text-blue-600" />
												</div>
												<div>
													<p className="font-medium text-sm">BMI</p>
													<p className="text-xs text-muted-foreground">Auto-calculated</p>
												</div>
											</div>
											<Badge
												className={cn("text-sm px-3 py-1", {
													"bg-blue-100 text-blue-800": Number.parseFloat(profileData.vitalStats.bmi) < 18.5,
													"bg-green-100 text-green-800":
														Number.parseFloat(profileData.vitalStats.bmi) >= 18.5 &&
														Number.parseFloat(profileData.vitalStats.bmi) < 25,
													"bg-yellow-100 text-yellow-800":
														Number.parseFloat(profileData.vitalStats.bmi) >= 25 &&
														Number.parseFloat(profileData.vitalStats.bmi) < 30,
													"bg-red-100 text-red-800": Number.parseFloat(profileData.vitalStats.bmi) >= 30,
												})}
											>
												{profileData.vitalStats.bmi}
											</Badge>
										</div>
									</div>
								)}
							</FormSection>

							{/* Allergies Section - Mobile Optimized */}
							<FormSection
								title="Allergies & Sensitivities"
								description="List any allergies or sensitivities"
								icon={Shield}
								className="from-orange-50 to-red-50"
							>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<p className="text-sm font-medium">Current Allergies</p>
										<Badge variant="outline" className="text-xs">
											{profileData.vitalStats.allergies.length}
										</Badge>
									</div>

									{profileData.vitalStats.allergies.length > 0 ? (
										<div className="flex flex-wrap gap-1.5">
											{profileData.vitalStats.allergies.map((allergy, index) => (
												<Badge
													key={index}
													variant="secondary"
													className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 text-xs"
												>
													{allergy}
													<Button
														variant="ghost"
														size="sm"
														className="h-3 w-3 p-0 ml-1.5 hover:bg-transparent"
														onClick={() => {
															const newAllergies = profileData.vitalStats.allergies.filter((_, i) => i !== index)
															setProfileData((prev) => ({
																...prev,
																vitalStats: { ...prev.vitalStats, allergies: newAllergies },
															}))
														}}
													>
														<X className="h-2 w-2" />
													</Button>
												</Badge>
											))}
										</div>
									) : (
										<div className="text-center py-4 text-muted-foreground">
											<Shield className="h-6 w-6 mx-auto mb-1 opacity-50" />
											<p className="text-xs">No allergies listed</p>
										</div>
									)}

									<div className="relative">
										<Input
											placeholder="Type allergy and press Enter"
											className="pr-16 bg-white text-sm"
											onKeyPress={(e) => {
												if (e.key === "Enter" && e.target.value.trim()) {
													const newAllergy = e.target.value.trim()
													if (!profileData.vitalStats.allergies.includes(newAllergy)) {
														setProfileData((prev) => ({
															...prev,
															vitalStats: {
																...prev.vitalStats,
																allergies: [...prev.vitalStats.allergies, newAllergy],
															},
														}))
														e.target.value = ""
													}
												}
											}}
										/>
										<kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-xs">
											Enter
										</kbd>
									</div>

									<div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
										{[
											{ name: "Peanuts", icon: "🥜" },
											{ name: "Dairy", icon: "🥛" },
											{ name: "Eggs", icon: "🥚" },
											{ name: "Shellfish", icon: "🦐" },
											{ name: "Gluten", icon: "🌾" },
											{ name: "Soy", icon: "🫘" },
											{ name: "Tree Nuts", icon: "🥥" },
											{ name: "Fish", icon: "🐟" },
										].map((allergy) => (
											<Button
												key={allergy.name}
												variant="outline"
												size="sm"
												onClick={() => {
													if (!profileData.vitalStats.allergies.includes(allergy.name)) {
														setProfileData((prev) => ({
															...prev,
															vitalStats: {
																...prev.vitalStats,
																allergies: [...prev.vitalStats.allergies, allergy.name],
															},
														}))
													}
												}}
												className="justify-start bg-white hover:bg-gray-50 text-xs h-8 px-2"
												disabled={profileData.vitalStats.allergies.includes(allergy.name)}
											>
												<span className="mr-1 text-xs">{allergy.icon}</span>
												<span className="truncate">{allergy.name}</span>
											</Button>
										))}
									</div>
								</div>
							</FormSection>

							{/* Medical Checkups Section - Mobile Optimized */}
							<FormSection
								title="Medical Checkups"
								description="Track your checkup history"
								icon={Stethoscope}
								className="from-blue-50 to-indigo-50"
							>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<p className="text-sm font-medium">Checkup History</p>
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												setProfileData((prev) => ({
													...prev,
													vitalStats: {
														...prev.vitalStats,
														checkups: [
															...prev.vitalStats.checkups,
															{
																date: new Date().toISOString().split("T")[0],
																type: "General",
																doctor: "",
																notes: "",
																nextAppointment: "",
															},
														],
													},
												}))
											}}
											className="bg-white hover:bg-blue-50 text-xs h-8 px-2"
										>
											<Plus className="h-3 w-3 mr-1" />
											Add
										</Button>
									</div>

									{profileData.vitalStats.checkups.length > 0 ? (
										<div className="space-y-3">
											{profileData.vitalStats.checkups.map((checkup, index) => (
												<CheckupCard
													key={index}
													checkup={checkup}
													index={index}
													onUpdate={(index, updatedCheckup) => {
														const newCheckups = [...profileData.vitalStats.checkups]
														newCheckups[index] = updatedCheckup
														setProfileData((prev) => ({
															...prev,
															vitalStats: { ...prev.vitalStats, checkups: newCheckups },
														}))
													}}
													onDelete={(index) => {
														const newCheckups = profileData.vitalStats.checkups.filter((_, i) => i !== index)
														setProfileData((prev) => ({
															...prev,
															vitalStats: { ...prev.vitalStats, checkups: newCheckups },
														}))
													}}
												/>
											))}
										</div>
									) : (
										<div className="text-center py-6 text-muted-foreground">
											<Stethoscope className="h-6 w-6 mx-auto mb-1 opacity-50" />
											<p className="text-xs">No checkups recorded</p>
										</div>
									)}
								</div>
							</FormSection>
						</TabsContent>

						{/* Health Issues Tab - Mobile Optimized */}
						<TabsContent value="health-issues" className="space-y-4 mt-0">
							<FormSection
								title="Health Conditions"
								description="Track your health conditions"
								icon={AlertCircle}
								className="from-orange-50 to-yellow-50"
							>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<p className="text-sm font-medium">Current Conditions</p>
										<div className="flex items-center space-x-2">
											<Badge variant="outline" className="text-xs">
												{profileData.vitalStats.healthIssues.length}
											</Badge>
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setProfileData((prev) => ({
														...prev,
														vitalStats: {
															...prev.vitalStats,
															healthIssues: [
																...prev.vitalStats.healthIssues,
																{
																	condition: "",
																	diagnosedDate: "",
																	severity: "Mild",
																	status: "Active",
																},
															],
														},
													}))
												}}
												className="bg-white hover:bg-orange-50 text-xs h-8 px-2"
											>
												<Plus className="h-3 w-3 mr-1" />
												Add
											</Button>
										</div>
									</div>

									{profileData.vitalStats.healthIssues.length > 0 ? (
										<div className="space-y-3">
											{profileData.vitalStats.healthIssues.map((issue, index) => (
												<HealthIssueCard
													key={index}
													issue={issue}
													index={index}
													onUpdate={(index, updatedIssue) => {
														const newHealthIssues = [...profileData.vitalStats.healthIssues]
														newHealthIssues[index] = updatedIssue
														setProfileData((prev) => ({
															...prev,
															vitalStats: { ...prev.vitalStats, healthIssues: newHealthIssues },
														}))
													}}
													onDelete={(index) => {
														const newHealthIssues = profileData.vitalStats.healthIssues.filter((_, i) => i !== index)
														setProfileData((prev) => ({
															...prev,
															vitalStats: { ...prev.vitalStats, healthIssues: newHealthIssues },
														}))
													}}
												/>
											))}
										</div>
									) : (
										<div className="text-center py-6 text-muted-foreground">
											<Heart className="h-6 w-6 mx-auto mb-1 opacity-50" />
											<p className="text-xs">No conditions recorded</p>
										</div>
									)}
								</div>
							</FormSection>
						</TabsContent>

						{/* Lifestyle Tab - Mobile Optimized */}
						<TabsContent value="lifestyle" className="space-y-4 mt-0">
							<FormSection
								title="Lifestyle & Wellness"
								description="Track your daily habits"
								icon={Activity}
								className="from-green-50 to-emerald-50"
							>
								<div className="space-y-3">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
										{/* Exercise */}
										<Card className="border shadow-sm bg-white/80">
											<CardContent className="p-3 sm:p-4">
												<div className="flex items-center space-x-2 mb-3">
													<div className="p-1.5 bg-blue-100 rounded-lg">
														<Activity className="h-4 w-4 text-blue-600" />
													</div>
													<div>
														<h4 className="font-medium text-sm">Exercise</h4>
														<p className="text-xs text-muted-foreground">How often?</p>
													</div>
												</div>
												<Select
													value={profileData.vitalStats.lifestyle.exercise.frequency}
													onValueChange={(value) =>
														setProfileData((prev) => ({
															...prev,
															vitalStats: {
																...prev.vitalStats,
																lifestyle: {
																	...prev.vitalStats.lifestyle,
																	exercise: { ...prev.vitalStats.lifestyle.exercise, frequency: value },
																},
															},
														}))
													}
												>
													<SelectTrigger className="bg-white text-sm">
														<SelectValue placeholder="Select frequency" />
													</SelectTrigger>
													<SelectContent>
														{[
															{ value: "Daily", icon: "🏃" },
															{ value: "Weekly", icon: "📅" },
															{ value: "Occasionally", icon: "🌟" },
															{ value: "Rarely", icon: "⭐" },
															{ value: "Never", icon: "💤" },
														].map(({ value, icon }) => (
															<SelectItem key={value} value={value}>
																<span className="flex items-center space-x-2">
																	<span>{icon}</span>
																	<span>{value}</span>
																</span>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</CardContent>
										</Card>

										{/* Diet */}
										<Card className="border shadow-sm bg-white/80">
											<CardContent className="p-3 sm:p-4">
												<div className="flex items-center space-x-2 mb-3">
													<div className="p-1.5 bg-green-100 rounded-lg">
														<Utensils className="h-4 w-4 text-green-600" />
													</div>
													<div>
														<h4 className="font-medium text-sm">Diet</h4>
														<p className="text-xs text-muted-foreground">Type</p>
													</div>
												</div>
												<Select
													value={profileData.vitalStats.lifestyle.diet.preferredDiet}
													onValueChange={(value) =>
														setProfileData((prev) => ({
															...prev,
															vitalStats: {
																...prev.vitalStats,
																lifestyle: {
																	...prev.vitalStats.lifestyle,
																	diet: { ...prev.vitalStats.lifestyle.diet, preferredDiet: value },
																},
															},
														}))
													}
												>
													<SelectTrigger className="bg-white text-sm">
														<SelectValue placeholder="Select diet" />
													</SelectTrigger>
													<SelectContent>
														{[
															{ value: "Balanced", icon: "🥗" },
															{ value: "Low-Carb", icon: "🥑" },
															{ value: "High-Protein", icon: "🍖" },
															{ value: "Mediterranean", icon: "🐟" },
															{ value: "Vegetarian", icon: "🥕" },
															{ value: "Vegan", icon: "🌱" },
														].map(({ value, icon }) => (
															<SelectItem key={value} value={value}>
																<span className="flex items-center space-x-2">
																	<span>{icon}</span>
																	<span>{value}</span>
																</span>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</CardContent>
										</Card>

										{/* Sleep */}
										<Card className="border shadow-sm bg-white/80">
											<CardContent className="p-3 sm:p-4">
												<div className="flex items-center space-x-2 mb-3">
													<div className="p-1.5 bg-purple-100 rounded-lg">
														<Moon className="h-4 w-4 text-purple-600" />
													</div>
													<div>
														<h4 className="font-medium text-sm">Sleep</h4>
														<p className="text-xs text-muted-foreground">Hours</p>
													</div>
												</div>
												<Select
													value={profileData.vitalStats.lifestyle.sleepPattern.hoursPerDay}
													onValueChange={(value) =>
														setProfileData((prev) => ({
															...prev,
															vitalStats: {
																...prev.vitalStats,
																lifestyle: {
																	...prev.vitalStats.lifestyle,
																	sleepPattern: { ...prev.vitalStats.lifestyle.sleepPattern, hoursPerDay: value },
																},
															},
														}))
													}
												>
													<SelectTrigger className="bg-white text-sm">
														<SelectValue placeholder="Select hours" />
													</SelectTrigger>
													<SelectContent>
														{[
															{ value: "Less than 4", icon: "😩" },
															{ value: "4-6 hours", icon: "😫" },
															{ value: "6-8 hours", icon: "😐" },
															{ value: "8-10 hours", icon: "😴" },
															{ value: "More than 10", icon: "🥳" },
														].map(({ value, icon }) => (
															<SelectItem key={value} value={value}>
																<span className="flex items-center space-x-2">
																	<span>{icon}</span>
																	<span>{value}</span>
																</span>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</CardContent>
										</Card>

										{/* Stress Level */}
										<Card className="border shadow-sm bg-white/80">
											<CardContent className="p-3 sm:p-4">
												<div className="flex items-center space-x-2 mb-3">
													<div className="p-1.5 bg-red-100 rounded-lg">
														<Heart className="h-4 w-4 text-red-600" />
													</div>
													<div>
														<h4 className="font-medium text-sm">Stress</h4>
														<p className="text-xs text-muted-foreground">Level</p>
													</div>
												</div>
												<Select
													value={profileData.vitalStats.lifestyle.stressLevel}
													onValueChange={(value) =>
														setProfileData((prev) => ({
															...prev,
															vitalStats: {
																...prev.vitalStats,
																lifestyle: { ...prev.vitalStats.lifestyle, stressLevel: value },
															},
														}))
													}
												>
													<SelectTrigger className="bg-white text-sm">
														<SelectValue placeholder="Select level" />
													</SelectTrigger>
													<SelectContent>
														{[
															{ value: "Low", icon: "😌" },
															{ value: "Moderate", icon: "😊" },
															{ value: "High", icon: "😰" },
															{ value: "Very High", icon: "😣" },
														].map(({ value, icon }) => (
															<SelectItem key={value} value={value}>
																<span className="flex items-center space-x-2">
																	<span>{icon}</span>
																	<span>{value}</span>
																</span>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</CardContent>
										</Card>
									</div>
								</div>
							</FormSection>
						</TabsContent>

						{/* Interests Tab - Mobile Optimized */}
						<TabsContent value="interests" className="space-y-4 mt-0">
							<FormSection
								title="Interests & Hobbies"
								description="Add your interests"
								icon={Sparkles}
								className="from-purple-50 to-pink-50"
							>
								<div className="space-y-4">
									<div className="relative">
										<Input
											placeholder="Type interest and press Enter"
											className="pr-16 bg-white text-sm"
											onKeyDown={(e) => {
												if (e.key === "Enter" && e.target.value.trim()) {
													const newInterest = e.target.value.trim()
													const currentInterests = Array.isArray(profileData.vitalStats?.interests)
														? profileData.vitalStats.interests
														: []

													if (!currentInterests.includes(newInterest)) {
														setProfileData((prev) => ({
															...prev,
															vitalStats: {
																...prev.vitalStats,
																interests: [...currentInterests, newInterest],
															},
														}))
														e.target.value = ""
													}
												}
											}}
										/>
										<kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-xs">
											Enter
										</kbd>
									</div>

									{profileData.vitalStats.interests.length > 0 && (
										<div className="space-y-2">
											<p className="text-sm font-medium">Your Interests</p>
											<div className="flex flex-wrap gap-1.5">
												{profileData.vitalStats.interests.map((interest, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs"
													>
														{interest}
														<Button
															variant="ghost"
															size="sm"
															className="h-3 w-3 p-0 ml-1.5 hover:bg-transparent"
															onClick={() => {
																setProfileData((prev) => ({
																	...prev,
																	vitalStats: {
																		...prev.vitalStats,
																		interests: prev.vitalStats.interests.filter((_, i) => i !== index),
																	},
																}))
															}}
														>
															<X className="h-2 w-2" />
														</Button>
													</Badge>
												))}
											</div>
										</div>
									)}

									<div className="space-y-2">
										<p className="text-sm font-medium">Popular Interests</p>
										<div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
											{[
												{ name: "Reading", icon: "📚" },
												{ name: "Fitness", icon: "💪" },
												{ name: "Cooking", icon: "🍳" },
												{ name: "Travel", icon: "✈️" },
												{ name: "Music", icon: "🎵" },
												{ name: "Photography", icon: "📷" },
												{ name: "Gardening", icon: "🌱" },
												{ name: "Art", icon: "🎨" },
											].map((interest) => (
												<Button
													key={interest.name}
													variant="outline"
													size="sm"
													onClick={() => {
														const currentInterests = Array.isArray(profileData.vitalStats?.interests)
															? profileData.vitalStats.interests
															: []

														if (!currentInterests.includes(interest.name)) {
															setProfileData((prev) => ({
																...prev,
																vitalStats: {
																	...prev.vitalStats,
																	interests: [...currentInterests, interest.name],
																},
															}))
														}
													}}
													className="justify-start bg-white hover:bg-purple-50 text-xs h-8 px-2"
													disabled={profileData.vitalStats.interests.includes(interest.name)}
												>
													<span className="mr-1 text-xs">{interest.icon}</span>
													<span className="truncate">{interest.name}</span>
												</Button>
											))}
										</div>
									</div>
								</div>
							</FormSection>
						</TabsContent>

						{/* Emergency Contact Tab - Mobile Optimized */}
						<TabsContent value="emergency" className="space-y-4 mt-0">
							<FormSection
								title="Emergency Contact"
								description="Emergency contact details"
								icon={Phone}
								className="from-red-50 to-pink-50"
							>
								<div className="space-y-4">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField label="Contact Name" required>
											<Input
												placeholder="Enter full name"
												value={profileData.vitalStats.emergencyContact?.name}
												onChange={(e) =>
													setProfileData((prev) => ({
														...prev,
														vitalStats: {
															...prev.vitalStats,
															emergencyContact: {
																...prev.vitalStats.emergencyContact,
																name: e.target.value,
															},
														},
													}))
												}
												className="bg-white text-sm"
											/>
										</FormField>

										<FormField label="Relationship" required>
											<Select
												value={profileData.vitalStats.emergencyContact?.relation}
												onValueChange={(value) =>
													setProfileData((prev) => ({
														...prev,
														vitalStats: {
															...prev.vitalStats,
															emergencyContact: {
																...prev.vitalStats.emergencyContact,
																relation: value,
															},
														},
													}))
												}
											>
												<SelectTrigger className="bg-white text-sm">
													<SelectValue placeholder="Select relationship" />
												</SelectTrigger>
												<SelectContent>
													{["Spouse", "Parent", "Child", "Sibling", "Friend", "Other"].map((rel) => (
														<SelectItem key={rel} value={rel}>
															{rel}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormField>
									</div>

									<FormField label="Phone Number" required>
										<div className="relative">
											<Input
												type="tel"
												placeholder="Enter phone number"
												className="pl-8 bg-white text-sm"
												value={profileData.vitalStats.emergencyContact?.phone}
												onChange={(e) =>
													setProfileData((prev) => ({
														...prev,
														vitalStats: {
															...prev.vitalStats,
															emergencyContact: {
																...prev.vitalStats.emergencyContact,
																phone: e.target.value,
															},
														},
													}))
												}
											/>
											<Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
										</div>
									</FormField>

									<div className="p-3 bg-red-50 rounded-lg border border-red-200">
										<div className="flex items-start space-x-2">
											<AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
											<div className="text-xs">
												<p className="font-medium text-red-900">Important Note</p>
												<p className="text-red-700 mt-1 leading-relaxed">
													Make sure your emergency contact can be reached quickly and knows your medical history.
												</p>
											</div>
										</div>
									</div>
								</div>
							</FormSection>
						</TabsContent>
					</div>

					{/* Mobile-optimized Footer Navigation */}
					<div className="flex-none px-2 sm:px-4 py-3 border-t bg-white/80 backdrop-blur-sm">
						<div className="flex justify-between items-center">
							<Button
								variant="outline"
								onClick={() => {
									const prevIndex = currentTabIndex - 1
									if (prevIndex >= 0) {
										setActiveTab(tabs[prevIndex].id)
									}
								}}
								disabled={currentTabIndex === 0 || isSubmitting}
								className="bg-white hover:bg-gray-50 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
							>
								<ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
								<span className="hidden sm:inline">Previous</span>
								<span className="sm:hidden">Prev</span>
							</Button>

							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									onClick={() => setIsOpen(false)}
									disabled={isSubmitting}
									className="bg-white hover:bg-gray-50 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
								>
									Cancel
								</Button>

								{currentTabIndex === tabs.length - 1 ? (
									<Button
										onClick={handleSubmit}
										disabled={isSubmitting}
										className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
									>
										{isSubmitting ? (
											<>
												<LoadingSpinner />
												<span className="ml-1">Saving...</span>
											</>
										) : (
											<>
												<Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
												<span className="hidden sm:inline">Save Changes</span>
												<span className="sm:hidden">Save</span>
											</>
										)}
									</Button>
								) : (
									<Button
										onClick={() => {
											const nextIndex = currentTabIndex + 1
											if (nextIndex < tabs.length) {
												setActiveTab(tabs[nextIndex].id)
											}
										}}
										className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
									>
										<span className="hidden sm:inline">Next</span>
										<span className="sm:hidden">Next</span>
										<ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
									</Button>
								)}
							</div>
						</div>
					</div>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
