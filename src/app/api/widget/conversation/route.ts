import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const conversation = await prisma.conversation.create({
    data: {
      visitorName: body.visitorName,
      visitorEmail: body.visitorEmail,
      userAgent: request.headers.get("user-agent"),
      currentUrl: body.currentUrl,
      metadata: body.metadata,
    },
  });

  // Create initial greeting message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "BUGSY",
      content:
        "Hi! I'm Bugsy. I can help you report a bug, request a feature, or ask a question. What can I help you with?",
    },
  });

  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
  });

  return Response.json({ conversation, messages });
}
