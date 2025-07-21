// pages/api/send-notification.ts
import { NextRequest, NextResponse } from "next/server";
import { fcm } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, topic, title, body: msgBody, data } = body;

    // Require either token or topic
    if ((!token && !topic) || !title || !msgBody) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: token or topic, title, body",
        },
        { status: 400 }
      );
    }

    const message: any = {
      notification: {
        title,
        body: msgBody,
      },
      data: data || {},
    };

    if (token) {
      message.token = token;
    } else if (topic) {
      message.topic = topic;
    }

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
