import React, { useState } from 'react'
import { Input } from '../../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../ui/select'
import { Edit, Plus, Save, Star } from 'lucide-react'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'

export default function SkillsSection(props) {
	const [skills, setSkills] = useState(props.skills)

	const handleAddSkill = (skills, name, proficiency) => {
		if (name && proficiency) {
			const newskills = [
				...(props?.skills ?? []),
				{ name, proficiency }
			]
			setSkills(newskills)
			props.update({ skills: newskills })
		}
	}

	const handleUpdateSkill = (index, name, proficiency) => {
		if (name && proficiency) {
			const newskills = [...props.skills]
			newskills[index] = { name, proficiency }
			setSkills(newskills)
			props.update({ skills: newskills })
		}
	}

	const deleteSkill = (index) => {
		const newskills = [...props.skills]
		newskills.splice(index, 1)
		setSkills(newskills)
		props.update({ skills: newskills })
	}

	const renderStars = (proficiency) => {
		const stars = [];
		const levels = { beginner: 1, intermediate: 2, advanced: 3 };
		for (let i = 0; i < levels[proficiency]; i++) {
			stars.push(<Star key={i} className={`h-4 w-4 ${proficiency === 'beginner' ? 'text-red-500' : proficiency === 'intermediate' ? 'text-yellow-500' : 'text-green-500'} `} />);
		}
		return stars;
	};

	const Addskill = (props) => {
		const [name, setName] = useState('')
		const [proficiency, setProficiency] = useState('')

		return (
			<div className='flex items-center justify-center rounded-full border '>
				<Input
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Skill Name"
					className="border-none shadow-none rounded-full outline-none focus:outline-none focus-visible:ring-0"
				/>
				<Select value={proficiency} onValueChange={setProficiency}>
					<SelectTrigger className="border-none shadow-none rounded-full outline-none focus:outline-none focus-visible:ring-0 focus:ring-0 w-36 px-0">
						<SelectValue placeholder="Proficiency" >
							{proficiency ? <span className=' w-fit flex items-center justify-center gap-1 '>{renderStars(proficiency)}</span> : "Select Proficiency"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Proficiency</SelectLabel>
							<SelectItem value="beginner">Beginner</SelectItem>
							<SelectItem value="intermediate">Intermediate</SelectItem>
							<SelectItem value="advanced">Advanced</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Button onClick={
					() => {
						handleAddSkill(skills, name, proficiency)
						setName('')
						setProficiency('')
					}
				} variant='ghost' className='border-none focus-visible:ring-0 shadow-none rounded-full px-3 py-1 ' ><Plus className='h-7 w-7' /></Button>
			</div>
		)
	}


	const Showskill = (props) => {
		const [edit, setEdit] = useState(false)
		const [name, setName] = useState(props.name)
		const [proficiency, setProficiency] = useState(props.proficiency)

		return (
			<li className='bg-gray-50 rounded-lg '>
				{edit ? (
					<div className='p-2'>
						<div className='flex items-center justify-between'>
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Skill Name"
								className="border-none shadow-none rounded-full outline-none focus:outline-none focus-visible:ring-0"
							/>
							<Button onClick={() => deleteSkill(props.index)} variant='ghost' className=' shadow-none rounded-full px-3 py-1 ' >
								Delete
							</Button>
						</div>
						<div className='flex items-center justify-between mt-2 '>
							<Select value={proficiency} onValueChange={setProficiency}>
								<SelectTrigger className="border-none shadow-none rounded-full outline-none ">
									<SelectValue placeholder="Proficiency" >
										{proficiency ? <span className=' w-fit flex items-center justify-center gap-1 '>{renderStars(proficiency)}</span> : "Select Proficiency"}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Proficiency</SelectLabel>
										<SelectItem value="beginner">Beginner</SelectItem>
										<SelectItem value="intermediate">Intermediate</SelectItem>
										<SelectItem value="advanced">Advanced</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<div className='flex items-center gap-2'>
								<Button onClick={() => setEdit(false)} variant='ghost' className='border-none shadow-none rounded-full px-3 py-1 ' >
									Cancel
								</Button>
								<Button onClick={() => {
									handleUpdateSkill(props.index, name, proficiency)
									setEdit(false)
								}} variant='ghost' className='border-none shadow-none rounded-full px-3 py-1 ' >
									<Save className='h-7 w-7' />
								</Button>
							</div>
						</div>
					</div>
				) : (
					<div className='flex items-center justify-between group transition-all duration-500 p-1'>
						<span className='text-lg'>{props.name}</span>
						<Badge variant={props.proficiency} className='flex items-center justify-center gap-1'>
							{props.proficiency ? (
								<span className='w-fit flex items-center justify-center gap-1'>
									{renderStars(props.proficiency)}
								</span>
							) : null}
							<Edit onClick={() => setEdit(true)} className='w-0 text-base opacity-0 group-hover:w-fit group-hover:ml-2 group-hover:opacity-100 transition-all duration-300 group-hover:duration-300 text-black' />
						</Badge>
					</div>
				)}
			</li>
		)
	}

	return (
		< >
			<div className='mb-3'>
				<h2 className='text-base font-thin italic '>Skills</h2>
			</div>
			<ul className='grid gap-2 '>
				{skills && skills.map((skill, index) => (
					<Showskill key={index} name={skill.name} proficiency={skill.proficiency} />
				))}
				<Addskill />
			</ul>
		</>
	)
}