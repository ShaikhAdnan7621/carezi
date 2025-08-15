'use client';

import { useState, useEffect } from 'react';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import AppointmentActionDialog from '@/components/appointments/AppointmentActionDialog';
import AppointmentDetailsFullDialog from '@/components/appointments/AppointmentDetailsFullDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, AlertCircle, Users, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Loading from '@/components/ui/loading';

const QUICK_FILTERS = [
	{ id: 'all', label: 'All', icon: Users },
	{ id: 'requested', label: 'Pending', icon: AlertCircle, color: 'text-amber-600' },
	{ id: 'approved', label: 'Approved', icon: CheckCircle2, color: 'text-emerald-600' },
	{ id: 'completed', label: 'Completed', icon: Calendar, color: 'text-blue-600' }
];

const generateDateRange = (startDate, days) => {
	const dates = [];
	for (let i = 0; i < days; i++) {
		const date = new Date(startDate);
		date.setDate(startDate.getDate() + i);
		dates.push(date);
	}
	return dates;
};

export default function ProfessionalAppointmentsPage() {
	const [appointments, setAppointments] = useState([]);
	const [stats, setStats] = useState({ requested: 0, approved: 0, completed: 0, total: 0 });
	const [selectedAppointment, setSelectedAppointment] = useState(null);
	const [showReviewDialog, setShowReviewDialog] = useState(false);
	const [showFullDetailsDialog, setShowFullDetailsDialog] = useState(false);
	const [loading, setLoading] = useState(true);
	const [activeFilter, setActiveFilter] = useState('all');
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [dateRange, setDateRange] = useState([]);
	const [currentViewDate, setCurrentViewDate] = useState(new Date());

	useEffect(() => {
		fetchStats();
		initializeDateRange();
	}, []);

	useEffect(() => {
		fetchAppointments();
	}, [currentViewDate]);

	const initializeDateRange = () => {
		updateDateRange(currentViewDate);
	};

	const updateDateRange = (viewDate) => {
		const year = viewDate.getFullYear();
		const month = viewDate.getMonth();
		const firstDay = new Date(year, month, 1);
		const startDate = new Date(firstDay);
		startDate.setDate(startDate.getDate() - firstDay.getDay());
		const monthDays = generateDateRange(startDate, 42);
		setDateRange(monthDays);
	};

	const fetchAppointments = async () => {
		try {
			const startDate = new Date(currentViewDate);
			startDate.setDate(startDate.getDate() - 7);
			const endDate = new Date(currentViewDate);
			endDate.setDate(endDate.getDate() + 30);

			const response = await axios.get('/api/appointments/professional/my', {
				params: {
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString()
				}
			});
			setAppointments(response.data.appointments || []);
		} catch (error) {
			console.error('Error fetching appointments:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchStats = async () => {
		try {
			const response = await axios.get('/api/appointments/professional/my/stats');
			setStats(response.data.stats || { requested: 0, approved: 0, completed: 0, total: 0 });
		} catch (error) {
			console.error('Error fetching stats:', error);
		}
	};

	const handleReview = (appointment) => {
		setSelectedAppointment(appointment);
		setShowReviewDialog(true);
	};

	const handleViewDetails = (appointment) => {
		setSelectedAppointment(appointment);
		setShowFullDetailsDialog(true);
	};

	const getFilteredAppointments = () => {
		let filtered = appointments;

		if (activeFilter !== 'all') {
			filtered = filtered.filter(apt => apt.status === activeFilter);
		}

		if (selectedDate) {
			const selectedDateStr = selectedDate.toDateString();
			filtered = filtered.filter(apt =>
				new Date(apt.appointmentDate).toDateString() === selectedDateStr
			);
		}

		return filtered.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
	};

	const getAppointmentsForDate = (date) => {
		return appointments.filter(apt =>
			new Date(apt.appointmentDate).toDateString() === date.toDateString()
		);
	};

	const getStatusCountForDate = (date, status) => {
		return appointments.filter(apt =>
			new Date(apt.appointmentDate).toDateString() === date.toDateString() &&
			apt.status === status
		).length;
	};

	const getStatusCount = (status) => {
		return stats[status] || 0;
	};

	const getUpcomingCount = () => {
		return stats.approved || 0;
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50/30">
				<div className="max-w-7xl mx-auto py-4 sm:py-8 flex h-full w-full justify-center items-center">
					<Loading />
				</div>
			</div>
		);
	}

	const filteredAppointments = getFilteredAppointments();

	return (
		<div className="min-h-screen bg-gray-50/30">
			<div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 sm:py-8">
				{/* Header */}
				<div className="mb-4 sm:mb-6">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
						<div>
							<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Appointments</h1>
							<p className="text-sm sm:text-base text-gray-600">Manage your patient appointments</p>
						</div>
						<Badge variant="outline" className="px-3 py-1 w-fit">
							<TrendingUp className="h-3 w-3 mr-1" />
							{stats.total} Total
						</Badge>
					</div>
				</div>

				{/* Main Layout */}
				<div className="flex gap-4 lg:gap-6 flex-col lg:flex-row">
					{/* Sidebar Panel */}
					<div className="w-full lg:w-80 xl:w-96 space-y-4 order-2 lg:order-1">
						{/* Calendar */}
						<Card className="border-0 shadow-lg ">
							<CardContent className="p-3 sm:p-4">
								<h3 className="font-semibold mb-3 text-emerald-800">Calendar</h3>

								<div className="flex items-center justify-between mb-3">
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											const newDate = new Date(currentViewDate);
											newDate.setMonth(newDate.getMonth() - 1);
											setCurrentViewDate(newDate);
											updateDateRange(newDate);
										}}
										className="flex items-center gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>

									<div className="text-center flex-1">
										<h4 className="font-semibold text-emerald-800 text-sm sm:text-base">
											{currentViewDate.toLocaleDateString('en-US', {
												month: 'long',
												year: 'numeric'
											})}
										</h4>
									</div>

									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											const newDate = new Date(currentViewDate);
											newDate.setMonth(newDate.getMonth() + 1);
											setCurrentViewDate(newDate);
											updateDateRange(newDate);
										}}
										className="flex items-center gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>

								{/* Weekday Headers */}
								<div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-3">
									{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
										<div key={day} className="text-center text-xs font-semibold text-emerald-700 py-2 bg-emerald-100/50 rounded-lg">
											<span className="hidden sm:inline">{day}</span>
											<span className="sm:hidden">{day.charAt(0)}</span>
										</div>
									))}
								</div>

								{/* Calendar Grid */}
								<div className="grid grid-cols-7 gap-1">
									{dateRange.map((date, index) => {
										const isSelected = date.toDateString() === selectedDate.toDateString();
										const isToday = date.toDateString() === new Date().toDateString();
										const isCurrentMonth = date.getMonth() === currentViewDate.getMonth();
										const isPastDate = date < new Date().setHours(0, 0, 0, 0);
										const pendingCount = getStatusCountForDate(date, 'requested');
										const approvedCount = getStatusCountForDate(date, 'approved');
										const totalCount = pendingCount + approvedCount;

										return (
											<Button
												key={index}
												variant="ghost"
												size="sm"
												onClick={() => setSelectedDate(date)}
												className={`h-13 lg:h-14 p-2 sm:p-2 flex flex-col items-center justify-start relative text-xs transition-all ${isSelected ? 'bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg ring-2 ring-green-400 ring-opacity-50' :
														isToday ? 'bg-gradient-to-br from-green-50 to-green-100 text-green-800 border-2 border-green-400 hover:from-green-100 hover:to-green-200' :
															!isCurrentMonth ? 'text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60' :
																isPastDate ? 'text-gray-500 bg-gradient-to-br from-gray-100 to-gray-200 opacity-75' : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100'
													}`}
											>
												<span className={`text-xs font-medium leading-none ${!isCurrentMonth ? 'opacity-50' : isPastDate ? 'opacity-70' : ''
													} ${isSelected ? 'text-white' : ''} `}>{date.getDate()}</span>
												{totalCount > 0 && (
													<div className={`flex items-center mt-0.5 text-xs ${!isCurrentMonth ? 'opacity-40' : isPastDate ? 'opacity-60' : ''
														}`}>
														{pendingCount > 0 && (
															<span className={`text-xs font-bold leading-none ${isSelected ? 'text-yellow-100 drop-shadow-sm' : 'text-amber-600'
																}`}>{pendingCount}</span>
														)}
														{approvedCount > 0 && (
															<>
																{pendingCount > 0 && (
																	<span className={`text-xs mx-1 ${isSelected ? 'text-white/80' : 'text-green-700'}`}>|</span>
																)}
																<span className={`text-xs font-bold leading-none ${isSelected ? 'text-green-100 drop-shadow-sm' : 'text-green-600'
																	}`}>{approvedCount}</span>
															</>
														)}
													</div>
												)}
											</Button>
										);
									})}
								</div>
							</CardContent>
						</Card>

						{/* Filters */}
						<Card className="border-0 shadow-sm">
							<CardContent className="p-3 sm:p-4">
								<h3 className="font-semibold mb-3 text-sm sm:text-base">Filter</h3>
								<div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:space-y-0">
									{QUICK_FILTERS.map((filter) => {
										const Icon = filter.icon;
										const isActive = activeFilter === filter.id;
										return (
											<Button
												key={filter.id}
												variant={isActive ? "default" : "outline"}
												size="sm"
												onClick={() => setActiveFilter(filter.id)}
												className={`w-full justify-start text-xs sm:text-sm ${isActive ? 'bg-green-600 hover:bg-green-700' : ''}`}
											>
												<Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
												<span className="truncate">{filter.label}</span>
												{filter.id !== 'all' && (
													<Badge variant="secondary" className="ml-auto text-xs">
														{getStatusCount(filter.id)}
													</Badge>
												)}
											</Button>
										);
									})}
								</div>
							</CardContent>
						</Card>

						{/* Stats */}
						<div className="grid grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3">
							<Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
								<CardContent className="p-2 sm:p-3 lg:p-4">
									<div className="text-center">
										<AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-amber-600 mx-auto mb-1 sm:mb-2" />
										<p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-900">{getStatusCount('requested')}</p>
										<p className="text-xs font-medium text-amber-700">Pending</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50">
								<CardContent className="p-2 sm:p-3 lg:p-4">
									<div className="text-center">
										<CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-emerald-600 mx-auto mb-1 sm:mb-2" />
										<p className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-900">{getStatusCount('approved')}</p>
										<p className="text-xs font-medium text-emerald-700">Approved</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
								<CardContent className="p-2 sm:p-3 lg:p-4">
									<div className="text-center">
										<CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600 mx-auto mb-1 sm:mb-2" />
										<p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{getStatusCount('completed')}</p>
										<p className="text-xs font-medium text-blue-700">Completed</p>
									</div>
								</CardContent>
							</Card>

							<Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-slate-50">
								<CardContent className="p-2 sm:p-3 lg:p-4">
									<div className="text-center">
										<Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600 mx-auto mb-1 sm:mb-2" />
										<p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
											{stats.total}
										</p>
										<p className="text-xs font-medium text-gray-700">This Month</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Main Content - Appointments List */}
					<div className="flex-1 order-1 lg:order-2">
						<div className="space-y-3 sm:space-y-4">
							{filteredAppointments.length > 0 ? (
								filteredAppointments.map(appointment => (
									<AppointmentCard
										key={appointment._id}
										appointment={appointment}
										showActions={appointment.status === 'requested'}
										onReview={() => handleReview(appointment)}
										onViewDetails={() => handleViewDetails(appointment)}
									/>
								))
							) : (
								<Card className="border-0 shadow-sm">
									<CardContent className="p-6 sm:p-8 text-center">
										<Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-3 sm:mb-4" />
										<h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">No appointments</h3>
										<p className="text-gray-600 text-sm">No appointments for selected date</p>
									</CardContent>
								</Card>
							)}
						</div>
					</div>


				</div>

				{/* Review Dialog */}
				{showReviewDialog && selectedAppointment && (
					<AppointmentActionDialog
						isOpen={showReviewDialog}
						onClose={() => setShowReviewDialog(false)}
						appointment={selectedAppointment}
						onSuccess={fetchAppointments}
					/>
				)}

				{/* Full Details Dialog */}
				{showFullDetailsDialog && selectedAppointment && (
					<AppointmentDetailsFullDialog
						isOpen={showFullDetailsDialog}
						onClose={() => setShowFullDetailsDialog(false)}
						appointment={selectedAppointment}
						onReview={handleReview}
					/>
				)}
			</div>
		</div >
	);
}