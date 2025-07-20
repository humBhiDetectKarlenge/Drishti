// pages/api/send-notification.ts
import { NextRequest, NextResponse } from "next/server";
import { fcm } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, title, body: msgBody, data } = body;

    if (!token || !title || !msgBody) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const message = {
      token,
      notification: {
        title,
        body: msgBody,
      },
      data: data || {},
    };

    const response = await fcm.send(message);

    return NextResponse.json({ success: true, messageId: response });
  } catch (err) {
    if (err instanceof Error) {
      console.error("FCM Error:", err.message);
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown Error:", err);
      return NextResponse.json(
        { success: false, error: "An unknown error occurred." },
        { status: 500 }
      );
    }
  }
}
