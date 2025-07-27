// /app/api/notify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fcm } from "@/lib/firebase-admin";
import twilio from "twilio";

const twilioClient = twilio(
  "ACe78f52d098450146146bc1869d55e3f8",
  "d3fb4e4ef8f7965ee2255ebc64121d00"
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, token, topic, title, body: msgBody, data, phone } = body;

    if (!type || (type !== "sms" && type !== "push")) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing 'type'" },
        { status: 400 }
      );
    }

    if (type === "push") {
      if ((!token && !topic) || !title || !msgBody) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing fields for push: token or topic, title, body",
          },
          { status: 400 }
        );
      }

      const message: any = {
        notification: { title, body: msgBody },
        data: data || {},
      };

      if (token) message.token = token;
      else if (topic) message.topic = topic;

      const fcmResponse = await fcm.send(message);

      return NextResponse.json({
        success: true,
        type: "push",
        messageId: fcmResponse,
      });
    }

    if (type === "sms") {
      if (!phone || !msgBody) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing fields for SMS: phone and body",
          },
          { status: 400 }
        );
      }

      const smsResponse = await twilioClient.messages.create({
        body: msgBody,
        from: "640500-2197",
        to: phone,
      });

      return NextResponse.json({
        success: true,
        type: "sms",
        smsSid: smsResponse.sid,
      });
    }
  } catch (err) {
    console.error("Notify Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
