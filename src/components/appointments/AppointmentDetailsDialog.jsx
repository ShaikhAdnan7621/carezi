'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Stethoscope
} from 'lucide-react';

const STATUS_CONFIG = {
  requested: { 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    label: 'Pending Review', 
    icon: Clock,
    description: 'Waiting for professional approval'
  },
  approved: { 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
    label: 'Approved', 
    icon: CheckCircle,
    description: 'Appointment confirmed'
  },
  rejected: { 
    color: 'bg-red-50 text-red-700 border-red-200', 
    label: 'Rejected', 
    icon: XCircle,
    description: 'Appointment declined'
  },
  completed: { 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    label: 'Completed', 
    icon: CheckCircle,
    description: 'Appointment finished'
  },
  cancelled: { 
    color: 'bg-gray-50 text-gray-700 border-gray-200', 
    label: 'Cancelled', 
    icon: XCircle,
    description: 'Appointment cancelled'
  },
  rescheduled: { 
    color: 'bg-purple-50 text-purple-700 border-purple-200', 
    label: 'Rescheduled', 
    icon: RotateCcw,
    description: 'New time suggested'
  }
};

const URGENCY_CONFIG = {
  emergency: { color: 'text-red-600', bg: 'bg-red-50', icon: '🚨', label: 'Emergency' },
  urgent: { color: 'text-orange-600', bg: 'bg-orange-50', icon: '⚡', label: 'Urgent' },
  routine: { color: 'text-gray-600', bg: 'bg-gray-50', icon: '📅', label: 'Routine' }
};

export default function AppointmentDetailsDialog({ 
  isOpen, 
  onClose, 
  appointment,
  onReview
}) {
  if (!appointment) return null;

  const statusConfig = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.requested;
  const urgencyConfig = URGENCY_CONFIG[appointment.urgencyLevel] || URGENCY_CONFIG.routine;
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-emerald-100 rounded-full">
              <Calendar className="h-5 w-5 text-emerald-600" />
            </div>
            Appointment Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status & Priority Header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={`border ${statusConfig.color} flex items-center gap-2 px-3 py-2`}>
                <StatusIcon className="h-4 w-4" />
                {statusConfig.label}
              </Badge>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${urgencyConfig.bg}`}>
                <span className="text-lg">{urgencyConfig.icon}</span>
                <span className={`font-semibold ${urgencyConfig.color}`}>
                  {urgencyConfig.label}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              ID: {appointment._id?.slice(-8)}
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Patient Information */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Patient Information</h3>
                    <p className="text-sm text-gray-600">Appointment requester</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-gray-900">{appointment.patientId?.name || 'N/A'}</p>
                  </div>
                  {appointment.patientId?.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{appointment.patientId.email}</span>
                    </div>
                  )}
                  {appointment.patientId?.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{appointment.patientId.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Stethoscope className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Professional Information</h3>
                    <p className="text-sm text-gray-600">Healthcare provider</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-gray-900">{appointment.professionalId?.userId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Profession</p>
                    <p className="text-gray-900">{appointment.professionalId?.professionType || 'N/A'}</p>
                  </div>
                  {appointment.professionalId?.department && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Department</p>
                      <p className="text-gray-900">{appointment.professionalId.department}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointment Details */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-full">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Appointment Schedule</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-emerald-900">
                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-emerald-700">Appointment date</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{appointment.appointmentTime}</p>
                    <p className="text-sm text-blue-700">Scheduled time</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{appointment.duration || 30} minutes</p>
                    <p className="text-sm text-gray-700">Duration</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Details */}
          {appointment.type === 'through_organization' && appointment.organizationDetails && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Organization Details</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Organization</p>
                    <p className="text-gray-900">{appointment.organizationDetails.name}</p>
                  </div>
                  {appointment.organizationDetails.department && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Department</p>
                      <p className="text-gray-900">{appointment.organizationDetails.department}</p>
                    </div>
                  )}
                  {appointment.organizationDetails.facilityType && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Facility Type</p>
                      <p className="text-gray-900">{appointment.organizationDetails.facilityType}</p>
                    </div>
                  )}
                  {appointment.organizationDetails.contactPhone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{appointment.organizationDetails.contactPhone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reason & Notes */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-full">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Appointment Details</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Reason for Visit</p>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{appointment.reason}</p>
                  </div>
                </div>

                {appointment.patientNotes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Patient Notes</p>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-900">{appointment.patientNotes}</p>
                    </div>
                  </div>
                )}

                {appointment.professionalNotes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Professional Notes</p>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-900">{appointment.professionalNotes}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rejection/Reschedule Details */}
          {appointment.status === 'rejected' && appointment.rejectionReason && (
            <Card className="border-0 shadow-sm bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-red-900">Rejection Details</h3>
                </div>
                <div className="p-4 bg-red-100 rounded-lg border border-red-200">
                  <p className="text-red-900">{appointment.rejectionReason}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {appointment.suggestedTimes?.length > 0 && (
            <Card className="border-0 shadow-sm bg-amber-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <RotateCcw className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-amber-900">Suggested Alternative Times</h3>
                </div>
                <div className="grid gap-3">
                  {appointment.suggestedTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-amber-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-amber-600" />
                      <span className="text-amber-900">
                        {new Date(time.date).toLocaleDateString()} at {time.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {appointment.status === 'requested' && onReview && (
              <Button 
                onClick={() => {
                  onReview(appointment);
                  onClose();
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Review Appointment
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}