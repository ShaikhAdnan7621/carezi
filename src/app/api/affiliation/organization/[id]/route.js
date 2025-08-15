import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AffiliationRequest from '@/models/affiliationRequestModel';

export async function GET(request, { params }) {
	try {
		await dbConnect();
		
		const { id: organizationId } = params;

		if (!organizationId) {
			return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
		}

		const affiliations = await AffiliationRequest.find({ 
			organizationId,
			status: 'approved'
		})
		.populate('professionalId', 'userId professionType specialization experience')
		.populate({
			path: 'professionalId',
			populate: {
				path: 'userId',
				select: 'name email avatar'
			}
		})
		.sort({ createdAt: -1 });

		return NextResponse.json({ 
			affiliations,
			count: affiliations.length 
		});
	} catch (error) {
		console.error('Error fetching organization affiliations:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}