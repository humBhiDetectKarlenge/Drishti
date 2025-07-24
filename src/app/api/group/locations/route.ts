import { NextRequest, NextResponse } from 'next/server';
import { Admin } from '../../../../lib/firebase-admin';

export async function GET(req: NextRequest) {
  const groupId = req.nextUrl.searchParams.get('groupId');

  if (!groupId) {
    return NextResponse.json({ success: false, message: 'Missing groupId' }, { status: 400 });
  }

  try {
    const groupRef = Admin.doc(`groups/${groupId}`);
    const groupSnap = await groupRef.get();

    if (!groupSnap.exists) {
      return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });
    }

    const groupData = groupSnap.data();
    if (!groupData || !Array.isArray(groupData.memberIds)) {
      return NextResponse.json({ success: false, message: 'Invalid group data' }, { status: 500 });
    }

    const memberIds: string[] = [groupData.creatorId, ...(groupData.memberIds || [])];

    const userRefs = memberIds.map(id => Admin.doc(`users/${id}`));
    const userDocs = await Admin.getAll(...userRefs);

    const coordinates = userDocs.map(doc => {
        const data = doc.exists ? doc.data() : null;
        const coordinate = data?.coordinates;
      
        return {
          userId: doc.id,
          coordinate: coordinate && coordinate.lat !== undefined && coordinate.lng !== undefined
            ? { lat: coordinate.lat, lng: coordinate.lng }
            : null,
        };
      });
      
      

    return NextResponse.json({ success: true, data: coordinates }, { status: 200 });
  } catch (error) {
    console.error('Error fetching members by groupId:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: String(error) }, { status: 500 });
  }
}
