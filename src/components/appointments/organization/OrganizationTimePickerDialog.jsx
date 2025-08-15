'use client';

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Building2, User, MessageSquare, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const URGENCY_OPTIONS = [
  { value: 'routine', label: 'Routine', color: 'bg-gray-100 text-gray-800', icon: '📅' },
  { value: 'urgent', label: 'Urgent', color: 'bg-orange-100 text-orange-800', icon: '⚡' },
  { value: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-800', icon: '🚨' }
];

export default function OrganizationTimePickerDialog({
  isOpen,
  onClose,
  selectedDate,
  organizationId,
  professionals = [],
  onSuccess
}) {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    patientNotes: '',
    urgencyLevel: 'routine'
  });
  const [errors, setErrors] = useState({});

  // Get unique departments
  const departments = useMemo(() => {
    const depts = [...new Set(professionals.map(p => p.department).filter(Boolean))];
    return depts.length > 0 ? depts : ['General'];
  }, [professionals]);

  // Filter professionals by department
  const filteredProfessionals = useMemo(() => {
    if (!selectedDepartment) return professionals;
    return professionals.filter(p => p.department === selectedDepartment || (!p.department && selectedDepartment === 'General'));
  }, [professionals, selectedDepartment]);

  // Get available times for selected professional and date
  const availableTimes = useMemo(() => {
    if (!selectedDate || !selectedProfessional || !availableSlots.length) return [];
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const slot = availableSlots.find(slot => slot.date.split('T')[0] === dateStr);
    const available = slot?.availableTimes || [];
    
    const booked = bookedSlots
      .filter(apt => new Date(apt.appointmentDate).toISOString().split('T')[0] === dateStr)
      .map(apt => apt.appointmentTime);
    
    return available.filter(time => !booked.includes(time));
  }, [selectedDate, selectedProfessional, availableSlots, bookedSlots]);

  // Fetch slots when professional is selected
  useEffect(() => {
    if (selectedProfessional && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedProfessional, selectedDate]);

  const fetchAvailableSlots = async () => {
    if (!selectedProfessional || !selectedDate) return;
    
    setLoading(true);
    try {
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1);

      const [slotsRes, appointmentsRes] = await Promise.all([
        axios.get(`/api/appointments/calendar/${selectedProfessional}`, {
          params: { 
            startDate: startDate.toISOString(), 
            endDate: endDate.toISOString() 
          }
        }),
        axios.get('/api/appointments', {
          params: { 
            professionalId: selectedProfessional,
            startDate: startDate.toISOString(), 
            endDate: endDate.toISOString() 
          }
        })
      ]);

      setAvailableSlots(slotsRes.data.availableSlots || []);
      setBookedSlots(appointmentsRes.data.appointments || []);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedDepartment) newErrors.department = 'Department is required';
    if (!selectedProfessional) newErrors.professional = 'Professional is required';
    if (!selectedTime) newErrors.time = 'Time is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('/api/appointments', {
        professionalId: selectedProfessional,
        organizationId,
        appointmentDate: selectedDate.toISOString(),
        appointmentTime: selectedTime,
        reason: formData.reason.trim(),
        patientNotes: formData.patientNotes.trim(),
        urgencyLevel: formData.urgencyLevel,
        department: selectedDepartment
      });

      toast.success('Appointment booked successfully');
      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDepartment('');
    setSelectedProfessional('');
    setSelectedTime('');
    setAvailableSlots([]);
    setBookedSlots([]);
    setFormData({ reason: '', patientNotes: '', urgencyLevel: 'routine' });
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const selectedProfessionalData = professionals.find(p => p._id === selectedProfessional);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            Book Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date Display */}
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-700">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">
                {selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Department Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Department
              <Badge variant="destructive" className="text-xs">Required</Badge>
            </Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className={errors.department ? 'border-red-300' : ''}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.department}
              </p>
            )}
          </div>

          {/* Professional Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Professional
              <Badge variant="destructive" className="text-xs">Required</Badge>
            </Label>
            <Select 
              value={selectedProfessional} 
              onValueChange={setSelectedProfessional}
              disabled={!selectedDepartment}
            >
              <SelectTrigger className={errors.professional ? 'border-red-300' : ''}>
                <SelectValue placeholder="Select professional" />
              </SelectTrigger>
              <SelectContent>
                {filteredProfessionals.map(prof => (
                  <SelectItem key={prof._id} value={prof._id}>
                    <div className="flex items-center gap-2">
                      <span>{prof.userId?.name}</span>
                      <Badge variant="outline" className="text-xs">{prof.professionType}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.professional && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.professional}
              </p>
            )}
          </div>

          {/* Time Selection */}
          {selectedProfessional && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Available Times
                <Badge variant="destructive" className="text-xs">Required</Badge>
              </Label>
              {loading ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-gray-600 mt-2">Loading times...</p>
                </div>
              ) : availableTimes.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map(time => (
                    <Button
                      key={time}
                      variant="outline"
                      size="sm"
                      className={`${
                        selectedTime === time 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'hover:bg-emerald-50'
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No available times</p>
                </div>
              )}
              {errors.time && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.time}
                </p>
              )}
            </div>
          )}

          {/* Selected Professional Info */}
          {selectedProfessionalData && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-600" />
                <span className="font-medium">{selectedProfessionalData.userId?.name}</span>
                <Badge variant="outline" className="text-xs">{selectedProfessionalData.professionType}</Badge>
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reason
              <Badge variant="destructive" className="text-xs">Required</Badge>
            </Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              placeholder="Brief description..."
              className={errors.reason ? 'border-red-300' : ''}
              maxLength={200}
            />
            {errors.reason && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.reason}
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority Level</Label>
            <Select value={formData.urgencyLevel} onValueChange={(value) => handleChange('urgencyLevel', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {URGENCY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.patientNotes}
              onChange={(e) => handleChange('patientNotes', e.target.value)}
              placeholder="Any additional information..."
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}