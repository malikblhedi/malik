import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const REGION = "us-east-1";
const ACCESS_KEY = "AKIAXTORPV3SKASW3HW5";
const SECRET_KEY = "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";
const BUCKET_NAME = "mys3projectbucketamine1";

if (!REGION || !ACCESS_KEY || !SECRET_KEY || !BUCKET_NAME) {
  throw new Error("Missing AWS S3 environment variables.");
}

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const data = await s3Client.send(command);

    return NextResponse.json({
      contents: data.Contents || [],
    });
  } catch (error: any) {
    console.error("Error listing objects:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to list objects", details: error.message }),
      { status: 500 }
    );
  }
}
