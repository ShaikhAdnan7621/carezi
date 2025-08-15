// src\models\usermodles.js

import mongoose from "mongoose";


const applicationSchema = new mongoose.Schema({
	professionType: { type: String, required: true },
	contactDetails: {
		phone: { type: String, required: true },
		email: { type: String, required: true },
	},
	verificationDocuments: {
		type: [String],
		required: true,
		validate: {
			validator: function (v) {
				return v.length > 0;
			},
			message: 'At least one document is required'
		},
	},
	status: {
		type: String,
		enum: ["pending", "approved", "rejected"],
		default: "pending",
	},
	reviewedDate: { type: Date },
	applicationDate: { type: Date, default: Date.now },
});

const EmergencyContactSchema = new mongoose.Schema({
	name: String,
	relation: String,
	phone: String
});

const HealthIssueSchema = new mongoose.Schema({
	condition: String,
	diagnosedDate: Date,
	severity: {
		type: String,
		enum: ['Mild', 'Moderate', 'Severe']
	},
	status: {
		type: String,
		enum: ['Active', 'Under Treatment', 'Resolved']
	},
 
}, { _id: false });

const InterestSchema = new mongoose.Schema({
    type: String
});

const VitalStatsSchema = new mongoose.Schema({
	bloodType: {
		type: String,
		enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
	},
	allergies: [String],
	emergencyContact: EmergencyContactSchema,
	height: Number,
	weight: Number,
	age: {
		type: Number,
		min: 0,
		max: 120,
	},
	bmi: {
		type: Number,
		default: function () {
			if (this.height && this.weight) {
				return (this.weight / ((this.height / 100) * (this.height / 100))).toFixed(2);
			}
			return null;
		}
	},
	checkups: [{
		date: { type: Date },
		type: { type: String, enum: ['General', 'Dental', 'Eye', 'Specialist', 'Other'] },
		doctor: { type: String },
		notes: { type: String },
		nextAppointment: { type: Date }
	}],
	healthIssues: [HealthIssueSchema],
	interests: [String], // Changed to array of strings
	lifestyle: {
		exercise: {
			frequency: {
				type: String,
				enum: ['Daily', 'Weekly', 'Occasionally', 'Rarely', 'Never']
			},
			preferredActivities: [String] // Remove enum restriction to allow custom activities
		},

		diet: {
			status: {
				type: String,
				enum: ['Excellent', 'Good', 'Fair', 'Poor']
			},
			restrictions: [String], // Remove enum restriction
			preferredDiet: {
				type: String,
				enum: ['Balanced', 'Low-Carb', 'High-Protein', 'Mediterranean', 'Regular']
			}
		},
		sleepPattern: {
			hoursPerDay: {
				type: String,
				enum: ['Less than 4', '4-6 hours', '6-8 hours', '8-10 hours', 'More than 10']
			},
			quality: {
				type: String,
				enum: ['Good', 'Moderate', 'Poor']
			}
		},
		stressLevel: {
			type: String,
			enum: ['Low', 'Moderate', 'High', 'Very High']
		}
	}
});

const userSchema = mongoose.Schema(
	{
		name: { type: String, required: true, },
		email: { type: String, required: true, unique: true, },
		password: { type: String, required: true, },
		bio: { type: String, },

		profilePic: { type: String, },
		isProfessional: { type: Boolean, default: false, },
		professionalApplication: applicationSchema,
		isEmailVerified: { type: Boolean, default: false, },

		refreshToken: { type: String, },

		// email verification token and expire
		verificationToken: { type: String, },
		verificationTokenExpires: { type: Date, },

		// password reset token and expire
		resetPasswordToken: { type: String, },
		resetPasswordExpires: { type: Date, },
		lastLogins: [{ date: { type: Date, default: Date.now, }, }],
		lastPasswordChange: [{ date: { type: Date, default: Date.now, }, }],
		accountLocked: { type: Boolean, default: false, },
		failedLoginAttempts: [{ date: { type: Date, default: Date.now, }, }],
		adminpass: { type: String },
		isAdmin: { type: Boolean, default: false },
		vitalStats: VitalStatsSchema,
	}, {
	timestamps: true
});

userSchema.index({ email: 1 });

export default mongoose.models?.users || mongoose.model("users", userSchema);
