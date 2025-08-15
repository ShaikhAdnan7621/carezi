import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';

import AffiliationRequest from "@/models/affiliationRequestModel";
import professionals from '@/models/professionalmodles';
import User from '@/models/usermodles';
import { getUserFromCookies } from "@/utils/getUserFromCookies";


export async function POST(request) {
	try {
		await dbConnect();
		const user = await getUserFromCookies(request);
		const userId = user?.userId || null;

		if (!userId) {
			return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
		}

		const body = await request.json();
		const { organizationId, requestedRole, requestedDepartment, coverLetter, expectedSalary, workType, employeeType, actualStartDate } = body;

		// Find the professional document for this user
		const professional = await professionals.findOne({ userId }).populate('userId');
		if (!professional) {
			return NextResponse.json({ error: "Professional profile not found" }, { status: 404 });
		}

		const userData = professional.userId;

		// Check for existing pending request
		const existingRequest = await AffiliationRequest.findOne({
			professionalId: professional._id,
			organizationId,
			status: "pending"
		});

		if (existingRequest) {
			return NextResponse.json({ error: "You already have a pending request to this organization" }, { status: 400 });
		}

		const affiliationRequest = new AffiliationRequest({
			professionalId: professional._id,
			organizationId,
			requestedRole,
			requestedDepartment,
			coverLetter,
			expectedSalary,
			workType,
			// Store user details for quick access
			professionalName: userData.name,
			professionalEmail: userData.email,
			professionalPhone: professional.contactDetails?.phone || userData.phone,
			professionalProfilePic: userData.profilePic,
			professionType: professional.professionType,
			professionalLocation: userData.location,
			professionalBio: professional.profileSummary?.bio,
			experienceSummary: professional.experience?.map(exp => `${exp.role} at ${exp.organization}`).join(', '),
			skills: professional.skills?.map(skill => skill.name) || [],
			employeeType: employeeType || "new",
			actualStartDate: actualStartDate ? new Date(actualStartDate) : undefined
		});

		await affiliationRequest.save();

		return NextResponse.json({
			message: "Affiliation request submitted successfully",
			data: affiliationRequest
		}, { status: 201 });

	} catch (error) {
		console.error("Error creating affiliation request:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}