export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import userModels from '@/models/usermodles'; // Consistent naming
import organizationModel from '@/models/organizationmodles' // Adjust path if needed
import { getUserFromCookies } from '@/utils/getUserFromCookies';

/**
 * GET /api/organization/suggestion
 * Returns a list of organizations based on user profile, search, sort, and filter.
 */
export async function GET(request) {
	try {

		await dbConnect()
		const { userId } = await getUserFromCookies(request);

		if (!userId) {
			return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const page = parseInt(searchParams.get('page')) || 1
		const limit = parseInt(searchParams.get('limit')) || 12
		const skip = (page - 1) * limit
		const search = searchParams.get('search') || ''
		const sort = searchParams.get('sort') || 'name'
		const filter = searchParams.get('filter') || 'all'

		// Build query
		const query = {}

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ type: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
				{ tags: { $regex: search, $options: 'i' } },
			]
		}

		if (filter && filter !== 'all') {
			query.type = filter
		}

		// Sorting
		let sortObj = {}
		if (sort === 'name') sortObj = { name: 1 }
		else if (sort === 'members') sortObj = { membersCount: -1 }
		else if (sort === 'recent') sortObj = { createdAt: -1 }
		else sortObj = { name: 1 }

		// Fetch organizations
		const totalResults = await organizationModel.countDocuments(query)
		const organizations = await organizationModel
			.find(query)
			.sort(sortObj)
			.skip(skip)
			.limit(limit)
			.lean()

		const totalPages = Math.ceil(totalResults / limit)

		return NextResponse.json({
			success: true,
			data: organizations,
			pagination: {
				currentPage: page,
				totalPages,
				totalResults,
				limit,
			},
		}, { status: 200 })
	} catch (error) {
		console.error('Organization Suggestion API Error:', error)
		return NextResponse.json({
			success: false,
			error: 'Failed to fetch organization suggestions. ' + error.message,
		}, { status: 500 })
	}
}