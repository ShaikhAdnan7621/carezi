import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/appointmentModel';

import { getUserFromCookies } from '@/utils/getUserFromCookies';

export async function PUT(request, { params }) {
	try {
		await dbConnect();
		const user = await getUserFromCookies(request);
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.json();
		const { action, professionalNotes, rejectionReason, suggestedTimes } = data;

		const appointment = await Appointment.findById(params.id);
		if (!appointment) {
			return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
		}

		let updateData = { professionalNotes };

		if (action === 'approve') {
			updateData.status = 'approved';
		} else if (action === 'reject') {
			updateData.status = 'rejected';
			updateData.rejectionReason = rejectionReason;
		} else if (action === 'reschedule') {
			updateData.status = 'requested';
			updateData.suggestedTimes = suggestedTimes;
		}

		const updatedAppointment = await Appointment.findByIdAndUpdate(
			params.id,
			updateData,
			{ new: true }
		).populate('patientId', 'name email')
			.populate('professionalId', 'userId professionType');

		return NextResponse.json({ appointment: updatedAppointment });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}