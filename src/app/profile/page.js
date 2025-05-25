"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EducationSection } from '@/components/pageComponents/profile/EducationSection';
import SkillsSection from '@/components/pageComponents/profile/SkillsSection';
import ExperienceSection from '@/components/pageComponents/profile/ExperienceSection';
import ResearchSection from '@/components/pageComponents/profile/ResearchSection';
import CertificationSection from '@/components/pageComponents/profile/CertificationSection';
import IntroSection from '@/components/pageComponents/profile/IntroSection';

export default function ProfilePage() {
	const [user, setUser] = useState(null);
	const [profileUpdate, setProfileUpdate] = useState({ name: '', bio: '', profilePic: '', });
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [professionalApplication, setProfessionalApplication] = useState({
		professionType: '',
		contactDetails: {
			phone: '',
		},
		verificationDocuments: [],
	});

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios.get('/api/user');
				setUser(response.data);
			} catch (error) {
				console.error('Error fetching user:', error);
			}
		};
		fetchUser();
	}, []);

	if (!user) return <div className='h-96 flex items-center justify-center'>Loading...</div>;

	return (
		<div className="pt-5">
			<section className='flex gap-3 flex-col sm:flex-row'>
				<div className='relative  '>
					<Card className='relative'>
						<CardHeader>
							<Avatar className='h-56 w-56 bg-white ring-4 mb-6 ring-green-800 group  hover:ring-[6px] hover:border-[6px] transition-all duration-100 border-4 border-white'>
								<AvatarImage src={user.profilePic || "/logo.svg"} alt="User Profile Picture" />
								<AvatarFallback>{user.name}</AvatarFallback>
							</Avatar>
							<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
								<DialogTrigger
									className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "rounded-full group absolute bottom-3/4 left-3/4 bg-transparent shadow-transparent")}
									onClick={() => setIsDialogOpen(true)} // Open dialog when clicked
								>
									<Edit2 className='stroke-gray-200 fill-gray-800 group-hover:stroke-gray-800 group-hover:fill-gray-200 transition-all duration-200 ease-in-out ' />
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Edit Profile</DialogTitle>
									</DialogHeader>
									<DialogDescription>
										<form onSubmit={async (e) => {
											e.preventDefault();
											try {
												const data = new FormData();
												data.append('name', profileUpdate.name || user.name);
												data.append('bio', profileUpdate.bio || user.bio);
												data.append('profilePic', profileUpdate.profilePic);
												data.append('userId', user._id);

												const response = await axios.put('/api/user', data);
												if (response.status === 200) {
													const userResponse = await axios.get('/api/user');
													setUser(userResponse.data);
													setIsDialogOpen(false); // Close the dialog on success

												} else {
													throw new Error('Failed to update profile');
												}
											} catch (error) {
												console.error('Error updating profile:', error);
											}
										}}
										>
											<div className='space-y-4'>
												<Input type="text" placeholder='Name' defaultValue={user.name} onChange={(e) => setProfileUpdate((prev) => ({ ...prev, name: e.target.value }))} />
												<Input type="text" placeholder='Bio' maxLength={100} defaultValue={user.bio} onChange={(e) => setProfileUpdate((prev) => ({ ...prev, bio: e.target.value }))} />
												<Input
													type="file"
													placeholder="Profile Pic"
													multiple={false}
													onChange={(e) => setProfileUpdate((prev) => ({ ...prev, profilePic: e.target.files[0] }))}
												/>
												<Button type='submit'>Save</Button>

											</div>
										</form>
									</DialogDescription>
								</DialogContent>
							</Dialog>
							<h1 className='text-center font-bold text-xl uppercase '>{user.name}</h1>
						</CardHeader>
					</Card>

				</div>
				<div className='grow'>
					{user.isProfessional ? (
						<>
							<ProfessionalSection props={user} />
						</>) : (
						<Card className='h-full'>
							<CardContent className='h-full  pt-6  '>
								<CardTitle className="text-5xl">@{user.name}</CardTitle>
								<div className='flex flex-col mt-6 text-2xl text-gray-500 font-bold'>
									<div>{user.bio}</div>
									<p></p>
								</div>
								<div className='flex gap-4 pt-5 flex-wrap'>
									<Badge variant={user.isEmailVerified ? "default" : "destructive"} >{user.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}</Badge>
									{user.accountLocked && <Badge variant="destructive"> </Badge>}
									{user.isProfessional ? (<Button variant="secondary">Profession: {user.professionalApplication.professionType}</Button>)
										: (user.professionalApplication ?
											<>
												<Button variant="secondary" className='capitalize'>Applyed For <span className='underline'>{user.professionalApplication.professionType}</span> Profession</Button>
												<Badge
													variant={user.professionalApplication.status === 'pending' ? 'warning' : user.professionalApplication.status === 'approved' ? 'success' : 'destructive'} >
													{user.professionalApplication.status}
												</Badge>
											</>
											:
											<Dialog>
												<DialogTrigger className={cn(buttonVariants({ variant: "secondary" }))}>Be a Professional</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>Become a Professional</DialogTitle>
													</DialogHeader>
													<DialogDescription>
														Fill in the profession type, contact details, and verification documents for your professional application.
													</DialogDescription>
													<form
														onSubmit={async (e) => {
															e.preventDefault();
															try {
																const data = new FormData();
																data.append('professionType', professionalApplication.professionType);
																data.append('phone', professionalApplication.contactDetails.phone);
																data.append('email', user.email);
																data.append('userId', user._id);
																professionalApplication.verificationDocuments.forEach((file) =>
																	data.append('verificationDocuments', file)
																);

																const response = await axios.post('/api/professional/apply', data);

																if (response.status === 200) {
																	const userResponse = await axios.get('/api/user');
																	setUser(userResponse.data);
																} else {
																	throw new Error('Failed to submit application');
																}
															} catch (error) {
																console.error('Error submitting application:', error);
															}
														}}
													>
														<div className='space-y-4'>
															<Select
																value={professionalApplication.professionType}
																onValueChange={(value) => setProfessionalApplication((prev) => ({ ...prev, professionType: value }))}
															>
																<SelectTrigger className="w-full">
																	<SelectValue placeholder="Select Profession Type" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="doctor">Doctor</SelectItem>
																	<SelectItem value="nurse">Nurse</SelectItem>
																	<SelectItem value="pharmacist">Pharmacist</SelectItem>
																	<SelectItem value="therapist">Therapist</SelectItem>
																	<SelectItem value="dentist">Dentist</SelectItem>
																	<SelectItem value="physiotherapist">Physiotherapist</SelectItem>
																	<SelectItem value="psychiatrist">Psychiatrist</SelectItem>
																	<SelectItem value="nutritionist">Nutritionist</SelectItem>
																	<SelectItem value="optometrist">Optometrist</SelectItem>
																	<SelectItem value="paramedic">Paramedic</SelectItem>
																	<SelectItem value="radiologist">Radiologist</SelectItem>
																	<SelectItem value="surgeon">Surgeon</SelectItem>
																	<SelectItem value="midwife">Midwife</SelectItem>
																	<SelectItem value="lab_technician">Lab Technician</SelectItem>
																	<SelectItem value="phlebotomist">Phlebotomist</SelectItem>
																	<SelectItem value="medical_assistant">Medical Assistant</SelectItem>
																	<SelectItem value="emergency_medical_technician">Emergency Medical Technician (EMT)</SelectItem>
																	<SelectItem value="healthcare_administrator">Healthcare Administrator</SelectItem>
																	<SelectItem value="medical_technologist">Medical Technologist</SelectItem>
																	<SelectItem value="researcher">Medical Researcher</SelectItem>
																	<SelectItem value="other">Other</SelectItem>
																</SelectContent>
															</Select>
															<Input
																type="tel"
																placeholder="Phone Number"
																value={professionalApplication.contactDetails.phone}
																onChange={(e) =>
																	setProfessionalApplication((prev) => ({
																		...prev,
																		contactDetails: { ...prev.contactDetails, phone: e.target.value },
																	}))
																}
															/>
															<Input
																type="file"
																placeholder="Upload Verification Documents"
																multiple
																accept="application/pdf, image/*"
																onChange={(e) =>
																	setProfessionalApplication((prev) => ({
																		...prev,
																		verificationDocuments: Array.from(e.target.files),
																	}))
																}
															/>
															<Button variant="primary" className="w-48" type="submit">
																Submit
															</Button>
														</div>
													</form>
												</DialogContent>
											</Dialog>
										)}
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</section>
			<section className='pt-5'>
			</section>
		</div>
	);
}



