"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Calendar, UserX, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import Image from "next/image"
import Loading from "@/components/ui/loading"

export default function OrganizationStaff() {
	const [affiliations, setAffiliations] = useState([])
	const [loading, setLoading] = useState(true)
	const [selectedAffiliation, setSelectedAffiliation] = useState(null)
	const [showTerminateDialog, setShowTerminateDialog] = useState(false)
	const [notes, setNotes] = useState("")
	const [actionLoading, setActionLoading] = useState(false)

	useEffect(() => {
		fetchAffiliations()
	}, [])

	const fetchAffiliations = async () => {
		try {
			const res = await axios.get('/api/affiliation/manage?type=organization')
			const affiliationsData = res.data.data || []
			console.log('Fetched affiliations:', affiliationsData)
			setAffiliations(affiliationsData)
		} catch (error) {
			console.error('Error fetching affiliations:', error)
			toast.error("Failed to fetch staff")
		} finally {
			setLoading(false)
		}
	}

	const handleTerminateAffiliation = async () => {
		try {
			setActionLoading(true)
			await axios.put('/api/affiliation/manage', {
				affiliationId: selectedAffiliation._id,
				action: 'terminate',
				notes
			})

			toast.success("Staff member terminated successfully")
			fetchAffiliations()
			setShowTerminateDialog(false)
			setNotes("")
			setSelectedAffiliation(null)
		} catch (error) {
			toast.error("Failed to terminate staff member")
		} finally {
			setActionLoading(false)
		}
	}

	const getStatusColor = (status) => {
		switch (status) {
			case "active": return "bg-green-50 text-green-700 border-green-200"
			case "inactive": return "bg-gray-50 text-gray-700 border-gray-200"
			case "terminated": return "bg-red-50 text-red-700 border-red-200"
			default: return "bg-gray-50 text-gray-700 border-gray-200"
		}
	}

	const activeStaff = affiliations.filter(a => a.isActive === true && a.status === "active")
	const inactiveStaff = affiliations.filter(a => !a.isActive || a.status !== "active")

	if (loading) {
		return (
			<div className="text-center py-16">
				<div className="flex items-center justify-center gap-3 text-green-600 ">
					<span className="text-green-700 font-medium">Loading staff members</span>
					<Loading className="w-8 h-8" />
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50/30 to-emerald-50/30 py-6">
			<div className="max-w-6xl mx-auto space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
					<p className="text-gray-600">{"Manage your organization's staff affiliations"}</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-green-100">Active Staff</p>
									<p className="text-3xl font-bold">{activeStaff.length}</p>
								</div>
								<User className="w-8 h-8 text-green-100" />
							</div>
						</CardContent>
					</Card>
					<Card className="bg-gradient-to-r from-gray-500 to-slate-500 text-white">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-gray-100">Inactive Staff</p>
									<p className="text-3xl font-bold">{inactiveStaff.length}</p>
								</div>
								<UserX className="w-8 h-8 text-gray-100" />
							</div>
						</CardContent>
					</Card>
					<Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-blue-100">Total Staff</p>
									<p className="text-3xl font-bold">{affiliations.length}</p>
								</div>
								<User className="w-8 h-8 text-blue-100" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Active Staff */}

				<h1 className="text-green-800">Active Staff ({activeStaff.length})</h1>

				{activeStaff.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-500">No active staff members</p>
					</div>
				) : (
					<div className="space-y-4">
						{activeStaff.map((affiliation) => (
							<Card key={affiliation._id} className="border border-green-100">
								<CardContent className="p-4">
									<div className="flex items-start gap-4 flex-col md:flex-row">
										<div className="w-24   md:w-36   rounded-xl overflow-hidden bg-green-50 border border-green-200">
											{affiliation.professionalId?.userId?.profilePic ? (
												<Image
													src={affiliation.professionalId.userId.profilePic}
													alt={affiliation.professionalId.userId.name}
													width={48}
													height={48}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<User className="w-6 h-6 text-green-400" />
												</div>
											)}
										</div>

										<div className="flex-1">
											<div className="flex items-start justify-between mb-2">
												<div>
													<h4 className="font-semibold text-gray-900">
														{affiliation.professionalId?.userId?.name}
													</h4>
													<p className="text-green-600 font-medium">{affiliation.role}</p>
													{affiliation.department && (
														<p className="text-sm text-gray-500">{affiliation.department}</p>
													)}
												</div>
												<Badge className={`${getStatusColor(affiliation.status)} font-medium px-3 py-1`}>
													{affiliation.status}
												</Badge>
											</div>

											<div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-4 gap-4 mb-3">
												<div>
													<span className="text-xs text-gray-500">Email</span>
													<p className="text-sm font-medium">{affiliation.professionalId?.userId?.email}</p>
												</div>
												<div>
													<span className="text-xs text-gray-500">Start Date</span>
													<p className="text-sm font-medium">{new Date(affiliation.startDate).toLocaleDateString()}</p>
												</div>
												<div>
													<span className="text-xs text-gray-500">Duration</span>
													<p className="text-sm font-medium">
														{Math.ceil((new Date() - new Date(affiliation.startDate)) / (1000 * 60 * 60 * 24 * 30))} months
													</p>
												</div>
												<div className="flex justify-end">
													<Button
														onClick={() => {
															setSelectedAffiliation(affiliation)
															setShowTerminateDialog(true)
														}}
														size="sm"
														variant="outline"
														className="border-red-300 text-red-700 hover:bg-red-50"
													>
														<UserX className="w-4 h-4 mr-1" />
														Terminate
													</Button>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}


				{/* Inactive Staff */}
				{
					inactiveStaff.length > 0 && (
						<Card className="bg-white/80 backdrop-blur-sm border-gray-200">
							<CardHeader>
								<CardTitle className="text-gray-800">Past Staff ({inactiveStaff.length})</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{inactiveStaff.map((affiliation) => (
										<Card key={affiliation._id} className="border border-gray-100 opacity-75">
											<CardContent className="p-4">
												<div className="flex items-start gap-4">
													<div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
														{affiliation.professionalId?.userId?.profilePic ? (
															<Image
																src={affiliation.professionalId.userId.profilePic}
																alt={affiliation.professionalId.userId.name}
																width={48}
																height={48}
																className="w-full h-full object-cover"
															/>
														) : (
															<div className="w-full h-full flex items-center justify-center">
																<User className="w-6 h-6 text-gray-400" />
															</div>
														)}
													</div>

													<div className="flex-1">
														<div className="flex items-start justify-between mb-2">
															<div>
																<h4 className="font-semibold text-gray-700">
																	{affiliation.professionalId?.userId?.name}
																</h4>
																<p className="text-gray-500 font-medium">{affiliation.role}</p>
																{affiliation.department && (
																	<p className="text-sm text-gray-500">{affiliation.department}</p>
																)}
															</div>
															<Badge className={`${getStatusColor(affiliation.status)} font-medium px-3 py-1`}>
																{affiliation.status}
															</Badge>
														</div>

														<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
															<div>
																<span className="text-xs text-gray-500">Start Date</span>
																<p className="text-sm">{new Date(affiliation.startDate).toLocaleDateString()}</p>
															</div>
															<div>
																<span className="text-xs text-gray-500">End Date</span>
																<p className="text-sm">{new Date(affiliation.endDate).toLocaleDateString()}</p>
															</div>
															<div>
																<span className="text-xs text-gray-500">Duration</span>
																<p className="text-sm">
																	{Math.ceil((new Date(affiliation.endDate) - new Date(affiliation.startDate)) / (1000 * 60 * 60 * 24 * 30))} months
																</p>
															</div>
														</div>

														{affiliation.notes && (
															<div className="mt-3 p-2 bg-gray-50 rounded border">
																<p className="text-xs font-medium text-gray-600 mb-1">Notes:</p>
																<p className="text-xs text-gray-600">{affiliation.notes}</p>
															</div>
														)}
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>
					)
				}
			</div >

			{/* Terminate Dialog */}
			< Dialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog} >
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<AlertTriangle className="w-5 h-5 text-red-500" />
							Terminate Staff Member
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<p className="text-gray-600">
							Are you sure you want to terminate <strong>{selectedAffiliation?.professionalId?.userId?.name}</strong>?
						</p>
						<div>
							<label className="text-sm font-medium text-gray-700 mb-2 block">
								Reason (optional)
							</label>
							<Textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Provide a reason for termination..."
								rows={3}
							/>
						</div>
						<div className="flex gap-2">
							<Button
								onClick={() => setShowTerminateDialog(false)}
								variant="outline"
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
								onClick={handleTerminateAffiliation}
								disabled={actionLoading}
								className="flex-1 bg-red-600 hover:bg-red-700"
							>
								{actionLoading ? "Terminating..." : "Terminate"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog >
		</div >
	)
}