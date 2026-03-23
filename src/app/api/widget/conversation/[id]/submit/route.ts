import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!conversation) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  // Build description from conversation
  const description = conversation.messages
    .filter((m) => m.sender === "VISITOR")
    .map((m) => m.content)
    .join("\n\n");

  const req = await prisma.request.create({
    data: {
      conversationId: id,
      title: body.title,
      description,
      type: body.type || "BUG",
      priority: body.priority || "MEDIUM",
    },
  });

  await prisma.conversation.update({
    where: { id },
    data: { status: "SUBMITTED" },
  });

  return Response.json({
    request: req,
    referenceId: `BUGSY-${req.id.slice(0, 8).toUpperCase()}`,
  });
}
