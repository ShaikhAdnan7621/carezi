// src\app\admin\applications\page.js
"use client"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'


export default function Page() {
	const [professionals, setProfessionals] = useState([])
	const [organizations, setOrganizations] = useState([])
	const [loading, setLoading] = useState(true)
	const [selectedItem, setSelectedItem] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				console.log("🔄 Fetching applications data...");

				// Fetch professionals
				const profResponse = await axios.get('/api/admin/professional/application/getapplications', {
					withCredentials: true
				});
				console.log("👨‍⚕️ Professional Response:", profResponse.data);
				setProfessionals(profResponse.data.applicants || []);

				const orgResponse = await axios.get('/api/admin/organization/getapplications', {
					withCredentials: true
				});
				console.log("🏢 Organization Response:", orgResponse.data);
				setOrganizations(orgResponse.data.organizations || []);

			} catch (error) {
				console.error("❌ Error fetching data:", error);
				console.log("📝 Error response:", error.response?.data);
				// Show error in UI
				setError(error.response?.data?.message || "Failed to fetch applications");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [])


	if (loading) {
		return <LoadingState />
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="text-red-500">Error: {error}</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-8">Applications Management</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Professional Applications Section */}
				<section>
					<Card>
						<CardHeader>
							<CardTitle>Professional Applications ({professionals.length})</CardTitle>
						</CardHeader>
						<CardContent className="max-h-[70vh] overflow-y-auto">
							{professionals.length === 0 ? (
								<EmptyState text="No professional applications" />
							) : (
								professionals.map(prof => (
									<ProfessionalApplicationCard
										key={prof._id}
										item={prof}
										setSelectedItem={setSelectedItem}
										selectedItem={selectedItem}
										setProfessionals={setProfessionals}
									/>
								))
							)}
						</CardContent>
					</Card>
				</section>

				<section>
					<Card>
						<CardHeader>
							<CardTitle>Organization Applications ({organizations.length})</CardTitle>
						</CardHeader>
						<CardContent className="max-h-[70vh] overflow-y-auto">
							{organizations.length === 0 ? (
								<EmptyState text="No organization applications" />
							) : (
								organizations.map(org => (
									<OrganizationApplicationCard
										key={org._id}
										item={org}
										setSelectedItem={setSelectedItem}
										selectedItem={selectedItem}
										setOrganizations={setOrganizations}
									/>
								))
							)}
						</CardContent>
					</Card>
				</section>
			</div>
		</div>
	)
}

const LoadingState = () => (
	<div className="container mx-auto p-4">
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{[1, 2].map(i => (
				<Card key={i}>
					<CardHeader>
						<Skeleton className="h-8 w-64" />
					</CardHeader>
					<CardContent>
						{[1, 2, 3].map(j => (
							<div key={j} className="mb-4">
								<Skeleton className="h-24 w-full" />
							</div>
						))}
					</CardContent>
				</Card>
			))}
		</div>
	</div>
)

const EmptyState = ({ text }) => (
	<div className="text-center py-8 text-muted-foreground">
		<p>{text}</p>
	</div>
)


const DebugInfo = ({ data }) => {
	if (process.env.NODE_ENV === 'development') {
		return (
			<pre className="bg-gray-100 p-4 mt-4 rounded text-xs">
				{JSON.stringify(data, null, 2)}
			</pre>
		);
	}
	return null;
};



