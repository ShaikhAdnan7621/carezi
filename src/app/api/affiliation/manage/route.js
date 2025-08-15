
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import Affiliation from "@/models/affiliationModel";
import professionals from '@/models/professionalmodles';
import userModel from '@/models/usermodles';
import { getUserFromCookies } from "@/utils/getUserFromCookies";

export async function GET(request) {
	try {
		await dbConnect();
		const user = await getUserFromCookies(request);
		const userId = user?.userId || null;

		if (!userId) {
			return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const type = searchParams.get("type");

		if (type === "professional") {
			// Find the professional document for this user
			const professional = await professionals.findOne({ userId });
			if (!professional) {
				return NextResponse.json({ error: "Professional profile not found" }, { status: 404 });
			}

			// Get all affiliations for this professional
			const affiliations = await Affiliation.find({ 
				professionalId: professional._id 
			})
			.populate("organizationId", "name profilePic facilityType")
			.sort({ createdAt: -1 });

			return NextResponse.json({ data: affiliations });
		}

		if (type === "organization") {
			// Find the organization document for this user
			const organizationModel = (await import('@/models/organizationmodles')).default;
			const organization = await organizationModel.findOne({ userId });
			if (!organization) {
				return NextResponse.json({ error: "Organization profile not found" }, { status: 404 });
			}

			// Get all affiliations for this organization with professional details
			const affiliations = await Affiliation.find({ 
				organizationId: organization._id 
			})
			.populate({
				path: "professionalId",
				model: professionals,
				select: "userId professionType",
				populate: {
					path: "userId",
					model: userModel,
					select: "name email profilePic location"
				}
			})
			.sort({ createdAt: -1 });

			return NextResponse.json({ data: affiliations });
		}

		return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });

	} catch (error) {
		console.error("Error fetching affiliations:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PUT(request) {
	try {
		await dbConnect();
		const user = await getUserFromCookies(request);
		const userId = user?.userId || null;

		if (!userId) {
			return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
		}

		const body = await request.json();
		const { affiliationId, action, notes } = body;

		if (action === 'end' || action === 'terminate') {
			const affiliation = await Affiliation.findByIdAndUpdate(
				affiliationId,
				{
					endDate: new Date(),
					status: action === 'terminate' ? 'terminated' : 'inactive',
					isActive: false,
					notes: notes || undefined
				},
				{ new: true }
			);

			if (!affiliation) {
				return NextResponse.json({ error: "Affiliation not found" }, { status: 404 });
			}

			const message = action === 'terminate' ? "Staff member terminated successfully" : "Affiliation ended successfully";
			return NextResponse.json({
				message,
				data: affiliation
			});
		}

		return NextResponse.json({ error: "Invalid action" }, { status: 400 });

	} catch (error) {
		console.error("Error managing affiliation:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}