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
  const { summary, diff } = await request.json();

  const req = await prisma.request.findUnique({ where: { id } });
  if (!req) {
    return Response.json({ error: "Request not found" }, { status: 404 });
  }

  const solution = await prisma.solution.create({
    data: {
      requestId: id,
      developerId: user.id,
      summary,
      diff,
    },
  });

  // If the developer has auto-approve, auto-approve the solution
  if (user.autoApprove) {
    await prisma.solution.update({
      where: { id: solution.id },
      data: { status: "APPROVED" },
    });
    await prisma.request.update({
      where: { id },
      data: { status: "COMPLETED", approvedById: user.id, approvedAt: new Date() },
    });
    return Response.json({ success: true, solution: { ...solution, status: "APPROVED" }, autoApproved: true });
  }

  // Otherwise, mark as awaiting approval
  await prisma.request.update({
    where: { id },
    data: { status: "AWAITING_APPROVAL" },
  });

  return Response.json({ success: true, solution, autoApproved: false });
}
