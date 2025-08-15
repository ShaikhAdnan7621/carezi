import mongoose from "mongoose";

const affiliationRequestSchema = new mongoose.Schema(
	{
		professionalId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "professionals",
			required: true,
		},
		// Stored user details for quick access
		professionalName: {
			type: String,
			required: true,
		},
		professionalEmail: {
			type: String,
			required: true,
		},
		professionalPhone: {
			type: String,
		},
		professionalProfilePic: {
			type: String,
		},
		professionType: {
			type: String,
			required: true,
		},
		professionalLocation: {
			type: String,
		},
		professionalBio: {
			type: String,
		},
		organizationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "organizations",
			required: true,
		},
		requestedRole: {
			type: String,
			required: true,
		},
		requestedDepartment: {
			type: String,
		},
		coverLetter: {
			type: String,
			required: true,
		},
		expectedSalary: {
			type: Number,
		},
		workType: {
			type: String,
			enum: ["full-time", "part-time", "contract"],
			default: "full-time",
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected", "withdrawn"],
			default: "pending",
		},
		submittedAt: {
			type: Date,
			default: Date.now,
		},
		reviewedAt: {
			type: Date,
		},
		reviewedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "organizations",
		},
		rejectionReason: {
			type: String,
		},
		documents: [{
			type: String,
		}],
		// Professional experience summary
		experienceSummary: {
			type: String,
		},
		// Key skills
		skills: [{
			type: String,
		}],
		// Employee type and timing
		employeeType: {
			type: String,
			enum: ["new", "existing"],
			default: "new"
		},
		actualStartDate: {
			type: Date,
			// Only required for existing employees
		}
	},
	{ timestamps: true }
);

// Indexes
affiliationRequestSchema.index({ professionalId: 1, organizationId: 1 });
affiliationRequestSchema.index({ organizationId: 1, status: 1 });
affiliationRequestSchema.index({ professionalId: 1, status: 1 });

export default mongoose.models.affiliationRequests || mongoose.model("affiliationRequests", affiliationRequestSchema);