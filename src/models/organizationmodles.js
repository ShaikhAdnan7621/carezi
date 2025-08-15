import mongoose from "mongoose";

// --- Sub-Schemas ---

// Contact Details Sub-Schema
const contactDetailsSchema = new mongoose.Schema({
	phone: { type: String, required: true },
	email: { type: String, required: true },
	website: { type: String },
	address: {
		street: { type: String },
		location: { type: String },
		city: { type: String, required: true },
		state: { type: String, required: true },
		country: { type: String, required: true },
		zipCode: { type: String },
	},
	socialMediaLinks: {
		facebook: { type: String },
		twitter: { type: String },
		linkedin: { type: String },
		instagram: { type: String },
	},
});

// Organization Hours Sub-Schema (consistent with professional consultation schema)
const organizationHoursSchema = new mongoose.Schema({
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
		required: true,
	},
	isOpen: { type: Boolean, default: false },
	morning: {
		startTime: { type: String, default: "09:00" },
		endTime: { type: String, default: "12:00" },
		isActive: { type: Boolean, default: false }
	},
	evening: {
		startTime: { type: String, default: "14:00" },
		endTime: { type: String, default: "17:00" },
		isActive: { type: Boolean, default: false }
	}
});

// Services Offered Sub-Schema
const serviceSchema = new mongoose.Schema({
	name: { type: String, required: true }, // Name of the service
	description: { type: String }, // Description of the service
	price: { type: Number }, // Optional price for the service
	isAvailable: { type: Boolean, default: true }, // Availability status
});

// Facilities Sub-Schema
const facilityDetailsSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String },
	specialities: [{ type: String }], // Array of specialties
});

// Amenities Sub-Schema
const amenitySchema = new mongoose.Schema({
	name: { type: String, required: true }, // Name of the amenity
	description: { type: String }, // Optional description
});

// Departments Sub-Schema
const departmentSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String },
	specialities: [{ type: String }], // Array of specialties
});



// --- Main Facility Schema ---
const organizationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending'
		},
		name: { type: String, required: true },
		facilityType: {
			type: String,
			
			required: true,
			enum: [
				"clinic", "hospital", "diagnostic", "pharmacy", "urgent_care", "rehabilitation",
				"therapy", "surgery_center", "specialty_center", "home_healthcare", "blood_bank",
				"vaccination_center", "mental_health", "traditional_medicine", "nutrition_center",
				"fitness_center", "other",
			],
		},
		profilePic: { type: String },
		images: [String],
		summary: {
			bio: { type: String },
			headline: { type: String },
		},
		contactDetails: contactDetailsSchema,
		operatingHours: [organizationHoursSchema],
		services: [serviceSchema],
		amenities: [amenitySchema],
		facilities: [facilityDetailsSchema],
		departments: [departmentSchema],

		verificationDocuments: [String],
		rejectionReason: { type: String },
		isProfileActive: { type: Boolean, default: false },
	},
	{ timestamps: true } // Auto-generates createdAt and updatedAt fields
);

export default mongoose.models.organizations || mongoose.model("organizations", organizationSchema);

