import { prisma } from "./prisma";
import { NextRequest } from "next/server";

export async function authenticateToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const user = await prisma.user.findUnique({ where: { apiToken: token } });
  return user;
}
