import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.AWS_PUBLIC_BUCKET || "greatwebdevelopment-public";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file
  const allowedTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return Response.json({ error: "Only image files are allowed" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: "File must be under 5MB" }, { status: 400 });
  }

  try {
    const ext = file.name.split(".").pop() || "png";
    const fileName = `${Date.now()}.${ext}`;
    const s3Key = `bugsy/screenshots/${id}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const publicUrl = `https://${BUCKET}.s3.amazonaws.com/${s3Key}`;

    const screenshot = await prisma.screenshot.create({
      data: {
        conversationId: id,
        filePath: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      },
    });

    return Response.json({ screenshot, url: publicUrl });
  } catch (error) {
    console.error("Screenshot upload error:", error);
    return Response.json({ error: "Failed to upload screenshot" }, { status: 500 });
  }
}
