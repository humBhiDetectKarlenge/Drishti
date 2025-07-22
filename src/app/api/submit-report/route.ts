import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Storage } from "@google-cloud/storage";
import { readFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

// Load credentials from the service account file
const keyPath = join(process.cwd(), "gcp-storage-key.json");
console.log("🚀 ~ keyPath:", keyPath);
const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));
console.log("🚀 ~ serviceAccount:", serviceAccount);

const storage = new Storage({
  projectId: serviceAccount.project_id,
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  },
});
const bucketName = process.env.GCP_BUCKET_NAME;
const bucket = storage.bucket("storage-bucket-files");
console.log("🚀 ~ bucket:", bucket);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    console.log("🚀 ~ POST ~ formData:", formData);

    const file = formData.get("file") as File | null;

    const zone = formData.get("zone")?.toString();
    const lat = parseFloat(formData.get("lat")?.toString() ?? "0");
    const lng = parseFloat(formData.get("lng")?.toString() ?? "0");
    const issueType = formData.get("issueType")?.toString();
    const priority = formData.get("priority")?.toString();
    const uuid = formData.get("uuid")?.toString();
    const authority = formData.get("authority")?.toString();
    const description = formData.get("description")?.toString() || "";
    const timestamp = formData.get("timestamp")?.toString();

    if (
      !zone ||
      !issueType ||
      !priority ||
      !uuid ||
      !authority ||
      isNaN(lat) ||
      isNaN(lng)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let fileUrl = "";

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${randomUUID()}-${file.name}`;
      const fileRef = bucket.file(filename);

      try {
        await fileRef.save(buffer, {
          contentType: file.type,
        });
      } catch (e) {
        console.error("Failed to upload file:", e);
        return NextResponse.json({ success: false, error: e }, { status: 500 });
      }

      fileUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    }

    const docData = {
      timestamp: timestamp
        ? Timestamp.fromDate(new Date(timestamp))
        : Timestamp.now(),
      zone,
      coordinates: { lat, lng },
      issueType,
      priority,
      uuid,
      authority,
      description,
      fileUrl,
    };

    await addDoc(collection(db, "reports"), docData);

    return NextResponse.json({
      success: true,
      message: "Report submitted",
      fileUrl,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error", err);
      return NextResponse.json(
        { success: false, error: "An unknown error occurred." },
        { status: 500 }
      );
    }
  }
}
