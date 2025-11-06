import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import mongodb from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { MongoClient, Db } from 'mongodb';

// Extend NextAuth user type
type NextAuthUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  avatar?: string;
  role?: string;
  phone?: string;
};

async function getDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await mongodb;
  const db = client.db('realestate');
  return { client, db };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as NextAuthUser;
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const { db } = await getDatabase();
    const userId = user.id as string;
    
    // Get user's favorites with property details
    const favorites = await db.collection('favorites')
      .aggregate([
        { $match: { userId } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'properties',
            localField: 'propertyId',
            foreignField: '_id',
            as: 'property',
            pipeline: [
              {
                $project: {
                  id: '$_id',
                  title: 1,
                  price: 1,
                  type: 1,
                  location: 1,
                  image: { $arrayElemAt: ['$images', 0] }
                }
              }
            ]
          }
        },
        { $unwind: '$property' },
        {
          $project: {
            id: '$_id',
            userId: 1,
            propertyId: 1,
            createdAt: 1,
            property: 1
          }
        }
      ])
      .toArray();

    // Get total count
    const total = await db.collection('favorites').countDocuments({ userId });

    const hasMore = skip + favorites.length < total;

    return NextResponse.json({
      data: {
        favorites,
        total,
        page,
        limit,
        hasMore
      },
      success: true
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as NextAuthUser;
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId } = await request.json();
    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const { db } = await getDatabase();
    const userId = user.id as string;

    // Check if property exists
    const property = await db.collection('properties').findOne({ _id: new ObjectId(propertyId) });
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Check if already favorited
    const existingFavorite = await db.collection('favorites').findOne({
      userId,
      propertyId
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Property already in favorites' },
        { status: 409 }
      );
    }

    // Add to favorites
    const favorite = {
      userId,
      propertyId,
      createdAt: new Date()
    };

    const result = await db.collection('favorites').insertOne(favorite);

    // Get the created favorite with property details
    const propertyWithDetails = await db.collection('properties').findOne({ _id: new ObjectId(propertyId) });

    if (!propertyWithDetails) {
      return NextResponse.json({ error: 'Property details not found' }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        success: true,
        favorite: {
          id: result.insertedId.toString(),
          userId: favorite.userId,
          propertyId: favorite.propertyId,
          createdAt: favorite.createdAt,
          property: {
            id: propertyId,
            title: propertyWithDetails.title,
            price: propertyWithDetails.price,
            type: propertyWithDetails.type,
            location: propertyWithDetails.location,
            image: propertyWithDetails.images?.[0]
          }
        }
      },
      success: true
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}