// zod_professional_schema.ts
import { z } from 'zod';

// Sub-schemas
const educationSchema = z.object({
	degree: z.string(),
	institution: z.string(),
	year: z.number().optional(),
	specialization: z.string().optional(),
}).partial();

const skillSchema = z.object({
	name: z.string(),
	proficiency: z.enum(["beginner", "intermediate", "expert"]),
});

const experienceSchema = z.object({
	organization: z.string(),
	role: z.string(),
	department: z.string().optional(),
	startDate: z.string().optional(), // Or string if you're handling date conversion
	endDate: z.string().optional(), // Or string
	isCurrent: z.boolean().optional(),
});

const certificationSchema = z.object({
	name: z.string(),
	issuedBy: z.string(),
	year: z.number().optional(),
	certificateURL: z.string().optional(),
});

const projectSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	associatedWith: z.string().optional(),
	technologiesUsed: z.array(z.string()).optional(),
	startDate: z.date().optional(), // Or string
	endDate: z.date().optional(), // Or string
	isOngoing: z.boolean().optional(),
});


const languagesSchema = z.object({
	name: z.string(),
	proficiency: z.enum(["basic", "conversational", "fluent", "native"]),
});

const consultationSchema = z.object({
	availability: z.enum(["high", "moderate", "low", "unavailable"]).optional(),
	hours: z.array(
		z.object({
			day: z.enum([
				"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
			]),
			startTime: z.string(),
			endTime: z.string(),
		})
	).optional(),
	fee: z.object({
		minimum: z.number().optional(),
		maximum: z.number().optional(),
	}).optional(),
}).partial();



// Main schema
const professionalSchema = z.object({
	userId: z.string(), // Assuming userId is a string
	professionType: z.string(),
	profileSummary: z.object({
		bio: z.string().optional(),
		headline: z.string().optional(),
	}).optional(),
	contactDetails: z.object({
		phone: z.string().optional(), // Optional phone
		email: z.string().optional(),  // Optional email
	}).optional(),
	socialMediaLinks: z.object({ // and other fields optional as well
		facebook: z.string().optional(),
		twitter: z.string().optional(),
		linkedin: z.string().optional(),
		instagram: z.string().optional(),
	}).optional(),// Social media links themselves optional
	education: z.array(educationSchema).optional(),
	skills: z.array(skillSchema).optional(),
	experience: z.array(experienceSchema).optional(),
	certifications: z.array(certificationSchema).optional(),
	projects: z.array(projectSchema).optional(),
	languages: z.array(languagesSchema).optional(),
	consultationDetails: consultationSchema.optional()
});


export default professionalSchema;