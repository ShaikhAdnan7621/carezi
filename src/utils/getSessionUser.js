import dbConnect from '@/lib/dbConnect';
import organizationmodles from '@/models/organizationmodles';
import professionalmodles from '@/models/professionalmodles';
import User from '@/models/usermodles';

/**
 * Fetches all necessary user data for the session from a userId.
 * This includes base user info, role, and associated profile IDs.
 * @param {string} userId - The ID of the user from the JWT payload.
 * @returns {Promise<Object|null>} A UI-ready user object or null if not found.
 */
export const getSessionUser = async (userId) => {
	if (!userId) {
		return null;
	}

	try {
		await dbConnect();

		// Perform queries in parallel for efficiency
		const [user, organization, professional] = await Promise.all([
			User.findById(userId).select('name email profilePic isProfessional').lean(),
			organizationmodles.findOne({ userId }).select('_id').lean(),
			professionalmodles.findOne({ userId }).select('_id').lean(),
		]);

		if (!user) {
			return null;
		}

		// Determine the user's primary role. Organization takes precedence.
		const role = organization ? 'organization' : user.isProfessional ? 'professional' : null;

		return {
			id: user._id.toString(),
			name: user.name,
			email: user.email,
			profilePictureUrl: user.profilePic,
			role: role,
			professionalId: professional?._id.toString() || null,
			organizationId: organization?._id.toString() || null,
		};
	} catch (error) {
		console.error('Failed to fetch session user:', error);
		return null;
	}
};