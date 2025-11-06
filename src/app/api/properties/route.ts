import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import mongodb from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { MongoClient, Db } from 'mongodb';

async function getDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await mongodb;
  const db = client.db('realestate');
  return { client, db };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'sale' | 'rent' | 'hotel' | null;
    const status = searchParams.get('status');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const location = searchParams.get('location');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const areaMin = searchParams.get('areaMin');
    const areaMax = searchParams.get('areaMax');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const { db } = await getDatabase();

    // Build filter query
    const filterQuery: Record<string, unknown> = {};

    // Type filter
    if (type) {
      filterQuery.type = type;
    }

    // Status filter
    if (status) {
      filterQuery.status = status;
    }

    // Price range filter
    if (priceMin || priceMax) {
      const priceFilter: Record<string, number> = {};
      if (priceMin) priceFilter.$gte = parseInt(priceMin);
      if (priceMax) priceFilter.$lte = parseInt(priceMax);
      filterQuery.price = priceFilter;
    }

    // Location filter
    if (location) {
      filterQuery.$or = [
        { location: { $regex: location, $options: 'i' } },
        { city: { $regex: location, $options: 'i' } },
        { state: { $regex: location, $options: 'i' } }
      ];
    }

    // Bedrooms filter
    if (bedrooms) {
      filterQuery.bedrooms = parseInt(bedrooms);
    }

    // Bathrooms filter
    if (bathrooms) {
      filterQuery.bathrooms = parseInt(bathrooms);
    }

    // Area range filter
    if (areaMin || areaMax) {
      const areaFilter: Record<string, number> = {};
      if (areaMin) areaFilter.$gte = parseInt(areaMin);
      if (areaMax) areaFilter.$lte = parseInt(areaMax);
      filterQuery.area = areaFilter;
    }

    // Search filter
    if (search) {
      filterQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Featured filter
    if (featured === 'true') {
      filterQuery.featured = true;
    }

    // Get properties with filters
    const properties = await db.collection('properties')
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await db.collection('properties').countDocuments(filterQuery);
    const hasMore = skip + properties.length < total;

    // Transform to match expected format
    const transformedProperties = properties.map(property => ({
      id: property._id.toString(),
      title: property.title,
      price: property.price,
      type: property.type,
      status: property.status,
      location: property.location,
      city: property.city,
      state: property.state,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      description: property.description,
      images: property.images,
      amenities: property.amenities || [],
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      featured: property.featured || false
    }));

    return NextResponse.json({
      data: {
        properties: transformedProperties,
        total,
        page,
        limit,
        hasMore
      },
      success: true
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const propertyData = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'price', 'type', 'location'];
    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate type
    const validTypes = ['sale', 'rent', 'hotel'];
    if (!validTypes.includes(propertyData.type)) {
      return NextResponse.json(
        { error: 'Type must be sale, rent, or hotel' },
        { status: 400 }
      );
    }

    const { db } = await getDatabase();

    // Add metadata
    const newProperty = {
      ...propertyData,
      userId: user.id,
      status: propertyData.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('properties').insertOne(newProperty);

    // Get the created property
    const createdProperty = await db.collection('properties').findOne({ _id: result.insertedId });

    return NextResponse.json({
      data: {
        id: result.insertedId.toString(),
        ...createdProperty
      },
      success: true
    });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}