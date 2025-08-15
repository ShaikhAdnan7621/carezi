// src/app/api/cear/[id]/likes/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import cearLikes from '@/models/cear/cearlikemodles';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Get total count of likes
    const totalLikes = await cearLikes.countDocuments({ cearId: id });
    
    // Get users who liked this post with pagination
    const likes = await cearLikes.find({ cearId: id })
      .populate('userId', 'name profilePic bio profileUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      likes,
      pagination: {
        page,
        limit,
        totalLikes,
        totalPages: Math.ceil(totalLikes / limit),
        hasMore: page < Math.ceil(totalLikes / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
  }
}