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

  if (user.role !== "ADMIN") {
    return Response.json({ error: "Only admins can approve solutions" }, { status: 403 });
  }

  const { id } = await params;
  const solution = await prisma.solution.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  await prisma.request.update({
    where: { id: solution.requestId },
    data: { status: "COMPLETED", approvedById: user.id, approvedAt: new Date() },
  });

  return Response.json({ success: true, solution });
}
