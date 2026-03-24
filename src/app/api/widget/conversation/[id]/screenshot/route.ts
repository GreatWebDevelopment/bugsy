import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

  // Save to public/uploads/<conversationId>/
  const uploadDir = path.join(process.cwd(), "public", "uploads", id);
  await mkdir(uploadDir, { recursive: true });

  const ext = file.name.split(".").pop() || "png";
  const fileName = `${Date.now()}.${ext}`;
  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const publicPath = `/uploads/${id}/${fileName}`;

  const screenshot = await prisma.screenshot.create({
    data: {
      conversationId: id,
      filePath: publicPath,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    },
  });

  return Response.json({ screenshot, url: publicPath });
}
