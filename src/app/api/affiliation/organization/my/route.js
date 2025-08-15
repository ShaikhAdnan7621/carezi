export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import AffiliationRequest from "@/models/affiliationRequestModel";
import { getUserFromCookies } from "@/utils/getUserFromCookies";
import organizationModel from '@/models/organizationmodles';
import professionalModel from '@/models/professionalmodles';
import userModel from '@/models/usermodles';

export async function GET(request) {
	try {
		await dbConnect();
		const user = await getUserFromCookies(request);
		const userId = user?.userId || null;

		if (!userId) {
			return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
		}

		// Find organization by user ID
		const organization = await organizationModel.findOne({ userId });

		if (!organization) {
			return NextResponse.json({ error: "Organization not found" }, { status: 404 });
		}

		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;

		const filter = { organizationId: organization._id };
		if (status) {
			filter.status = status;
		}

		const affiliationRequests = await AffiliationRequest.find(filter)
			.populate({
				path: "professionalId",
				model: professionalModel,
				select: "professionType contactDetails education experience skills",
				populate: {
					path: "userId",
					model: userModel,
					select: "name email profilePic bio"
				}
			})
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		const total = await AffiliationRequest.countDocuments(filter);

		return NextResponse.json({
			data: affiliationRequests,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit)
			}
		});

	} catch (error) {
		console.error("Error fetching organization requests:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}