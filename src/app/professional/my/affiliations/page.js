"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Building2, Calendar, LogOut, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import Image from "next/image"
import Loading from "@/components/ui/loading"

export default function MyAffiliations() {
	const [affiliations, setAffiliations] = useState([])
	const [loading, setLoading] = useState(true)
	const [selectedAffiliation, setSelectedAffiliation] = useState(null)
	const [showEndDialog, setShowEndDialog] = useState(false)
	const [notes, setNotes] = useState("")
	const [actionLoading, setActionLoading] = useState(false)

	useEffect(() => {
		fetchAffiliations()
	}, [])

	const fetchAffiliations = async () => {
		try {
			// Fetch actual affiliations, not requests
			const res = await axios.get('/api/affiliation/manage?type=professional')
			setAffiliations(res.data.data || [])
		} catch (error) {
			console.error('Error fetching affiliations:', error)
			toast.error("Failed to fetch affiliations")
		} finally {
			setLoading(false)
		}
	}

	const handleEndAffiliation = async () => {
		try {
			setActionLoading(true)
			await axios.put('/api/affiliation/manage', {
				affiliationId: selectedAffiliation._id,
				action: 'end',
				notes
			})

			toast.success("Affiliation ended successfully")
			fetchAffiliations()
			setShowEndDialog(false)
			setNotes("")
			setSelectedAffiliation(null)
		} catch (error) {
			toast.error("Failed to end affiliation")
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

	if (loading) {
		return (
			<div className="text-center py-16">
				<div className="flex items-center justify-center gap-3 text-green-600 ">
					<span className="text-green-700 font-medium">Loading your affiliations</span>
					<Loading className="w-8 h-8" />
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50/30 to-emerald-50/30 py-6">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">My Affiliations</h1>
					<p className="text-gray-600">Manage your organization affiliations</p>
				</div>

				{affiliations.length === 0 ? (
					<Card className="bg-white/80 backdrop-blur-sm border-green-200">
						<CardContent className="text-center py-16">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Building2 className="w-8 h-8 text-green-500" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No Affiliations</h3>
							<p className="text-gray-600">{"You don't have any active affiliations yet."}</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-4">
						{affiliations.map((affiliation) => (
							<Card key={affiliation._id} className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300">
								<CardContent className="p-6">
									<div className="flex items-start gap-4 flex-col md:flex-row">
										<div className="w-16 h-16 rounded-xl overflow-hidden bg-green-50 border-2 border-green-200">
											{affiliation.organizationId?.profilePic ? (
												<Image
													src={affiliation.organizationId.profilePic}
													alt={affiliation.organizationId.name}
													width={64}
													height={64}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<Building2 className="w-8 h-8 text-green-400" />
												</div>
											)}
										</div>

										<div className="flex-1">
											<div className="flex items-start justify-between mb-3">
												<div>
													<h3 className="font-bold text-lg text-gray-900">{affiliation.organizationId?.name}</h3>
													<p className="text-green-600 font-medium">{affiliation.role || 'Professional'}</p>
													{affiliation.organizationId?.facilityType && (
														<p className="text-sm text-gray-500">{affiliation.organizationId.facilityType}</p>
													)}
												</div>
												<Badge className={`${getStatusColor(affiliation.status)} font-medium px-3 py-1`}>
													{affiliation.status?.charAt(0).toUpperCase() + affiliation.status?.slice(1) || 'Pending'}
												</Badge>
											</div>

											<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
												<div>
													<span className="text-sm text-gray-500">Start Date</span>
													<p className="font-medium">{new Date(affiliation.startDate).toLocaleDateString()}</p>
												</div>
												<div>
													<span className="text-sm text-gray-500">Employee Type</span>
													<p className="font-medium capitalize">{affiliation.employeeType || 'New Employee'}</p>
												</div>
												{affiliation.endDate && (
													<div>
														<span className="text-sm text-gray-500">End Date</span>
														<p className="font-medium">{new Date(affiliation.endDate).toLocaleDateString()}</p>
													</div>
												)}
												<div>
													<span className="text-sm text-gray-500">Status</span>
													<p className="font-medium capitalize">{affiliation.status || 'Active'}</p>
												</div>
											</div>

											{affiliation.notes && (
												<div className="mb-4 p-3 bg-gray-50 rounded-lg border">
													<p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
													<p className="text-sm text-gray-600">{affiliation.notes}</p>
												</div>
											)}

											{affiliation.status === 'active' && affiliation.isActive && (
												<div className="flex gap-2">
													<Button
														onClick={() => {
															setSelectedAffiliation(affiliation)
															setShowEndDialog(true)
														}}
														variant="outline"
														className="border-red-300 text-sm text-red-700 hover:bg-red-50  "
													>
														<LogOut className="mr-2 text-sm text-red-700" />
														<span className="text-red-700 text-sm">End Affiliation</span>
													</Button>
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>

			{/* End Affiliation Dialog */}
			<Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<AlertTriangle className="w-5 h-5 text-red-500" />
							End Affiliation
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<p className="text-gray-600">
							Are you sure you want to end your affiliation with <strong>{selectedAffiliation?.organizationId?.name}</strong>?
						</p>
						<div>
							<label className="text-sm font-medium text-gray-700 mb-2 block">
								Reason (optional)
							</label>
							<Textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Provide a reason for ending this affiliation..."
								rows={3}
							/>
						</div>
						<div className="flex gap-2">
							<Button
								onClick={() => setShowEndDialog(false)}
								variant="outline"
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
								onClick={handleEndAffiliation}
								disabled={actionLoading}
								className="flex-1 bg-red-600 hover:bg-red-700"
							>
								{actionLoading ? "Ending..." : "End Affiliation"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}