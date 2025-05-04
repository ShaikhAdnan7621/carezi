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
        adminpass: { type: String},	
    }, {
    timestamps: true
});

userSchema.index({ email: 1 });

export default mongoose.models?.users || mongoose.model("users", userSchema);