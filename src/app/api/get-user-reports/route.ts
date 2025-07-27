import { db } from '@/firebase/config';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  DocumentData
} from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('email');

  if (!userEmail) {
    return NextResponse.json({ error: 'Missing user email' }, { status: 400 });
  }

  try {
    const userQuery = query(collection(db, 'users'), where('email', '==', userEmail));
    const userSnap = await getDocs(userQuery);

    if (userSnap.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userDoc = userSnap.docs[0];
    const userData = userDoc.data();
    const reportUUIDs = userData.reports || [];
    if (!Array.isArray(reportUUIDs) || reportUUIDs.length === 0) {
      return NextResponse.json({ reports: [] }, { status: 200 });
    }

    const reportsRef = collection(db, 'reports');
    const reports: DocumentData[] = [];

    for (const uuid of reportUUIDs) {
      const q = query(reportsRef, where('uuid', '==', uuid));
      const snap = await getDocs(q);
      snap.forEach((doc) => {
        const data = doc.data();
        reports.push({
          id: doc.id,
          timestamp: data.timestamp?.toDate().toISOString() || null,
          zone: data.zone ?? '',
          coordinates: data.coordinates ?? '',
          nature: data.nature ?? '',
          priority: data.priority ?? '',
          uuid: data.uuid ?? '',
          description: data.description ?? '',
          authority: data.userType
        });
      });
    }

    return NextResponse.json({ reports }, { status: 200 });

  } catch (err) {
    console.error('Error fetching reports:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
