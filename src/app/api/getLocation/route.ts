import { NextResponse } from 'next/server';
import { Admin } from '../../../lib/firebase-admin';

const ROLE_OPTIONS = ['crowd', 'doctor', 'police', 'help', 'security'];

export async function GET() {
  try {
    const snapshot = await Admin.collection('users').get();

    const usersWithCoordinates: {
      userType: string;
      coordinates: { lat: number; lng: number };
    }[] = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const userType = data.userType?.toLowerCase();
      const lat = data.coordinates?.lat;
      const lng = data.coordinates?.lng;

      if (
        userType &&
        ROLE_OPTIONS.includes(userType) &&
        typeof lat === 'number' &&
        typeof lng === 'number'
      ) {
        usersWithCoordinates.push({
          userType,
          coordinates: { lat, lng },
        });
      }
    });

    return NextResponse.json(
      { success: true, data: usersWithCoordinates },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching user data', error: String(error) },
      { status: 500 }
    );
  }
}