const ProfessionalSection = ({ props }) => {
	const [professionalData, setProfessionalData] = useState(null);
	const updateProfessionalProfileData = async (data) => {
		try {
			const response = await axios.put('/api/professional/update', { ProfessionalId: professionalData._id, data: data });
			if (response.status === 200) {
				setProfessionalData(response.data.professional);
				console.log('Updated professional profile data: ', response.data.professional);
			} else {
				throw new Error('Failed to update professional profile');
			}
		} catch (error) {
			console.error('Error updating professional profile:', error);
		}
	};

	useEffect(() => {
		const fetchProfessionalData = async () => {
			try {
				const response = await axios.get('/api/professional', { params: { userId: props._id } });
				setProfessionalData(response.data.professional);
				console.log('Fetched professional data: ', response.data.professional);
			} catch (error) {
				console.error('Error fetching professional data:', error);
			}
		};
		fetchProfessionalData();
	}, [props._id, setProfessionalData]);

	if (!professionalData) {
		return <div className="h-96 flex items-center justify-center">Loading...</div>;
	}

	return (
		<div className=' space-y-6'>
			<Card className='min-h-full relative '>
				<CardContent className='pt-6'>
					<IntroSection professionalData={professionalData} updateProfessionalProfileData={updateProfessionalProfileData} />
				</CardContent>
			</Card >
			<Card>
				<CardContent>
					<div className='grid grid-cols-1 xl:grid-cols-2	  h-full mt-6 gap-4'>
						<div className='flex flex-col justify-between '>
							<EducationSection
								educations={professionalData.education}
								update={updateProfessionalProfileData}
							/>
						</div>
						<hr className='xl:hidden border-green-900' />
						<div>
							<SkillsSection skills={professionalData.skills} update={updateProfessionalProfileData} />
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className={' pt-6'}>
					<ExperienceSection experiences={professionalData.experience}
						update={updateProfessionalProfileData}
					/>
				</CardContent>
			</Card>
			<Card>
				<CardContent className={' pt-6'}>
					<ResearchSection
						researchProjects={professionalData.researchProjects}
						update={updateProfessionalProfileData}
					/>
				</CardContent>
			</Card>
			<Card>
				<CardContent className={' pt-6'}>
					<CertificationSection
						certifications={professionalData.certifications}
						update={updateProfessionalProfileData}
					/>
				</CardContent>
			</Card>
		</div>
	);
};	
