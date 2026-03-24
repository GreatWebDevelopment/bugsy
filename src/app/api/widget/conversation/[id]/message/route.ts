import { prisma } from "@/lib/prisma";
import { generateBugsyResponse } from "@/lib/ai";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { message } = await request.json();

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!conversation) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  // Store visitor message
  const visitorMessage = await prisma.message.create({
    data: {
      conversationId: id,
      sender: "VISITOR",
      content: message,
    },
  });

  // Generate Bugsy response using AI (falls back to rule-based if no API key)
  const bugsyResponse = await generateBugsyResponse(
    conversation.messages.map((m) => ({ sender: m.sender, content: m.content })),
    message
  );

  const bugsyMessage = await prisma.message.create({
    data: {
      conversationId: id,
      sender: "BUGSY",
      content: bugsyResponse,
    },
  });

  return Response.json({ visitorMessage, bugsyMessage });
}
