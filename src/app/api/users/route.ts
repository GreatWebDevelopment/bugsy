import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-session";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function GET() {
  const user = await requireAuth();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
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

  return Response.json({ users });
}

export async function POST(request: Request) {
  const user = await requireAuth();
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, password, role, autoApprove } = body;

  if (!name || !email || !password) {
    return Response.json({ error: "name, email, and password are required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Email already in use" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const apiToken = crypto.randomUUID();

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role || "DEVELOPER",
      autoApprove: autoApprove || false,
      apiToken,
    },
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

  return Response.json({ user: newUser }, { status: 201 });
}
