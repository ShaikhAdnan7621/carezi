'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, Building2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const URGENCY_OPTIONS = [
	{ value: 'routine', label: 'Routine', color: 'bg-gray-100 text-gray-800', icon: '📅' },
	{ value: 'urgent', label: 'Urgent', color: 'bg-orange-100 text-orange-800', icon: '⚡' },
	{ value: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-800', icon: '🚨' }
];

export default function ProfessionalTimePickerDialog({
	isOpen,
	onClose,
	selectedDate,
	professionalId,
	organizationId,
	availableSlots,
	bookedSlots,
	onSuccess
}) {
	const [selectedTime, setSelectedTime] = useState('');
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		reason: '',
		patientNotes: '',
		urgencyLevel: 'routine',
		department: ''
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const { availableTimes, bookedTimes, allTimeSlots } = useMemo(() => {
		if (!selectedDate) return { availableTimes: [], bookedTimes: [], allTimeSlots: [] };

		const dateStr = selectedDate.toISOString().split('T')[0];
		const slot = availableSlots.find(slot => slot.date.split('T')[0] === dateStr);
		
		const available = slot?.availableTimes || [];
		const booked = bookedSlots?.filter(apt => 
			new Date(apt.appointmentDate).toISOString().split('T')[0] === dateStr
		).map(apt => apt.appointmentTime) || [];

		const allTimes = [...new Set([...available, ...booked])].sort();

		return {
			availableTimes: available,
			bookedTimes: booked,
			allTimeSlots: allTimes
		};
	}, [selectedDate, availableSlots, bookedSlots]);

	const handleTimeSelect = (time) => {
		setSelectedTime(time);
		setShowForm(true);
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
		if (formData.reason.length > 200) newErrors.reason = 'Reason must be less than 200 characters';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setLoading(true);
		try {
			await axios.post('/api/appointments', {
				professionalId,
				organizationId: organizationId || null,
				appointmentDate: selectedDate.toISOString(),
				appointmentTime: selectedTime,
				reason: formData.reason.trim(),
				patientNotes: formData.patientNotes.trim(),
				urgencyLevel: formData.urgencyLevel,
				department: formData.department.trim()
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
		setSelectedTime('');
		setShowForm(false);
		setFormData({ reason: '', patientNotes: '', urgencyLevel: 'routine', department: '' });
		setErrors({});
		onClose();
	};

	const handleChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5 text-emerald-600" />
						{showForm ? 'Book Appointment' : 'Select Time'}
					</DialogTitle>
				</DialogHeader>

				{!showForm ? (
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

						{/* Time Slots */}
						<div className="space-y-3">
							<h3 className="font-medium text-gray-900">Time Slots</h3>
							{allTimeSlots.length > 0 ? (
								<div className="grid grid-cols-2 gap-2">
									{allTimeSlots.map(time => {
										const isBooked = bookedTimes.includes(time);
										const isAvailable = availableTimes.includes(time);
										return (
											<Button
												key={time}
												variant="outline"
												className={`justify-center ${
													isBooked 
														? 'bg-red-50 text-red-600 border-red-200 cursor-not-allowed'
														: isAvailable 
															? 'hover:bg-emerald-50 hover:border-emerald-300'
															: 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
												}`}
												onClick={() => isAvailable && !isBooked && handleTimeSelect(time)}
												disabled={!isAvailable || isBooked}
											>
												<span>{time}</span>
												{isBooked && <span className="ml-1 text-xs">📅</span>}
											</Button>
										);
									})}
								</div>
							) : (
								<div className="text-center py-8 text-gray-500">
									<Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
									<p>No time slots available</p>
								</div>
							)}
						</div>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Selected Time Display */}
						<div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
							<div className="flex items-center justify-between text-emerald-700">
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									<span className="text-sm">{selectedDate?.toLocaleDateString()}</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4" />
									<span className="font-medium">{selectedTime}</span>
								</div>
							</div>
						</div>

						{/* Reason */}
						<div className="space-y-2">
							<Label htmlFor="reason" className="flex items-center gap-2">
								<MessageSquare className="h-4 w-4" />
								Reason <Badge variant="destructive" className="text-xs">Required</Badge>
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

						{/* Department */}
						{organizationId && (
							<div className="space-y-2">
								<Label htmlFor="department" className="flex items-center gap-2">
									<Building2 className="h-4 w-4" />
									Department (Optional)
								</Label>
								<Input
									id="department"
									value={formData.department}
									onChange={(e) => handleChange('department', e.target.value)}
									placeholder="Specific department..."
								/>
							</div>
						)}

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
							<Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
								Back
							</Button>
							<Button type="submit" disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
								{loading ? 'Booking...' : 'Book Appointment'}
							</Button>
						</div>
					</form>
				)}
			</DialogContent>
		</Dialog>
	)
}