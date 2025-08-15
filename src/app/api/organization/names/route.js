// src\app\api\organization\names\route.js
export const dynamic = 'force-dynamic';
import organizationModel from '@/models/organizationmodles';
import dbConnect from "@/lib/dbConnect";

export async function GET(request) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('query') || '';

		// Create an array of search terms by splitting the query
		const searchTerms = query.split(/\s+/).filter(term => term.length > 0);

		// Create a fuzzy search pattern for each term
		const searchPattern = searchTerms.map(term => {
			// Allow for typos and variations:
			// - \w* allows for any additional characters between letters
			// - ? makes the previous character optional (handles typos)
			return term.split('').map(char => `${char}\\w*`).join('');
		}).join('|');

		// Find organizations with fuzzy name match
		const organizations = await organizationModel.aggregate([
			{
				$match: {
					name: { $regex: searchPattern, $options: 'i' },
					status: 'approved',
					isProfileActive: true
				}
			},
			{
				// Add relevance score
				$addFields: {
					score: {
						$sum: [
							// Exact match gets highest score
							{ $cond: [{ $regexMatch: { input: "$name", regex: new RegExp(`^${query}$`, 'i') } }, 100, 0] },
							// Starts with gets high score
							{ $cond: [{ $regexMatch: { input: "$name", regex: new RegExp(`^${query}`, 'i') } }, 75, 0] },
							// Contains whole query gets medium score
							{ $cond: [{ $regexMatch: { input: "$name", regex: new RegExp(query, 'i') } }, 50, 0] },
							// Contains any search term gets low score
							{ $cond: [{ $regexMatch: { input: "$name", regex: new RegExp(searchPattern, 'i') } }, 25, 0] }
						]
					}
				}
			},
			{
				// Sort by relevance score
				$sort: { score: -1 }
			},
			{
				// Project only needed fields
				$project: {
					_id: 1,
					name: 1,
					score: 1,
					matchType: {
						$switch: {
							branches: [
								{ case: { $gte: ["$score", 100] }, then: "exact" },
								{ case: { $gte: ["$score", 75] }, then: "starts" },
								{ case: { $gte: ["$score", 50] }, then: "contains" },
								{ case: { $gte: ["$score", 25] }, then: "similar" }
							],
							default: "partial"
						}
					}
				}
			},
			{ $limit: 10 }
		]);

		return Response.json(organizations);
	} catch (error) {
		console.error("Error fetching organizations:", error);
		return Response.json({ error: "Failed to fetch organizations" }, { status: 500 });
	}
}