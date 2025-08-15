"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect, useCallback } from "react"
import { User, Phone, GraduationCap, Briefcase, Award, Settings, Plus, Trash2, ChevronLeft, ChevronRight, DollarSign, Clock, CalendarDays, CheckCircle, Building, UserCog, CalendarPlus, Info, FileText, Mail, Linkedin, Twitter, Share2, Facebook, Instagram, Globe, Save, AlertCircle, Check, Loader2, ArrowRight, Star, MapPin, Camera, Upload, X, Eye, EyeOff, Sparkles, Zap, Target, TrendingUp, IndianRupee, ChevronsUpDown } from 'lucide-react'
import { toast } from "sonner"
import { interval } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WorkingHours from './WorKinghours'

import axios from "axios"
import { cn } from "@/lib/utils"


const tabs = [
	{
		id: "summary",
		label: "Profile Summary",
		shortLabel: "Summary",
		icon: <User className="w-4 h-4" />,
		color: "text-violet-700",
		bgColor: "bg-violet-50",
		borderColor: "border-violet-200",
		progressColor: "bg-gradient-to-r from-violet-500 to-purple-600",
		accentColor: "accent-violet-500",
		description: "Your professional identity",
	},
	{
		id: "contact",
		label: "Contact & Social",
		shortLabel: "Contact",
		icon: <Phone className="w-4 h-4" />,
		color: "text-emerald-700",
		bgColor: "bg-emerald-50",
		borderColor: "border-emerald-200",
		progressColor: "bg-gradient-to-r from-emerald-500 to-teal-600",
		accentColor: "accent-emerald-500",
		description: "How clients can reach you",
	},
	{
		id: "education",
		label: "Education",
		shortLabel: "Education",
		icon: <GraduationCap className="w-4 h-4" />,
		color: "text-blue-700",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
		progressColor: "bg-gradient-to-r from-blue-500 to-cyan-600",
		accentColor: "accent-blue-500",
		description: "Your academic background",
	},
	{
		id: "experience",
		label: "Experience",
		shortLabel: "Experience",
		icon: <Briefcase className="w-4 h-4" />,
		color: "text-indigo-700",
		bgColor: "bg-indigo-50",
		borderColor: "border-indigo-200",
		progressColor: "bg-gradient-to-r from-indigo-500 to-purple-600",
		accentColor: "accent-indigo-500",
		description: "Your professional journey",
	},
	{
		id: "skills",
		label: "Skills & Languages",
		shortLabel: "Skills",
		icon: <Award className="w-4 h-4" />,
		color: "text-amber-700",
		bgColor: "bg-amber-50",
		borderColor: "border-amber-200",
		progressColor: "bg-gradient-to-r from-amber-500 to-orange-600",
		accentColor: "accent-amber-500",
		description: "Your expertise areas",
	},
	{
		id: "consultation",
		label: "Consultation",
		shortLabel: "Rates",
		icon: <Settings className="w-4 h-4" />,
		color: "text-rose-700",
		bgColor: "bg-rose-50",
		borderColor: "border-rose-200",
		progressColor: "bg-gradient-to-r from-rose-500 to-pink-600",
		accentColor: "accent-rose-500",
		description: "Availability and pricing",
	},
]


