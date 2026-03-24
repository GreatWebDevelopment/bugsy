import { prisma } from "@/lib/prisma";
import { authenticateToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await authenticateToken(request);
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rules = await prisma.autoApproveRule.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ rules });
}

export async function POST(request: NextRequest) {
  const user = await authenticateToken(request);
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, name } = await request.json();
  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  const rule = await prisma.autoApproveRule.upsert({
    where: { email },
    update: { name, enabled: true },
    create: { email, name, enabled: true },
  });

  return Response.json({ success: true, rule });
}

export async function DELETE(request: NextRequest) {
  const user = await authenticateToken(request);
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await request.json();
  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  await prisma.autoApproveRule.delete({ where: { email } });
  return Response.json({ success: true });
}
