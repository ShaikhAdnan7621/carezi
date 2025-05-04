import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Binoculars, Edit2, Facebook, Instagram, Linkedin, Recycle, Trash2, Twitter } from 'lucide-react';
import { Button, buttonVariants } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import Lineplaceholder from '@/components/skeleton/lineplaceholder';
import { cn } from '@/lib/utils';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

export default function IntroSection({ professionalData, updateProfessionalProfileData }) {
	const [localProfessionalData, setLocalProfessionalData] = useState(professionalData);

	useEffect(() => {
		setLocalProfessionalData(professionalData);
	}, [professionalData]);

	const handleUpdate = (data) => {
		updateProfessionalProfileData(data);
		setLocalProfessionalData((prev) => ({ ...prev, ...data }));
	};

	return (
		<>
			<div className=' relative '>
				<Dialog>
					<DialogTrigger className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "rounded-full group absolute top-0 right-2 shadow-transparent")}>
						<Edit2 className='stroke-gray-200 fill-gray-800 group-hover:stroke-gray-800 group-hover:fill-gray-200 transition-all duration-200 ease-in-out ' />
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit Professional Profile</DialogTitle>
						</DialogHeader>
						<EditIntro professionalData={localProfessionalData} update={handleUpdate} />
					</DialogContent>
				</Dialog>
				<div>
					{localProfessionalData.profileSummary ? (
						<>
							<h1 className='font-bold text-xl capitalize pr-10'>
								{localProfessionalData.profileSummary.headline || <Lineplaceholder />}
							</h1>
							<h1 className='italic mt-1 font-thin pr-10'>
								{localProfessionalData.profileSummary.bio || <Lineplaceholder />}
							</h1>
						</>
					) : (
						<>
							<Lineplaceholder />
							<Lineplaceholder />
						</>
					)}
				</div>
				<hr  className='mt-4'/>
				<div className='flex items-center justify-between mt-4'>

					{localProfessionalData.professionType ? (
						<Badge variant="outline" className='text-base uppercase'>
							{`	Profession Type: ${localProfessionalData.professionType} `}
						</Badge>
					) : <Lineplaceholder />}

					{localProfessionalData.socialMediaLinks && (
						<div className="flex gap-4 items-center">
							{['facebook', 'instagram', 'linkedin', 'twitter'].map((platform) =>
								localProfessionalData.socialMediaLinks[platform] && (
									<a key={platform}
										href={localProfessionalData.socialMediaLinks[platform]}
										target="_blank"
										rel="noopener noreferrer"
									>
										{platform === 'facebook' && <Facebook className="w-6 h-6 hover:text-blue-600" />}
										{platform === 'instagram' && <Instagram className="w-6 h-6 hover:text-pink-600" />}
										{platform === 'linkedin' && <Linkedin className="w-6 h-6 hover:text-blue-800" />}
										{platform === 'twitter' && <Twitter className="w-6 h-6 hover:text-sky-500" />}
									</a>
								)
							)}
						</div>
					)}
				</div>

			</div>

			<div className='mt-4 relative border rounded-md '>
				<Dialog >
					<DialogTrigger className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "rounded-full group absolute top-2 right-2 shadow-transparent")}>
						<Edit2 className='stroke-gray-200 fill-gray-800 group-hover:stroke-gray-800 group-hover:fill-gray-200 transition-all duration-200 ease-in-out ' />
					</DialogTrigger>
					<DialogContent className='max-h-screen overflow-y-auto'>
						<DialogHeader>
							<DialogTitle>Edit Professional Profile</DialogTitle>
						</DialogHeader>
						<ConsultationDetailsAndLanguages professionalData={localProfessionalData} update={handleUpdate} />
					</DialogContent>
				</Dialog>
				{/* Add consultation details */}
				<div className='flex flex-col xl:flex-row h-full gap-4'>
					{localProfessionalData.consultationDetails && (
						<div className='rounded-md p-2 flex-1'>
							<h2 className='font-bold text-lg'>Consultation Details</h2>
							<div className='flex flex-col md:flex-row md:flex-wrap gap-4'>
								<div className='flex-1'>
									<p><strong>Availability:</strong> {localProfessionalData.consultationDetails.availability}</p>
								</div>
								<div className='flex-1'>
									<p><strong>Fee:</strong> ${localProfessionalData.consultationDetails.fee.minimum} - ${localProfessionalData.consultationDetails.fee.maximum}</p>
								</div>
								<div className='w-full'>
									<h3 className='font-semibold text-md'>Hours</h3>
									<div className='flex flex-col gap-2'>
										{localProfessionalData.consultationDetails.hours.map((hour, index) => (
											<div key={index} className='flex justify-between'>
												<p>{hour.day}:</p>
												<p>{hour.startTime} - {hour.endTime}</p>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}
					<div className='m-2 border-t xl:border-t-0 xl:border-l' />
					{/* Add languages */}
					{localProfessionalData.languages && (
						<div className='rounded-md p-2 flex-1'>
							<h2 className='font-bold text-lg'>Languages</h2>
							<div className='flex flex-wrap gap-2'>
								{localProfessionalData.languages.map((language, index) => (
									<Badge key={index} variant={"outline"} className={'text-base'}>{language.name} ({language.proficiency})</Badge>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}



const EditIntro = ({ professionalData, update }) => {
	const [bio, setBio] = useState(professionalData?.profileSummary?.bio || "");
	const [headline, setHeadline] = useState(professionalData?.profileSummary?.headline || "");
	const [socialLinks, setSocialLinks] = useState(professionalData?.socialMediaLinks || {});

	const handleSocialChange = (platform, value) => {
		setSocialLinks((prev) => ({ ...prev, [platform]: value }));
	};

	return (
		<div className="space-y-6 p-4">
			{/* Profile Summary */}
			<div>
				<h3 className="font-semibold">Profile Summary</h3>
				<Textarea
					placeholder="Bio"
					value={bio}
					onChange={(e) => setBio(e.target.value)}
				/>
				<Input
					placeholder="Headline"
					value={headline}
					onChange={(e) => setHeadline(e.target.value)}
				/>
			</div>

			{/* Social Media Links */}
			<div>
				<h3 className="font-semibold">Social Media Links</h3>
				<div className="grid grid-cols-2 gap-3">
					{[{ icon: Facebook, name: "facebook" }, { icon: Instagram, name: "instagram" },
					{ icon: Linkedin, name: "linkedin" }, { icon: Twitter, name: "twitter" }].map(({ icon: Icon, name }) => (
						<div key={name} className="flex items-center gap-2">
							<Icon className="w-6 h-6" />
							<Input
								type="url"
								placeholder={`${name.charAt(0).toUpperCase() + name.slice(1)} Profile Link`}
								value={socialLinks[name] || ""}
								onChange={(e) => handleSocialChange(name, e.target.value)}
							/>
						</div>
					))}
				</div>
			</div>

			<Button onClick={() => update({ profileSummary: { bio, headline }, socialMediaLinks: socialLinks })} className="w-full mt-5">Save</Button>
		</div>
	);
};


const ConsultationDetailsAndLanguages = ({ professionalData, update }) => {
	const [availability, setAvailability] = useState(professionalData?.consultationDetails?.availability || "moderate");
	const [hours, setHours] = useState(professionalData?.consultationDetails?.hours.length ? professionalData.consultationDetails.hours : [{ day: "", startTime: "", endTime: "" }]);
	const [fee, setFee] = useState(professionalData?.consultationDetails?.fee || { minimum: "", maximum: "" });
	const [languages, setLanguages] = useState(professionalData?.languages || []);

	const handleHourChange = (index, field, value) => {
		const updatedHours = [...hours];
		updatedHours[index][field] = value;
		setHours(updatedHours);
	};

	const handleFeeChange = (field, value) => {
		setFee((prev) => ({ ...prev, [field]: value }));
	};

	const handleLanguageChange = (index, field, value) => {
		const updatedLanguages = [...languages];
		updatedLanguages[index][field] = value;
		setLanguages(updatedLanguages);
	};

	return (
		<div className="space-y-6 ">
			{/* Consultation Details */}
			<h3>Consultation Details</h3>
			<div className='space-y-4 border p-2 rounded-md '>
				<div className="flex justify-between items-center ">
					<p >Consultation Hours</p>
					<Button variant="secondary"
						onClick={() => {
							if (hours.length < 7) {
								setHours([...hours, { day: "", startTime: "", endTime: "" }]);
							}
						}}
					>Add Hour</Button>
				</div>
				<div>
					{hours.map((hour, index) => (
						<div key={index} className="flex gap-2 items-center mt-1">
							<Select value={hour.day} onValueChange={(value) => handleHourChange(index, "day", value)}>
								<SelectTrigger>
									<SelectValue placeholder="Select Day" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="monday">Monday</SelectItem>
									<SelectItem value="tuesday">Tuesday</SelectItem>
									<SelectItem value="wednesday">Wednesday</SelectItem>
									<SelectItem value="thursday">Thursday</SelectItem>
									<SelectItem value="friday">Friday</SelectItem>
									<SelectItem value="saturday">Saturday</SelectItem>
									<SelectItem value="sunday">Sunday</SelectItem>
								</SelectContent>
							</Select>
							<Input type="time" value={hour.startTime} onChange={(e) => handleHourChange(index, "startTime", e.target.value)} />
							<Input type="time" value={hour.endTime} onChange={(e) => handleHourChange(index, "endTime", e.target.value)} />
							<Button variant="destructive" onClick={() => {
								setHours(hours.filter((_, i) => i !== index));
							}}>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					))}
				</div>
				{/* Availability */}
				<div className='space-y-1'>
					<p >Availability</p>

					<Select value={availability} onValueChange={(value) => setAvailability(value)} 				>
						<SelectTrigger>
							<SelectValue placeholder="Select Availability" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="high">High</SelectItem>
							<SelectItem value="moderate">Moderate</SelectItem>
							<SelectItem value="low">Low</SelectItem>
							<SelectItem value="unavailable">Unavailable</SelectItem>
						</SelectContent>
					</Select>
				</div>


				{/* Consultation Fee */}
				<div className='space-y-1'>
					<p >Consultation Fee</p>
					<div className="flex gap-2">
						<Input type="number" placeholder="Minimum Fee" value={fee.minimum} onChange={(e) => handleFeeChange("minimum", e.target.value)} />
						<Input type="number" placeholder="Maximum Fee" value={fee.maximum} onChange={(e) => handleFeeChange("maximum", e.target.value)} />
					</div>
				</div>
			</div>
			{/* Languages */}
			<div>
				<div className="flex justify-between">
					<h3 className="font-semibold">Languages</h3>
					<Button variant="secondary" onClick={() => setLanguages([...languages, { name: "", proficiency: "basic" }])}>Add Language</Button>
				</div>
				{languages.map((language, index) => (
					<div key={index} className="flex gap-2 items-center mt-2">
						<Input placeholder="Language" value={language.name} onChange={(e) => handleLanguageChange(index, "name", e.target.value)} />
						<Select value={language.proficiency} onValueChange={(value) => handleLanguageChange(index, "proficiency", value)}>
							<SelectTrigger>
								<SelectValue placeholder="Select Proficiency" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="basic">Basic</SelectItem>
								<SelectItem value="conversational">Conversational</SelectItem>
								<SelectItem value="fluent">Fluent</SelectItem>
								<SelectItem value="native">Native</SelectItem>
							</SelectContent>
						</Select>
						<Button variant="destructive" onClick={() => setLanguages(languages.filter((_, i) => i !== index))}>
							<Trash2 className="w-4 h-4" />

						</Button>
					</div>
				))}
			</div>

			<Button onClick={() => update({ consultationDetails: { availability, hours, fee }, languages })} className="w-full mt-5">Save</Button>
		</div>
	);
};