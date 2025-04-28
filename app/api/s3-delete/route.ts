import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { fileKey } = await request.json();

    // Validate fileKey
    if (!fileKey) {
      return NextResponse.json({ message: "File key is required" }, { status: 400 });
    }

    // Initialize S3 client with hardcoded credentials
    const s3Client = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: "AKIAXTORPV3SKASW3HW5",
        secretAccessKey: "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",
      },
    });

    // Delete object from S3
    const deleteParams = {
      Bucket: "mys3projectbucketamine1",
      Key: fileKey,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3Client.send(deleteCommand);

    return NextResponse.json({ message: "File deleted successfully!" });
  } catch (error) {
    console.error("Error deleting file from S3:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        message: "Failed to delete file",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}