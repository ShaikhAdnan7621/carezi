export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/appointmentModel';
import { getUserFromCookies } from '@/utils/getUserFromCookies';
import professionals from '@/models/professionalmodles';

export async function GET(request) {
	try {
		await dbConnect();
		
		const user = await getUserFromCookies(request);

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const professional = await professionals.findOne({ userId: user.userId });
		
		if (!professional) {
			return NextResponse.json({ 
				stats: { requested: 0, approved: 0, completed: 0, total: 0 } 
			});
		}

		const stats = await Appointment.aggregate([
			{ $match: { professionalId: professional._id } },
			{
				$group: {
					_id: '$status',
					count: { $sum: 1 }
				}
			}
		]);

		const result = {
			requested: 0,
			approved: 0,
			completed: 0,
			total: 0
		};

		stats.forEach(stat => {
			if (result.hasOwnProperty(stat._id)) {
				result[stat._id] = stat.count;
				result.total += stat.count;
			}
		});

		return NextResponse.json({ stats: result });
	} catch (error) {
		console.error('Error fetching appointment stats:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}