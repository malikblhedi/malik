import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Vérifie que toutes les variables sont bien définies
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

export async function POST(req: Request) {
  try {
    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return new Response("Missing fileName or fileType", { status: 400 });
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return Response.json({ signedUrl });
  } catch (error) {
    console.error("❌ Failed to generate signed URL:", error);
    return new Response("Failed to generate signed URL", { status: 500 });
  }
}

