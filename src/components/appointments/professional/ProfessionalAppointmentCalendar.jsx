'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar as CalendarIcon, XIcon, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProfessionalTimePickerDialog from './ProfessionalTimePickerDialog';
import axios from 'axios';
import Loading from '../../ui/loading';



const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ProfessionalAppointmentCalendar({ professionalId, organizationId }) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [calendarData, setCalendarData] = useState({ appointments: [], availableSlots: [] });
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);
	const [loading, setLoading] = useState(false);

	const { days, monthYear } = useMemo(() => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days = [];
		for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
		for (let day = 1; day <= daysInMonth; day++) {
			days.push(new Date(year, month, day));
		}

		return {
			days,
			monthYear: currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
		};
	}, [currentDate]);

	const fetchCalendarData = useCallback(async () => {
		if (!professionalId) return;
		setLoading(true);

		try {
			const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
			const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

			const [appointmentsRes, slotsRes] = await Promise.allSettled([
				axios.get('/api/appointments', {
					params: { professionalId, startDate: startDate.toISOString(), endDate: endDate.toISOString() }
				}),
				axios.get(`/api/appointments/calendar/${professionalId}`, {
					params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
				})
			]);

			setCalendarData({
				appointments: appointmentsRes.status === 'fulfilled' ? appointmentsRes.value.data.appointments || [] : [],
				availableSlots: slotsRes.status === 'fulfilled' ? slotsRes.value.data.availableSlots || [] : []
			});
		} catch (err) {
			console.error('Failed to load calendar data');
		} finally {
			setLoading(false);
		}
	}, [currentDate, professionalId]);

	useEffect(() => {
		fetchCalendarData();
	}, [fetchCalendarData]);

	const getDateStats = useCallback((date) => {
		if (!date) return null;

		const dateStr = date.toDateString();
		const dayAppointments = calendarData.appointments.filter(apt =>
			new Date(apt.appointmentDate).toDateString() === dateStr
		);

		const dateISOStr = date.toISOString().split('T')[0];
		const hasAvailableSlots = calendarData.availableSlots.some(slot =>
			slot.date.split('T')[0] === dateISOStr && slot.availableTimes.length > 0
		);

		return {
			total: dayAppointments.length,
			approved: dayAppointments.filter(apt => apt.status === 'approved').length,
			pending: dayAppointments.filter(apt => apt.status === 'requested').length,
			rejected: dayAppointments.filter(apt => apt.status === 'rejected').length,
			hasSlots: hasAvailableSlots,
			isPast: date < new Date().setHours(0, 0, 0, 0)
		};
	}, [calendarData]);

	const navigateMonth = (direction) => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() + direction);
		setCurrentDate(newDate);
	};

	const handleBookAppointment = (date) => {
		setSelectedDate(date);
		setShowTimePicker(true);
	};

	const DateCard = ({ date, stats }) => {
		if (!date) return <div className="aspect-square" />;

		const isToday = date.toDateString() === new Date().toDateString();

		return (
			<Card className={`
      aspect-square p-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1
      ${isToday ? 'ring-2 ring-green-500 bg-green-200' : ''}
      ${stats.isPast ? 'bg-gray-50' : 'bg-white hover:bg-green-100'}
    `}>
				<div className="h-full flex flex-col justify-between">
					{/* Date Number */}
					<div className="flex items-center justify-between">
						<span className={`text-lg font-bold ${isToday ? 'text-green-700' : 'text-gray-900'}`}>
							{date.getDate()}
						</span>
						{stats.hasSlots && !stats.isPast && (
							<Button
								size="sm"
								variant="ghost"
								className="h-6 w-6 p-0 hover:bg-green-300 transition-colors duration-200"
								onClick={() => handleBookAppointment(date)}
							>
								<Plus className="h-3 w-3 text-green-700" />
							</Button>
						)}
					</div>

					{/* Appointment Stats */}
					{stats.total > 0 && (
						<div className="space-y-1">
							<div className="flex items-center gap-1 text-xs">
								<CalendarIcon className="h-3 w-3 text-green-500" />
								<span className="text-green-600 font-medium">{stats.total}</span>
							</div>

							<div className="flex gap-1 flex-wrap">
								{stats.approved > 0 && (
									<Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 font-medium shadow-sm">
										<CheckIcon className="h-3 w-3 mr-1" />{stats.approved}
									</Badge>
								)}
								{stats.pending > 0 && (
									<Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 font-medium shadow-sm">
										<Clock className="h-3 w-3 mr-1" />{stats.pending}
									</Badge>
								)}
								{stats.rejected > 0 && (
									<Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 font-medium shadow-sm">
										<XIcon className="h-3 w-3 mr-1" />{stats.rejected}
									</Badge>
								)}
							</div>
						</div>
					)}

					{/* Available Indicator */}
					{stats.hasSlots && !stats.isPast && stats.total === 0 && (
						<div className="flex items-center justify-center">
							<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
						</div>
					)}
				</div>
			</Card>
		);
	};
	if (loading) {
		return (
			<Card className="p-8">
				<div className="flex items-center justify-center">
					<Loading className="rounded-full h-8 w-8  " />
				</div>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-emerald-900">{monthYear}</h2>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" onClick={() => navigateMonth(-1)} className="text-emerald-600 hover:bg-emerald-50">
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="sm" onClick={() => navigateMonth(1)} className="text-emerald-600 hover:bg-emerald-50">
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Calendar Grid */}
			<Card className="p-4 bg-emerald-50/50">
				{/* Weekday Headers */}
				<div className="grid grid-cols-7 gap-2 mb-4">
					{WEEKDAYS.map(day => (
						<div key={day} className="text-center text-sm font-medium text-emerald-600 py-2">
							{day}
						</div>
					))}
				</div>

				{/* Date Cards */}
				<div className="grid grid-cols-7 gap-2">
					{days.map((date, index) => (
						<DateCard key={index} date={date} stats={getDateStats(date)} />
					))}
				</div>
			</Card>

			{/* Legend */}
			<Card className="p-3 bg-emerald-50/50">
				<div className="flex flex-wrap gap-4 text-sm">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
						<span className="text-emerald-700">Available</span>
					</div>
					{calendarData.appointments.filter(apt => apt.status === 'approved').length > 0 && (
						<div className="flex items-center gap-2">
							<Badge className="text-xs px-1 py-0 bg-emerald-100 text-emerald-700">
								<CheckIcon className="h-3 w-3 mr-1" />
								{calendarData.appointments.filter(apt => apt.status === 'approved').length}
							</Badge>
							<span className="text-emerald-700">Approved</span>
						</div>
					)}
					{calendarData.appointments.filter(apt => apt.status === 'requested').length > 0 && (
						<div className="flex items-center gap-2">
							<Badge className="text-xs px-1 py-0 bg-emerald-100 text-emerald-700">
								
								<Clock className="h-3 w-3 mr-1" />
								{calendarData.appointments.filter(apt => apt.status === 'requested').length}
							</Badge>
							<span className="text-emerald-700">Pending</span>
						</div>
					)}
					{calendarData.appointments.filter(apt => apt.status === 'rejected').length > 0 && (
						<div className="flex items-center gap-2">
							<Badge className="text-xs px-1 py-0 bg-emerald-100 text-emerald-700">
								<XIcon className="h-3 w-3 mr-1" />
								{calendarData.appointments.filter(apt => apt.status === 'rejected').length}
							</Badge>
							<span className="text-emerald-700">Rejected</span>
						</div>
					)}
				</div>
			</Card>

			{/* Time Picker Dialog */}
			{showTimePicker && (
				<ProfessionalTimePickerDialog
					isOpen={showTimePicker}
					onClose={() => setShowTimePicker(false)}
					selectedDate={selectedDate}
					professionalId={professionalId}
					organizationId={organizationId}
					availableSlots={calendarData.availableSlots}
					bookedSlots={calendarData.appointments}
					onSuccess={fetchCalendarData}
				/>
			)}
		</div>
	);
}
