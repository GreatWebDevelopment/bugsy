import { prisma } from "@/lib/prisma";
import { authenticateToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticateToken(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const req = await prisma.request.findUnique({ where: { id } });
  if (!req) {
    return Response.json({ error: "Request not found" }, { status: 404 });
  }

  if (req.claimedById && req.claimedById !== user.id) {
    return Response.json({ error: "Request already claimed by another developer" }, { status: 409 });
  }

  const updated = await prisma.request.update({
    where: { id },
    data: { claimedById: user.id, status: "IN_PROGRESS" },
  });

  return Response.json({ success: true, request: updated });
}
