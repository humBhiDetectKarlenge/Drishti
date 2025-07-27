import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uuid, coordinates } = body;

    if (!uuid || !coordinates || !coordinates.lat || !coordinates.lng) {
      return NextResponse.json(
        { success: false, error: "Missing uuid or coordinates" },
        { status: 400 }
      );
    }

    const userRef = doc(db, "users", uuid);

    await setDoc(
      userRef,
      {
        coordinates,
        lastUpdated: serverTimestamp(),
      },
      { merge: true } 
    );

    return NextResponse.json({ success: true, message: "Location updated" });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
