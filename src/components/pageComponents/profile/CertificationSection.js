import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Edit, Plus, Trash } from 'lucide-react';

export default function CertificationSection(props) {
	const [certifications, setCertifications] = useState(props.certifications || []);
	const [currentCertification, setCurrentCertification] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleSave = async (certification) => {
		if (currentCertification !== null) {
			const updatedCertifications = [...certifications];
			updatedCertifications[currentCertification] = certification;
			setCertifications(updatedCertifications);
			props.update({ certifications: updatedCertifications });
		} else {
			const newCertifications = [...certifications, certification];
			setCertifications(newCertifications);
			props.update({ certifications: newCertifications });
		}
		setCurrentCertification(null);
		setIsDialogOpen(false);
	};

	const handleEdit = (index) => {
		setCurrentCertification(index);
		setIsDialogOpen(true);
	};

	const handleDelete = (index) => {
		const updatedCertifications = certifications.filter((_, i) => i !== index);
		setCertifications(updatedCertifications);
		props.update({ certifications: updatedCertifications });
	};

	return (
		<div>
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Certifications</h2>
				<Button variant="secondary" onClick={() => { setCurrentCertification(null); setIsDialogOpen(true); }}>
					<Plus /> Add Certification
				</Button>
			</div>
			<div className="space-y-4 mt-4">
				{certifications.map((certification, index) => (
					<div key={index} className="flex items-center justify-between group gap-5  ">
				 		<div className='flex flex-col xl:flex-row w-full gap-4 xl:items-center'>
							{certification.certificateURL && (
								<img src={certification.certificateURL} alt="Certificate" className="w-32 h-32 object-cover mt-2" />
							)}
							<div>
								<h3 className="font-semibold">{certification.name}{" : "}{certification.year}</h3>
								<p className="text-sm text-gray-500">Issued by <b>{certification.issuedBy}</b></p>
							</div>
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
				<AddCertification
					handleSave={handleSave}
					certification={currentCertification !== null ? certifications[currentCertification] : null}
					setIsDialogOpen={setIsDialogOpen}
				/>
			)}
		</div>
	);
}

const AddCertification = ({ handleSave, certification, setIsDialogOpen }) => {
	const [name, setName] = useState(certification ? certification.name : '');
	const [issuedBy, setIssuedBy] = useState(certification ? certification.issuedBy : '');
	const [year, setYear] = useState(certification ? certification.year : '');
	const [certificateURL, setCertificateURL] = useState(certification ? certification.certificateURL : '');
	const [file, setFile] = useState(null);

	const handleImageUpload = async (event) => {
		const selectedFile = event.target.files[0];
		setFile(selectedFile);
	};

	const handleSaveCertification = async () => {
		let uploadedURL = certificateURL;

		if (file) {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('folder', 'certifications');

			const response = await fetch('/api/uploadimage', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				uploadedURL = data.url;
			} else {
				console.error('Error uploading image');
				return;
			}
		}

		handleSave({
			name,
			issuedBy,
			year,
			certificateURL: uploadedURL,
		});
	};

	return (
		<Dialog open={true} onOpenChange={setIsDialogOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{certification ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<Input
						id="name"
						type="text"
						placeholder="Certification Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						id="issuedBy"
						type="text"
						placeholder="Issued By"
						value={issuedBy}
						onChange={(e) => setIssuedBy(e.target.value)}
					/>
					<Input
						id="year"
						type="number"
						placeholder="Year"
						value={year}
						onChange={(e) => setYear(parseInt(e.target.value, 10) || '')}
						min={1900}
						max={new Date().getFullYear()}
					/>
					<Input
						type="file"
						accept="image/*"
						onChange={handleImageUpload}
					/>
					{certificateURL && (
						<img src={certificateURL} alt="Certificate" className="w-32 h-32 object-cover mt-2" />
					)}
					<div className="grid grid-cols-2 gap-4">
						<Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
						<Button onClick={handleSaveCertification}>Save</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}