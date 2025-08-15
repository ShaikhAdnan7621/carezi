'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, User, Loader2, IndianRupee } from 'lucide-react';
import axios from 'axios';
import Loading from '@/components/ui/loading';
import ProfessionalAppointmentCalendar from '@/components/appointments/professional/ProfessionalAppointmentCalendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function ProfessionalAppointmentsPage() {
	const params = useParams();
	const [professional, setProfessional] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchProfessional();
	}, [params.id]);

	const fetchProfessional = async () => {
		try {
			const response = await axios.get("/api/professional/get/findbyId/", { params });
			if (response.status === 200 && response.data) {
				setProfessional(response.data);
			}
		} catch (error) {
			console.error('Error fetching professional:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loading className="h-8 w-8 text-emerald-600" />
					<p className="text-emerald-700">Loading professional details...</p>
				</div>
			</div>
		);
	}

	if (!professional) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<User className="h-16 w-16 mx-auto mb-4 text-emerald-400" />
					<h1 className="text-xl font-semibold text-emerald-900">Professional not found</h1>
					<p className="text-emerald-700 mt-2">{"The professional you're looking for doesn't exist."}</p>
				</div>
			</div>
		);
	}

	const availability = professional.consultationDetails?.availability || 'unavailable';
	const hours = professional.consultationDetails?.hours?.filter(h => h.isAvailable) || [];
	const fee = professional.consultationDetails?.fee || {};

	return (
		<div className="min-h-screen py-6 ">
			<div className="max-w-4xl mx-auto px-4 space-y-6">
				{/* Header */}
				<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
					<div className="flex flex-col sm:flex-row items-center gap-6">
						{console.log(professional)}
						<Avatar className="w-20 h-20 shadow-sm">
							<AvatarImage
								src={professional.userId?.profilePic}
								alt={professional.userId?.name}
							/>
							<AvatarFallback className="bg-emerald-600 text-white font-bold text-2xl">
								{professional.userId?.name?.charAt(0) || 'D'}
							</AvatarFallback>
						</Avatar>

						<div className="text-center sm:text-left flex-1">
							<h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
								{professional.userId?.name}
							</h1>
							<div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
								<Badge variant="outline" className="text-sm bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100">
									{professional.professionType}
								</Badge>
								<Badge className={`text-sm hover:opacity-90 ${availability === 'high' ? 'bg-green-50 text-green-700' :
									availability === 'moderate' ? 'bg-amber-50 text-amber-700' :
										availability === 'low' ? 'bg-red-50 text-red-700' :
											'bg-gray-50 text-gray-600'
									}`}>
									{availability.charAt(0).toUpperCase() + availability.slice(1)} Available
								</Badge>
								{fee.minimum && fee.maximum && (
									<Badge variant="outline" className="text-sm bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100">
										₹{fee.minimum}-{fee.maximum}
									</Badge>
								)}
							</div>
							<div className="text-base text-gray-600 space-y-2">
								{professional.education?.[0] && (
									<p>{professional.education[0].degree} • {professional.education[0].institution}</p>
								)}
								{professional.experience?.[0] && (
									<p>{professional.experience[0].role} at {professional.experience[0].organization}</p>
								)}
							</div>
						</div>
					</div>
				</div>
				{/* Calendar */}
				<Card className="p-4 sm:p-6">
					<div className="flex items-center gap-2 mb-4">
						<Calendar className="h-5 w-5 text-emerald-600" />
						<h2 className="text-lg font-semibold text-emerald-900">Book Appointment</h2>
					</div>
					<ProfessionalAppointmentCalendar
						professionalId={professional._id}
						organizationId={null}
					/>
					<div className='mt-4 p-3 bg-emerald-50 rounded-lg'>
						<p className="text-xs text-emerald-700">
							💡 Click the + button on available dates to book your appointment
						</p>
					</div>

				</Card>


				{/* Quick Info */}
				{hours.length > 0 && (
					<Card className="p-4">
						<div className="flex items-center gap-2 mb-3">
							<Clock className="h-4 w-4 text-emerald-600" />
							<h3 className="font-medium text-emerald-900 text-sm">Available Hours</h3>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
							{hours.slice(0, 6).map((hour, index) => (
								<div key={index} className="text-xs bg-emerald-50 p-2 rounded">
									<div className="font-medium text-emerald-800 capitalize">{hour.day.slice(0, 3)}</div>
									<div className="text-emerald-600">
										{hour.morning?.isActive && `${hour.morning.startTime.slice(0, 5)}`}
										{hour.morning?.isActive && hour.evening?.isActive && ', '}
										{hour.evening?.isActive && `${hour.evening.startTime.slice(0, 5)}`}
									</div>
								</div>
							))}
						</div>
					</Card>
				)}

			</div>
		</div>
	);
}
