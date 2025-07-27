import { NextRequest, NextResponse } from "next/server";
import {
  addDoc,
  collection,
  Timestamp,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Storage } from "@google-cloud/storage";
import { readFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
export const dynamic = "force-dynamic";

const keyPath = join(process.cwd(), "gcp-storage-key.json");
const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));

const storage = new Storage({
  projectId: serviceAccount.project_id,
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  },
});
const bucket = storage.bucket("storage-bucket-files");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const zone = formData.get("zone")?.toString();
    const lat = parseFloat(formData.get("lat")?.toString() ?? "0");
    const lng = parseFloat(formData.get("lng")?.toString() ?? "0");
    const issueType = formData.get("issueType")?.toString();
    const priority = formData.get("priority")?.toString();
    const uuid = formData.get("uuid")?.toString();
    const userEmail = formData.get("userEmail")?.toString();
    const userType = formData.get("userType")?.toString();
    const description = formData.get("description")?.toString() || "";
    const timestamp = formData.get("timestamp")?.toString();

    if (
      !zone ||
      !issueType ||
      !priority ||
      !uuid ||
      !userEmail ||
      !userType ||
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
      userType,
      description,
      fileUrl,
      userEmail
    };

    // console.log("Final docData to Firestore:", docData);

    await addDoc(collection(db, "reports"), docData);

    const userQuery = query(
      collection(db, "users"),
      where("email", "==", userEmail)
    );
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      const userRef = doc(db, "users", userDoc.id);

      await updateDoc(userRef, {
        reports: arrayUnion(uuid),
      });
    } else {
      console.warn("No user found with email:", userEmail);
    }

    return NextResponse.json({
      success: true,
      message: "Report submitted and user updated",
      fileUrl,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
