"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import React, { useState } from 'react'

export default function page() {
	const [adminPassword, setAdminPassword] = useState('')
	const [error, seterror] = useState('')
	return (
		<div className='  '>
			<Card className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-96 '>
				<CardHeader className=" text-center text-2xl font-bold">
					Admin Verification
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{/* Add your admin verification form here */}
						<Input type="password" placeholder="Enter Admin Password" onChange={(e) => { setAdminPassword(e.target.value) }} />
						<Button className='w-full'
							onClick={() => {
								try {
									// make a axios requesti to add aa cookies and send data to verify admin i want to send this password 
									console.log("Verifying admin password...");
									if (!adminPassword) {
										seterror('Admin Password is required');
										return;
									}
									const responce = axios.post('/api/admin/verify', { adminPassword });
									if (responce.status === 200) {
										console.log("Admin password verified");
										window.location.href = '/admin';
									}
								} catch (error) {
									console.error("Error verifying admin password:", error);
								}
							}}

						>Verify</Button>
						{error && <p className='text-red-500'>{error}</p>}
					</div>
				</CardContent>
			</Card>
		</div >
	)
}
