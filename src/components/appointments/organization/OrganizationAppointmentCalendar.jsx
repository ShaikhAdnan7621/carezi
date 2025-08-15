'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import OrganizationTimePickerDialog from './OrganizationTimePickerDialog';
import axios from 'axios';
import Loading from '../../ui/loading';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PROFESSIONAL_COLORS = [
	'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
	'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500'
];

export default function OrganizationAppointmentCalendar({ 
	professionals, 
	organizationId
}) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [calendarData, setCalendarData] = useState({ appointments: [], availableSlots: [] });
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);

	const [selectedProfessionalFilter, setSelectedProfessionalFilter] = useState('all');
	const [loading, setLoading] = useState(false);

	const { days, monthYear } = useMemo(() => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const firstDay = new Date(year, month, 1);
		const startingDayOfWeek = firstDay.getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

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

	const activeProfessionals = useMemo(() => {
		return selectedProfessionalFilter === 'all' 
			? professionals 
			: professionals.filter(p => p._id === selectedProfessionalFilter);
	}, [selectedProfessionalFilter, professionals]);

	const fetchCalendarData = useCallback(async () => {
		if (!activeProfessionals.length) return;
		setLoading(true);

		try {
			const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
			const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

			const professionalIds = activeProfessionals.map(p => p._id);
			
			// Use existing appointments API with organizationId filter
			console.log('Fetching appointments for org:', organizationId, 'professionals:', professionalIds);
			const appointmentsRes = await axios.get('/api/appointments', {
				params: { 
					organizationId,
					startDate: startDate.toISOString(), 
					endDate: endDate.toISOString() 
				}
			});
			console.log('Appointments response:', appointmentsRes.data);

			// Get available slots for each professional
			const slotsPromises = professionalIds.map(profId => 
				axios.get(`/api/appointments/calendar/${profId}`, {
					params: { 
						startDate: startDate.toISOString(), 
						endDate: endDate.toISOString() 
					}
				})
			);

			const slotsResults = await Promise.allSettled(slotsPromises);
			const allSlots = slotsResults
				.filter(result => result.status === 'fulfilled')
				.flatMap(result => result.value.data.availableSlots || []);

			setCalendarData({
				appointments: appointmentsRes.data.appointments || [],
				availableSlots: allSlots
			});
		} catch (err) {
			console.error('Failed to load calendar data');
		} finally {
			setLoading(false);
		}
	}, [currentDate, activeProfessionals, organizationId]);

	useEffect(() => {
		fetchCalendarData();
	}, [fetchCalendarData]);

	const getDateStats = useCallback((date) => {
		if (!date) return null;

		const dateStr = date.toDateString();
		const dayAppointments = calendarData.appointments.filter(apt =>
			new Date(apt.appointmentDate).toDateString() === dateStr
		);

		const professionalStats = activeProfessionals.map((prof, index) => {
			const profAppointments = dayAppointments.filter(apt => apt.professionalId === prof._id);
			return {
				professional: prof,
				color: PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length],
				count: profAppointments.length,
				approved: profAppointments.filter(apt => apt.status === 'approved').length,
				pending: profAppointments.filter(apt => apt.status === 'requested').length
			};
		});

		const dateISOStr = date.toISOString().split('T')[0];
		const hasAvailableSlots = calendarData.availableSlots.some(slot =>
			slot.date.split('T')[0] === dateISOStr && slot.availableTimes.length > 0
		);

		return {
			total: dayAppointments.length,
			professionalStats,
			hasSlots: hasAvailableSlots,
			isPast: date < new Date().setHours(0, 0, 0, 0)
		};
	}, [calendarData, activeProfessionals]);

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
				${isToday ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}
				${stats.isPast ? 'bg-gray-50' : 'bg-white hover:bg-emerald-50'}
			`}>
				<div className="h-full flex flex-col justify-between">
					<div className="flex items-center justify-between">
						<span className={`text-sm font-bold ${isToday ? 'text-emerald-700' : 'text-gray-900'}`}>
							{date.getDate()}
						</span>
						{!stats.isPast && (
							<Button
								size="sm"
								variant="ghost"
								className="h-5 w-5 p-0 hover:bg-emerald-200"
								onClick={() => handleBookAppointment(date)}
							>
								<Plus className="h-3 w-3 text-emerald-600" />
							</Button>
						)}
					</div>

					{stats.total > 0 && (
						<div className="space-y-1">
							<div className="flex items-center gap-1 text-xs">
								<CalendarIcon className="h-3 w-3 text-emerald-500" />
								<span className="text-emerald-600 font-medium">{stats.total}</span>
							</div>

							<div className="flex flex-wrap gap-1">
								{stats.professionalStats.map((profStat, index) => (
									profStat.count > 0 && (
										<div key={profStat.professional._id} className="flex items-center gap-1">
											<div className={`w-2 h-2 rounded-full ${profStat.color}`}></div>
											<span className="text-xs font-medium">{profStat.count}</span>
										</div>
									)
								))}
							</div>
						</div>
					)}

					{stats.hasSlots && !stats.isPast && stats.total === 0 && (
						<div className="flex items-center justify-center">
							<div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
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
					<Loading className="h-8 w-8" />
				</div>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-emerald-900">{monthYear}</h2>
				<div className="flex gap-2">

					<Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Professional Filter & Legend */}
			<Card className="p-4">
				<div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
					<div className="flex items-center gap-2">
						<label className="text-sm font-medium text-gray-700">Filter by Professional:</label>
						<select 
							value={selectedProfessionalFilter} 
							onChange={(e) => setSelectedProfessionalFilter(e.target.value)}
							className="px-3 py-1 border border-gray-300 rounded-md text-sm"
						>
							<option value="all">All Professionals</option>
							{professionals.map(prof => (
								<option key={prof._id} value={prof._id}>{prof.userId?.name}</option>
							))}
						</select>
					</div>
					{activeProfessionals.length > 1 && (
						<div className="flex flex-wrap gap-3">
							{activeProfessionals.map((prof, index) => (
								<div key={prof._id} className="flex items-center gap-2">
									<div className={`w-3 h-3 rounded-full ${PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]}`}></div>
									<span className="text-sm text-gray-700">{prof.userId?.name}</span>
									<Badge variant="outline" className="text-xs">{prof.professionType}</Badge>
								</div>
							))}
						</div>
					)}
				</div>
			</Card>

			<Card className="p-4 bg-emerald-50/50">
				<div className="grid grid-cols-7 gap-2 mb-4">
					{WEEKDAYS.map(day => (
						<div key={day} className="text-center text-sm font-medium text-emerald-600 py-2">
							{day}
						</div>
					))}
				</div>

				<div className="grid grid-cols-7 gap-2">
					{days.map((date, index) => (
						<DateCard key={index} date={date} stats={getDateStats(date)} />
					))}
				</div>
			</Card>

			{/* Appointments Summary */}
			{calendarData.appointments.length > 0 && (
				<Card className="p-4">
					<h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Appointments</h3>
					<div className="space-y-2 max-h-60 overflow-y-auto">
						{calendarData.appointments.slice(0, 10).map((apt, index) => (
							<div key={apt._id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
								<div className="flex items-center gap-3">
									<div className={`w-3 h-3 rounded-full ${PROFESSIONAL_COLORS[activeProfessionals.findIndex(p => p._id === apt.professionalId) % PROFESSIONAL_COLORS.length]}`}></div>
									<div>
										<p className="text-sm font-medium">{apt.patientName || 'Patient'}</p>
										<p className="text-xs text-gray-500">{new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}</p>
									</div>
								</div>
								<Badge className={apt.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
									{apt.status}
								</Badge>
							</div>
						))}
					</div>
				</Card>
			)}

			{showTimePicker && (
				<OrganizationTimePickerDialog
					isOpen={showTimePicker}
					onClose={() => setShowTimePicker(false)}
					selectedDate={selectedDate}
					organizationId={organizationId}
					professionals={professionals}
					onSuccess={fetchCalendarData}
				/>
			)}
		</div>
	);
}