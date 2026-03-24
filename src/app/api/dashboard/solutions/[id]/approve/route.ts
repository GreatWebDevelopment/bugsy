import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-session";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

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
