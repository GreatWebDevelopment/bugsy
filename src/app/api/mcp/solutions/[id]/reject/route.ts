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
  const { reason } = await request.json();

  const solution = await prisma.solution.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  // Move request back to in_progress so developer can try again
  await prisma.request.update({
    where: { id: solution.requestId },
    data: { status: "IN_PROGRESS" },
  });

  return Response.json({ success: true, solution, reason });
}
