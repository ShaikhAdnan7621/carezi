'use client';

import { useState, useEffect } from 'react';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import AppointmentDetailsFullDialog from '@/components/appointments/AppointmentDetailsFullDialog';

export default function MyAppointmentsPage() {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedAppointment, setSelectedAppointment] = useState(null);
	const [showFullDetailsDialog, setShowFullDetailsDialog] = useState(false);

	useEffect(() => {
		fetchAppointments();
	}, []);

	const fetchAppointments = async () => {
		try {
			const response = await axios.get('/api/appointments?patientId=me');
			setAppointments(response.data.appointments || []);
			console.log(response.data.appointments);
		} catch (error) {
			console.error('Error fetching appointments:', error);
		} finally {
			setLoading(false);
		}
	};

	const getAppointmentsByStatus = (status) => {
		return appointments.filter(apt => apt.status === status);
	};

	const getStatusCount = (status) => {
		return getAppointmentsByStatus(status).length;
	};

	const getUpcomingAppointments = () => {
		const now = new Date();
		return appointments.filter(apt =>
			apt.status === 'approved' && new Date(apt.appointmentDate) >= now
		).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-gray-200 rounded w-1/3"></div>
					<div className="h-64 bg-gray-200 rounded"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h1>
				<p className="text-gray-600">View and manage your healthcare appointments</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
				<Card>
					<CardContent className="p-4 text-center">
						<div className="text-2xl font-bold text-orange-600">{getStatusCount('requested')}</div>
						<div className="text-sm text-gray-600">Pending</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<div className="text-2xl font-bold text-green-600">{getUpcomingAppointments().length}</div>
						<div className="text-sm text-gray-600">Upcoming</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<div className="text-2xl font-bold text-blue-600">{getStatusCount('completed')}</div>
						<div className="text-sm text-gray-600">Completed</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4 text-center">
						<div className="text-2xl font-bold text-gray-600">{appointments.length}</div>
						<div className="text-sm text-gray-600">Total</div>
					</CardContent>
				</Card>
			</div>

			{/* Appointments Tabs */}
			<Tabs defaultValue="upcoming" className="space-y-4">
				<TabsList>
					<TabsTrigger value="upcoming">
						Upcoming ({getUpcomingAppointments().length})
					</TabsTrigger>
					<TabsTrigger value="pending">
						Pending ({getStatusCount('requested')})
					</TabsTrigger>
					<TabsTrigger value="completed">
						Completed ({getStatusCount('completed')})
					</TabsTrigger>
					<TabsTrigger value="all">
						All ({appointments.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="upcoming">
					<div className="space-y-4">
						{getUpcomingAppointments().map(appointment => (
							<AppointmentCard
								key={appointment._id}
								appointment={appointment}
							/>
						))}
						{getUpcomingAppointments().length === 0 && (
							<Card>
								<CardContent className="p-8 text-center text-gray-500">
									No upcoming appointments
								</CardContent>
							</Card>
						)}
					</div>
				</TabsContent>

				<TabsContent value="pending">
					<div className="space-y-4">
						{getAppointmentsByStatus('requested').map(appointment => (
							<AppointmentCard
								key={appointment._id}
								appointment={appointment}
							/>
						))}
						{getAppointmentsByStatus('requested').length === 0 && (
							<Card>
								<CardContent className="p-8 text-center text-gray-500">
									No pending appointments
								</CardContent>
							</Card>
						)}
					</div>
				</TabsContent>

				<TabsContent value="completed">
					<div className="space-y-4">
						{getAppointmentsByStatus('completed').map(appointment => (
							<AppointmentCard
								key={appointment._id}
								appointment={appointment}
							/>
						))}
						{getAppointmentsByStatus('completed').length === 0 && (
							<Card>
								<CardContent className="p-8 text-center text-gray-500">
									No completed appointments
								</CardContent>
							</Card>
						)}
					</div>
				</TabsContent>
				
				{showFullDetailsDialog && selectedAppointment && (
					<AppointmentDetailsFullDialog
						isOpen={showFullDetailsDialog}
						onClose={() => setShowFullDetailsDialog(false)}
						appointment={selectedAppointment}
						onReview={handleReview}
					/>
				)}



				<TabsContent value="all">
					<div className="space-y-4">
						{appointments.map(appointment => (
							<AppointmentCard
								key={appointment._id}
								appointment={appointment}
							/>
						))}
						{appointments.length === 0 && (
							<Card>
								<CardContent className="p-8 text-center text-gray-500">
									No appointments yet
								</CardContent>
							</Card>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}