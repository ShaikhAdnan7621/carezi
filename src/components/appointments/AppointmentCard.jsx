'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Building2, AlertTriangle, MessageSquare, CheckCircle } from 'lucide-react';

const STATUS_CONFIG = {
	approved: { color: 'bg-green-50 text-green-700 border-green-200', label: 'Approved', icon: CheckCircle },
	rejected: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Rejected', icon: AlertTriangle },
	completed: { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Completed', icon: CheckCircle },
	cancelled: { color: 'bg-gray-50 text-gray-700 border-gray-200', label: 'Cancelled', icon: AlertTriangle },
	rescheduled: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Rescheduled', icon: Clock },
	requested: { color: 'bg-orange-50 text-orange-700 border-orange-200', label: 'Pending', icon: Clock }
};

const URGENCY_CONFIG = {
	emergency: { color: 'text-red-600', bg: 'bg-red-50', label: 'Emergency' },
	urgent: { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Urgent' },
	routine: { color: 'text-gray-600', bg: 'bg-gray-50', label: 'Routine' }
};

export default function AppointmentCard({ appointment, onReview, onViewDetails, showActions = false }) {
	const statusConfig = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.requested;
	const urgencyConfig = URGENCY_CONFIG[appointment.urgencyLevel] || URGENCY_CONFIG.routine;
	const StatusIcon = statusConfig.icon;

	const formattedDate = useMemo(() => {
		return new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}, [appointment.appointmentDate]);

	return (
		<Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
			<CardContent className="p-4">
				{/* Header */}
				<div className="flex items-start justify-between mb-3">
					<div className="flex items-center gap-2 flex-1 min-w-0">
						<div className="p-1.5 bg-green-50 rounded-full flex-shrink-0">
							<User className="h-4 w-4 text-green-600" />
						</div>
						<div className="min-w-0 flex-1">
							<h3 className="font-semibold text-gray-900 truncate">{appointment.patientId?.name || 'Patient'}</h3>
							<div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
								<Clock className="h-3 w-3 flex-shrink-0" />
								<span>{appointment.appointmentTime}</span>
							</div>
						</div>
					</div>
					<Badge className={`border ${statusConfig.color} flex items-center gap-1 text-xs px-2 py-1 flex-shrink-0`}>
						<StatusIcon className="h-3 w-3" />
						{statusConfig.label}
					</Badge>
				</div>

				{/* Compact Info */}
				<div className="space-y-2">
					{/* Reason */}
					<div className="bg-gray-50 rounded-lg p-2">
						<p className="text-sm text-gray-900 line-clamp-2">{appointment.reason}</p>
					</div>

					{/* Additional Info Row */}
					<div className="flex items-center gap-3 text-xs text-gray-600">
						{/* Urgency */}
						{appointment.urgencyLevel !== 'routine' && (
							<div className={`flex items-center gap-1 px-2 py-1 rounded ${urgencyConfig.bg}`}>
								<span className={`font-medium ${urgencyConfig.color}`}>
									{urgencyConfig.label}
								</span>
							</div>
						)}

						{/* Organization */}
						{appointment.type === 'through_organization' && appointment.organizationDetails && (
							<div className="flex items-center gap-1">
								<Building2 className="h-3 w-3 text-blue-600" />
								<span className="text-blue-700 truncate max-w-[120px]">{appointment.organizationDetails.name}</span>
							</div>
						)}

						{/* Notes Indicator */}
						{(appointment.patientNotes || appointment.professionalNotes) && (
							<div className="flex items-center gap-1">
								<MessageSquare className="h-3 w-3 text-green-600" />
								<span className="text-green-700">Notes</span>
							</div>
						)}
					</div>

					{/* Rejection Reason */}
					{appointment.status === 'rejected' && appointment.rejectionReason && (
						<div className="bg-red-50 rounded-lg p-2 border border-red-200">
							<div className="flex items-center gap-1 mb-1">
								<AlertTriangle className="h-3 w-3 text-red-600" />
								<span className="text-xs font-medium text-red-700">Rejected</span>
							</div>
							<p className="text-xs text-red-800 line-clamp-2">{appointment.rejectionReason}</p>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="flex gap-2 pt-3 mt-3 border-t">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onViewDetails?.(appointment)}
						className="flex-1 h-8 text-xs"
					>
						View Details
					</Button>
					{showActions && appointment.status === 'requested' && (
						<Button
							size="sm"
							onClick={() => onReview?.(appointment)}
							className="bg-green-600 hover:bg-green-700 text-white flex-1 h-8 text-xs"
						>
							Review
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}