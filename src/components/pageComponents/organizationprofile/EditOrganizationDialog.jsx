"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, Phone, Clock, Building, BookOpen, Stethoscope, ImageIcon, Plus, Trash2, ChevronLeft, ChevronRight, Save, X, CheckCircle2, AlertCircle, } from "lucide-react"
import OperatingHours from "./OperatingHours"
import { toast } from "sonner"
import Image from "next/image"
import axios from "axios"

export default function EditOrganizationDialog({ isOpen, onClose, organization, onSave }) {
	const [formData, setFormData] = useState(organization || {})
	const [loading, setLoading] = useState(false)
	const [activeTab, setActiveTab] = useState("basic")
	const [errors, setErrors] = useState({})
	const [touchedFields, setTouchedFields] = useState({})

	useEffect(() => {
		setFormData(organization || {})
		setErrors({})
		setTouchedFields({})
	}, [organization])

	const handleFieldChange = (section, field, value) => {
		// Mark field as touched
		setTouchedFields((prev) => ({
			...prev,
			[`${section}.${field}`]: true,
		}))

		// Handle root level fields
		if (typeof field === "string" && !value) {
			setFormData((prev) => ({
				...prev,
				[section]: field,
			}))
			return
		}

		// Handle array fields
		if (typeof field === "number") {
			setFormData((prev) => ({
				...prev,
				[section]: prev[section]?.map((item, i) => (i === field ? value : item)) || [],
			}))
			return
		}

		// Handle nested fields
		setFormData((prev) => ({
			...prev,
			[section]: {
				...(prev[section] || {}),
				[field]: value,
			},
		}))

		// Clear errors for this field
		if (errors[`${section}.${field}`]) {
			setErrors((prev) => {
				const newErrors = { ...prev }
				delete newErrors[`${section}.${field}`]
				return newErrors
			})
		}
	}

	const handleArrayFieldAdd = (section, defaultItem) => {
		setFormData((prev) => ({
			...prev,
			[section]: [...(prev[section] || []), defaultItem],
		}))
	}

	const handleArrayFieldRemove = (section, index) => {
		setFormData((prev) => ({
			...prev,
			[section]: prev[section].filter((_, i) => i !== index),
		}))
	}

	const validateFormData = (data) => {
		const errors = {}

		// Basic validation
		if (!data.name?.trim()) {
			errors["basic.name"] = "Organization name is required"
		}
		if (!data.facilityType) {
			errors["basic.facilityType"] = "Facility type is required"
		}

		// Contact validation
		const contactDetails = data.contactDetails || {}
		if (contactDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email)) {
			errors["contact.email"] = "Invalid email format"
		}
		if (contactDetails.phone && !/^[\d\s+-]{8,}$/.test(contactDetails.phone)) {
			errors["contact.phone"] = "Phone number must be at least 8 digits"
		}

		// Services validation
		if (data.services?.length > 0) {
			data.services.forEach((service, index) => {
				if (!service.name?.trim()) {
					errors[`services.${index}.name`] = `Service #${index + 1} requires a name`
				}
			})
		}

		return errors
	}

	const cleanFormData = (data) => {
		const cleanObject = (obj) => {
			return Object.entries(obj).reduce((acc, [key, value]) => {
				// Handle arrays
				if (Array.isArray(value)) {
					const cleanArray = value.filter((item) => {
						if (typeof item === "object") {
							return Object.values(item).some((v) => v !== "" && v != null)
						}
						return item !== "" && item != null
					})
					if (cleanArray.length > 0) {
						acc[key] = cleanArray
					}
					return acc
				}

				// Handle nested objects
				if (value && typeof value === "object") {
					const cleaned = cleanObject(value)
					if (Object.keys(cleaned).length > 0) {
						acc[key] = cleaned
					}
					return acc
				}

				// Handle primitive values
				if (value !== "" && value != null) {
					acc[key] = value
				}
				return acc
			}, {})
		}

		return cleanObject(data)
	}

	const handleSaveChanges = async (updatedData) => {
		try {
			setLoading(true)
			const response = await axios.put(`/api/organization/profile/update?orgId=${organization._id}`, updatedData)
			if (onSave) onSave(response.data)
			toast.success("Organization profile updated successfully")
		} catch (error) {
			console.error("Error updating organization:", error)
			toast.error(error.response?.data?.message || "Failed to update organization profile")
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async () => {
		try {
			setLoading(true)

			// Validate form data
			const validationErrors = validateFormData(formData)
			if (Object.keys(validationErrors).length > 0) {
				setErrors(validationErrors)
				Object.values(validationErrors).forEach((error) => toast.error(error))
				return
			}

			const cleanedData = cleanFormData(formData)
			console.log("Submitting data:", cleanedData)

			await handleSaveChanges(cleanedData)
			toast.success("Organization profile updated successfully!")
			onClose()
		} catch (error) {
			console.error("Submit error:", error)
			const errorMessage = error.response?.data?.message || error.message || "Failed to update organization profile"
			toast.error(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	const tabs = [
		{ id: "basic", label: "Basic", icon: <Building2 className="w-4 h-4" />, color: "blue" },
		{ id: "contact", label: "Contact", icon: <Phone className="w-4 h-4" />, color: "green" },
		{ id: "services", label: "Services", icon: <Stethoscope className="w-4 h-4" />, color: "purple" },
		{ id: "departments", label: "Departments", icon: <BookOpen className="w-4 h-4" />, color: "orange" },
		{ id: "schedule", label: "Schedule", icon: <Clock className="w-4 h-4" />, color: "teal" },
		{ id: "amenities", label: "Amenities", icon: <Building className="w-4 h-4" />, color: "pink" },
		{ id: "gallery", label: "Gallery", icon: <ImageIcon className="w-4 h-4" />, color: "indigo" },
	]

	const handleTabChange = (value) => {
		setActiveTab(value)
	}

	const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
	const isFirstTab = currentTabIndex === 0
	const isLastTab = currentTabIndex === tabs.length - 1

	const handleNext = () => {
		if (!isLastTab) {
			handleTabChange(tabs[currentTabIndex + 1].id)
		}
	}

	const handlePrevious = () => {
		if (!isFirstTab) {
			handleTabChange(tabs[currentTabIndex - 1].id)
		}
	}

	const getTabCompletionStatus = (tabId) => {
		switch (tabId) {
			case "basic":
				return formData.name && formData.facilityType
			case "contact":
				return formData.contactDetails?.email || formData.contactDetails?.phone
			case "services":
				return formData.services?.length > 0
			case "departments":
				return formData.departments?.length > 0
			case "schedule":
				return (formData.operatingHours || formData.availability)?.length > 0
			case "amenities":
				return formData.amenities?.length > 0
			case "gallery":
				return formData.images?.length > 0
			default:
				return false
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[900px] p-0 flex flex-col gap-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
				{/* Header */}
				<div className="flex-none p-4 border-b bg-white/80 backdrop-blur-sm">
					<DialogHeader>
						<div className="flex items-center justify-between">
							<div>
								<DialogTitle className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
									Edit Organization Profile
								</DialogTitle>
								<p className="text-sm text-gray-600 mt-1">{`Update your organization's information`}</p>
							</div>
							<Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
								<X className="w-5 h-5" />
							</Button>
						</div>
					</DialogHeader>
				</div>

				<Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col min-h-0">
					{/* Tab Navigation */}
					<div className="flex-none p-4 bg-white/50">
						{/* Mobile Tab Navigation */}
						<div className="lg:hidden mb-4">
							<div className="flex items-center justify-between mb-3">
								<h3 className="font-semibold text-gray-800">{tabs[currentTabIndex].label}</h3>
								<Badge variant="outline" className="text-xs">
									{currentTabIndex + 1} of {tabs.length}
								</Badge>
							</div>
							<div className="flex gap-2 overflow-x-auto pb-2">
								{tabs.map((tab, index) => (
									<Button
										key={tab.id}
										variant={activeTab === tab.id ? "default" : "outline"}
										size="sm"
										onClick={() => handleTabChange(tab.id)}
										className={`flex-shrink-0 ${activeTab === tab.id ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-50 border-gray-200"
											}`}
									>
										<div className="flex items-center gap-2">
											{tab.icon}
											<span className="hidden sm:inline">{tab.label}</span>
											{getTabCompletionStatus(tab.id) && <CheckCircle2 className="w-3 h-3 text-green-500" />}
										</div>
									</Button>
								))}
							</div>
						</div>

						{/* Desktop Tab Navigation */}
						<div className="hidden lg:block">
							<TabsList className="grid w-full grid-cols-7 h-auto p-1 bg-white/80 backdrop-blur-sm shadow-sm rounded-xl">
								{tabs.map((tab) => (
									<TabsTrigger
										key={tab.id}
										value={tab.id}
										className={`flex flex-col items-center gap-2 px-3 py-4 text-sm transition-all duration-200 ${activeTab === tab.id ? "bg-blue-600 text-white shadow-lg" : "hover:bg-blue-50 text-gray-600"
											}`}
									>
										<div className="flex items-center gap-2">
											{tab.icon}
											{getTabCompletionStatus(tab.id) && <CheckCircle2 className="w-4 h-4 text-green-500" />}
										</div>
										<span className="font-medium">{tab.label}</span>
									</TabsTrigger>
								))}
							</TabsList>
						</div>

						{/* Progress Bar */}
						<div className="mt-4">
							<div className="flex justify-between text-xs text-gray-500 mb-2">
								<span>Progress</span>
								<span>{Math.round(((currentTabIndex + 1) / tabs.length) * 100)}%</span>
							</div>
							<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
									style={{ width: `${((currentTabIndex + 1) / tabs.length) * 100}%` }}
								/>
							</div>
						</div>
					</div>

					{/* Tab Content */}
					<ScrollArea className="flex-1  lg:px-4">
						<div className="pb-6">
							{/* Basic Info Tab */}
							<TabsContent value="basic" className="mt-0">
								<Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
									<CardHeader className="pb-4">
										<CardTitle className="flex items-center gap-2 text-blue-700">
											<Building2 className="w-5 h-5" />
											Basic Information
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="grid gap-6 md:grid-cols-2">
											<div className="space-y-2">
												<Label className="text-sm font-medium text-gray-700">
													Organization Name <span className="text-red-500">*</span>
												</Label>
												<Input
													value={formData.name || ""}
													onChange={(e) => handleFieldChange("name", e.target.value)}
													placeholder="Enter organization name"
													className={`${errors["basic.name"] ? "border-red-300 focus:border-red-500" : "border-gray-200"
														}`}
												/>
												{errors["basic.name"] && (
													<p className="text-xs text-red-600 flex items-center gap-1">
														<AlertCircle className="w-3 h-3" />
														{errors["basic.name"]}
													</p>
												)}
											</div>

											<div className="space-y-2">
												<Label className="text-sm font-medium text-gray-700">
													Facility Type <span className="text-red-500">*</span>
												</Label>
												<Select
													value={formData.facilityType}
													onValueChange={(value) => setFormData((prev) => ({ ...prev, facilityType: value }))}
												>
													<SelectTrigger
														className={`${errors["basic.facilityType"] ? "border-red-300 focus:border-red-500" : "border-gray-200"
															}`}
													>
														<SelectValue placeholder="Select facility type" />
													</SelectTrigger>
													<SelectContent>
														{[
															"clinic",
															"hospital",
															"diagnostic",
															"pharmacy",
															"urgent_care",
															"rehabilitation",
															"therapy",
															"surgery_center",
															"specialty_center",
															"home_healthcare",
															"blood_bank",
															"vaccination_center",
															"mental_health",
															"traditional_medicine",
															"nutrition_center",
															"fitness_center",
															"dental_clinic",
															"eye_care",
															"pediatric_center",
															"womens_health",
															"fertility_clinic",
															"dialysis_center",
															"imaging_center",
															"laboratory",
															"sleep_clinic",
															"pain_clinic",
															"chiropractic",
															"acupuncture",
															"physiotherapy",
															"nursing_home",
															"assisted_living",
															"hospice",
															"addiction_treatment",
															"other",
														].map((type) => (
															<SelectItem key={type} value={type}>
																{type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												{errors["basic.facilityType"] && (
													<p className="text-xs text-red-600 flex items-center gap-1">
														<AlertCircle className="w-3 h-3" />
														{errors["basic.facilityType"]}
													</p>
												)}
											</div>
										</div>

										<div className="space-y-2">
											<Label className="text-sm font-medium text-gray-700">Headline</Label>
											<Input
												value={formData.summary?.headline || ""}
												onChange={(e) => handleFieldChange("summary", "headline", e.target.value)}
												placeholder="Enter a compelling headline for your organization"
												className="border-gray-200"
											/>
										</div>

										<div className="space-y-2">
											<Label className="text-sm font-medium text-gray-700">About Your Organization</Label>
											<Textarea
												value={formData.summary?.bio || ""}
												onChange={(e) => handleFieldChange("summary", "bio", e.target.value)}
												placeholder="Describe your organization, mission, and what makes you unique..."
												rows={4}
												className="border-gray-200 resize-none"
											/>
											<p className="text-xs text-gray-500">{(formData.summary?.bio || "").length}/500 characters</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Contact Tab */}
							<TabsContent value="contact" className="mt-0">
								<Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
									<CardHeader className="pb-4">
										<CardTitle className="flex items-center gap-2 text-green-700">
											<Phone className="w-5 h-5" />
											Contact Information
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="grid gap-6 md:grid-cols-2">
											<div className="space-y-2">
												<Label className="text-sm font-medium text-gray-700">Phone Number</Label>
												<Input
													value={formData.contactDetails?.phone || ""}
													onChange={(e) => handleFieldChange("contactDetails", "phone", e.target.value)}
													placeholder="+1 (555) 123-4567"
													className={`${errors["contact.phone"] ? "border-red-300 focus:border-red-500" : "border-gray-200"
														}`}
												/>
												{errors["contact.phone"] && (
													<p className="text-xs text-red-600 flex items-center gap-1">
														<AlertCircle className="w-3 h-3" />
														{errors["contact.phone"]}
													</p>
												)}
											</div>

											<div className="space-y-2">
												<Label className="text-sm font-medium text-gray-700">Email Address</Label>
												<Input
													value={formData.contactDetails?.email || ""}
													onChange={(e) => handleFieldChange("contactDetails", "email", e.target.value)}
													type="email"
													placeholder="contact@organization.com"
													className={`${errors["contact.email"] ? "border-red-300 focus:border-red-500" : "border-gray-200"
														}`}
												/>
												{errors["contact.email"] && (
													<p className="text-xs text-red-600 flex items-center gap-1">
														<AlertCircle className="w-3 h-3" />
														{errors["contact.email"]}
													</p>
												)}
											</div>
										</div>

										<div className="space-y-2">
											<Label className="text-sm font-medium text-gray-700">Website</Label>
											<Input
												value={formData.contactDetails?.website || ""}
												onChange={(e) => handleFieldChange("contactDetails", "website", e.target.value)}
												placeholder="https://www.organization.com"
												className="border-gray-200"
											/>
										</div>

										<Separator />

										<div className="space-y-4">
											<Label className="text-sm font-medium text-gray-700">Address</Label>
											<div className="space-y-4">
												<Input
													value={formData.contactDetails?.address?.street || ""}
													onChange={(e) =>
														handleFieldChange("contactDetails", "address", {
															...formData.contactDetails?.address,
															street: e.target.value,
														})
													}
													placeholder="Street address"
													className="border-gray-200"
												/>
												<div className="grid gap-4 md:grid-cols-2">
													<Input
														value={formData.contactDetails?.address?.city || ""}
														onChange={(e) =>
															handleFieldChange("contactDetails", "address", {
																...formData.contactDetails?.address,
																city: e.target.value,
															})
														}
														placeholder="City"
														className="border-gray-200"
													/>
													<Input
														value={formData.contactDetails?.address?.state || ""}
														onChange={(e) =>
															handleFieldChange("contactDetails", "address", {
																...formData.contactDetails?.address,
																state: e.target.value,
															})
														}
														placeholder="State/Province"
														className="border-gray-200"
													/>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<Input
														value={formData.contactDetails?.address?.country || ""}
														onChange={(e) =>
															handleFieldChange("contactDetails", "address", {
																...formData.contactDetails?.address,
																country: e.target.value,
															})
														}
														placeholder="Country"
														className="border-gray-200"
													/>
													<Input
														value={formData.contactDetails?.address?.zipCode || ""}
														onChange={(e) =>
															handleFieldChange("contactDetails", "address", {
																...formData.contactDetails?.address,
																zipCode: e.target.value,
															})
														}
														placeholder="ZIP/Postal Code"
														className="border-gray-200"
													/>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Services Tab */}
							<TabsContent value="services" className="mt-0">
								<Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
									<CardHeader className="pb-4">
										<div className="flex items-center justify-between">
											<CardTitle className="flex items-center gap-2 text-purple-700">
												<Stethoscope className="w-5 h-5" />
												Services Offered
											</CardTitle>
											<Button
												onClick={() =>
													handleArrayFieldAdd("services", {
														name: "",
														description: "",
														price: "",
														isAvailable: true,
													})
												}
												className="bg-purple-600 hover:bg-purple-700 text-white"
												size="sm"
											>
												<Plus className="w-4 h-4 mr-2" />
												Add Service
											</Button>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										{formData.services?.length === 0 || !formData.services ? (
											<div className="text-center py-8 text-gray-500">
												<Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-300" />
												<p>{`No services added yet. Click "Add Service" to get started.`}</p>
											</div>
										) : (
											formData.services?.map((service, index) => (
												<Card key={index} className="border border-purple-100 bg-purple-50/30">
													<CardContent className="p-4">
														<div className="flex justify-between items-start mb-4">
															<h4 className="font-medium text-purple-800">Service #{index + 1}</h4>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleArrayFieldRemove("services", index)}
																className="text-red-500 hover:text-red-700 hover:bg-red-50"
															>
																<Trash2 className="w-4 h-4" />
															</Button>
														</div>
														<div className="grid gap-4 md:grid-cols-2">
															<div className="space-y-2">
																<Label className="text-sm font-medium text-gray-700">Service Name</Label>
																<Input
																	value={service.name || ""}
																	onChange={(e) =>
																		handleFieldChange("services", index, {
																			...service,
																			name: e.target.value,
																		})
																	}
																	placeholder="Enter service name"
																	className="border-gray-200"
																/>
															</div>
															<div className="space-y-2">
																<Label className="text-sm font-medium text-gray-700">Price (optional)</Label>
																<Input
																	type="number"
																	value={service.price || ""}
																	onChange={(e) =>
																		handleFieldChange("services", index, {
																			...service,
																			price: e.target.value,
																		})
																	}
																	placeholder="0.00"
																	className="border-gray-200"
																/>
															</div>
														</div>
														<div className="space-y-2 mt-4">
															<Label className="text-sm font-medium text-gray-700">Description</Label>
															<Textarea
																value={service.description || ""}
																onChange={(e) =>
																	handleFieldChange("services", index, {
																		...service,
																		description: e.target.value,
																	})
																}
																placeholder="Describe this service..."
																rows={3}
																className="border-gray-200 resize-none"
															/>
														</div>
													</CardContent>
												</Card>
											))
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Departments Tab */}
							<TabsContent value="departments" className="mt-0">
								<Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
									<CardHeader className="pb-4">
										<div className="flex items-center justify-between">
											<CardTitle className="flex items-center gap-2 text-orange-700">
												<BookOpen className="w-5 h-5" />
												Departments
											</CardTitle>
											<Button
												onClick={() =>
													handleArrayFieldAdd("departments", { name: "", description: "", specialities: [] })
												}
												className="bg-orange-600 hover:bg-orange-700 text-white"
												size="sm"
											>
												<Plus className="w-4 h-4 mr-2" />
												Add Department
											</Button>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										{formData.departments?.length === 0 || !formData.departments ? (
											<div className="text-center py-8 text-gray-500">
												<BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
												<p>{`No departments added yet. Click "Add Department" to get started.`}</p>
											</div>
										) : (
											formData.departments?.map((department, index) => (
												<Card key={index} className="border border-orange-100 bg-orange-50/30">
													<CardContent className="p-4">
														<div className="flex justify-between items-start mb-4">
															<h4 className="font-medium text-orange-800">Department #{index + 1}</h4>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleArrayFieldRemove("departments", index)}
																className="text-red-500 hover:text-red-700 hover:bg-red-50"
															>
																<Trash2 className="w-4 h-4" />
															</Button>
														</div>
														<div className="space-y-4">
															<div className="space-y-2">
																<Label className="text-sm font-medium text-gray-700">Department Name</Label>
																<Input
																	value={department.name || ""}
																	onChange={(e) =>
																		handleFieldChange("departments", index, {
																			...department,
																			name: e.target.value,
																		})
																	}
																	placeholder="Enter department name"
																	className="border-gray-200"
																/>
															</div>
															<div className="space-y-2">
																<Label className="text-sm font-medium text-gray-700">Description</Label>
																<Textarea
																	value={department.description || ""}
																	onChange={(e) =>
																		handleFieldChange("departments", index, {
																			...department,
																			description: e.target.value,
																		})
																	}
																	placeholder="Describe this department..."
																	rows={3}
																	className="border-gray-200 resize-none"
																/>
															</div>
															<div className="space-y-2">
																<Label className="text-sm font-medium text-gray-700">
																	Specialities (comma-separated)
																</Label>
																<Input
																	value={department.specialities?.join(", ") || ""}
																	onChange={(e) =>
																		handleFieldChange("departments", index, {
																			...department,
																			specialities: e.target.value.split(",").map((s) => s.trim()),
																		})
																	}
																	placeholder="Cardiology, Neurology, Pediatrics..."
																	className="border-gray-200"
																/>
															</div>
														</div>
													</CardContent>
												</Card>
											))
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Schedule Tab */}
							<TabsContent value="schedule" className="mt-0">
								<OperatingHours 
									hours={formData.operatingHours || formData.availability || []}
									onChange={(hours) => {
										setFormData(prev => ({
											...prev,
											operatingHours: hours
										}))
									}}
								/>
							</TabsContent>

							{/* Amenities Tab */}
							<TabsContent value="amenities" className="mt-0">
								<Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
									<CardHeader className="pb-4">
										<div className="flex items-center justify-between">
											<CardTitle className="flex items-center gap-2 text-pink-700">
												<Building className="w-5 h-5" />
												Amenities
											</CardTitle>
											<Button
												onClick={() => handleArrayFieldAdd("amenities", { name: "", description: "" })}
												className="bg-pink-600 hover:bg-pink-700 text-white"
												size="sm"
											>
												<Plus className="w-4 h-4 mr-2" />
												Add Amenity
											</Button>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										{formData.amenities?.length === 0 || !formData.amenities ? (
											<div className="text-center py-8 text-gray-500">
												<Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
												<p>{`No amenities added yet. Click "Add Amenity" to get started.`}</p>
											</div>
										) : (
											formData.amenities?.map((amenity, index) => (
												<Card key={index} className="border border-pink-100 bg-pink-50/30">
													<CardContent className="p-4">
														<div className="flex justify-between items-start mb-4">
															<h4 className="font-medium text-pink-800">Amenity #{index + 1}</h4>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleArrayFieldRemove("amenities", index)}
																className="text-red-500 hover:text-red-700 hover:bg-red-50"
															>
																<Trash2 className="w-4 h-4" />
															</Button>
														</div>
														<div className="space-y-4">
															<div className="space-y-2">
																<Label className="text-sm font-medium text-gray-700">Amenity Name</Label>
																<Input
																	value={amenity.name || ""}
																	onChange={(e) =>
																		handleFieldChange("amenities", index, {
																			...amenity,
																			name: e.target.value,
																		})
																	}
																	placeholder="Enter amenity name"
																	className="border-gray-200"
																/>
															</div>
															<div className="space-y-2">
																<Label className="text-sm font-medium text-gray-700">Description</Label>
																<Textarea
																	value={amenity.description || ""}
																	onChange={(e) =>
																		handleFieldChange("amenities", index, {
																			...amenity,
																			description: e.target.value,
																		})
																	}
																	placeholder="Describe this amenity..."
																	rows={3}
																	className="border-gray-200 resize-none"
																/>
															</div>
														</div>
													</CardContent>
												</Card>
											))
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Gallery Tab */}
							<TabsContent value="gallery" className="mt-0">
								<Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
									<CardHeader className="pb-4">
										<div className="flex items-center justify-between">
											<CardTitle className="flex items-center gap-2 text-indigo-700">
												<ImageIcon className="w-5 h-5" />
												Image Gallery
											</CardTitle>
											<Button
												onClick={() => handleArrayFieldAdd("images", "")}
												className="bg-indigo-600 hover:bg-indigo-700 text-white"
												size="sm"
											>
												<Plus className="w-4 h-4 mr-2" />
												Add Image
											</Button>
										</div>
									</CardHeader>
									<CardContent>
										{formData.images?.length === 0 || !formData.images ? (
											<div className="text-center py-8 text-gray-500">
												<ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
												<p>{`No images added yet. Click "Add Image" to get started.`}</p>
											</div>
										) : (
											<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
												{formData.images?.map((image, index) => (
													<Card key={index} className="border border-indigo-100 bg-indigo-50/30 overflow-hidden">
														<div className="relative group">
															<Image
																src={image || "/placeholder.svg?height=200&width=300"}
																alt={`Gallery image ${index + 1}`}
																layout="fill"
																objectFit="cover"

																className="w-full h-48 object-cover"
															/>
															<Button
																variant="destructive"
																size="icon"
																className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
																onClick={() => handleArrayFieldRemove("images", index)}
															>
																<Trash2 className="w-4 h-4" />
															</Button>
														</div>
														<CardContent className="p-3">
															<Input
																type="url"
																value={image}
																onChange={(e) => handleFieldChange("images", index, e.target.value)}
																placeholder="Enter image URL"
																className="border-gray-200 text-sm"
															/>
														</CardContent>
													</Card>
												))}
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>
						</div>
					</ScrollArea>

					{/* Footer Navigation */}
					<div className="flex-none p-4 border-t bg-white/80 backdrop-blur-sm">
						<div className="flex flex-col sm:flex-row justify-between gap-4">
							<Button
								variant="outline"
								onClick={handlePrevious}
								disabled={isFirstTab || loading}
								className="flex items-center gap-2 order-2 sm:order-1"
							>
								<ChevronLeft className="w-4 h-4" />
								Previous
							</Button>

							<div className="flex gap-2 order-1 sm:order-2">
								<Button variant="outline" onClick={onClose} disabled={loading} className="flex-1 sm:flex-none">
									Cancel
								</Button>
								{isLastTab ? (
									<Button
										onClick={handleSubmit}
										disabled={loading}
										className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white flex-1 sm:flex-none"
									>
										{loading ? (
											<>
												<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
												Saving...
											</>
										) : (
											<>
												<Save className="w-4 h-4 mr-2" />
												Save Changes
											</>
										)}
									</Button>
								) : (
									<Button
										onClick={handleNext}
										disabled={loading}
										className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
									>
										Next
										<ChevronRight className="w-4 h-4 ml-2" />
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
