export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/appointmentModel';
import { getUserFromCookies } from '@/utils/getUserFromCookies';
import professionals from '@/models/professionalmodles';
import Organization from '@/models/organizationmodles';
import users from '@/models/usermodles';


export async function GET(request) {
	try {
		await dbConnect();
		
		const user = await getUserFromCookies(request);

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const professional = await professionals.findOne({ userId: user.userId });
		
		if (!professional) {
			return NextResponse.json({ appointments: [] });
		}

		const { searchParams } = new URL(request.url);
		const startDate = searchParams.get('startDate');
		const endDate = searchParams.get('endDate');

		let query = { professionalId: professional._id };
		
		if (startDate && endDate) {
			query.appointmentDate = {
				$gte: new Date(startDate),
				$lte: new Date(endDate)
			};
		}

		const appointments = await Appointment.find(query)
			.populate('patientId', 'name email')
			.populate('organizationId', 'name facilityType')
			.sort({ appointmentDate: 1, appointmentTime: 1 });

		return NextResponse.json({ appointments });
	} catch (error) {
		console.error('Error fetching appointments:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}