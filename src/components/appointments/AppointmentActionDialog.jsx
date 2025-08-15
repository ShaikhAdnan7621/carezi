'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  MessageSquare,
  Plus,
  Trash2,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  FileText,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const ACTION_CONFIG = {
  approve: {
    label: 'Approve',
    icon: CheckCircle,
    color: 'bg-emerald-600 hover:bg-emerald-700',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    description: 'Confirm this appointment and notify patient'
  },
  reject: {
    label: 'Reject',
    icon: XCircle,
    color: 'bg-red-600 hover:bg-red-700',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    description: 'Decline appointment with reason'
  },
  reschedule: {
    label: 'Reschedule',
    icon: RotateCcw,
    color: 'bg-amber-600 hover:bg-amber-700',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    description: 'Suggest alternative appointment times'
  }
};

const URGENCY_CONFIG = {
  emergency: { color: 'text-red-600', bg: 'bg-red-50', icon: '🚨', label: 'Emergency' },
  urgent: { color: 'text-orange-600', bg: 'bg-orange-50', icon: '⚡', label: 'Urgent' },
  routine: { color: 'text-gray-600', bg: 'bg-gray-50', icon: '📅', label: 'Routine' }
};

export default function AppointmentActionDialog({ 
  isOpen, 
  onClose, 
  appointment, 
  onSuccess 
}) {
  const [action, setAction] = useState(null);
  const [professionalNotes, setProfessionalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [suggestedTimes, setSuggestedTimes] = useState([{ date: '', time: '' }]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (action === 'reject' && !rejectionReason.trim()) {
      newErrors.rejectionReason = 'Rejection reason is required';
    }

    if (action === 'reschedule') {
      const validTimes = suggestedTimes.filter(t => t.date && t.time);
      if (validTimes.length === 0) {
        newErrors.suggestedTimes = 'At least one alternative time is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    
    try {
      await axios.put(`/api/appointments/${appointment._id}/review`, {
        action,
        professionalNotes: professionalNotes.trim(),
        rejectionReason: action === 'reject' ? rejectionReason.trim() : undefined,
        suggestedTimes: action === 'reschedule' ? 
          suggestedTimes.filter(t => t.date && t.time) : undefined
      });

      toast.success(`Appointment ${action}d successfully`);
      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update appointment';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addSuggestedTime = () => {
    setSuggestedTimes([...suggestedTimes, { date: '', time: '' }]);
  };

  const removeSuggestedTime = (index) => {
    if (suggestedTimes.length > 1) {
      setSuggestedTimes(suggestedTimes.filter((_, i) => i !== index));
    }
  };

  const updateSuggestedTime = (index, field, value) => {
    const newTimes = [...suggestedTimes];
    newTimes[index][field] = value;
    setSuggestedTimes(newTimes);
    
    if (errors.suggestedTimes) {
      setErrors(prev => ({ ...prev, suggestedTimes: '' }));
    }
  };

  const resetForm = () => {
    setAction(null);
    setProfessionalNotes('');
    setRejectionReason('');
    setSuggestedTimes([{ date: '', time: '' }]);
    setErrors({});
  };

  const urgencyConfig = URGENCY_CONFIG[appointment.urgencyLevel] || URGENCY_CONFIG.routine;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-full">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            Review Appointment Request
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Patient & Appointment Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Patient Info */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <User className="h-5 w-5 text-gray-600" />
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

            {/* Appointment Details */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Appointment Details</h3>
                    <p className="text-sm text-gray-600">Requested schedule</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-blue-700">Requested date</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">{appointment.appointmentTime}</p>
                      <p className="text-sm text-blue-700">Preferred time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reason & Priority */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-full">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Appointment Reason & Priority</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Reason for Visit</Label>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{appointment.reason}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Priority Level</Label>
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${urgencyConfig.bg}`}>
                    <span className="text-lg">{urgencyConfig.icon}</span>
                    <span className={`font-semibold ${urgencyConfig.color}`}>
                      {urgencyConfig.label.toUpperCase()}
                    </span>
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
                  <div className="p-2 bg-blue-100 rounded-full">
                    <MapPin className="h-5 w-5 text-blue-600" />
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
                </div>
              </CardContent>
            </Card>
          )}

          {/* Patient Notes */}
          {appointment.patientNotes && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <MessageSquare className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Additional Notes from Patient</h3>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-amber-900">{appointment.patientNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Action Selection */}
          {!action && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How would you like to respond?</h3>
                <p className="text-gray-600">Choose an action to proceed with this appointment request</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(ACTION_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <Card 
                      key={key}
                      className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => setAction(key)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`p-4 rounded-full w-16 h-16 mx-auto mb-4 ${config.bgColor} group-hover:scale-110 transition-transform`}>
                          <Icon className={`h-8 w-8 ${config.textColor}`} />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{config.label}</h4>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Form */}
          {action && (
            <Card className={`border-0 shadow-sm ${ACTION_CONFIG[action].bgColor}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${ACTION_CONFIG[action].bgColor}`}>
                      {React.createElement(ACTION_CONFIG[action].icon, { 
                        className: `h-5 w-5 ${ACTION_CONFIG[action].textColor}` 
                      })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {ACTION_CONFIG[action].label} Appointment
                      </h3>
                      <p className="text-sm text-gray-600">{ACTION_CONFIG[action].description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    ← Back
                  </Button>
                </div>

                <div className="space-y-6">

                  {/* Professional Notes */}
                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                      Professional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={professionalNotes}
                      onChange={(e) => setProfessionalNotes(e.target.value)}
                      placeholder="Add any notes about this appointment..."
                      rows={4}
                      maxLength={500}
                      className="resize-none"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>These notes will be visible to the patient</span>
                      <span>{professionalNotes.length}/500</span>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {action === 'reject' && (
                    <div className="space-y-3">
                      <Label htmlFor="rejection" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        Rejection Reason
                        <Badge variant="destructive" className="text-xs px-2 py-0.5">Required</Badge>
                      </Label>
                      <Textarea
                        id="rejection"
                        value={rejectionReason}
                        onChange={(e) => {
                          setRejectionReason(e.target.value);
                          if (errors.rejectionReason) {
                            setErrors(prev => ({ ...prev, rejectionReason: '' }));
                          }
                        }}
                        placeholder="Please provide a clear reason for declining this appointment..."
                        rows={4}
                        className={`resize-none ${errors.rejectionReason ? 'border-red-300 focus:border-red-500' : ''}`}
                        maxLength={300}
                      />
                      {errors.rejectionReason && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <p className="text-sm text-red-700">{errors.rejectionReason}</p>
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>This reason will be shared with the patient</span>
                        <span>{rejectionReason.length}/300</span>
                      </div>
                    </div>
                  )}

                  {/* Suggested Times */}
                  {action === 'reschedule' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          Alternative Times
                          <Badge variant="destructive" className="text-xs px-2 py-0.5">At least 1 required</Badge>
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSuggestedTime}
                          className="flex items-center gap-2 hover:bg-amber-50"
                        >
                          <Plus className="h-4 w-4" />
                          Add Time Slot
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {suggestedTimes.map((time, index) => (
                          <Card key={index} className="border border-amber-200 bg-amber-50/50">
                            <CardContent className="p-4">
                              <div className="flex gap-3 items-center">
                                <div className="flex-1">
                                  <Label className="text-xs text-gray-600 mb-1 block">Date</Label>
                                  <Input
                                    type="date"
                                    value={time.date}
                                    onChange={(e) => updateSuggestedTime(index, 'date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="bg-white"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Label className="text-xs text-gray-600 mb-1 block">Time</Label>
                                  <Input
                                    type="time"
                                    value={time.time}
                                    onChange={(e) => updateSuggestedTime(index, 'time', e.target.value)}
                                    className="bg-white"
                                  />
                                </div>
                                {suggestedTimes.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSuggestedTime(index)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-100 mt-5"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {errors.suggestedTimes && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <p className="text-sm text-red-700">{errors.suggestedTimes}</p>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <Zap className="h-4 w-4 inline mr-1" />
                        The patient will be notified of these alternative times and can choose their preferred slot.
                      </div>
                    </div>
                  )}

                  {/* Submit Actions */}
                  <div className="flex gap-3 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="flex-1"
                      disabled={loading}
                    >
                      ← Back to Actions
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`flex-1 ${ACTION_CONFIG[action].color}`}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {React.createElement(ACTION_CONFIG[action].icon, { className: "h-4 w-4" })}
                          {ACTION_CONFIG[action].label} Appointment
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
