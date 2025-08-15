// src\models\appointment\appointmentmodles.js

// here i want a mongoos schema for appointment booking
//  in this schema i wamt somethigns like the name of booking per son booked by user id, booking perfessionel id, if booking form organization then throuworganization boolean, and organization id, date of booking, time of booking, status of booking, reson or description of booking, status with reson, and what we can add in the appointment booking schema?
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	bookedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	bookedProfessional: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Professional',
		required: true,
	},
	
	organization: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Organization',
		required: false, // Optional if booking is not through an organization
	},
	throughOrganization: {
		type: Boolean,
		default: false, // Indicates if the booking is through an organization
	},
	date: {
		type: Date,
		required: true,
	},
	time: {
		type: String, // Could be in HH:mm format
		required: true,
	},
	description: {
		type: String,
		required: false, // Optional description or reason for the booking
	},

	status: {
		type: String,
		enum: ['pending', 'confirmed', 'cancelled', 'completed'],
		default: 'pending',
	},

	statusReason: {
		type: String,
		required: false, // Optional reason for the current status
	},
}, {
	timestamps: true, // Automatically manage createdAt and updatedAt fields
});


export default mongoose.models?.Appointment || mongoose.model('Appointment', appointmentSchema);