import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import mongodb from '@/lib/mongodb';
import { MongoClient, Db } from 'mongodb';

async function getDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await mongodb;
  const db = client.db('realestate');
  return { client, db };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const { db } = await getDatabase();
    const userId = user.id as string;
    
    // Get user's notifications
    const notifications = await db.collection('notifications')
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get unread count
    const unreadCount = await db.collection('notifications').countDocuments({
      userId,
      isRead: false
    });

    // Get total count
    const total = await db.collection('notifications').countDocuments({ userId });

    const hasMore = skip + notifications.length < total;

    return NextResponse.json({
      data: {
        notifications,
        unreadCount,
        total,
        page,
        limit,
        hasMore
      },
      success: true
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}