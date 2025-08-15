
/**
 * @fileoverview Professional Suggestion API Route
 * This file implements an intelligent recommendation system for healthcare professionals
 * based on user's health conditions, interests, and medical history.
 */

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import professionalModels from '@/models/professionalmodles'; // Consistent naming
import { getUserFromCookies } from '@/utils/getUserFromCookies';
import userModels from '@/models/usermodles'; // Consistent naming
import mongoose from 'mongoose';
import { buildSimpleQuery, sortProfessionals } from './simple-filters';

/**
 * @typedef {Object} SpecialtyMapping
 * A mapping of health conditions to relevant medical specialties
 * @property {string[]} [condition] - Array of relevant specialties for a condition
 */

/**
 * Medical specialty mapping for different health conditions.
 * Maps common health conditions to their most relevant medical specialties.
 * @type {SpecialtyMapping}
 */
const specialtyMapping = {
	// Cardiovascular conditions
	'heart disease': ['cardiologist', 'internal medicine'],
	'high blood pressure': ['cardiologist', 'internal medicine'],
	'arrhythmia': ['cardiologist', 'electrophysiologist'],
	'heart failure': ['cardiologist', 'heart failure specialist'],
	'coronary artery disease': ['cardiologist', 'interventional cardiologist'],
	'heart valve disease': ['cardiologist', 'cardiothoracic surgeon'],

	// Orthopedic conditions
	'back pain': ['orthopedist', 'physiotherapist', 'chiropractor'],
	'joint pain': ['orthopedist', 'rheumatologist', 'physiotherapist'],
	'arthritis': ['rheumatologist', 'orthopedist'],
	'osteoporosis': ['rheumatologist', 'endocrinologist'],
	'sports injuries': ['sports medicine', 'orthopedist', 'physiotherapist'],
	'spinal disorders': ['spine specialist', 'neurosurgeon', 'orthopedist'],
	'knee problems': ['orthopedist', 'sports medicine', 'physiotherapist'],
	'shoulder pain': ['orthopedist', 'physiotherapist', 'sports medicine'],

	// Neurological conditions
	'headache': ['neurologist', 'pain management specialist'],
	'migraine': ['neurologist', 'headache specialist'],
	'epilepsy': ['neurologist', 'epileptologist'],
	'multiple sclerosis': ['neurologist', 'ms specialist'],
	'parkinsons disease': ['neurologist', 'movement disorder specialist'],
	'alzheimers': ['neurologist', 'geriatrician', 'memory specialist'],
	'stroke': ['neurologist', 'rehabilitation specialist', 'physiotherapist'],
	'neuropathy': ['neurologist', 'pain specialist'],

	// Mental health
	'anxiety': ['psychiatrist', 'psychologist', 'therapist'],
	'depression': ['psychiatrist', 'psychologist', 'therapist'],
	'stress': ['psychiatrist', 'psychologist', 'therapist'],
	'bipolar disorder': ['psychiatrist', 'psychologist'],
	'schizophrenia': ['psychiatrist', 'mental health specialist'],
	'eating disorders': ['psychiatrist', 'nutritionist', 'eating disorder specialist'],
	'addiction': ['addiction specialist', 'psychiatrist', 'counselor'],
	'ptsd': ['psychiatrist', 'trauma specialist', 'therapist'],
	'ocd': ['psychiatrist', 'behavioral therapist'],

	// Respiratory conditions
	'asthma': ['pulmonologist', 'allergist', 'respiratory therapist'],
	'copd': ['pulmonologist', 'respiratory therapist'],
	'sleep apnea': ['sleep specialist', 'pulmonologist', 'ent specialist'],
	'lung cancer': ['pulmonologist', 'oncologist', 'thoracic surgeon'],
	'bronchitis': ['pulmonologist', 'internal medicine'],
	'pneumonia': ['pulmonologist', 'infectious disease specialist'],

	// Digestive conditions
	'stomach pain': ['gastroenterologist', 'internal medicine'],
	'acid reflux': ['gastroenterologist', 'internal medicine'],
	'ibs': ['gastroenterologist', 'nutritionist'],
	'crohns disease': ['gastroenterologist', 'colorectal surgeon'],
	'ulcerative colitis': ['gastroenterologist', 'colorectal surgeon'],
	'celiac disease': ['gastroenterologist', 'nutritionist', 'allergist'],
	'liver disease': ['hepatologist', 'gastroenterologist'],
	'gallbladder disease': ['general surgeon', 'gastroenterologist'],

	// Endocrine conditions
	'diabetes': ['endocrinologist', 'diabetologist', 'internal medicine'],
	'thyroid': ['endocrinologist', 'internal medicine'],
	'hormonal imbalance': ['endocrinologist', 'gynecologist'],
	'pcos': ['endocrinologist', 'gynecologist', 'fertility specialist'],
	'adrenal disorders': ['endocrinologist'],
	'metabolic disorders': ['endocrinologist', 'metabolic specialist'],

	// Skin conditions
	'acne': ['dermatologist', 'aesthetician'],
	'eczema': ['dermatologist', 'allergist'],
	'psoriasis': ['dermatologist', 'rheumatologist'],
	'skin cancer': ['dermatologist', 'oncologist'],
	'rosacea': ['dermatologist'],

	// General health
	'nutrition': ['nutritionist', 'dietitian'],
	'weight management': ['nutritionist', 'dietitian', 'bariatric specialist'],
	'fitness': ['physiotherapist', 'sports medicine', 'fitness specialist'],
	'preventive care': ['primary care physician', 'internal medicine'],
	'womens health': ['gynecologist', 'womens health specialist'],
	'mens health': ['urologist', 'mens health specialist'],
	'geriatric care': ['geriatrician', 'internal medicine'],
	'chronic pain': ['pain management specialist', 'physical medicine'],
	'allergies': ['allergist', 'immunologist'],
	'immune disorders': ['immunologist', 'rheumatologist'],
	'chronic fatigue': ['internal medicine', 'rheumatologist', 'sleep specialist']
};

