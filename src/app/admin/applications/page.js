// src\app\admin\applications\page.js
"use client"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import axios from 'axios'
import React, { useEffect, useState } from 'react'


export default function page() {
	const [applicants, setapplicants] = useState([])
	const [loading, setloading] = useState(true)
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	useEffect(() => {

		const getApplications = async () => {
			setloading(true)
			const responce = await axios.get('/api/admin/professional/application/getapplications', { withCredentials: true })
			console.log(responce)
			setapplicants(responce.data.applicants)
			setloading(false)
		}

		getApplications()
	}, [])


	if (loading) { return (<div className='flex justify-center items-center h-screen'> <div>Loading....</div> </div>) }
	if (!applicants || applicants.length === 0) { return (<div className='flex justify-center items-center h-screen'> <div>No applications found</div> </div>) }
	return (
		<div>

			<h1 className='mb-6'>Profession Applications</h1>

			{applicants.map((applicant) => (
				<Card key={applicant._id} >
					<CardContent className='pt-6'>
						<div className=' flex '>
							<div >
								<Avatar className=' w-24 h-24 rounded-full mr-4'>
									<AvatarImage src={applicant.profilePic} alt={applicant.name} />
								</Avatar>
							</div>
							<div className='flex  justify-between bg-gray-500 rounded-md p-4 flex-grow bg-opacity-10'>
								<div >
									<h1 className='text-xl'>{applicant.name}</h1>
									<Badge >{applicant.professionalApplication.professionType}</Badge>

								</div>
								<Dialog open={true} onOpenChange={setIsDialogOpen}>
									<DialogTrigger className=' block'>See more</DialogTrigger>
									<DialogContent>
										<div>Email: {applicant.email}</div>
										<div>Status: {applicant.professionalApplication.status}</div>
										{/* verification image */}
										<img src={applicant.professionalApplication.verificationDocuments[0]} alt="Verification Image" className='w-full h-auto mt-4' />
										<div className='flex justify-end'>
											<Button  onClick={async () => { 
												const responce = await axios.post('/api/admin/professional/application/review', { userId: applicant._id, approved: true}, { withCredentials: true })
												console.log(responce)
												setIsDialogOpen(false)
												
											}} 
											>Accept</Button>
										</div>

									</DialogContent>
								</Dialog>
							</div>
						</div>
					</CardContent>
				</Card>
			))
			}
		</div>
	)
}
