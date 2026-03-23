import { prisma } from "@/lib/prisma";
import { authenticateToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await authenticateToken(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (type) where.type = type;

  const requests = await prisma.request.findMany({
    where,
    include: {
      conversation: { include: { messages: true, screenshots: true } },
      claimedBy: { select: { id: true, name: true, email: true } },
      solutions: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return Response.json({ requests });
}
