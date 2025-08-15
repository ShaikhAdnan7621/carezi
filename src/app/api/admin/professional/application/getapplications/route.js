// src\app\api\admin\professional\application\getapplications\route.js

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import users from '@/models/usermodles';
import dbConnect from '@/lib/dbConnect';

export async function GET(request) {
    try {
        console.log("🔍 GET Applications API called");
        await dbConnect();
        
        const adminToken = request.cookies.get('adminToken')?.value;
        console.log("📌 Admin Token:", adminToken ? "Present" : "Missing");
        
        if (!adminToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const applicants = await users.find({
            'professionalApplication.status': 'pending'
        });

        console.log("📊 Found applicants:", applicants.length);
        console.log("🔍 First applicant sample:", applicants[0]);

        return NextResponse.json({ message: 'Applications fetched successfully', applicants }, { status: 200 });
    } catch (error) {
        console.error('❌ Admin applications API error:', error);
        return NextResponse.json({ message: 'Failed to fetch applications', error: error.message }, { status: 500 });
    }
}