export default function EditProfessionalDialog({ isOpen, onClose, professional, onSave }) {
	const [formData, setFormData] = useState(professional || {})
	const [loading, setLoading] = useState(false)
	const [activeTab, setActiveTab] = useState("summary")
	const [autoSaving, setAutoSaving] = useState(false)
	const [validationErrors, setValidationErrors] = useState({})
	const [completionStatus, setCompletionStatus] = useState({})
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

	const [organizations, setOrganizations] = useState([])
	const [openOrg, setOpenOrg] = useState(false)
	const [searchLoading, setSearchLoading] = useState(false)
	const [openOrgMap, setOpenOrgMap] = useState({}) // Track open state for each experience entry
	const [showCommandOrg, setShowCommandOrg] = useState(false)
	const [searchTerm, setSearchTerm] = useState("")
	const [showSuggestions, setShowSuggestions] = useState(false)

	const [searchTimeout, setSearchTimeout] = useState(null);

	// Update the searchOrganizations function

	// Templates for new items
	const templates = {
		education: {
			degree: "",
			institution: "",
			year: new Date().getFullYear(),
			specialization: "",
			gpa: "",
			honors: "",
		},
		experience: {
			organization: "",
			organizationId: null,
			isManualEntry: true,
			role: "",
			department: "",
			startDate: "",
			endDate: "",
			isCurrent: false,
			description: ""
		},


		skills: {
			name: "",
			proficiency: "intermediate",
			category: "technical",
			yearsOfExperience: 1,
		},
		languages: {
			name: "",
			proficiency: "conversational",
			certification: "",
		},
	}

	// Auto-save functionality
	const autoSave = useCallback(async () => {
		if (!hasUnsavedChanges) return

		try {
			setAutoSaving(true)
			// Simulate auto-save delay
			await new Promise(resolve => setTimeout(resolve, 1000))
			// In real app, this would save to backend
			setHasUnsavedChanges(false)
			toast.success("Changes auto-saved", { duration: 2000 })
		} catch (error) {
			toast.error("Auto-save failed")
		} finally {
			setAutoSaving(false)
		}
	}, [hasUnsavedChanges])

	// Auto-save every 30 seconds
	useEffect(() => {
		const interval = setInterval(autoSave, 30000)
		return () => clearInterval(interval)
	}, [autoSave, interval])

	// Form validation
	const validateSection = useCallback((sectionId) => {
		const errors = {}

		switch (sectionId) {
			case "summary":
				if (!formData.professionType?.trim()) {
					errors.professionType = "Professional type is required"
				}
				break
			case "contact":
				if (!formData.contactDetails?.email?.trim()) {
					errors.email = "Email is required"
				} else if (!/\S+@\S+\.\S+/.test(formData.contactDetails.email)) {
					errors.email = "Invalid email format"
				}
				if (!formData.contactDetails?.phone?.trim()) {
					errors.phone = "Phone number is required"
				}
				break
		}

		setValidationErrors(prev => ({ ...prev, [sectionId]: errors }))
		return Object.keys(errors).length === 0
	}, [formData])

	// Calculate completion status
	useEffect(() => {
		const status = {}
		tabs.forEach(tab => {
			let completed = 0
			let total = 0

			switch (tab.id) {
				case "summary":
					total = 3
					if (formData.professionType?.trim()) completed++
					if (formData.profileSummary?.headline?.trim()) completed++
					if (formData.profileSummary?.bio?.trim()) completed++
					break
				case "contact":
					total = 2
					if (formData.contactDetails?.email?.trim()) completed++
					if (formData.contactDetails?.phone?.trim()) completed++
					break
				case "education":
					total = 1
					if (formData.education?.length > 0) completed++
					break
				case "experience":
					total = 1
					if (formData.experience?.length > 0) completed++
					break
				case "skills":
					total = 2
					if (formData.skills?.length > 0) completed++
					if (formData.languages?.length > 0) completed++
					break
				case "consultation":
					total = 2
					if (formData.consultationDetails?.availability) completed++
					if (formData.consultationDetails?.fee?.minimum) completed++
					break
			}

			status[tab.id] = { completed, total, percentage: (completed / total) * 100 }
		})

		setCompletionStatus(status)
	}, [])

	// Common handler factory for list operations
	const createListHandlers = (section) => ({
		add: () => {
			setFormData(prev => ({
				...prev,
				[section]: [...(prev[section] || []), templates[section]],
			}))
			setHasUnsavedChanges(true)
		},
		remove: (index) => {
			setFormData(prev => ({
				...prev,
				[section]: prev[section].filter((_, i) => i !== index),
			}))
			setHasUnsavedChanges(true)
		},
		change: (index, field, value) => {
			setFormData(prev => ({
				...prev,
				[section]: prev[section]?.map((item, i) => (i === index ? { ...item, [field]: value } : item)) || [],
			}))
			setHasUnsavedChanges(true)
		},
	})

	// Create handlers for each section
	const educationHandlers = createListHandlers("education")
	const experienceHandlers = createListHandlers("experience")
	const skillHandlers = createListHandlers("skills")
	const languageHandlers = createListHandlers("languages")

	// Special handler for nested objects
	const handleNestedChange = (section, field, value) => {
		setFormData(prev => ({
			...prev,
			[section]: {
				...(prev[section] || {}),
				[field]: value,
			},
		}))
		setHasUnsavedChanges(true)
	}

	// Handle simple field changes
	const handleFieldChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }))
		setHasUnsavedChanges(true)
	}

	// Initialize working hours to ensure all 7 days are present
	useEffect(() => {
		const allDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
		const existingHours = formData.consultationDetails?.hours || [];
		
		// Create a map of existing hours by day (handle duplicates by keeping the first occurrence)
		const hoursMap = {};
		existingHours.forEach(hour => {
			if (hour.day && !hoursMap[hour.day]) {
				hoursMap[hour.day] = hour;
			}
		});
		
		// Ensure all 7 days are present
		const completeHours = allDays.map(day => {
			return hoursMap[day] || {
				day,
				isAvailable: false,
				morning: {
					startTime: "09:00",
					endTime: "12:00",
					isActive: false
				},
				evening: {
					startTime: "14:00",
					endTime: "17:00",
					isActive: false
				}
			};
		});
		
		// Check if we need to update (missing days, duplicates, or wrong order)
		const needsUpdate = existingHours.length !== 7 || 
			new Set(existingHours.map(h => h.day)).size !== 7 ||
			!allDays.every((day, index) => existingHours[index]?.day === day);
		
		if (needsUpdate) {
			console.log('Fixing consultation hours - missing days or duplicates detected');
			setFormData(prev => ({
				...prev,
				consultationDetails: {
					...(prev.consultationDetails || {}),
					hours: completeHours,
				},
			}));
			setHasUnsavedChanges(true);
		}
	}, [formData.consultationDetails?.hours?.length])

	// Update working hours handler
	const handleWorkingHoursChange = (updatedHours) => {
		setFormData(prev => ({
			...prev,
			consultationDetails: {
				...(prev.consultationDetails || {}),
				hours: updatedHours,
			},
		}));
		setHasUnsavedChanges(true);
	}

	const handleSubmit = async () => {
		try {
			setLoading(true)

			// Validate all sections
			let isValid = true
			tabs.forEach(tab => {
				if (!validateSection(tab.id)) {
					isValid = false
				}
			})

			if (!isValid) {
				toast.error("Please fix validation errors before saving")
				return
			}

			await onSave(formData)
			onClose()
			toast.success("Profile updated successfully! 🎉")
		} catch (error) {
			toast.error("Failed to update profile")
		} finally {
			setLoading(false)
		}
	}

	const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab)
	const currentTab = tabs[currentTabIndex]
	const isFirstTab = currentTabIndex === 0
	const isLastTab = currentTabIndex === tabs.length - 1

	const handleNext = () => {
		if (!isLastTab) {
			validateSection(activeTab)
			setActiveTab(tabs[currentTabIndex + 1].id)
		}
	}

	const handlePrevious = () => {
		if (!isFirstTab) {
			setActiveTab(tabs[currentTabIndex - 1].id)
		}
	}

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.ctrlKey || e.metaKey) {
				switch (e.key) {
					case 's':
						e.preventDefault()
						handleSubmit()
						break
					case 'ArrowRight':
						e.preventDefault()
						if (!isLastTab) handleNext()
						break
					case 'ArrowLeft':
						e.preventDefault()
						if (!isFirstTab) handlePrevious()
						break
				}
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown)
			return () => document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, activeTab, isFirstTab, isLastTab])

	const searchOrganizations = async (query) => {
		if (!query || query.length < 3) {
			setOrganizations([])
			setShowSuggestions(false)
			return
		}

		// Clear any existing timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout)
		}

		// Set a new timeout
		setSearchTimeout(
			setTimeout(async () => {
				try {
					setSearchLoading(true)
					const response = await axios.get(`/api/organization/names?query=${query}`)
					setOrganizations(response.data)
					setShowSuggestions(true)
				} catch (error) {
					console.error("Failed to fetch organizations:", error)
				} finally {
					setSearchLoading(false)
				}
			}, 1000) // 1 second delay
		)
	}



	useEffect(() => {
		const handleClickOutside = () => {
			setShowSuggestions(false)
		}

		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
	}, [])

	const overallProgress = Object.values(completionStatus).reduce((acc, status) => acc + (status.percentage || 0), 0) / tabs.length

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-6xl w-[98vw] h-[95vh] p-0 flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
				{/* Header */}
				<div className="flex-none relative">
					<div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-emerald-500/10" />
					<div className="relative p-6 pb-4">
						<DialogHeader className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
										Edit Professional Profile
									</DialogTitle>
								</div>
								<div className="flex items-center gap-3">
									{autoSaving && (
										<div className="flex items-center gap-2 text-sm text-slate-500">
											<Loader2 className="w-4 h-4 animate-spin" />
											Auto-saving...
										</div>
									)}
									{hasUnsavedChanges && !autoSaving && (
										<Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
											<AlertCircle className="w-3 h-3 mr-1" />
											Unsaved changes
										</Badge>
									)}
								</div>
							</div>

							{/* Overall Progress */}
							<div className="space-y-1 mt-1">
								<div className="flex items-center justify-between text-sm">
									<span className="text-slate-600">Profile Completion</span>
									<span className=" text-slate-900">{Math.round(overallProgress)}%</span>
								</div>
								<Progress value={overallProgress} className="h-1 bg-slate-200">
									<div
										className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-500"
										style={{ width: `${overallProgress}%` }}
									/>
								</Progress>
							</div>
						</DialogHeader>
					</div>
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
					{/* Tab Navigation */}
					<div className="flex-none px-6 pb-4">
						<TabsList className="flex flex-wrap w-full grid-cols-6 gap-2 h-auto p-1 bg-slate-100/50 backdrop-blur-sm  sm:justify-around">
							{tabs.map((tab, index) => {
								const status = completionStatus[tab.id]
								const isCompleted = status?.percentage === 100
								const isActive = tab.id === activeTab

								return (
									<TabsTrigger
										key={tab.id}
										value={tab.id}
										className={`
											relative flex flex-col items-center gap-1 px-4 sm:px-8  py-1 text-xs font-medium transition-all duration-200
											${isActive
												? `${tab.bgColor} ${tab.color} shadow-sm ring-1 ${tab.borderColor}`
												: 'hover:bg-white/50'
											} `}
									>
										<div className="flex items-center gap-1">
											<div className={` ${isActive ? tab.color : 'text-slate-500'}`}>
												{tab.icon}

											</div>
											{isCompleted && (
												<div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
													<Check className="w-2 h-2 text-white" />
												</div>
											)}
										</div>
										<span className="hidden sm:block">{tab.shortLabel}</span>
										<span className="sm:hidden text-[10px]">{tab.shortLabel}</span>
									</TabsTrigger>
								)
							})}
						</TabsList>

						{/* Current tab info */}
						{/* <div className="mt-4 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className={`p-2 rounded-lg ${currentTab.bgColor}`}>
									<div className={currentTab.color}>
										{currentTab.icon}
									</div>
								</div>
								<div>
									<h3 className="font-semibold text-slate-900">{currentTab.label}</h3>
									<p className="text-sm text-slate-600">{currentTab.description}</p>
								</div>
							</div>
							<Badge variant="outline" className="text-xs">
								Step {currentTabIndex + 1} of {tabs.length}
							</Badge>
						</div> */}
					</div>

					{/* Tab Content */}
					<div className="flex-1 overflow-y-auto px-6 pb-6">
						{/* Summary Tab */}
						<TabsContent value="summary" className="mt-0 space-y-6">
							<div className="grid gap-6">
								{/* Professional Type */}
								<div className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/30 p-6 shadow-sm transition-all hover:shadow-md">
									<div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5" />
									<div className="relative space-y-4">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-lg bg-violet-100">
												<User className="w-5 h-5 text-violet-600" />
											</div>
											<div>
												<Label className="text-lg font-semibold text-slate-900">Professional Type</Label>
												<p className="text-sm text-slate-600">What type of professional are you?</p>
											</div>
											<Badge variant="destructive" className="ml-auto">Required</Badge>
										</div>
										<Input
											value={formData.professionType || ""}
											onChange={(e) => handleFieldChange("professionType", e.target.value)}
											placeholder="e.g., Cardiologist, Corporate Lawyer, Software Architect..."
											className="h-12 text-base border-violet-200 focus:border-violet-400 focus:ring-violet-400 bg-white/50"
										/>
										{validationErrors.summary?.professionType && (
											<p className="text-sm text-red-600 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{validationErrors.summary.professionType}
											</p>
										)}
									</div>
								</div>

								{/* Professional Headline */}
								<div className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/30 p-6 shadow-sm transition-all hover:shadow-md">
									<div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5" />

									<div className="relative space-y-4">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-lg bg-violet-100">
												<Target className="w-5 h-5 text-violet-600" />
											</div>
											<div>
												<Label className="text-lg font-semibold text-slate-900">Professional Headline</Label>
												<p className="text-sm text-slate-600">A compelling one-liner that captures your expertise</p>
											</div>
										</div>
										<Input
											value={formData.profileSummary?.headline || ""}
											onChange={(e) => handleNestedChange("profileSummary", "headline", e.target.value)}
											placeholder="e.g., Award-winning Cardiologist with 15+ years of experience in interventional procedures"
											className="h-12 text-base border-violet-200 focus:border-violet-400 focus:ring-violet-400 bg-white/50"
										/>
									</div>
								</div>

								{/* Professional Bio */}
								<div className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/30 p-6 shadow-sm transition-all hover:shadow-md">
									<div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5" />
									<div className="relative space-y-4">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-lg bg-violet-100">
												<FileText className="w-5 h-5 text-violet-600" />
											</div>
											<div>
												<Label className="text-lg font-semibold text-slate-900">Professional Bio</Label>
												<p className="text-sm text-slate-600">Tell your professional story and what makes you unique</p>
											</div>
										</div>
										<Textarea
											value={formData.profileSummary?.bio || ""}
											onChange={(e) => handleNestedChange("profileSummary", "bio", e.target.value)}
											placeholder="Share your professional journey, key achievements, areas of expertise, and what drives your passion for your field..."
											rows={6}
											className="resize-none text-base border-violet-200 focus:border-violet-400 focus:ring-violet-400 bg-white/50"
										/>
										<div className="flex items-center justify-between text-xs text-slate-500">
											<span>Tip: Include your specializations, notable achievements, and professional philosophy</span>
											<span>{formData.profileSummary?.bio?.length || 0} characters</span>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						{/* Contact Tab */}
						<TabsContent value="contact" className="mt-0 space-y-6">
							<div className="grid gap-6">
								{/* Contact Information */}
								<div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-6 shadow-sm transition-all hover:shadow-md">
									<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
									<div className="relative space-y-6">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-lg bg-emerald-100">
												<Phone className="w-5 h-5 text-emerald-600" />
											</div>
											<div>
												<Label className="text-lg font-semibold text-slate-900">Contact Information</Label>
												<p className="text-sm text-slate-600">How clients can reach you directly</p>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-3">
												<Label className="text-base font-medium flex items-center gap-2">
													<Mail className="w-4 h-4 text-emerald-600" />
													Email Address
													<Badge variant="destructive" className="text-xs">Required</Badge>
												</Label>
												<Input
													type="email"
													value={formData.contactDetails?.email || ""}
													onChange={(e) => handleNestedChange("contactDetails", "email", e.target.value)}
													placeholder="your.email@domain.com"
													className="h-12 text-base border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 bg-white/50"
												/>
												{validationErrors.contact?.email && (
													<p className="text-sm text-red-600 flex items-center gap-1">
														<AlertCircle className="w-4 h-4" />
														{validationErrors.contact.email}
													</p>
												)}
											</div>

											<div className="space-y-3">
												<Label className="text-base font-medium flex items-center gap-2">
													<Phone className="w-4 h-4 text-emerald-600" />
													Phone Number
													<Badge variant="destructive" className="text-xs">Required</Badge>
												</Label>
												<Input
													type="tel"
													value={formData.contactDetails?.phone || ""}
													onChange={(e) => handleNestedChange("contactDetails", "phone", e.target.value)}
													placeholder="+1 (555) 123-4567"
													className="h-12 text-base border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 bg-white/50"
												/>
												{validationErrors.contact?.phone && (
													<p className="text-sm text-red-600 flex items-center gap-1">
														<AlertCircle className="w-4 h-4" />
														{validationErrors.contact.phone}
													</p>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Social Media */}
								<div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-6 shadow-sm transition-all hover:shadow-md">
									<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
									<div className="relative space-y-6">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-lg bg-emerald-100">
												<Share2 className="w-5 h-5 text-emerald-600" />
											</div>
											<div>
												<Label className="text-lg font-semibold text-slate-900">Professional Social Media</Label>
												<p className="text-sm text-slate-600">Build trust with your professional network presence</p>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-3">
												<Label className="text-base font-medium flex items-center gap-2">
													<Linkedin className="w-4 h-4 text-blue-600" />
													LinkedIn Profile
												</Label>
												<Input
													value={formData.socialMediaLinks?.linkedin || ""}
													onChange={(e) => handleNestedChange("socialMediaLinks", "linkedin", e.target.value)}
													placeholder="linkedin.com/in/your-profile"
													className="h-12 text-base border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 bg-white/50"
												/>
											</div>

											<div className="space-y-3">
												<Label className="text-base font-medium flex items-center gap-2">
													<Twitter className="w-4 h-4 text-sky-500" />
													Twitter/X Profile
												</Label>
												<Input
													value={formData.socialMediaLinks?.twitter || ""}
													onChange={(e) => handleNestedChange("socialMediaLinks", "twitter", e.target.value)}
													placeholder="twitter.com/your-handle"
													className="h-12 text-base border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 bg-white/50"
												/>
											</div>

											<div className="space-y-3">
												<Label className="text-base font-medium flex items-center gap-2">
													<Globe className="w-4 h-4 text-slate-600" />
													Professional Website
												</Label>
												<Input
													value={formData.socialMediaLinks?.website || ""}
													onChange={(e) => handleNestedChange("socialMediaLinks", "website", e.target.value)}
													placeholder="www.yourwebsite.com"
													className="h-12 text-base border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 bg-white/50"
												/>
											</div>

											<div className="space-y-3">
												<Label className="text-base font-medium flex items-center gap-2">
													<Instagram className="w-4 h-4 text-pink-600" />
													Instagram (Optional)
												</Label>
												<Input
													value={formData.socialMediaLinks?.instagram || ""}
													onChange={(e) => handleNestedChange("socialMediaLinks", "instagram", e.target.value)}
													placeholder="instagram.com/your-handle"
													className="h-12 text-base border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 bg-white/50"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>

						{/* Education Tab */}
						<TabsContent value="education" className="mt-0 space-y-6">
							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="p-2 rounded-lg bg-blue-100">
											<GraduationCap className="w-5 h-5 text-blue-600" />
										</div>
										<div>
											<h3 className="text-lg font-semibold text-slate-900">Education History</h3>
											<p className="text-sm text-slate-600">Your academic qualifications and achievements</p>
										</div>
									</div>
									<Button
										onClick={educationHandlers.add}
										className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
									>
										<Plus className="w-4 h-4 mr-2" />
										Add Education
									</Button>
								</div>

								{(!formData.education || formData.education.length === 0) ? (
									<div className="text-center py-16 border-2 border-dashed border-blue-200 rounded-2xl bg-gradient-to-br from-blue-50/50 to-white">
										<div className="p-4 rounded-full bg-blue-100 w-fit mx-auto mb-4">
											<GraduationCap className="w-8 h-8 text-blue-600" />
										</div>
										<h3 className="text-xl font-semibold text-slate-900 mb-2">Add Your Education</h3>
										<p className="text-slate-600 mb-6 max-w-md mx-auto">
											Showcase your academic background to build credibility with potential clients
										</p>
										<Button
											onClick={educationHandlers.add}
											size="lg"
											className="bg-blue-600 hover:bg-blue-700 text-white"
										>
											<Plus className="w-5 h-5 mr-2" />
											Add Your First Education Entry
										</Button>
									</div>
								) : (
									<div className="space-y-4">
										{formData.education.map((edu, index) => (
											<div
												key={index}
												className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-sm transition-all hover:shadow-md"
											>
												<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
												<Button
													variant="ghost"
													size="icon"
													className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50"
													onClick={() => educationHandlers.remove(index)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>

												<div className="relative grid gap-6">
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
														<div className="space-y-2">
															<Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
																<GraduationCap className="w-4 h-4 text-blue-500" />
																Degree
																<Badge variant="destructive" className="text-xs">Required</Badge>
															</Label>
															<Input
																value={edu.degree || ""}
																onChange={(e) => educationHandlers.change(index, "degree", e.target.value)}
																placeholder="e.g., Doctor of Medicine (MD)"
																className="h-11 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
															/>
														</div>
														<div className="space-y-2">
															<Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
																<Building className="w-4 h-4 text-blue-500" />
																Institution
																<Badge variant="destructive" className="text-xs">Required</Badge>
															</Label>
															<Input
																value={edu.institution || ""}
																onChange={(e) => educationHandlers.change(index, "institution", e.target.value)}
																placeholder="e.g., Harvard Medical School"
																className="h-11 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
															/>
														</div>
													</div>

													<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
														<div className="space-y-2">
															<Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
																<CalendarDays className="w-4 h-4 text-blue-500" />
																Graduation Year
															</Label>
															<Input
																type="number"
																min="1950"
																max={new Date().getFullYear() + 10}
																value={edu.year || ""}
																onChange={(e) => educationHandlers.change(index, "year", parseInt(e.target.value))}
																placeholder="2020"
																className="h-11 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
															/>
														</div>
														<div className="space-y-2">
															<Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
																<Award className="w-4 h-4 text-blue-500" />
																Specialization
															</Label>
															<Input
																value={edu.specialization || ""}
																onChange={(e) => educationHandlers.change(index, "specialization", e.target.value)}
																placeholder="e.g., Cardiology"
																className="h-11 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
															/>
														</div>
														<div className="space-y-2">
															<Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
																<Star className="w-4 h-4 text-blue-500" />
																GPA/Grade
															</Label>
															<Input
																value={edu.gpa || ""}
																onChange={(e) => educationHandlers.change(index, "gpa", e.target.value)}
																placeholder="3.8/4.0 or First Class"
																className="h-11 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
															/>
														</div>
													</div>

													<div className="space-y-2">
														<Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
															<Award className="w-4 h-4 text-blue-500" />
															Honors & Awards
														</Label>
														<Input
															value={edu.honors || ""}
															onChange={(e) => educationHandlers.change(index, "honors", e.target.value)}
															placeholder="e.g., Magna Cum Laude, Dean's List, Phi Beta Kappa"
															className="h-11 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
														/>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</TabsContent>

						{/* Experience Tab */}
						<TabsContent value="experience" className="mt-0 space-y-6">
							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="p-2 rounded-lg bg-indigo-100">
											<Briefcase className="w-5 h-5 text-indigo-600" />
										</div>
										<div>
											<h3 className="text-lg font-semibold text-slate-900">Professional Experience</h3>
											<p className="text-sm text-slate-600">Your career journey and key achievements</p>
										</div>
									</div>
									<Button
										onClick={experienceHandlers.add}
										className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
									>
										<Plus className="w-4 h-4 mr-2" />
										Add Experience
									</Button>
								</div>

								{(!formData.experience || formData.experience.length === 0) ? (
									<div className="text-center py-16 border-2 border-dashed border-indigo-200 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-white">
										<div className="p-4 rounded-full bg-indigo-100 w-fit mx-auto mb-4">
											<Briefcase className="w-8 h-8 text-indigo-600" />
										</div>
										<h3 className="text-xl font-semibold text-slate-900 mb-2">Add Your Experience</h3>
										<p className="text-slate-600 mb-6 max-w-md mx-auto">
											Showcase your professional journey to demonstrate your expertise and track record
										</p>
										<Button
											onClick={experienceHandlers.add}
											size="lg"
											className="bg-indigo-600 hover:bg-indigo-700 text-white"
										>
											<Plus className="w-5 h-5 mr-2" />
											Add Your First Experience
										</Button>
									</div>
								) : (
									<div className="space-y-4">
										{formData.experience.map((exp, index) => (
											<div
												key={index}
												className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30 p-6 shadow-sm transition-all hover:shadow-md"
											>
												<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
												<Button
													variant="ghost"
													size="icon"
													className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50"
													onClick={() => experienceHandlers.remove(index)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>

												<div className="relative grid gap-6">
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
														<div className="space-y-2">
															<Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
																<Building className="w-4 h-4 text-indigo-500" />
																Organization
																<Badge variant="destructive" className="text-xs">Required</Badge>
															</Label>

															<div className="relative">
																<Input
																	value={exp.organization || ""}
																	onChange={(e) => {
																		const value = e.target.value;
																		experienceHandlers.change(index, "organization", value);
																		experienceHandlers.change(index, "isManualEntry", true);
																		experienceHandlers.change(index, "organizationId", null);
																		setSearchTerm(value);

																		// Only search if 3 or more characters
																		if (value.length >= 3) {
																			searchOrganizations(value);
																		} else {
																			setOrganizations([]);
																			setShowSuggestions(false);
																		}
																	}}
																	placeholder="Enter organization name (min. 3 characters)..."
																	className="h-11 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 bg-white/50"
																/>
																{searchLoading && (
																	<div className="absolute right-3 top-1/2 -translate-y-1/2">
																		<Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
																	</div>
																)}

																{showSuggestions && organizations.length > 0 && (
																	<div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-indigo-100">
																		<div className="max-h-60 overflow-auto rounded-md py-1">
																			{organizations.map((org) => (
																				<button
																					key={org._id}
																					className={cn(
																						"w-full text-left px-3 py-2 text-sm hover:bg-indigo-50",
																						"focus:bg-indigo-50 focus:outline-none transition-colors",
																						exp.organizationId === org._id && "bg-indigo-50 text-indigo-600"
																					)}
																					onClick={() => {
																						experienceHandlers.change(index, "organization", org.name);
																						experienceHandlers.change(index, "organizationId", org._id);
																						experienceHandlers.change(index, "isManualEntry", false);
																						setShowSuggestions(false);
																					}}
																				>
																					<div className="flex flex-col">
																						<span className="font-medium">{org.name}</span>
																						<span className="text-xs text-slate-500">Verified Organization</span>
																					</div>
																				</button>
																			))}
																		</div>
																	</div>
																)}
															</div>
														</div>

														<div className="space-y-2">
															<Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
																<UserCog className="w-4 h-4 text-indigo-500" />
																Role/Position
																<Badge variant="destructive" className="text-xs">Required</Badge>
															</Label>
															<Input
																value={exp.role || ""}
																onChange={(e) => experienceHandlers.change(index, "role", e.target.value)}
																placeholder="e.g., Senior Cardiologist"
																className="h-11 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 bg-white/50"
															/>
														</div>
													</div>

													<div className="space-y-2">
														<Label className="text-sm font-medium text-slate-700">Department/Division</Label>
														<Input
															value={exp.department || ""}
															onChange={(e) => experienceHandlers.change(index, "department", e.target.value)}
															placeholder="e.g., Cardiovascular Medicine"
															className="h-11 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 bg-white/50"
														/>
													</div>

													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
														<div className="space-y-2">
															<Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
																<CalendarPlus className="w-4 h-4 text-indigo-500" />
																Start Date
																<Badge variant="destructive" className="text-xs">Required</Badge>
															</Label>
															<Input
																type="date"
																value={exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : ""}
																onChange={(e) => experienceHandlers.change(index, "startDate", e.target.value)}
																className="h-11 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 bg-white/50"
															/>
														</div>
														<div className="space-y-2">
															<Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
																<CalendarDays className="w-4 h-4 text-indigo-500" />
																End Date
															</Label>
															<Input
																type="date"
																value={exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : ""}
																onChange={(e) => experienceHandlers.change(index, "endDate", e.target.value)}
																disabled={exp.isCurrent}
																min={exp.startDate}
																className="h-11 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 bg-white/50 disabled:bg-slate-100 disabled:text-slate-400"
															/>
														</div>
													</div>

													<div className="flex items-center space-x-3">
														<input
															type="checkbox"
															id={`current-${index}`}
															checked={exp.isCurrent || false}
															onChange={(e) => {
																experienceHandlers.change(index, "isCurrent", e.target.checked)
																if (e.target.checked) {
																	experienceHandlers.change(index, "endDate", "")
																}
															}}
															className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
														/>
														<Label htmlFor={`current-${index}`} className="text-sm text-slate-700 flex items-center gap-2">
															<TrendingUp className="w-4 h-4 text-indigo-500" />
															I currently work here
														</Label>
													</div>

													<div className="space-y-2">
														<Label className="text-sm font-medium text-slate-700">Role Description & Key Achievements</Label>
														<Textarea
															value={exp.description || ""}
															onChange={(e) => experienceHandlers.change(index, "description", e.target.value)}
															placeholder="Describe your key responsibilities, notable achievements, and impact in this role..."
															rows={4}
															className="resize-none border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 bg-white/50"
														/>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</TabsContent>

						{/* Skills Tab */}
						<TabsContent value="skills" className="mt-0 space-y-8">
							{/* Skills Section */}
							<div className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50/30 p-6 shadow-sm transition-all hover:shadow-md">
								<div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
								<div className="relative space-y-6">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-lg bg-amber-100">
												<Award className="w-5 h-5 text-amber-600" />
											</div>
											<div>
												<h3 className="text-lg font-semibold text-slate-900">Professional Skills</h3>
												<p className="text-sm text-slate-600">Showcase your expertise and proficiency levels</p>
											</div>
										</div>
										<Button
											onClick={skillHandlers.add}
											variant="outline"
											className="border-amber-200 text-amber-700 hover:bg-amber-50"
										>
											<Plus className="w-4 h-4 mr-2" />
											Add Skill
										</Button>
									</div>

									{(!formData.skills || formData.skills.length === 0) ? (
										<div className="text-center py-12 border-2 border-dashed border-amber-200 rounded-xl bg-amber-50/30">
											<Award className="w-12 h-12 mx-auto mb-4 text-amber-400" />
											<h4 className="font-semibold text-slate-900 mb-2">Add Your Skills</h4>
											<p className="text-sm text-slate-600 mb-4">Highlight your professional competencies</p>
											<Button
												onClick={skillHandlers.add}
												size="sm"
												className="bg-amber-600 hover:bg-amber-700 text-white"
											>
												<Plus className="w-4 h-4 mr-2" />
												Add First Skill
											</Button>
										</div>
									) : (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{formData.skills.map((skill, index) => (
												<div
													key={index}
													className="relative p-4 border border-amber-100 rounded-xl bg-white/50 shadow-sm hover:shadow-md transition-all group"
												>
													<Button
														variant="ghost"
														size="icon"
														className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50 w-6 h-6"
														onClick={() => skillHandlers.remove(index)}
													>
														<Trash2 className="w-3 h-3" />
													</Button>

													<div className="space-y-3">
														<div className="space-y-2">
															<Label className="text-sm font-medium text-slate-700">Skill Name</Label>
															<Input
																value={skill.name || ""}
																onChange={(e) => skillHandlers.change(index, "name", e.target.value)}
																placeholder="e.g., Cardiac Surgery"
																className="h-9 text-sm border-amber-200 focus:border-amber-400 focus:ring-amber-400"
															/>
														</div>
														<div className="grid grid-cols-2 gap-3">
															<div className="space-y-2">
																<Label className="text-sm font-medium text-slate-700">Proficiency</Label>
																{/* <Select
																	value={skill.proficiency || "intermediate"}
																	onChange={(e) => skillHandlers.change(index, "proficiency", e.target.value)}
																	className="w-full h-9 text-sm border-amber-200 rounded-md focus:border-amber-400 focus:ring-amber-400"
																>
																	<option value="beginner">Beginner</option>
																	<option value="intermediate">Intermediate</option>
																	<option value="advanced">Advanced</option>
																	<option value="expert">Expert</option>
																</Select> */}

																<Select
																	value={skill.proficiency || "intermediate"}
																	onValueChange={(value) => skillHandlers.change(index, "proficiency", value)}
																	className="w-full h-9 text-sm border-amber-200 rounded-md focus:border-amber-400 focus:ring-amber-400"

																>
																	<SelectTrigger className="h-9">
																		<SelectValue placeholder="Select proficiency" />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="beginner">Beginner</SelectItem>
																		<SelectItem value="intermediate">Intermediate</SelectItem>
																		<SelectItem value="advanced">Advanced</SelectItem>
																		<SelectItem value="expert">Expert</SelectItem>
																	</SelectContent>
																</Select>
															</div>
															<div className="space-y-2">
																<Label className="text-sm font-medium text-slate-700">Experience</Label>
																<Input
																	type="number"
																	min="0"
																	max="50"
																	value={skill.yearsOfExperience || ""}
																	onChange={(e) => skillHandlers.change(index, "yearsOfExperience", parseInt(e.target.value))}
																	placeholder="Years"
																	className="h-9 text-sm border-amber-200 focus:border-amber-400 focus:ring-amber-400"
																/>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</div>

							{/* Languages Section */}
							<div className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50/30 p-6 shadow-sm transition-all hover:shadow-md">
								<div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
								<div className="relative space-y-6">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-lg bg-amber-100">
												<Globe className="w-5 h-5 text-amber-600" />
											</div>
											<div>
												<h3 className="text-lg font-semibold text-slate-900">Languages</h3>
												<p className="text-sm text-slate-600">Languages you can communicate in professionally</p>
											</div>
										</div>
										<Button
											onClick={languageHandlers.add}
											variant="outline"
											className="border-amber-200 text-amber-700 hover:bg-amber-50"
										>
											<Plus className="w-4 h-4 mr-2" />
											Add Language
										</Button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{formData.languages?.map((lang, index) => (
											<div
												key={index}
												className="relative p-4 border border-amber-100 rounded-xl bg-white/50 shadow-sm hover:shadow-md transition-all group"
											>
												<Button
													variant="ghost"
													size="icon"
													className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50 w-6 h-6"
													onClick={() => languageHandlers.remove(index)}
												>
													<Trash2 className="w-3 h-3" />
												</Button>

												<div className="space-y-3">
													<div className="space-y-2">
														<Label className="text-sm font-medium text-slate-700">Language</Label>
														<Input
															value={lang.name || ""}
															onChange={(e) => languageHandlers.change(index, "name", e.target.value)}
															placeholder="e.g., Spanish"
															className="h-9 text-sm border-amber-200 focus:border-amber-400 focus:ring-amber-400"
														/>
													</div>
													<div className="space-y-2">
														<Label className="text-sm font-medium text-slate-700">Proficiency Level</Label>
														<Select
															value={lang.proficiency || "conversational"}
															onChange={(e) => languageHandlers.change(index, "proficiency", e.target.value)}
															className="w-full h-9 text-sm border-amber-200 rounded-md focus:border-amber-400 focus:ring-amber-400"
														>
															<SelectTrigger className="h-9">
																<SelectValue placeholder="Select proficiency" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="basic">Basic</SelectItem>
																<SelectItem value="conversational">Conversational</SelectItem>
																<SelectItem value="fluent">Fluent</SelectItem>
																<SelectItem value="native">Native</SelectItem>
															</SelectContent>
														</Select>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</TabsContent>

						{/* Consultation Tab */}
						<TabsContent value="consultation" className="mt-0 space-y-6">
							<div className="grid gap-6">
								{/* Availability & Fees */}
								<div className="group relative overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/30 p-6 shadow-sm transition-all hover:shadow-md">
									<div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5" />
									<div className="relative space-y-6">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-lg bg-rose-100">
												<IndianRupee className="w-5 h-5 text-rose-600" />
											</div>
											<div>
												<h3 className="text-lg font-semibold text-slate-900">Consultation Fees & Availability</h3>
												<p className="text-sm text-slate-600">Set your rates and let clients know your availability</p>
											</div>
										</div>

										<div className="grid gap-6">
											<div className="space-y-3">
												<Label className="text-base font-medium flex items-center gap-2">
													<CheckCircle className="w-4 h-4 text-rose-500" />
													Current Availability Status
												</Label>

												<Select
													value={formData.consultationDetails?.availability || "moderate"}
													onValueChange={(value) => handleNestedChange("consultationDetails", "availability", value)}
													className="w-full h-12 bg-white/50 border border-rose-200 focus:border-rose-400 focus:ring-rose-400"
												>
													<SelectTrigger className="h-12">
														<SelectValue placeholder="Select availability" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="high">🟢 High Availability - Accepting new clients</SelectItem>
														<SelectItem value="moderate">🟡 Moderate Availability - Limited slots</SelectItem>
														<SelectItem value="low">🟠 Low Availability - Very limited</SelectItem>
														<SelectItem value="unavailable">🔴 Currently Unavailable</SelectItem>
													</SelectContent	>
												</Select>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												<div className="space-y-3">
													<Label className="text-base font-medium flex items-center gap-2">
														<IndianRupee className="w-4 h-4 text-rose-500" />
														Minimum Consultation Fee
													</Label>
													<div className="relative">
														<IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
														<Input
															type="number"
															min="0"
															value={formData.consultationDetails?.fee?.minimum || ""}
															onChange={(e) =>
																handleNestedChange("consultationDetails", "fee", {
																	...formData.consultationDetails?.fee,
																	minimum: e.target.value ? Number(e.target.value) : "",
																})
															}
															placeholder="100"
															className="h-12 pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-400 bg-white/50"
														/>
													</div>
												</div>
												<div className="space-y-3">
													<Label className="text-base font-medium flex items-center gap-2">
														<IndianRupee className="w-4 h-4 text-rose-500" />
														Maximum Consultation Fee
													</Label>
													<div className="relative">
														<IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
														<Input
															type="number"
															min="0"
															value={formData.consultationDetails?.fee?.maximum || ""}
															onChange={(e) =>
																handleNestedChange("consultationDetails", "fee", {
																	...formData.consultationDetails?.fee,
																	maximum: e.target.value ? Number(e.target.value) : "",
																})
															}
															placeholder="500"
															className="h-12 pl-10 border-rose-200 focus:border-rose-400 focus:ring-rose-400 bg-white/50"
														/>
													</div>
												</div>
											</div>

											<div className="p-4 bg-rose-50/50 rounded-lg border border-rose-100">
												<p className="text-sm text-slate-600 flex items-start gap-2">
													<Info className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
													<span>
														Setting a fee range helps clients understand your pricing structure.
														You can always negotiate specific rates based on consultation complexity and duration.
													</span>
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* working hourse */}

								<WorkingHours
									hours={formData.consultationDetails?.hours || []}
									onChange={(updatedHours) => {
										setFormData(prev => ({
											...prev,
											consultationDetails: {
												...(prev.consultationDetails || {}),
												hours: updatedHours,
											},
										}))
										setHasUnsavedChanges(true)
									}}
								/>


							</div>
						</TabsContent>
					</div>

					{/* Footer Navigation */}
					<div className="flex-none border-t bg-white/50 backdrop-blur-sm">
						<div className="px-6 py-4">
							<div className="flex items-center justify-between">
								<Button
									variant="outline"
									onClick={handlePrevious}
									disabled={isFirstTab || loading}
									className="flex items-center gap-2 hover:bg-slate-50"
								>
									<ChevronLeft className="w-4 h-4" />
									Previous
								</Button>

								<div className="flex items-center gap-3">
									<div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
										<span>💡 Tip: Use</span>
										<kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Ctrl+S</kbd>
										<span>to save</span>
									</div>

									<Button variant="outline" onClick={onClose} disabled={loading}>
										Cancel
									</Button>

									{isLastTab ? (
										<Button
											onClick={handleSubmit}
											disabled={loading}
											className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
										>
											{loading ? (
												<>
													<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													Saving...
												</>
											) : (
												<>
													<Save className="w-4 h-4 mr-2" />
													Save Profile
												</>
											)}
										</Button>
									) : (
										<Button
											onClick={handleNext}
											disabled={loading}
											className={`${currentTab.progressColor} text-white shadow-sm hover:shadow-md transition-all`}
										>
											Continue
											<ArrowRight className="w-4 h-4 ml-2" />
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
