import { NextRequest, NextResponse } from 'next/server';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic'; 
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as File | null;

    const zone = formData.get('zone')?.toString();
    const lat = parseFloat(formData.get('lat')?.toString() ?? '0');
    const lng = parseFloat(formData.get('lng')?.toString() ?? '0');
    const issueType = formData.get('issueType')?.toString();
    const priority = formData.get('priority')?.toString();
    const uuid = formData.get('uuid')?.toString();
    const authority = formData.get('authority')?.toString();
    const description = formData.get('description')?.toString() || '';
    const timestamp = formData.get('timestamp')?.toString();

    if (!zone || !issueType || !priority || !uuid || !authority || isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let fileUrl = '';

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${randomUUID()}-${file.name}`;
      const fileRef = bucket.file(filename);

      await fileRef.save(buffer, {
        contentType: file.type,
      });
      await fileRef.makePublic();


      fileUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    }

    const docData = {
      timestamp: timestamp ? Timestamp.fromDate(new Date(timestamp)) : Timestamp.now(),
      zone,
      coordinates: { lat, lng },
      issueType,
      priority,
      uuid,
      authority,
      description,
      fileUrl, 
    };

    await addDoc(collection(db, 'reports'), docData);

    return NextResponse.json({ success: true, message: 'Report submitted', fileUrl });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    } else {
      console.error('Unknown error', err);
      return NextResponse.json({ success: false, error: 'An unknown error occurred.' }, { status: 500 });
    }
  }
}
