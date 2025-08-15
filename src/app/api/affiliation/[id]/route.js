import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import AffiliationRequest from "@/models/affiliationRequestModel";
import Affiliation from "@/models/affiliationModel";
import { getUserFromCookies } from "@/utils/getUserFromCookies";


export async function GET(request, { params }) {
	try {
		await dbConnect();
		const user = await getUserFromCookies(request);
		const userId = user?.userId || null;

		if (!userId) {
			return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
		}


		const affiliationRequest = await AffiliationRequest.findById(params.id)
			.populate("organizationId", "name profilePic facilityType");

		if (!affiliationRequest) {
			return NextResponse.json({ error: "Request not found" }, { status: 404 });
		}

		return NextResponse.json({ data: affiliationRequest });

	} catch (error) {
		console.error("Error fetching affiliation request:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PUT(request, { params }) {
	try {
		await dbConnect();
		const user = await getUserFromCookies(request);
		const userId = user?.userId || null;

		if (!userId) {
			return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
		}

		const body = await request.json();
		const { status, rejectionReason } = body;

		const updateData = {
			status,
			reviewedAt: new Date(),
			reviewedBy: userId
		};

		if (rejectionReason) {
			updateData.rejectionReason = rejectionReason;
		}

		const affiliationRequest = await AffiliationRequest.findByIdAndUpdate(
			params.id,
			updateData,
			{ new: true }
		);

		// Create actual affiliation if approved
		if (status === 'approved' && affiliationRequest) {
			try {
				// Check if affiliation already exists
				const existingAffiliation = await Affiliation.findOne({
					professionalId: affiliationRequest.professionalId,
					organizationId: affiliationRequest.organizationId,
					isActive: true
				});

				if (!existingAffiliation) {
					// Use actual start date for existing employees, current date for new employees
					const startDate = affiliationRequest.employeeType === 'existing' && affiliationRequest.actualStartDate 
						? new Date(affiliationRequest.actualStartDate)
						: new Date();
					
					// Map request employeeType to affiliation employeeType
					const employeeType = affiliationRequest.employeeType === 'existing' ? 'existing employee' : 'new employee';
					
					const newAffiliation = await Affiliation.create({
						professionalId: affiliationRequest.professionalId,
						organizationId: affiliationRequest.organizationId,
						startDate: startDate,
						role: affiliationRequest.requestedRole,
						department: affiliationRequest.requestedDepartment,
						employeeType: employeeType,
						status: 'active',
						isActive: true
					});
					console.log('Affiliation created successfully:', newAffiliation._id);
				} else {
					console.log('Affiliation already exists, skipping creation');
				}
			} catch (affiliationError) {
				console.error('Error creating affiliation:', affiliationError);
				// Don't fail the request if affiliation creation fails
			}
		}

		if (!affiliationRequest) {
			return NextResponse.json({ error: "Request not found" }, { status: 404 });
		}

		return NextResponse.json({
			message: "Request updated successfully",
			data: affiliationRequest
		});

	} catch (error) {
		console.error("Error updating affiliation request:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(request, { params }) {
	try {
		await dbConnect();
		const user = await getUserFromCookies(request);
		const userId = user?.userId || null;

		if (!userId) {
			return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
		}
		const affiliationRequest = await AffiliationRequest.findByIdAndUpdate(
			params.id,
			{ status: "withdrawn" },
			{ new: true }
		);

		if (!affiliationRequest) {
			return NextResponse.json({ error: "Request not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Request withdrawn successfully" });

	} catch (error) {
		console.error("Error withdrawing affiliation request:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}