"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Phone, Mail, Globe, MapPin, Clock, Calendar, Stethoscope, Star, Users, ImageIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import JoinOrganizationDialog from "@/components/affiliation/JoinOrganizationDialog"
import Loading from "@/components/ui/loading"

export default function PublicOrganizationProfile() {
	const { id } = useParams()
	const [organization, setOrganization] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [showJoinDialog, setShowJoinDialog] = useState(false)

	useEffect(() => {
		if (!id) return
		const fetchOrganization = async () => {
			try {
				const res = await axios.get("/api/organization/get/findbyid", { params: { id } })
				setOrganization(res.data.data)
				setError(null)
			} catch (err) {
				setError(err.response?.data?.error || "Failed to fetch organization")
			} finally {
				setLoading(false)
			}
		}
		fetchOrganization()
	}, [id])

	if (loading) return (
		<div className="text-center py-16">
			<div className="flex items-center justify-center gap-3 text-green-600 ">
				<span className="text-green-700 font-medium">Loading Organization</span> 
				<Loading  className="w-8 h-8"/>
			</div>
		</div>
	)

	if (error || !organization) return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
			<Card className="max-w-md mx-4 shadow-xl border-0">
				<CardContent className="p-8 text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Building2 className="w-8 h-8 text-red-500" />
					</div>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">
						{error ? "Something went wrong" : "Organization not found"}
					</h2>
					<p className="text-gray-600">{error || "The requested organization could not be found."}</p>
				</CardContent>
			</Card>
		</div>
	)

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
				<div className="absolute inset-0 bg-black/10"></div>
				<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20 pointer-events-none z-0"></div>

				<div className="relative container mx-auto px-4 py-12">
					<div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
						<div className="relative group">
							<div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
								{organization?.profilePic ? (
									<Image
										src={organization.profilePic}
										alt={organization.name}
										width={128}
										height={128}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<Building2 className="w-16 h-16 text-white/80" />
									</div>
								)}
							</div>
							<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
								<Star className="w-4 h-4 text-white fill-current" />
							</div>
						</div>

						<div className="flex-1 text-center md:text-left">
							<h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
								{organization.name}
							</h1>
							<div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
								<Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-4 py-2 text-sm font-medium backdrop-blur-sm">
									{organization.facilityType?.replace("_", " ")}
								</Badge>
								<Badge className={`px-4 py-2 text-sm font-medium ${organization.status === 'approved'
									? 'bg-green-100 text-green-800 border-green-200'
									: 'bg-yellow-100 text-yellow-800 border-yellow-200'
									}`}>
									{organization.status}
								</Badge>
							</div>
							{organization?.summary?.headline && (
								<p className="text-green-100 text-lg leading-relaxed max-w-2xl">
									{organization.summary.headline}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-12 max-w-6xl">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* About Section */}
						{organization?.summary?.bio && (
							<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
								<CardHeader className="pb-4">
									<CardTitle className="text-2xl text-gray-800">About Us</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-700 leading-relaxed text-lg">{organization.summary.bio}</p>
								</CardContent>
							</Card>
						)}

						{/* Services Section */}
						{organization?.services?.length > 0 && (
							<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
								<CardHeader className="pb-6">
									<CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
										<div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
											<Stethoscope className="w-5 h-5 text-green-600" />
										</div>
										Our Services
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{organization.services.map((service, index) => (
											<div key={index} className="group p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
												<h3 className="font-semibold text-gray-800 mb-3 text-lg group-hover:text-green-700 transition-colors">
													{service.name}
												</h3>
												{service.description && (
													<p className="text-gray-600 leading-relaxed mb-3">{service.description}</p>
												)}
												{service.price && (
													<p className="text-green-600 font-semibold">${service.price}</p>
												)}
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Departments Section */}
						{organization?.departments?.length > 0 && (
							<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
								<CardHeader className="pb-6">
									<CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
										<div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
											<Users className="w-5 h-5 text-blue-600" />
										</div>
										Departments
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{organization.departments.map((department, index) => (
											<div key={index} className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-md transition-all duration-300">
												<h3 className="font-semibold text-blue-900 mb-3 text-lg">{department.name}</h3>
												<p className="text-blue-700 mb-4 leading-relaxed">{department.description}</p>
												{department.specialities?.length > 0 && (
													<div className="flex flex-wrap gap-2">
														{department.specialities.map((spec, idx) => (
															<Badge key={idx} className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
																{spec}
															</Badge>
														))}
													</div>
												)}
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Facilities Section */}
						{organization?.facilities?.length > 0 && (
							<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
								<CardHeader className="pb-6">
									<CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
										<div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
											<Building2 className="w-5 h-5 text-purple-600" />
										</div>
										Facilities
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{organization.facilities.map((facility, index) => (
											<div key={index} className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-md transition-all duration-300">
												<h3 className="font-semibold text-purple-900 mb-3 text-lg">{facility.name}</h3>
												<p className="text-purple-700 mb-4 leading-relaxed">{facility.description}</p>
												{facility.specialities?.length > 0 && (
													<div className="flex flex-wrap gap-2">
														{facility.specialities.map((spec, idx) => (
															<Badge key={idx} className="bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors">
																{spec}
															</Badge>
														))}
													</div>
												)}
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Amenities Section */}
						{organization?.amenities?.length > 0 && (
							<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
								<CardHeader className="pb-6">
									<CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
										<div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
											<Star className="w-5 h-5 text-orange-600" />
										</div>
										Amenities
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
										{organization.amenities.map((amenity, index) => (
											<div key={index} className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 text-center hover:shadow-md transition-all duration-300">
												<h3 className="font-medium text-orange-900 text-sm">{amenity.name}</h3>
												{amenity.description && (
													<p className="text-xs text-orange-700 mt-2">{amenity.description}</p>
												)}
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{organization?.departments?.length > 0 && (
							<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
								<CardHeader className="pb-6">
									<CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
										<div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
											<Users className="w-5 h-5 text-blue-600" />
										</div>
										Departments
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{organization.departments.map((department, index) => (
											<div key={index} className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-md transition-all duration-300">
												<h3 className="font-semibold text-blue-900 mb-3 text-lg">{department.name}</h3>
												<p className="text-blue-700 mb-4 leading-relaxed">{department.description}</p>
												{department.specialities?.length > 0 && (
													<div className="flex flex-wrap gap-2">
														{department.specialities.map((spec, idx) => (
															<Badge key={idx} className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
																{spec}
															</Badge>
														))}
													</div>
												)}
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}


						{/* Gallery Section */}
						{organization?.images?.length > 0 && (
							<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
								<CardHeader className="pb-6">
									<CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
										<div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
											<ImageIcon className="w-5 h-5 text-pink-600" />
										</div>
										Gallery
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
										{organization.images.slice(0, 6).map((image, index) => (
											<div key={index} className="relative aspect-square rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
												<Image
													src={image}
													alt={`Gallery image ${index + 1}`}
													fill
													className="object-cover"
												/>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Quick Actions */}
						<Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm sticky top-6">
							<CardContent className="p-6 space-y-3">
								<Link href={`/organizations/profile/${id}/appointments`}>
									<Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
										<Calendar className="w-5 h-5 mr-3" />
										Book Appointment
									</Button>
								</Link>
								<Button
									onClick={() => setShowJoinDialog(true)}
									className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
								>
									<Users className="w-5 h-5 mr-3" />
									Join Organization
								</Button>
							</CardContent>
						</Card>

						{/* Contact Information */}
						{organization?.contactDetails && (
							<Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
								<CardHeader className="pb-4">
									<CardTitle className="text-xl text-gray-800">Contact Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{organization.contactDetails.phone && (
										<div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
											<div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
												<Phone className="w-5 h-5 text-green-600" />
											</div>
											<span className="font-medium text-gray-700">{organization.contactDetails.phone}</span>
										</div>
									)}
									{organization.contactDetails.email && (
										<div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
											<div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
												<Mail className="w-5 h-5 text-blue-600" />
											</div>
											<span className="font-medium text-gray-700">{organization.contactDetails.email}</span>
										</div>
									)}
									{organization.contactDetails.website && (
										<div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
											<div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
												<Globe className="w-5 h-5 text-purple-600" />
											</div>
											<a href={organization.contactDetails.website} target="_blank" rel="noopener noreferrer" className="font-medium text-purple-600 hover:underline">
												Visit Website
											</a>
										</div>
									)}
									{organization.contactDetails.address && (
										<div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
											<div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mt-1">
												<MapPin className="w-5 h-5 text-orange-600" />
											</div>
											<div className="font-medium text-gray-700">
												{organization.contactDetails.address.street && <div>{organization.contactDetails.address.street}</div>}
												<div>{organization.contactDetails.address.city}, {organization.contactDetails.address.state}</div>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						)}

						{/* Operating Hours */}
						{organization?.availability?.length > 0 && (
							<Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-3 text-xl text-gray-800">
										<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
											<Clock className="w-4 h-4 text-green-600" />
										</div>
										Operating Hours
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{organization.availability.map((slot, index) => (
											<div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
												<span className="font-medium text-gray-700 capitalize">{slot.day}</span>
												<span className="text-green-600 font-semibold">{slot.startTime} - {slot.endTime}</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

					</div>
				</div>
			</div>

			{/* Join Dialog */}
			<JoinOrganizationDialog
				isOpen={showJoinDialog}
				onClose={() => setShowJoinDialog(false)}
				organization={organization}
			/>
		</div>
	)
}