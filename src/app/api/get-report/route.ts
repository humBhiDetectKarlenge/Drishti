import { db } from '@/firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const reportsRef = collection(db, 'reports');
    const q = query(reportsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    const reports = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        timestamp: data.timestamp?.toDate().toISOString() || null,
        zone: data.zone ?? '',
        coordinates: data.coordinates ?? '',
        nature: data.nature ?? '',
        priority: data.priority ?? '',
        uuid: data.uuid ?? '',
        description: data.description ?? '',
        authority: data.userType
      };
    });

    return NextResponse.json({ reports }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      console.error('Unknown error', err);
      return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
    }
  }
}
