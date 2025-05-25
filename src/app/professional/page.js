'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, ArrowRight } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"

export default function page() {
	const [user, setUser] = useState({})
	const [loading, setLoading] = useState(false)
	const [professionals, setProfessionals] = useState([{}])
	const [error, setError] = useState(null)
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(20)

	useEffect(() => {
		const getUserData = async () => {
			setLoading(true)
			try {
				const response = await axios.get('/api/professional') // Added forward slash
				if (response.status === 200) {
					setUser(response.data.professional)
				} else {
					setError('Failed to fetch user data')
				}
			} catch (error) {
				console.error('API Error:', error) // Debug log
				setError(error)
			} finally {
				setLoading(false)
			}
		}
		getUserData()
	}, [search, page, limit])

	if (loading) {
		return (
			<div className="container mx-auto p-6 space-y-6">
				<Card className="w-full">
					<CardContent className="p-6">
						<div className="flex items-start gap-6">
							<Skeleton className="h-24 w-24 rounded-full" />
							<div className="space-y-2 w-full">
								<Skeleton className="h-8 w-3/4" />
								<Skeleton className="h-4 w-full" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container mx-auto p-6">
				<Card className="w-full">
					<CardContent className="p-6 text-center text-red-500">
						Failed to load profile data. Please try again later.
					</CardContent>
				</Card>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="container mx-auto p-6">
				<Card className="w-full">
					<CardContent className="p-6 text-center text-gray-500">
						No profile data available
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="container mx-auto p-6">
			{/* Header Section */}
			<Card className="w-full mb-6">
				<CardContent className="p-6">
					<div className="flex items-start gap-6">
						<Avatar className="h-24 w-24">
							<AvatarFallback>SA</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<h1 className="text-2xl font-bold">{user.profileSummary?.headline}</h1>
							<p className="text-gray-600">{user.profileSummary?.bio}</p>
							<div className="flex gap-2">
								<a href={user.socialMediaLinks?.linkedin} className="text-blue-600"><Linkedin /></a>
								<a href={user.socialMediaLinks?.twitter} className="text-blue-400"><Twitter /></a>
								<a href={user.socialMediaLinks?.facebook} className="text-blue-600"><Facebook /></a>
								<a href={user.socialMediaLinks?.instagram} className="text-pink-600"><Instagram /></a>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Contact Info */}
				<Card>
					<CardHeader>
						<CardTitle>Contact Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{user.contactDetails ? (
							<>
								hello
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4" />
									{console.log("hello andnan user.contactDetails")}
									<span>{user.contactDetails.phone || 'No phone number'}</span>
								</div>
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4" />
									<span>{user.contactDetails.email || 'No email'}</span>
								</div>
							</>
						) : (
							<p className="text-gray-500">No contact details available</p>
						)}
					</CardContent>
				</Card>

				{/* Skills */}
				<Card>
					<CardHeader>
						<CardTitle>Skills</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{user?.skills && Array.isArray(user.skills) && user.skills.length > 0 ? (
								user.skills.map((skill, index) => (
									<Badge key={skill._id || index} variant="secondary">
										{skill.name} - {skill.proficiency}
									</Badge>
								))
							) : (
								<p className="text-gray-500">No skills listed</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Languages */}
				<Card>
					<CardHeader>
						<CardTitle>Languages</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{user.languages && user.languages.length > 0 ? (
								user.languages.map((lang, index) => (
									<Badge key={index} variant="outline">
										{lang.name} ({lang.proficiency})
									</Badge>
								))
							) : (
								<p className="text-gray-500">No languages listed</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Education */}
			<Accordion type="single" collapsible >
				<AccordionItem value="educationdropdown">
					<AccordionTrigger className=" text-sm text-gray-500">
						Education & Experience
					</AccordionTrigger>
					<AccordionContent value="educationdropdown" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Education</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{user.education?.map((edu, index) => (
									<div key={index} className="space-y-2">
										<h3 className="font-semibold">{edu.degree}</h3>
										<p className="text-sm text-gray-600">{edu.institution}</p>
										<p className="text-sm">
											{edu.specialization} • {edu.year}
										</p>
										{index < user.education.length - 1 && <Separator />}
									</div>
								))}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Experience</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{user.experience?.map((exp, index) => (
									<div key={index} className="space-y-2">
										<h3 className="font-semibold">{exp.role}</h3>
										<p className="text-sm text-gray-600">{exp.organization} • {exp.department}</p>
										<p className="text-sm">
											{new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).getFullYear()}
										</p>
									</div>
								))}
							</CardContent>
						</Card>

						{/* Research Projects */}
						<Card>
							<CardHeader>
								<CardTitle>Research Projects</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{user.researchProjects?.map((project, index) => (
									<div key={index} className="space-y-2">
										<h3 className="font-semibold">{project.title}</h3>
										<p className="text-sm">{project.summary}</p>
										<p className="text-sm text-gray-600">
											{project.field} • {project.associatedWith}
										</p>
									</div>
								))}
							</CardContent>
						</Card>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			{user && <Suggestion props={{ user }} />}
		</div>

	)
}



const Suggestion = ({ props }) => {
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSimilarProfessionals = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                professionType: props.user.professionType || '',
                skills: props.user.skills?.map(s => s.name).filter(Boolean).join(',') || '',
                specializations: props.user.education?.map(e => e.specialization).filter(Boolean).join(',') || ''
            });

            const response = await axios.get(`/api/professional/suggestion?${queryParams}`);

            if (response.status === 200 && response.data.success) {
                setProfessionals(response.data.professionals);
            }
        } catch (error) {
            console.error('Error fetching similar professionals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (props.user?._id) {
            fetchSimilarProfessionals();
        }
    }, [props.user?._id]); 


	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl">Similar Professionals</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{professionals && professionals.length > 0 ? (
						professionals.slice(0, 3).map((prof, index) => (
							<Card key={prof._id || index} className="hover:shadow-lg transition-shadow">
								<CardContent className="p-4">
									<div className="flex items-start gap-4">
										<Avatar className="h-12 w-12">
											<AvatarFallback>{prof.profileSummary?.headline?.[0] || 'P'}</AvatarFallback>
										</Avatar>
										<div>
											<h3 className="font-semibold">{prof.profileSummary?.headline || 'Professional'}</h3>
											<p className="text-sm text-gray-600 line-clamp-2">
												{prof.profileSummary?.bio || 'No bio available'}
											</p>
											<a
												href={`/professional/${prof._id}`}
												className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800"
											>
												View Profile <ArrowRight className="ml-1 h-4 w-4" />
											</a>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<p className="text-gray-500 col-span-3 text-center py-4">
							No similar professionals found
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