/**
 * Weights for different scoring factors
 */
const SCORE_WEIGHTS = {
	SPECIALTY_MATCH: 15,        // Direct specialty match
	RELATED_SPECIALTY: 8,       // Related specialty match
	EXPERIENCE_YEARS: 10,       // Maximum points for experience
	EXPERIENCE_RELEVANCE: 5,    // Points for relevant experience
	SKILLS_MATCH: 3,           // Points per matching skill
	RESEARCH_MATCH: 2,         // Points per relevant research
	EDUCATION_MATCH: 5,        // Points for relevant education
	LOCATION_MATCH: 4,         // Points for location match
	AVAILABILITY: 3,           // Points for availability
	RATING: 2                  // Points for rating
};

/**
 * Calculate relevance score with weighted factors
 */
function calculateRelevanceScore(professional, keywords, conditions, userLocation) {
	let score = 0;
	const relevantSpecialties = new Set();
	const relatedSpecialties = new Set();

	// Build specialty sets
	conditions.forEach(condition => {
		const mappedSpecialties = specialtyMapping[condition.toLowerCase()] || [];
		mappedSpecialties.forEach((specialty, index) => {
			if (index === 0) {
				relevantSpecialties.add(specialty); // Primary specialty
			} else {
				relatedSpecialties.add(specialty);  // Related specialties
			}
		});
	});

	// Specialty match scoring
	const professionType = professional.professionType.toLowerCase();
	if (relevantSpecialties.has(professionType)) {
		score += SCORE_WEIGHTS.SPECIALTY_MATCH;
	} else if (relatedSpecialties.has(professionType)) {
		score += SCORE_WEIGHTS.RELATED_SPECIALTY;
	}

	// Experience scoring
	if (professional.experience && Array.isArray(professional.experience)) {
		// Years of experience points
		const yearsOfExperience = professional.experience.reduce((total, exp) => {
			if (!exp?.startDate) return total;
			const start = new Date(exp.startDate);
			const end = exp?.endDate ? new Date(exp.endDate) : new Date();
			return total + (end.getFullYear() - start.getFullYear());
		}, 0);
		score += Math.min(yearsOfExperience * 2, SCORE_WEIGHTS.EXPERIENCE_YEARS);

		// Relevant experience points
		professional.experience.forEach(exp => {
			if (!exp) return; // Skip if experience entry is null/undefined

			const hasMatchingKeyword = keywords.some(keyword => {
				if (!keyword || !exp.role || !exp.description) return false;
				return exp.role.toLowerCase().includes(keyword.toLowerCase()) ||
					exp.description.toLowerCase().includes(keyword.toLowerCase());
			});

			if (hasMatchingKeyword) {
				score += SCORE_WEIGHTS.EXPERIENCE_RELEVANCE;
			}
		});
	}

	// Skills scoring with relevance weighting
	if (professional.skills) {
		professional.skills.forEach(skill => {
			let skillScore = 0;
			keywords.forEach(keyword => {
				if (skill.name.toLowerCase().includes(keyword.toLowerCase())) {
					// Calculate similarity score (0-1)
					const similarity = calculateStringSimilarity(skill.name.toLowerCase(), keyword.toLowerCase());
					skillScore = Math.max(skillScore, similarity * SCORE_WEIGHTS.SKILLS_MATCH);
				}
			});
			score += skillScore;
		});
	}

	// Research scoring with context and null checks
	if (professional.researchProjects && Array.isArray(professional.researchProjects)) {
		professional.researchProjects.forEach(project => {
			if (!project) return; // Skip if project is null/undefined

			const isRelevant = keywords.some(keyword => {
				if (!keyword) return false; // Skip if keyword is null/undefined

				const fieldMatch = project.field &&
					project.field.toLowerCase().includes(keyword.toLowerCase());

				const descriptionMatch = project.description &&
					project.description.toLowerCase().includes(keyword.toLowerCase());

				return fieldMatch || descriptionMatch;
			});

			if (isRelevant) score += SCORE_WEIGHTS.RESEARCH_MATCH;
		});
	}

	// Education specialization scoring
	if (professional.education) {
		professional.education.forEach(edu => {
			if (relevantSpecialties.has(edu.specialization.toLowerCase())) {
				score += SCORE_WEIGHTS.EDUCATION_MATCH;
			} else if (relatedSpecialties.has(edu.specialization.toLowerCase())) {
				score += SCORE_WEIGHTS.EDUCATION_MATCH / 2;
			}
		});
	}

	// Location scoring if available
	if (userLocation && professional.location) {
		const distance = calculateDistance(userLocation, professional.location);
		if (distance <= 5) score += SCORE_WEIGHTS.LOCATION_MATCH;
		else if (distance <= 15) score += SCORE_WEIGHTS.LOCATION_MATCH / 2;
	}

	// Availability scoring
	if (professional.availability && professional.availability.length > 0) {
		score += SCORE_WEIGHTS.AVAILABILITY;
	}

	// Rating scoring
	if (professional.rating) {
		score += (professional.rating / 5) * SCORE_WEIGHTS.RATING;
	}

	return Math.round(score * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate string similarity using Levenshtein distance
 */
function calculateStringSimilarity(str1, str2) {
	const maxLength = Math.max(str1.length, str2.length);
	if (maxLength === 0) return 1.0;
	return (maxLength - levenshteinDistance(str1, str2)) / maxLength;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
	const matrix = Array(str2.length + 1).fill(null).map(() =>
		Array(str1.length + 1).fill(null)
	);

	for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
	for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

	for (let j = 1; j <= str2.length; j++) {
		for (let i = 1; i <= str1.length; i++) {
			const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
			matrix[j][i] = Math.min(
				matrix[j][i - 1] + 1,
				matrix[j - 1][i] + 1,
				matrix[j - 1][i - 1] + substitutionCost
			);
		}
	}
	return matrix[str2.length][str1.length];
}

/**
 * GET handler for professional suggestions
 * Returns personalized professional recommendations based on user's health profile
 * 
 * @route GET /api/professional/suggestion
 * @param {Request} request - Next.js request object
 * @query {number} page - Page number for pagination (default: 1)
 * @query {number} limit - Number of results per page (default: 10)
 * 
 * @returns {Promise<NextResponse>} JSON response containing:
 * - success: boolean indicating if the request was successful
 * - data: array of professional profiles with relevance scores
 * - pagination: object containing pagination details
 * 
 * @throws {NextResponse} 
 * - 401 if user is not authenticated
 * - 404 if user is not found
 * - 500 for server errors
 * 
 * @example
 * // Success Response
 * {
 *   success: true,
 *   data: [{
 *     _id: string,
 *     userId: {
 *       name: string,
 *       profilePic: string,
 *       email: string
 *     },
 *     professionType: string,
 *     relevanceScore: number,
 *     ...other professional details
 *   }],
 *   pagination: {
 *     currentPage: number,
 *     totalPages: number,
 *     totalResults: number,
 *     limit: number
 *   }
 * }
 */
export async function GET(request) {
	try {
		await dbConnect();
		// @ts-ignore
		const { userId } = await getUserFromCookies(request);

		if (!userId) {
			return NextResponse.json({
				success: false,
				error: 'User not authenticated'
			}, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page')) || 1;
		const limit = parseInt(searchParams.get('limit')) || 10;
		const skip = (page - 1) * limit;

		// Get user details
		const user = await userModels.findById(userId);
		if (!user) {
			return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
		}

		// Extract keywords and conditions
		const keywords = [];
		const conditions = [];

		if (user.vitalStats) {
			if (user.vitalStats.interests) {
				keywords.push(...user.vitalStats.interests);
			}
			if (user.vitalStats.healthIssues) {
				user.vitalStats.healthIssues.forEach(issue => {
					if (issue.condition) {
						conditions.push(issue.condition);
						keywords.push(issue.condition);
					}
				});
			}
		}

		// Get simple filter parameters
		const searchQuery = searchParams.get('search') || '';
		const filterBy = searchParams.get('filter') || 'all';
		const sortBy = searchParams.get('sort') || 'name';

		// Build simple query
		const query = buildSimpleQuery(userId, searchQuery, filterBy);

		// Find all eligible professionals
		const professionals = await professionalModels.find(query)
			.populate('userId', 'name profilePic email')
			.lean();

		// Filter by username if search query exists
		let filteredProfessionals = professionals;
		if (searchQuery) {
			filteredProfessionals = professionals.filter(prof => {
				// Check if user name matches search query
				if (prof.userId && prof.userId.name &&
					prof.userId.name.toLowerCase().includes(searchQuery.toLowerCase())) {
					return true;
				}

				// Keep professionals that matched other criteria in the database query
				return prof.professionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
					(prof.profileSummary?.bio && prof.profileSummary.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
					(prof.profileSummary?.headline && prof.profileSummary.headline.toLowerCase().includes(searchQuery.toLowerCase())) ||
					(prof.skills && prof.skills.some(skill =>
						skill.name.toLowerCase().includes(searchQuery.toLowerCase())
					));
			});
		}

		// Apply sorting
		const sortedProfessionals = sortProfessionals(filteredProfessionals, sortBy);

		// Score professionals
		const scoredProfessionals = sortedProfessionals.map(prof => ({
			...prof,
			relevanceScore: calculateRelevanceScore(prof, keywords, conditions, user.location)
		}));

		// Apply pagination
		const paginatedResults = scoredProfessionals.slice(skip, skip + limit);
		const totalProfessionals = scoredProfessionals.length;
		const totalPages = Math.ceil(totalProfessionals / limit);

		return NextResponse.json({
			success: true,
			data: paginatedResults,
			pagination: {
				currentPage: page,
				totalPages,
				totalResults: totalProfessionals,
				limit
			}
		}, { status: 200 });

	} catch (error) {
		console.error('Suggestion API Error:', error);
		return NextResponse.json({
			success: false,
			error: 'Failed to fetch professional suggestions. ' + error.message
		}, { status: 500 });
	}
}
