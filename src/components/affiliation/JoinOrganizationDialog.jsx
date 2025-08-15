"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, User, FileText, ArrowRight, ArrowLeft, Send } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import Image from "next/image"

export default function JoinOrganizationDialog({ isOpen, onClose, organization }) {
	const [formData, setFormData] = useState({
		requestedRole: "",
		requestedDepartment: "",
		coverLetter: "",
		expectedSalary: "",
		workType: "full-time",
		employeeType: "new", // new or existing
		actualStartDate: ""
	})
	const [loading, setLoading] = useState(false)
	const [step, setStep] = useState(1)

	const handleSubmit = async () => {
		try {
			setLoading(true)

			await axios.post("/api/affiliation", {
				organizationId: organization._id,
				...formData
			})

			toast.success("Application submitted successfully!")
			onClose()
			setFormData({
				requestedRole: "",
				requestedDepartment: "",
				coverLetter: "",
				expectedSalary: "",
				workType: "full-time",
				employeeType: "new",
				actualStartDate: ""
			})
			setStep(1)
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to submit application")
		} finally {
			setLoading(false)
		}
	}

	const nextStep = () => setStep(step + 1)
	const prevStep = () => setStep(step - 1)

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-green-200">
				<DialogHeader className="pb-6">
					<div className="text-center">
						<DialogTitle className="text-3xl font-bold text-gray-900 mb-2">Join Our Team</DialogTitle>
						<p className="text-gray-600">Apply to become part of {organization?.name}</p>
					</div>
				</DialogHeader>

				{/* Organization Info */}
				<Card className="mb-8 bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
					<CardContent className="p-6">
						<div className="flex items-center gap-6">
							<div className="w-20 h-20 rounded-2xl overflow-hidden bg-green-50 border-2 border-green-200 shadow-sm">
								{organization?.profilePic ? (
									<Image
										src={organization.profilePic}
										alt={organization.name}
										width={80}
										height={80}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<Building2 className="w-10 h-10 text-green-400" />
									</div>
								)}
							</div>
							<div>
								<h3 className="font-bold text-2xl text-gray-900 mb-2">{organization?.name}</h3>
								<Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 font-medium">
									{organization?.facilityType?.replace("_", " ")}
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Progress Indicator */}
				<div className="flex items-center justify-center mb-8">
					<div className="flex items-center gap-4">
						<div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
							step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
						}`}>
							1
						</div>
						<div className={`w-16 h-1 rounded-full ${
							step >= 2 ? 'bg-green-500' : 'bg-gray-200'
						}`}></div>
						<div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
							step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
						}`}>
							2
						</div>
					</div>
				</div>

				{/* Step 1: Position Details */}
				{step === 1 && (
					<Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg">
						<CardContent className="p-8">
							<div className="flex items-center gap-3 mb-8">
								<div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
									<User className="w-6 h-6 text-green-600" />
								</div>
								<div>
									<h3 className="text-2xl font-bold text-gray-900">Position Details</h3>
									<p className="text-gray-600">{"Tell us about the role you're interested in"}</p>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Employee Type */}
								<div className="md:col-span-2">
									<Label className="text-sm font-semibold text-green-700 mb-3 block">Employee Status *</Label>
									<Select value={formData.employeeType} onValueChange={(value) => setFormData({ ...formData, employeeType: value, actualStartDate: "" })}>
										<SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-200 rounded-xl h-14 bg-green-50/50">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="new">New Employee - Starting Fresh</SelectItem>
											<SelectItem value="existing">Existing Employee - Already Working Here</SelectItem>
										</SelectContent>
									</Select>
									{formData.employeeType === "existing" && (
										<p className="text-sm text-blue-600 mt-2 bg-blue-50 p-3 rounded-lg">
											{"💡 You're already working here but joining the system officially"}
										</p>
									)}
								</div>

								{/* Actual Start Date for Existing Employees */}
								{formData.employeeType === "existing" && (
									<div className="md:col-span-2">
										<Label htmlFor="actualStartDate" className="text-sm font-semibold text-green-700 mb-3 block">
											When did you actually start working here? *
										</Label>
										<Input
											id="actualStartDate"
											type="date"
											value={formData.actualStartDate}
											onChange={(e) => setFormData({ ...formData, actualStartDate: e.target.value })}
											className="border-green-200 focus:border-green-400 focus:ring-green-200 rounded-xl h-14 bg-green-50/50"
											max={new Date().toISOString().split('T')[0]}
										/>
										<p className="text-sm text-gray-500 mt-2">
											This will be used as your official start date in the system
										</p>
									</div>
								)}

								<div className="md:col-span-2">
									<Label htmlFor="role" className="text-sm font-semibold text-green-700 mb-3 block">Requested Role *</Label>
									<Input
										id="role"
										value={formData.requestedRole}
										onChange={(e) => setFormData({ ...formData, requestedRole: e.target.value })}
										placeholder="e.g., Doctor, Nurse, Medical Technician"
										className="border-green-200 focus:border-green-400 focus:ring-green-200 rounded-xl h-14 text-lg bg-green-50/50"
									/>
								</div>

								<div>
									<Label htmlFor="department" className="text-sm font-semibold text-green-700 mb-3 block">Department</Label>
									<Select value={formData.requestedDepartment} onValueChange={(value) => setFormData({ ...formData, requestedDepartment: value })}>
										<SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-200 rounded-xl h-14 bg-green-50/50">
											<SelectValue placeholder="Select department" />
										</SelectTrigger>
										<SelectContent>
											{organization?.departments?.map((dept, index) => (
												<SelectItem key={index} value={dept.name}>{dept.name}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor="workType" className="text-sm font-semibold text-green-700 mb-3 block">Work Type</Label>
									<Select value={formData.workType} onValueChange={(value) => setFormData({ ...formData, workType: value })}>
										<SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-200 rounded-xl h-14 bg-green-50/50">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="full-time">Full Time</SelectItem>
											<SelectItem value="part-time">Part Time</SelectItem>
											<SelectItem value="contract">Contract</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="md:col-span-2">
									<Label htmlFor="salary" className="text-sm font-semibold text-green-700 mb-3 block">Expected Salary (Optional)</Label>
									<Input
										id="salary"
										type="number"
										value={formData.expectedSalary}
										onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
										placeholder="Enter expected salary amount"
										className="border-green-200 focus:border-green-400 focus:ring-green-200 rounded-xl h-14 bg-green-50/50"
									/>
								</div>
							</div>

							<div className="flex justify-end pt-8">
								<Button
									onClick={nextStep}
									disabled={!formData.requestedRole || (formData.employeeType === "existing" && !formData.actualStartDate)}
									className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
								>
									Next Step
									<ArrowRight className="w-5 h-5 ml-2" />
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Step 2: Cover Letter */}
				{step === 2 && (
					<Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg">
						<CardContent className="p-8">
							<div className="flex items-center gap-3 mb-8">
								<div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
									<FileText className="w-6 h-6 text-green-600" />
								</div>
								<div>
									<h3 className="text-2xl font-bold text-gray-900">Cover Letter</h3>
									<p className="text-gray-600">Tell us why you want to join our team</p>
								</div>
							</div>

							<div>
								<Label htmlFor="coverLetter" className="text-sm font-semibold text-green-700 mb-3 block">
									Why do you want to join this organization? *
								</Label>
								<Textarea
									id="coverLetter"
									value={formData.coverLetter}
									onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
									placeholder="Share your motivation, relevant experience, and what unique value you can bring to our organization. Tell us about your passion for healthcare and how you align with our mission..."
									rows={10}
									className="border-green-200 focus:border-green-400 focus:ring-green-200 rounded-xl resize-none bg-green-50/50 text-base leading-relaxed"
								/>
								<p className="text-sm text-gray-500 mt-2">
									{formData.coverLetter.length}/500 characters
								</p>
							</div>

							<div className="flex flex-col sm:flex-row justify-between gap-4 pt-8">
								<Button
									variant="outline"
									onClick={prevStep}
									className="border-green-300 text-green-700 hover:bg-green-50 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
								>
									<ArrowLeft className="w-5 h-5 mr-2" />
									Back
								</Button>
								<Button
									onClick={handleSubmit}
									disabled={!formData.coverLetter || loading}
									className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
								>
									{loading ? (
										<>Submitting...</>
									) : (
										<>
											<Send className="w-5 h-5 mr-2" />
											Submit Application
										</>
									)}
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</DialogContent>
		</Dialog>
	)
}