import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { app } from '../../../../firebase/config';

const db = getFirestore(app);



export async function POST(req: NextRequest) {
    
  try {
    const body = await req.json();
    const { creatorId, groupId, memberIds } = body;

    if (!creatorId || !Array.isArray(memberIds) || !groupId) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);

    if (groupSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Group ID already exists' }, { status: 403 });
    }

    const filteredMembers = memberIds.filter(id => id !== creatorId);

    await setDoc(groupRef, {
      creatorId,
      memberIds: filteredMembers,
      createdAt: Date.now()
    });

    const updateUserPromises = filteredMembers.map(id => {
      const userRef = doc(db, 'users', id);
      return updateDoc(userRef, {
        groupIds: arrayUnion(groupId)
      });
    });

    updateUserPromises.push(
      updateDoc(doc(db, 'users', creatorId), {
        groupIds: arrayUnion(groupId)
      })
    );

    await Promise.all(updateUserPromises);

    return NextResponse.json({ success: true, message: 'Group created and users updated successfully' });
  } catch (error) {
    console.error('Group creation failed:', error);
    return NextResponse.json({ success: false, message: 'Server error', error: String(error) }, { status: 500 });
  }
}