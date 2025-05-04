import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Edit, Plus, Trash } from 'lucide-react';
import { Checkbox } from '../../ui/checkbox';
import { format } from 'date-fns';


export default function ExperienceSection(props) {
	const [experiences, setExperiences] = useState(props.experiences || []);
	const [currentExperience, setCurrentExperience] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const formatDate = (date) => format(new Date(date), 'MMM yyyy');


	const handleSave = (experience) => {
		if (currentExperience !== null) {
			const updatedExperiences = [...experiences];
			updatedExperiences[currentExperience] = experience;
			setExperiences(updatedExperiences);
			props.update({ experience: updatedExperiences });
		} else {
			const newExperiences = [...experiences, experience];
			setExperiences(newExperiences);
			props.update({ experience: newExperiences });
		}
		setCurrentExperience(null);
		setIsDialogOpen(false);
	};

	const handleEdit = (index) => {
		setCurrentExperience(index);
		setIsDialogOpen(true);
	};

	const handleDelete = (index) => {
		const updatedExperiences = experiences.filter((_, i) => i !== index);
		setExperiences(updatedExperiences);
		props.update({ experience: updatedExperiences });
	};

	return (
		<>
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Experience</h2>
				<Button variant="secondary" onClick={() => { setCurrentExperience(null); setIsDialogOpen(true); }}>
					<Plus /> Add Experience
				</Button>
			</div>
			<div className="space-y-4 mt-4">
				{experiences.map((experience, index) => (
					<div key={index} className="flex items-center justify-between group">
						<div>
							<h3 className="font-semibold">{experience.role}{" : "}{formatDate(experience.startDate) + " - " + (experience.isCurrent ? 'Present' : formatDate(experience.endDate))}</h3>
							<p className="text-sm text-gray-500">at <b>{experience.organization}</b>
								<br /><b>{experience.department}</b>
							</p>
						</div>
						<div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<Button variant="secondary" className="hidden group-hover:flex  " onClick={() => handleEdit(index)}>
								<Edit /> Edit
							</Button>
							<Button variant="outline" className="hidden group-hover:flex  " onClick={() => handleDelete(index)}>
								<Trash />
							</Button>
						</div>
					</div>
				))}
			</div>
			{isDialogOpen && (
				<AddExperience
					handleSave={handleSave}
					experience={currentExperience !== null ? experiences[currentExperience] : null}
					setIsDialogOpen={setIsDialogOpen}
				/>
			)}
		</>
	);
}

const AddExperience = ({ handleSave, experience, setIsDialogOpen }) => {
	const [organization, setOrganization] = useState(experience ? experience.organization : '');
	const [role, setRole] = useState(experience ? experience.role : '');
	const [department, setDepartment] = useState(experience ? experience.department : '');
	const [startDate, setStartDate] = useState(experience ? format(new Date(experience.startDate), 'yyyy-MM-dd') : '');
	const [isCurrent, setIsCurrent] = useState(experience ? experience.isCurrent : false);
	const [endDate, setEndDate] = useState(experience ? format(new Date(experience.endDate), 'yyyy-MM-dd') : '');

	return (
		<Dialog open={true} onOpenChange={setIsDialogOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{experience ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<Input
						id="organization"
						type="text"
						placeholder="Organization"
						value={organization}
						onChange={(e) => setOrganization(e.target.value)}
					/>
					<Input
						id="role"
						type="text"
						placeholder="Role"
						value={role}
						onChange={(e) => setRole(e.target.value)}
					/>
					<Input
						id="department"
						type="text"
						placeholder="Department"
						value={department}
						onChange={(e) => setDepartment(e.target.value)}
					/>
					<div>
						<label htmlFor="startDate">Start Date</label>
						<Input
							id="startDate"
							type="date"
							placeholder="Start Date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
					</div>
					{!isCurrent &&
						<div>
							<label htmlFor="endDate">End Date</label>
							<Input
								id="endDate"
								type="date"
								placeholder="End Date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								disabled={isCurrent}
							/>
						</div>
					}
					<Checkbox
						checked={isCurrent}
						onCheckedChange={setIsCurrent}
						id="isCurrent" />
					<label htmlFor="isCurrent">{"  "}Is Current Job</label>
					<div className="grid grid-cols-2 gap-4">
						<Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
						<Button onClick={() =>
							handleSave({
								organization,
								role,
								department,
								startDate,
								endDate,
								isCurrent
							})
						}>Save</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
