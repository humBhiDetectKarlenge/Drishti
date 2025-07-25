import { NextRequest, NextResponse } from 'next/server';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { app } from '../../../../firebase/config';

const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { groupId, memberEmails } = body;

    if (!Array.isArray(memberEmails) || memberEmails.length === 0 || !groupId) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', 'in', memberEmails));
    const querySnapshot = await getDocs(q);

    const emailToIdMap: Record<string, string> = {};
    querySnapshot.forEach(docSnap => {
      const userData = docSnap.data();
      emailToIdMap[userData.email] = docSnap.id;
    });

    const missingEmails = memberEmails.filter(email => !emailToIdMap[email]);
    if (missingEmails.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Some emails not found',
        missingEmails
      }, { status: 404 });
    }

    const memberIds = memberEmails.map(email => emailToIdMap[email]);
    const creatorId = memberIds[0]; 

    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);

    if (groupSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Group ID already exists' }, { status: 403 });
    }

    await setDoc(groupRef, {
      creatorId,
      memberIds,
      createdAt: Date.now()
    });

    const updateUserPromises = memberIds.map(uid => {
      const userRef = doc(db, 'users', uid);
      return updateDoc(userRef, {
        groupIds: arrayUnion(groupId)
      });
    });

    await Promise.all(updateUserPromises);

    return NextResponse.json({ success: true, message: 'Group created and users updated successfully' });
  } catch (error) {
    console.error('Group creation failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error',
      error: String(error)
    }, { status: 500 });
  }
}
