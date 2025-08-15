import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'professionals',
    required: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'organizations',
    default: null
  },
  affiliationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Affiliation',
    default: null
  },
  
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 30
  },
  
  type: {
    type: String,
    enum: ['direct', 'through_organization'],
    required: true
  },
  status: {
    type: String,
    enum: ['requested', 'approved', 'rejected', 'completed', 'cancelled', 'rescheduled'],
    default: 'requested'
  },
  
  organizationDetails: {
    name: String,
    facilityType: String,
    department: String,
    address: String,
    contactPhone: String
  },
  
  reason: {
    type: String,
    required: true
  },
  patientNotes: String,
  urgencyLevel: {
    type: String,
    enum: ['routine', 'urgent', 'emergency'],
    default: 'routine'
  },
  
  professionalNotes: String,
  rejectionReason: String,
  suggestedTimes: [{
    date: Date,
    time: String
  }],
  
  isRescheduled: {
    type: Boolean,
    default: false
  },
  originalAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
  }
}, {
  timestamps: true
});

appointmentSchema.index({ professionalId: 1, appointmentDate: 1 });
appointmentSchema.index({ patientId: 1, status: 1 });
appointmentSchema.index({ organizationId: 1, appointmentDate: 1 });

export default mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);