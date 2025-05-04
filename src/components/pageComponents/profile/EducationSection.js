import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Button, buttonVariants } from "../../ui/button";
import { cn } from '@/lib/utils';
import { Calendar, Edit, GraduationCap, Medal, Plus, Trash, University } from "lucide-react";

export const EducationSection = (props) => {
	const [educations, setEducations] = useState(props.educations);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [currentEducation, setCurrentEducation] = useState(null);
	const [dialogIndex, setDialogIndex] = useState(null);

	const handleEdit = (education, index) => {
		setCurrentEducation(education);
		setDialogIndex(index);
		setIsDialogOpen(true);
	};

	const handleSave = (education, index) => {
		const updatedEducations = [...educations];
		updatedEducations[index] = education;
		setEducations(updatedEducations);
		console.log("hello adnan", "\n debug check here", updatedEducations)
		props.update({ education: updatedEducations });
		setIsDialogOpen(false);
		setDialogIndex(null);
	};

	const handleDelete = (index) => {
		// remove the element from the array
		const updateEducation = [...educations];
		updateEducation.splice(index, 1);
		setEducations(updateEducation);
		console.log("hello adnan", "\n debug check here", updateEducation)
		props.update({ education: updateEducation });
	};

	return (
		<>
			<div className='flex justify-between items-center mb-3'>
				<h2 className='text-base font-thin italic '>Educations</h2>
				<div>
					<AddEditDegree
						onSave={(education) => {
							setEducations([...educations, education]);
							props.update({ education: [...educations, education] });
						}
						} />
				</div>
			</div>
			{educations?.map((education, index) => (
				<div key={index} className='mb-1'>
					<Dialog
						open={isDialogOpen && dialogIndex === index}
						onOpenChange={(open) => {
							setIsDialogOpen(open);
							if (!open) setDialogIndex(null);
						}}
					>
						<DialogTrigger className='text-lg w-full text-left p-2 rounded-md bg-zinc-50 hover:bg-zinc-100	  ' onClick={() => handleEdit(education, index)}>
							<div className='w-full '>
								<div className="flex items-center gap-2" >
									<GraduationCap />
									<p>{education.degree}</p>
								</div>
								<div className="flex items-center gap-2" >
									<University />
									<p>{education.specialization}</p>
								</div>
							</div>
						</DialogTrigger>
						<DialogContent>
							<div className='space-y-2 '>
								<h3 className='text-xl font-bold text-center'>{education.degree}</h3>
								<div className='flex flex-col gap-4'>
									<div className='flex items-center gap-2'>
										<GraduationCap />
										<p className='text-sm font-medium'>{education.institution}</p>
									</div>
									{education.year &&
										<div className='flex items-center gap-2'>
											<Calendar />
											<p className='text-sm text-gray-600'>{education.year}</p>
										</div>
									}
									{education.specialization &&
										<div className='flex items-center gap-2'>
											<Medal />
											<p className='text-sm text-gray-600'>{education.specialization}</p>
										</div>
									}
									<div className='flex justify-end'>
										<Button variant="icon" onClick={() => handleDelete(index)}>
											<Trash />
										</Button>
									</div>
								</div>
							</div>
							<div className='grid grid-cols-2 gap-2 '>
								<Button variant="default" onClick={() => setIsDialogOpen(false)}>Close</Button>
								<AddEditDegree
									education={education}
									onSave={(updatedEducation) => handleSave(updatedEducation, index)}
								/>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			))}
		</>
	);
}

export const AddEditDegree = (props) => {
	const [education, setEducation] = useState(props.education);
	const [degree, setDegree] = useState(education?.degree || '');
	const [institution, setInstitution] = useState(education?.institution || '');
	const [year, setYear] = useState(education?.year || '');
	const [specialization, setSpecialization] = useState(education?.specialization || '');
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleSave = () => {
		if (props.onSave) {
			props.onSave({
				degree,
				institution,
				year,
				specialization
			});
			setDegree('');
			setInstitution('');
			setYear('');
			setSpecialization('');
			setIsDialogOpen(false);
		}
	};

	return (
		<Dialog open={isDialogOpen}
			onOpenChange={setIsDialogOpen}
		>
			<DialogTrigger className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "w-full")}>
				{education ? < ><Edit />Edit Degree</ > : < ><Plus /> Add Degree</ >}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{education ? 'Edit Education Details' : 'Add Education Details'}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<Input
						name="degree"
						type="text"
						placeholder="Degree (e.g. MS)" value={degree}
						onChange={(e) => setDegree(e.target.value)}
					/>
					<Input
						name="institution"
						type="text"
						placeholder="Institution (e.g. Stanford University)" value={institution}
						onChange={(e) => setInstitution(e.target.value)}
					/>
					<Input
						name="year"
						type="number"
						placeholder="Year (e.g. 2020)"
						value={year}
						onChange={(e) => setYear(parseInt(e.target.value, 10) || '')}
						min={1900}
						max={2025}
					/>
					<Input
						name="specialization"
						type="text"
						value={specialization}
						placeholder="Specialization (e.g. Cardiology, Neurology, Pediatrics)"
						onChange={(e) => setSpecialization(e.target.value)}
					/>
					<div className='grid grid-cols-2 gap-2'>
						<Button variant="default" className="w-full" onClick={handleSave}>
							{education ? 'Save Changes' : 'Add Degree'}
						</Button>
						<Button
							variant="secondary"
							className="w-full"
							onClick={() => { setIsDialogOpen(false) }}
						>
							Cancel
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};