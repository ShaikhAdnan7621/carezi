import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/appointmentModel';
import professionals from '@/models/professionalmodles';

export async function GET(request, { params }) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const startDate = searchParams.get('startDate');
		const endDate = searchParams.get('endDate');

		// Get professional availability
		const professional = await professionals.findById(params.professionalId);
		if (!professional) {
			return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
		}

		// Use default hours if none set or invalid
		const hasValidHours = professional.consultationDetails?.hours?.some(h =>
			h.isAvailable && (h.morning?.isActive || h.evening?.isActive)
		);

		const workingHours = hasValidHours
			? professional.consultationDetails.hours
			: [
				{
					day: 'monday',
					isAvailable: true,
					morning: { startTime: '09:00', endTime: '12:00', isActive: true },
					evening: { startTime: '14:00', endTime: '17:00', isActive: true }
				},
				{
					day: 'tuesday',
					isAvailable: true,
					morning: { startTime: '09:00', endTime: '12:00', isActive: true },
					evening: { startTime: '14:00', endTime: '17:00', isActive: true }
				},
				{
					day: 'wednesday',
					isAvailable: true,
					morning: { startTime: '09:00', endTime: '12:00', isActive: true },
					evening: { startTime: '14:00', endTime: '17:00', isActive: true }
				},
				{
					day: 'thursday',
					isAvailable: true,
					morning: { startTime: '09:00', endTime: '12:00', isActive: true },
					evening: { startTime: '14:00', endTime: '17:00', isActive: true }
				},
				{
					day: 'friday',
					isAvailable: true,
					morning: { startTime: '09:00', endTime: '12:00', isActive: true },
					evening: { startTime: '14:00', endTime: '17:00', isActive: true }
				}
			];


		// Get existing appointments in date range
		const appointments = await Appointment.find({
			professionalId: params.professionalId,
			appointmentDate: {
				$gte: new Date(startDate),
				$lte: new Date(endDate)
			},
			status: { $in: ['requested', 'approved'] }
		});

		// Generate available time slots
		const availableSlots = generateTimeSlots(
			workingHours,
			appointments,
			startDate,
			endDate
		);


		return NextResponse.json({
			availableSlots,
			bookedSlots: appointments.map(apt => ({
				date: apt.appointmentDate,
				time: apt.appointmentTime,
				status: apt.status
			}))
		});
	} catch (error) {
		console.error('Calendar API error:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

function generateTimeSlots(hours, appointments, startDate, endDate) {
	const slots = [];
	const start = new Date(startDate);
	const end = new Date(endDate);

	for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
		const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
		const dayHours = hours.find(h => h.day === dayName);

		if (dayHours && dayHours.isAvailable) {
			let timeSlots = [];

			// Add morning slots if active
			if (dayHours.morning?.isActive && dayHours.morning.startTime && dayHours.morning.endTime) {
				timeSlots = timeSlots.concat(generateDayTimeSlots(dayHours.morning.startTime, dayHours.morning.endTime));
			}

			// Add evening slots if active
			if (dayHours.evening?.isActive && dayHours.evening.startTime && dayHours.evening.endTime) {
				timeSlots = timeSlots.concat(generateDayTimeSlots(dayHours.evening.startTime, dayHours.evening.endTime));
			}

			const bookedTimes = appointments
				.filter(apt => apt.appointmentDate.toDateString() === date.toDateString())
				.map(apt => apt.appointmentTime);

			const availableTimes = timeSlots.filter(time => !bookedTimes.includes(time));

			if (availableTimes.length > 0) {
				slots.push({
					date: new Date(date),
					availableTimes
				});
			}
		}
	}

	return slots;
}

function generateDayTimeSlots(startTime, endTime) {
	const slots = [];
	const start = timeToMinutes(startTime);
	const end = timeToMinutes(endTime);

	for (let minutes = start; minutes < end; minutes += 30) {
		slots.push(minutesToTime(minutes));
	}

	return slots;
}

function timeToMinutes(time) {
	const [hours, minutes] = time.split(':').map(Number);
	return hours * 60 + minutes;
}

function minutesToTime(minutes) {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}