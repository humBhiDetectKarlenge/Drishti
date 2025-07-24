import { NextResponse } from 'next/server';
import { Admin } from '../../../lib/firebase-admin'; 

const ROLE_OPTIONS = ['crowd', 'doctor', 'police', 'help', 'security'];

export async function GET() {
  try {
    const snapshot = await Admin.collection('users').get();
    const counts: Record<string, number> = {};

    ROLE_OPTIONS.forEach(role => {
      counts[role] = 0;
    });

    snapshot.forEach(doc => {
      const data = doc.data();
      const userType = data.userType?.toLowerCase();
      if (userType && ROLE_OPTIONS.includes(userType)) {
        counts[userType]++;
      }
    });

    return NextResponse.json({ success: true, data: counts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching userType counts:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching reports', error: String(error) },
      { status: 500 }
    );
  }
}
