import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import professionals from '@/models/professionalmodles';
import { getUserFromCookies } from '@/utils/getUserFromCookies';

export async function GET(request) {
    try {
        await dbConnect();
        const { userId } = await getUserFromCookies(request);
        const { searchParams } = new URL(request.url);
        
        // Parse query parameters
        const professionType = searchParams.get('professionType');
        const skills = searchParams.get('skills')?.split(',').filter(Boolean) || [];
        const specializations = searchParams.get('specializations')?.split(',').filter(Boolean) || [];

        // Get current user's professional profile
        const currentProfessional = await professionals.findOne({ userId });
        
        if (!currentProfessional) {
            return NextResponse.json({ message: 'Professional not found' }, { status: 404 });
        }

        // Build matching criteria with weights
        const matchCriteria = {
            $and: [
                { _id: { $ne: currentProfessional._id } },
                {
                    $or: [
                        { professionType: professionType },
                        { 'skills.name': { $in: skills } },
                        { 'education.specialization': { $in: specializations } }
                    ]
                }
            ]
        };

        // Find similar professionals with aggregation pipeline
        const similarProfessionals = await professionals.aggregate([
            { $match: matchCriteria },
            {
                $addFields: {
                    matchScore: {
                        $sum: [
                            // Profession type match (weight: 5)
                            { $cond: [{ $eq: ['$professionType', professionType] }, 5, 0] },
                            // Skills match (weight: 2 per match)
                            { 
                                $multiply: [
                                    { $size: { $setIntersection: ['$skills.name', skills] } },
                                    2
                                ]
                            },
                            // Specialization match (weight: 3 per match)
                            {
                                $multiply: [
                                    { $size: { $setIntersection: ['$education.specialization', specializations] } },
                                    3
                                ]
                            }
                        ]
                    }
                }
            },
            { $sort: { matchScore: -1 } },
            { $limit: 6 },
            {
                $project: {
                    profileSummary: 1,
                    contactDetails: 1,
                    socialMediaLinks: 1,
                    skills: 1,
                    education: 1,
                    matchScore: 1
                }
            }
        ]).exec();

        return NextResponse.json({ 
            success: true, 
            professionals: similarProfessionals 
        });

    } catch (error) {
        console.error('Suggestion API Error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
} 