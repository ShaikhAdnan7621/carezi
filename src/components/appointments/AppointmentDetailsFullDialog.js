'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, Building2, Phone, Mail, MapPin, FileText, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const getStatusConfig = (status) => {
	switch (status) {
		case 'requested':
			return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertCircle };
		case 'approved':
			return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 };
		case 'completed':
			return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2 };
		case 'cancelled':
			return { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle };
		default:
			return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle };
	}
};

export default function AppointmentDetailsFullDialog({ isOpen, onClose, appointment, onReview }) {
	if (!appointment) return null;

	const statusConfig = getStatusConfig(appointment.status);
	const StatusIcon = statusConfig.icon;

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const formatTime = (date) => {
		return new Date(date).toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-3">
						<Calendar className="h-6 w-6 text-green-600" />
						Appointment Details
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Status and Basic Info */}
					<Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<Badge className={`px-3 py-1 border ${statusConfig.color}`}>
									<StatusIcon className="h-4 w-4 mr-2" />
									{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
								</Badge>
								<div className="text-sm text-gray-600">
									ID: {appointment._id?.slice(-8) || 'N/A'}
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<Calendar className="h-5 w-5 text-green-600" />
										<div>
											<p className="font-semibold text-gray-900">{formatDate(appointment.appointmentDate)}</p>
											<p className="text-sm text-gray-600">Appointment Date</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Clock className="h-5 w-5 text-green-600" />
										<div>
											<p className="font-semibold text-gray-900">{formatTime(appointment.appointmentDate)}</p>
											<p className="text-sm text-gray-600">Time</p>
										</div>
									</div>
								</div>

								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<FileText className="h-5 w-5 text-green-600" />
										<div>
											<p className="font-semibold text-gray-900">{appointment.appointmentType || 'General Consultation'}</p>
											<p className="text-sm text-gray-600">Appointment Type</p>
										</div>
									</div>
									{appointment.duration && (
										<div className="flex items-center gap-3">
											<Clock className="h-5 w-5 text-green-600" />
											<div>
												<p className="font-semibold text-gray-900">{appointment.duration} minutes</p>
												<p className="text-sm text-gray-600">Duration</p>
											</div>
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Professional Information */}
					{appointment.professionalId && (
						<Card className="border-0 shadow-sm">
							<CardContent className="p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
									<User className="h-5 w-5 text-green-600" />
									Professional Information
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-3">
										<div>
											<p className="font-semibold text-gray-900">
												{appointment.professionalId.firstName} {appointment.professionalId.lastName}
											</p>
											<p className="text-sm text-gray-600">Full Name</p>
										</div>
										{appointment.professionalId.specialization && (
											<div>
												<p className="font-semibold text-gray-900">{appointment.professionalId.specialization}</p>
												<p className="text-sm text-gray-600">Specialization</p>
											</div>
										)}
										{appointment.professionalId.licenseNumber && (
											<div>
												<p className="font-semibold text-gray-900">{appointment.professionalId.licenseNumber}</p>
												<p className="text-sm text-gray-600">License Number</p>
											</div>
										)}
									</div>
									<div className="space-y-3">
										{appointment.professionalId.email && (
											<div className="flex items-center gap-3">
												<Mail className="h-4 w-4 text-green-600" />
												<div>
													<p className="font-semibold text-gray-900">{appointment.professionalId.email}</p>
													<p className="text-sm text-gray-600">Email</p>
												</div>
											</div>
										)}
										{appointment.professionalId.phone && (
											<div className="flex items-center gap-3">
												<Phone className="h-4 w-4 text-green-600" />
												<div>
													<p className="font-semibold text-gray-900">{appointment.professionalId.phone}</p>
													<p className="text-sm text-gray-600">Phone</p>
												</div>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Organization Information */}
					{appointment.organizationId && (
						<Card className="border-0 shadow-sm">
							<CardContent className="p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
									<Building2 className="h-5 w-5 text-green-600" />
									Organization Information
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-3">
										<div>
											<p className="font-semibold text-gray-900">{appointment.organizationId.name}</p>
											<p className="text-sm text-gray-600">Organization Name</p>
										</div>
										{appointment.organizationId.type && (
											<div>
												<p className="font-semibold text-gray-900">{appointment.organizationId.type}</p>
												<p className="text-sm text-gray-600">Type</p>
											</div>
										)}
									</div>
									<div className="space-y-3">
										{appointment.organizationId.email && (
											<div className="flex items-center gap-3">
												<Mail className="h-4 w-4 text-green-600" />
												<div>
													<p className="font-semibold text-gray-900">{appointment.organizationId.email}</p>
													<p className="text-sm text-gray-600">Email</p>
												</div>
											</div>
										)}
										{appointment.organizationId.phone && (
											<div className="flex items-center gap-3">
												<Phone className="h-4 w-4 text-green-600" />
												<div>
													<p className="font-semibold text-gray-900">{appointment.organizationId.phone}</p>
													<p className="text-sm text-gray-600">Phone</p>
												</div>
											</div>
										)}
									</div>
								</div>
								{appointment.organizationId.address && (
									<div className="mt-4 pt-4 border-t border-gray-100">
										<div className="flex items-start gap-3">
											<MapPin className="h-4 w-4 text-green-600 mt-1" />
											<div>
												<p className="font-semibold text-gray-900">{appointment.organizationId.address}</p>
												<p className="text-sm text-gray-600">Address</p>
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					{/* Appointment Details */}
					{(appointment.reason || appointment.notes || appointment.symptoms) && (
						<Card className="border-0 shadow-sm">
							<CardContent className="p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
									<FileText className="h-5 w-5 text-green-600" />
									Appointment Details
								</h3>
								<div className="space-y-4">
									{appointment.reason && (
										<div>
											<p className="font-semibold text-gray-900 mb-2">Reason for Visit</p>
											<p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{appointment.reason}</p>
										</div>
									)}
									{appointment.symptoms && (
										<div>
											<p className="font-semibold text-gray-900 mb-2">Symptoms</p>
											<p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{appointment.symptoms}</p>
										</div>
									)}
									{appointment.notes && (
										<div>
											<p className="font-semibold text-gray-900 mb-2">Additional Notes</p>
											<p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{appointment.notes}</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Timestamps */}
					<Card className="border-0 shadow-sm bg-gray-50">
						<CardContent className="p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-gray-600">Created</p>
									<p className="font-semibold text-gray-900">
										{new Date(appointment.createdAt).toLocaleString()}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-600">Last Updated</p>
									<p className="font-semibold text-gray-900">
										{new Date(appointment.updatedAt).toLocaleString()}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Actions */}
					<div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
						{appointment.status === 'requested' && onReview && (
							<Button 
								onClick={() => onReview(appointment)}
								className="bg-green-600 hover:bg-green-700"
							>
								Review Appointment
							</Button>
						)}
						<Button variant="outline" onClick={onClose}>
							Close
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}