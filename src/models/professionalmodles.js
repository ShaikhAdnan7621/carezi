// src\models\professionalmodles.js

import mongoose from "mongoose";

// --- Sub-Schemas ---
// Education Sub-Schema
const educationSchema = new mongoose.Schema({
	degree: { type: String, required: true },
	institution: { type: String, required: true },
	year: { type: Number },
	specialization: { type: String },
});

// Skills Sub-Schema
const skillSchema = new mongoose.Schema({
	name: { type: String, required: true },
	proficiency: {
		type: String,
		enum: ["beginner", "intermediate", "expert"],
		required: true,
	},
});

// Experience Sub-Schema
const experienceSchema = new mongoose.Schema({
	organization: { type: String, required: true },
	role: { type: String, required: true },
	department: { type: String },
	startDate: { type: Date, required: true },
	endDate: { type: Date },
	isCurrent: { type: Boolean, default: false },
});

// Certification Sub-Schema
const certificationSchema = new mongoose.Schema({
	name: { type: String, required: true },
	issuedBy: { type: String, required: true },
	year: { type: Number },
	certificateURL: { type: String }, // Optional
});

// Project Sub-Schema
const researchProjectSchema = new mongoose.Schema({
	title: { type: String, required: true },
	summary: { type: String }, // Changed from description to summary
	associatedWith: { type: String }, // Optional organization or institution
	resourcesUsed: [String], // Array of resources (equipment, tools, etc.)
	startDate: { type: Date },
	endDate: { type: Date },
	isOngoing: { type: Boolean, default: false },
	field: { type: String, required: true }, // Field of expertise
});

// Consultation Sub-Schema (specific to doctors or consultants)
const consultationSchema = new mongoose.Schema({
	availability: {
		type: String,
		enum: ["high", "moderate", "low", "unavailable"],
		default: "moderate",
	},
	hours: [
		{
			day: {
				type: String,
				enum: [
					"monday",
					"tuesday",
					"wednesday",
					"thursday",
					"friday",
					"saturday",
					"sunday",
				],
			},
			startTime: { type: String },
			endTime: { type: String },
		},
	],
	fee: {
		minimum: { type: Number },
		maximum: { type: Number },
	},
});

// Languages Sub-Schema
const languagesSchema = new mongoose.Schema({
	name: { type: String, required: true },
	proficiency: {
		type: String,
		enum: ["basic", "conversational", "fluent", "native"],
		required: true,
	},
});



// --- Main Professional Schema ---
const professionalsSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users", // Link to the common user schema
			required: true,
		},
		professionType: {
			type: String,
			required: true,
		},
		profileSummary: {
			bio: { type: String },
			headline: { type: String },
		},
		contactDetails: {
			phone: { type: String, required: true },
			email: { type: String, required: true },
		},
		socialMediaLinks: {
			facebook: { type: String },
			instagram: { type: String },
			linkedin: { type: String },
			twitter: { type: String },
		},
		// --- Linked Sub-Schemas ---
		education: [educationSchema],
		skills: [skillSchema],
		experience: [experienceSchema],
		certifications: [certificationSchema],
		researchProjects: [researchProjectSchema],
		languages: [languagesSchema],
		consultationDetails: consultationSchema
	},
	{ timestamps: true }
);

export default mongoose.models.professionals || mongoose.model("professionals", professionalsSchema);