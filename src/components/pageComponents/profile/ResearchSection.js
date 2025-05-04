import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Edit, Plus, Trash } from 'lucide-react';
import { Checkbox } from '../../ui/checkbox';
import { format } from 'date-fns';
import { Textarea } from '../../ui/textarea';

export default function ResearchSection(props) {
	const [researchProjects, setResearchProjects] = useState(props.researchProjects || []);
	const [currentProject, setCurrentProject] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const formatDate = (date) => format(new Date(date), 'MMM yyyy');

	const handleSave = (project) => {
		if (currentProject !== null) {
			const updatedProjects = [...researchProjects];
			updatedProjects[currentProject] = project;
			setResearchProjects(updatedProjects);
			props.update({ researchProjects: updatedProjects });
		} else {
			const newProjects = [...researchProjects, project];
			setResearchProjects(newProjects);
			props.update({ researchProjects: newProjects });
		}
		setCurrentProject(null);
		setIsDialogOpen(false);
	};

	const handleEdit = (index) => {
		setCurrentProject(index);
		setIsDialogOpen(true);
	};

	const handleDelete = (index) => {
		const updatedProjects = researchProjects.filter((_, i) => i !== index);
		setResearchProjects(updatedProjects);
		props.update({ researchProjects: updatedProjects });
	};

	return (
		<div>
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Research Projects</h2>
				<Button variant="secondary" onClick={() => { setCurrentProject(null); setIsDialogOpen(true); }}>
					<Plus /> Add Project
				</Button>
			</div>
			<div className="space-y-4 mt-4">
				{researchProjects.map((project, index) => (
					<div key={index} className="flex items-center justify-between group">
						<div>
							<h3 className="font-semibold">{project.title}{" : "}{formatDate(project.startDate) + " - " + (project.isOngoing ? 'Present' : formatDate(project.endDate))}</h3>
							<p className="text-sm text-gray-500">at <b>{project.associatedWith}</b>
								<br />in <b>{project.field}</b>
							</p>
						</div>
						<div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<Button variant="secondary" className="hidden group-hover:flex" onClick={() => handleEdit(index)}>
								<Edit /> Edit
							</Button>
							<Button variant="outline" className="hidden group-hover:flex" onClick={() => handleDelete(index)}>
								<Trash />
							</Button>
						</div>
					</div>
				))}
			</div>
			{isDialogOpen && (
				<AddProject
					handleSave={handleSave}
					project={currentProject !== null ? researchProjects[currentProject] : null}
					setIsDialogOpen={setIsDialogOpen}
				/>
			)}
		</div>
	);
}

const AddProject = ({ handleSave, project, setIsDialogOpen }) => {
	const [title, setTitle] = useState(project ? project.title : '');
	const [summary, setSummary] = useState(project ? project.summary : '');
	const [associatedWith, setAssociatedWith] = useState(project ? project.associatedWith : '');
	const [resourcesUsed, setResourcesUsed] = useState(project ? project.resourcesUsed.join(', ') : '');
	const [startDate, setStartDate] = useState(project ? format(new Date(project.startDate), 'yyyy-MM-dd') : '');
	const [isOngoing, setIsOngoing] = useState(project ? project.isOngoing : false);
	const [endDate, setEndDate] = useState(project ? format(new Date(project.endDate), 'yyyy-MM-dd') : '');
	const [field, setField] = useState(project ? project.field : '');

	return (
		<Dialog open={true} onOpenChange={setIsDialogOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{project ? 'Edit Project' : 'Add Project'}</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<Input
						id="title"
						type="text"
						placeholder="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<Input
						id="field"
						type="text"
						placeholder="Field"
						value={field}
						onChange={(e) => setField(e.target.value)}
					/>
					<Input
						id="associatedWith"
						type="text"
						placeholder="Associated With"
						value={associatedWith}
						onChange={(e) => setAssociatedWith(e.target.value)}
					/>
					<Input
						id="resourcesUsed"
						type="text"
						placeholder="Resources Used (comma separated)"
						value={resourcesUsed}
						onChange={(e) => setResourcesUsed(e.target.value)}
					/>

					<Textarea
						id="summary"
						type="text"
						placeholder="Summary"
						value={summary}
						onChange={(e) => setSummary(e.target.value)}
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
					{!isOngoing &&
						<div>
							<label htmlFor="endDate">End Date</label>
							<Input
								id="endDate"
								type="date"
								placeholder="End Date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								disabled={isOngoing}
							/>
						</div>
					}
					<Checkbox
						checked={isOngoing}
						onCheckedChange={setIsOngoing}
						id="isOngoing" />
					<label htmlFor="isOngoing">{"  "}Is Ongoing</label>

					<div className="grid grid-cols-2 gap-4">
						<Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
						<Button onClick={() =>
							handleSave({
								title,
								summary,
								associatedWith,
								resourcesUsed: resourcesUsed.split(',').map(resource => resource.trim()),
								startDate,
								endDate,
								isOngoing,
								field
							})
						}>Save</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}