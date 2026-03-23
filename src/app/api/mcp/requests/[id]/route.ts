import { prisma } from "@/lib/prisma";
import { authenticateToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticateToken(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const req = await prisma.request.findUnique({
    where: { id },
    include: {
      conversation: { include: { messages: { orderBy: { createdAt: "asc" } }, screenshots: true } },
      claimedBy: { select: { id: true, name: true, email: true } },
      approvedBy: { select: { id: true, name: true, email: true } },
      solutions: { include: { developer: { select: { id: true, name: true } } } },
    },
  });

  if (!req) {
    return Response.json({ error: "Request not found" }, { status: 404 });
  }

  return Response.json(req);
}
