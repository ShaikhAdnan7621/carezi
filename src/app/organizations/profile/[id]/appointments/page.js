'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import OrganizationAppointmentCalendar from '@/components/appointments/organization/OrganizationAppointmentCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, Grid, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';

export default function OrganizationAppointmentsPage() {
	const params = useParams();
	const { id } = useParams()
	const [organization, setOrganization] = useState(null);
	const [affiliatedProfessionals, setAffiliatedProfessionals] = useState([]);

	const [selectedSpecialty, setSelectedSpecialty] = useState('all');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchOrganization();
		fetchAffiliatedProfessionals();
	}, [params.id]);

	const fetchOrganization = async () => {
		try {
			const response = await axios.get("/api/organization/get/findbyid", { params: { id } })

			setOrganization(response.data.data);
			console.log(response.data.data);
		} catch (error) {
			console.error('Error fetching organization:', error);
		}
	};

	const fetchAffiliatedProfessionals = async () => {
		try {
			const response = await axios.get(`/api/affiliation/organization/${params.id}`);
			const professionals = response.data.affiliations?.map(aff => aff.professionalId) || [];
			
			setAffiliatedProfessionals(professionals);

		} catch (error) {
			console.error('Error fetching professionals:', error);
		} finally {
			setLoading(false);
		}
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

	if (!organization) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900">Organization not found</h1>
				</div>
			</div>
		);
	}

	const filteredProfessionals = affiliatedProfessionals.filter(prof => 
		selectedSpecialty === 'all' || prof.professionType === selectedSpecialty
	);

	const specialties = [...new Set(affiliatedProfessionals.map(p => p.professionType))];

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			{/* Organization Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Book Appointment at {organization.name}
				</h1>
				<div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
					<Badge variant="outline">{organization.facilityType}</Badge>
					<div className="flex items-center gap-1">
						<Users className="h-4 w-4" />
						<span>{affiliatedProfessionals.length} professionals</span>
					</div>
				</div>

				{/* Organization Details */}
				<Card className="mb-4">
					<CardContent className="pt-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{organization.contactDetails?.address && (
								<div>
									<h4 className="font-medium text-gray-900 text-sm">Address</h4>
									<p className="text-sm text-gray-600">
										{[
											organization.contactDetails.address.street,
											organization.contactDetails.address.city,
											organization.contactDetails.address.state,
											organization.contactDetails.address.country
										].filter(Boolean).join(', ')}
									</p>
								</div>
							)}
							{organization.contactDetails?.phone && (
								<div>
									<h4 className="font-medium text-gray-900 text-sm">Phone</h4>
									<p className="text-sm text-gray-600">{organization.contactDetails.phone}</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Controls */}
			{affiliatedProfessionals.length > 0 && (
				<Card className="mb-4">
					<CardContent className="pt-4">
						<div className="flex flex-col sm:flex-row gap-4">
							{/* Specialty Filter */}
							<Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
								<SelectTrigger className="w-48">
									<SelectValue placeholder="Filter by specialty" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Specialties</SelectItem>
									{specialties.map(specialty => (
										<SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Professional Cards */}
			{filteredProfessionals.length > 0 && (
				<Card className="mb-4">
					<CardHeader>
						<CardTitle className="text-lg">Available Professionals</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredProfessionals.map(professional => (
								<div key={professional._id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
									<Avatar className="w-10 h-10">
										<AvatarImage src={professional.userId?.avatar} />
										<AvatarFallback className="bg-emerald-600 text-white">
											{professional.userId?.name?.charAt(0) || 'D'}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<p className="font-medium text-sm">{professional.userId?.name}</p>
										<Badge variant="outline" className="text-xs">
											{professional.professionType}
										</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Calendar */}
			{filteredProfessionals.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							Book Appointment - {filteredProfessionals.length} Professionals
						</CardTitle>
					</CardHeader>
					<CardContent>
						<OrganizationAppointmentCalendar
							professionals={filteredProfessionals}
							organizationId={params.id}
						/>
					</CardContent>
				</Card>
			)}

			{/* No Professionals */}
			{affiliatedProfessionals.length === 0 && (
				<Card>
					<CardContent className="p-8 text-center text-gray-500">
						<Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">No Professionals Available</h3>
						<p>{"This organization doesn't have any affiliated professionals yet."}</p>
					</CardContent>
				</Card>
			)}

			{/* No Filtered Results */}
			{affiliatedProfessionals.length > 0 && filteredProfessionals.length === 0 && (
				<Card>
					<CardContent className="p-8 text-center text-gray-500">
						<Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">No Professionals Found</h3>
						<p>No professionals match the selected specialty filter.</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}