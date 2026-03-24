import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: Request) {
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    return Response.json(
      { error: "Setup already completed. Users already exist." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return Response.json(
      { error: "name, email, and password are required" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const apiToken = crypto.randomUUID();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "ADMIN",
      apiToken,
    },
  });

  return Response.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      apiToken: user.apiToken,
    },
  });
}
