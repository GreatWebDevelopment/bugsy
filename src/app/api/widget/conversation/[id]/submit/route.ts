import { prisma } from "@/lib/prisma";
import { categorizeRequest } from "@/lib/ai";
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

  // Auto-categorize if type/priority not provided
  let type = body.type;
  let priority = body.priority;
  if (!type || !priority) {
    const fullText = conversation.messages.map((m) => `${m.sender}: ${m.content}`).join("\n");
    const categorization = await categorizeRequest(fullText);
    type = type || categorization.type;
    priority = priority || categorization.priority;
  }

  const req = await prisma.request.create({
    data: {
      conversationId: id,
      title: body.title,
      description,
      type,
      priority,
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
