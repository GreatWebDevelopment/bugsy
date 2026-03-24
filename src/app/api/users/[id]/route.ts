import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-session";
import crypto from "crypto";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};

  if (typeof body.autoApprove === "boolean") {
    data.autoApprove = body.autoApprove;
  }

  if (body.regenerateToken) {
    data.apiToken = crypto.randomUUID();
  }

  if (body.name) data.name = body.name;
  if (body.role) data.role = body.role;

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      autoApprove: true,
      apiToken: true,
      createdAt: true,
    },
  });

  return Response.json({ user: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (id === user.id) {
    return Response.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });

  return Response.json({ success: true });
}
