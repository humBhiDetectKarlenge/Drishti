import { db } from '@/firebase/config';
import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
} from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uuid = searchParams.get('uuid');

  if (!uuid) {
    return NextResponse.json({ error: 'Missing uuid parameter' }, { status: 400 });
  }
  try {
    const reportsQuery = query(
      collection(db, 'reports'),
      where('assigneeId', '==', uuid)
    );
    const snapshot = await getDocs(reportsQuery);
    const reports: DocumentData[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      reports.push({
        id: doc.id,
        timestamp: data.timestamp?.toDate().toISOString() || null,
        zone: data.zone ?? '',
        coordinates: data.coordinates ?? '',
        nature: data.nature ?? '',
        priority: data.priority ?? '',
        uuid: data.uuid ?? '',
        assignee: data.assignee ?? '',
        description: data.description ?? '',
        authority: data.userType ?? '',
      });
    });

    return NextResponse.json({ reports }, { status: 200 });
  } catch (err) {
    console.error('Error fetching reports by uuid:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
