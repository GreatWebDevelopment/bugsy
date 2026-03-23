import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { message } = await request.json();

  const conversation = await prisma.conversation.findUnique({ where: { id } });
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

  // Generate Bugsy response (simple rule-based for MVP, can plug in AI later)
  const messageCount = await prisma.message.count({
    where: { conversationId: id, sender: "VISITOR" },
  });

  let bugsyResponse: string;
  const lowerMessage = message.toLowerCase();

  if (messageCount === 1) {
    if (lowerMessage.includes("bug") || lowerMessage.includes("error") || lowerMessage.includes("broken")) {
      bugsyResponse = "That sounds like a bug. Can you describe what you expected to happen vs what actually happened?";
    } else if (lowerMessage.includes("feature") || lowerMessage.includes("wish") || lowerMessage.includes("would be nice")) {
      bugsyResponse = "A feature request! Can you describe how you'd like this to work?";
    } else {
      bugsyResponse = "Thanks for reaching out! Can you give me more details about what you're experiencing?";
    }
  } else if (messageCount === 2) {
    bugsyResponse = "Got it, that's helpful. Any additional context? When you're ready, click 'Submit' to send this to the team.";
  } else {
    bugsyResponse = "Thanks for the details. Feel free to add more, or click 'Submit' when you're ready.";
  }

  const bugsyMessage = await prisma.message.create({
    data: {
      conversationId: id,
      sender: "BUGSY",
      content: bugsyResponse,
    },
  });

  return Response.json({ visitorMessage, bugsyMessage });
}
