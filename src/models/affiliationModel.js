import mongoose from "mongoose";

const affiliationSchema = new mongoose.Schema(
	{
		professionalId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "professionals",
			required: true,
		},
		organizationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "organizations",
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			default: null, // null means currently active
		},
		role: {
			type: String,
			required: true,
		},
		department: {
			type: String,
		},
		status: {
			type: String,
			enum: ["active", "inactive", "terminated"],
			default: "active",
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		employeeType: {
			type: String,
			enum: ["new employee", "existing employee"],
			default: "new employee",
		},
		notes: {
			type: String,
		},
	},
	{ timestamps: true }
);

// Indexes for better query performance
affiliationSchema.index({ professionalId: 1, organizationId: 1 });
affiliationSchema.index({ professionalId: 1, isActive: 1 });
affiliationSchema.index({ organizationId: 1, isActive: 1 });

export default mongoose.models.affiliations || mongoose.model("affiliations", affiliationSchema);