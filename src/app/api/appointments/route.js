import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/appointmentModel';
import organizationModel from '@/models/organizationmodles';
import { getUserFromCookies } from '@/utils/getUserFromCookies';
import Organization from '@/models/organizationmodles';
import users from '@/models/usermodles';


export async function GET(request) {
	try {
		await dbConnect();
		const user = await getUserFromCookies(request);
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const professionalId = searchParams.get('professionalId');
		const organizationId = searchParams.get('organizationId');
		const date = searchParams.get('date');
		const startDate = searchParams.get('startDate');
		const endDate = searchParams.get('endDate');
		const patientId = searchParams.get('patientId');

		let query = {};
		if (professionalId) query.professionalId = professionalId;
		if (organizationId) query.organizationId = organizationId;
		if (patientId === 'me') query.patientId = user.userId || user._id;
		else if (patientId) query.patientId = patientId;

		if (date) {
			const start = new Date(date);
			const end = new Date(start);
			end.setDate(end.getDate() + 1);
			query.appointmentDate = { $gte: start, $lt: end };
		} else if (startDate && endDate) {
			query.appointmentDate = {
				$gte: new Date(startDate),
				$lte: new Date(endDate)
			};
		}

		console.log("quary: ",  query)
		const appointments = await Appointment.find(query)
			.populate('patientId', 'name email')
			.populate({
				path: 'professionalId',
				select: 'userId professionType department',
				populate: {
					path: 'userId',
					select: 'name email profileImage'
				}
			})
			.populate('organizationId', 'name facilityType')
			.sort({ appointmentDate: 1, appointmentTime: 1 });

		return NextResponse.json({ appointments });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		await dbConnect();
		const user = await getUserFromCookies(request);

		console.log(user)
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.json();

		console.log(" appoinment post route hited here")
		console.log(data)

		// Check for conflicts
		const existingAppointment = await Appointment.findOne({
			professionalId: data.professionalId,
			appointmentDate: new Date(data.appointmentDate),
			appointmentTime: data.appointmentTime,
			status: { $in: ['requested', 'approved'] }
		});



		if (existingAppointment) {
			return NextResponse.json({ error: 'Time slot not available' }, { status: 400 });
		}

		// Get organization details if booking through organization
		let organizationDetails = null;
		if (data.organizationId) {
			const organization = await organizationModel.findById(data.organizationId);
			if (organization) {
				organizationDetails = {
					name: organization.name,
					facilityType: organization.facilityType,
					department: data.department || '',
					address: organization.contactDetails?.address || '',
					contactPhone: organization.contactDetails?.phone || ''
				};
			}
		}

		const appointment = new Appointment({
			...data,
			patientId: user.userId || user._id,
			organizationDetails,
			type: data.organizationId ? 'through_organization' : 'direct'
		});

		console.log('Creating appointment with patientId:', user.userId || user._id);

		await appointment.save();
		await appointment.populate('professionalId', 'userId professionType');

		return NextResponse.json({ appointment }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}