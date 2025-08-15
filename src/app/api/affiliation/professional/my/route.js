export const dynamic = 'force-dynamic';
import { getUserFromCookies } from "@/utils/getUserFromCookies"
import AffiliationRequest from "@/models/affiliationRequestModel"
import Professional from "@/models/professionalmodles"
import organizationModel from '@/models/organizationmodles';

import dbConnect from "@/lib/dbConnect"

export async function GET(request) {
	try {
		await dbConnect()

		const user = await getUserFromCookies(request)
		if (!user) {
			return Response.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Find professional by userId (user object has userId, not _id)
		const professional = await Professional.findOne({ userId: user.userId })
 		
		if (!professional) {
			// Check if user has professional role
			if (user.role !== 'professional') {
				return Response.json({ error: "User is not a professional" }, { status: 403 })
			}
			return Response.json({ error: "Professional profile not found. Please complete your professional profile first." }, { status: 404 })
		}

		const requests = await AffiliationRequest.find({ professionalId: professional._id })
			.populate('organizationId', 'name profilePic facilityType')
			.sort({ submittedAt: -1 })

		return Response.json({ data: requests })
	} catch (error) {
		console.error('Error fetching professional requests:', error)
		return Response.json({ error: "Failed to fetch requests" }, { status: 500 })
	}
}
