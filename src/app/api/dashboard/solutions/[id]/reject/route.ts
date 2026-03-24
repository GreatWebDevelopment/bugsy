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
    data: { status: "REJECTED" },
  });

  return Response.json({ success: true, solution });
}