const ProfessionalApplicationCard = ({ item, setSelectedItem, selectedItem, setProfessionals }) => (
	<Card className="mb-4 hover:shadow-lg transition-shadow">
		<CardContent className="pt-6">
			<div className="flex gap-4">
				<Avatar className="w-16 h-16 md:w-24 md:h-24">
					<AvatarImage src={item.profilePic} alt={item.name} />
				</Avatar>
				<div className="flex-grow flex justify-between items-center bg-secondary/10 rounded-md p-4">
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">{item.name}</h3>
						<Badge variant="outline">
							{item.professionalApplication?.professionType}
						</Badge>
					</div>
					<Dialog open={selectedItem?._id === item._id} onOpenChange={(open) => setSelectedItem(open ? item : null)}>
						<DialogTrigger asChild>
							<Button variant="outline">View Details</Button>
						</DialogTrigger>
						<DialogContent className="w-[95vw] max-w-[600px] h-[90vh] max-h-[800px] overflow-y-auto p-6 md:w-[80vw]">
							<DialogHeader className="mb-4">
								<DialogTitle className="text-xl">Application Details</DialogTitle>
							</DialogHeader>
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<h4 className="font-semibold text-sm">Email</h4>
										<p className="text-sm">{item.email}</p>
									</div>
									<div className="space-y-2">
										<h4 className="font-semibold text-sm">Status</h4>
										<Badge variant={item.status === 'pending' ? 'outline' : 'default'}>
											{item.professionalApplication?.status}
										</Badge>
									</div>
								</div>
								<div className="space-y-2">
									<h4 className="font-semibold text-sm">Verification Document</h4>
									<div className="relative w-full h-[40vh] min-h-[300px] border rounded-lg overflow-hidden">
										<Image
											src={item.professionalApplication?.verificationDocuments[0]}
											alt="Verification"
											className="absolute w-full h-full object-contain"
										/>
									</div>
								</div>
								<div className="flex justify-end gap-2 pt-4">
									<Button variant="destructive" onClick={async () => {
										try {
											await axios.post('/api/admin/professional/application/review', {
												userId: item._id,
												approved: false
											}, { withCredentials: true });

											setSelectedItem(null);
											setProfessionals(prev => prev.filter(p => p._id !== item._id));
										} catch (error) {
											console.error('Error rejecting application:', error);
										}
									}}>Reject</Button>
									<Button onClick={async () => {
										try {
											await axios.post('/api/admin/professional/application/review', {
												userId: item._id,
												approved: true
											}, { withCredentials: true });

											setSelectedItem(null);
											setProfessionals(prev => prev.filter(p => p._id !== item._id));
										} catch (error) {
											console.error('Error approving application:', error);
										}
									}}>Accept</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</CardContent>
	</Card>
)

// Organization Application Card Component 
const OrganizationApplicationCard = ({ item, setSelectedItem, selectedItem, setOrganizations }) => {
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectionInput, setShowRejectionInput] = useState(false);

    const handleReview = async (status) => {
        try {
            if (status === 'rejected' && !rejectionReason.trim()) {
                alert('Please provide a reason for rejection');
                return;
            }

            await axios.post('/api/admin/organization/review', {
                organizationId: item._id,
                status: status,
                rejectionReason: status === 'rejected' ? rejectionReason : null
            }, { withCredentials: true });

            setSelectedItem(null);
            setOrganizations(prev => prev.filter(o => o._id !== item._id));
        } catch (error) {
            console.error('Error reviewing application:', error);
            alert(error.response?.data?.message || 'Error reviewing application');
        }
    };

    return (
        <Card className="mb-4 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
                <div className="flex gap-4">
                    <Avatar className="w-16 h-16 md:w-24 md:h-24">
                        <AvatarImage src={item.profilePic} alt={item.name} />
                    </Avatar>
                    <div className="flex-grow flex justify-between items-center bg-secondary/10 rounded-md p-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <Badge variant="outline">
                                {item.facilityType}
                            </Badge>
                        </div>
                        <Dialog open={selectedItem?._id === item._id} onOpenChange={(open) => setSelectedItem(open ? item : null)}>
                            <DialogTrigger asChild>
                                <Button variant="outline">View Details</Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-[600px] h-[90vh] max-h-[800px] overflow-y-auto p-6 md:w-[80vw]">
                                <DialogHeader className="mb-4">
                                    <DialogTitle className="text-xl">Application Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-sm">Email</h4>
                                            <p className="text-sm">{item.email}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-sm">Status</h4>
                                            <Badge variant={item.status === 'pending' ? 'outline' : 'default'}>
                                                {item.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Verification Document</h4>
                                        <div className="relative w-full h-[40vh] min-h-[300px] border rounded-lg overflow-hidden">
                                            <Image
                                                src={item.verificationDocuments?.[0]}
                                                alt="Verification"
                                                className="absolute w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {showRejectionInput && (
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm">Rejection Reason</h4>
                                                <textarea
                                                    className="w-full p-2 border rounded-md"
                                                    value={rejectionReason}
                                                    onChange={(e) => setRejectionReason(e.target.value)}
                                                    placeholder="Please provide a reason for rejection..."
                                                    rows={3}
                                                />
                                            </div>
                                        )}
                                        <div className="flex justify-end gap-2 pt-4">
                                            <Button 
                                                variant="destructive" 
                                                onClick={() => {
                                                    if (!showRejectionInput) {
                                                        setShowRejectionInput(true);
                                                    } else {
                                                        handleReview('rejected');
                                                    }
                                                }}
                                            >
                                                {showRejectionInput ? 'Confirm Rejection' : 'Reject'}
                                            </Button>
                                            {!showRejectionInput && (
                                                <Button onClick={() => handleReview('approved')}>
                                                    Accept
                                                </Button>
                                            )}
                                            {showRejectionInput && (
                                                <Button variant="outline" onClick={() => {
                                                    setShowRejectionInput(false);
                                                    setRejectionReason("");
                                                }}>
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
