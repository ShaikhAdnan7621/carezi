export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import organizations from '@/models/organizationmodles';
import dbConnect from '@/lib/dbConnect';

export async function GET(request) {
    try {
         await dbConnect();
        const adminToken = request.cookies.get('adminToken')?.value;        
        if (!adminToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const orgs = await organizations.find({ status: 'pending' });
        console.log("📊 Found organizations:", orgs.length);

        return NextResponse.json({ 
            message: 'Organizations fetched successfully', 
            organizations: orgs 
        }, { status: 200 });
    } catch (error) {
        console.error('❌ Organization applications API error:', error);
        return NextResponse.json({ 
            message: 'Failed to fetch organizations', 
            error: error.message 
        }, { status: 500 });
    }
}
