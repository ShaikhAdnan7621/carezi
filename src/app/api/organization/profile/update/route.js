// src\app\api\organization\profile\update\route.js


import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import organizations from '@/models/organizationmodles';

export async function PUT(request) {
    try {
        await dbConnect();
        
        // Get query parameters from URL
        const { searchParams } = new URL(request.url);
        const orgId = searchParams.get('orgId');
        const updateData = await request.json();

        if (!orgId) {
            return NextResponse.json(
                { message: 'Organization ID is required' },
                { status: 400 }
            );
        }

        console.log('Updating organization:', orgId, updateData);

        // Validate if organization exists
        const existingOrg = await organizations.findById(orgId);
        if (!existingOrg) {
            return NextResponse.json(
                { message: 'Organization not found' },
                { status: 404 }
            );
        }

        // Handle operatingHours field mapping (for backward compatibility)
        if (updateData.availability) {
            updateData.operatingHours = updateData.availability;
            delete updateData.availability;
        }

        // Update organization
        const updatedOrg = await organizations.findByIdAndUpdate(
            orgId,
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            },
            { new: true, runValidators: true }
        );

        console.log('Organization updated successfully:', updatedOrg);
        return NextResponse.json(updatedOrg);

    } catch (error) {
        console.error('Error updating organization:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update organization' },
            { status: 500 }
        );
    }
}