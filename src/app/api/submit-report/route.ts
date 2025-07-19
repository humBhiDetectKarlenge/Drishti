import { NextRequest, NextResponse } from 'next/server';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      timestamp,
      zone,
      coordinates,
      issueType,
      priority,
      uuid,
      description
    } = body;

    // Basic validation (optional)
    if (!zone || !coordinates || !issueType || !priority || !uuid) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docData = {
      timestamp: timestamp ? Timestamp.fromDate(new Date(timestamp)) : Timestamp.now(),
      zone,
      coordinates,
      issueType,
      priority,
      uuid,
      description: description || '',
    };

    await addDoc(collection(db, 'reports'), docData);

    return NextResponse.json({ success: true, message: 'Report submitted' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    } else {
      console.error("Unknown error", err);
      return NextResponse.json({ success: false, error: "An unknown error occurred." }, { status: 500 });
    }
  }
}
