// src\app\api\organization\get\findbyid\route.js

import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import organizationModel from '@/models/organizationmodles' // Adjust path if needed


export async function GET(request) {
    try {
        await dbConnect()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        // Validate id parameter
        if (!id) {
            return NextResponse.json({ 
                success: false, 
                error: "Organization ID is required" 
            }, { status: 400 })
        }

        // Fetch organization data
        const organization = await organizationModel.findById(id).lean()
        
        // Return 404 if not found
        if (!organization) {
            return NextResponse.json({ 
                success: false, 
                error: "Organization not found" 
            }, { status: 404 })
        }

        // Return success response with organization data
        return NextResponse.json({
            success: true,
            data: organization
        }, { status: 200 })

    } catch (error) {
        // Return error response for any server errors
        return NextResponse.json({ 
            success: false, 
            error: error.message || "Failed to fetch organization"
        }, { status: 500 })
    }
}
