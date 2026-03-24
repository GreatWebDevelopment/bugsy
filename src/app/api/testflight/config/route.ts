import { prisma } from "@/lib/prisma";
import { authenticateToken } from "@/lib/auth";
import { NextRequest } from "next/server";
import { randomBytes } from "crypto";

export async function GET(request: NextRequest) {
  const user = await authenticateToken(request);
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const configs = await prisma.testFlightConfig.findMany({
    select: {
      id: true,
      issuerId: true,
      keyId: true,
      appId: true,
      enabled: true,
      lastSyncAt: true,
      webhookSecret: true,
      createdAt: true,
      _count: { select: { feedbacks: true } },
    },
  });

  return Response.json({ configs });
}

export async function POST(request: NextRequest) {
  const user = await authenticateToken(request);
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { issuerId, keyId, privateKey, appId } = body;

  if (!issuerId || !keyId || !privateKey || !appId) {
    return Response.json({ error: "Missing required fields: issuerId, keyId, privateKey, appId" }, { status: 400 });
  }

  const config = await prisma.testFlightConfig.create({
    data: {
      issuerId,
      keyId,
      privateKey,
      appId,
      webhookSecret: randomBytes(32).toString("hex"),
    },
  });

  return Response.json({
    success: true,
    config: {
      id: config.id,
      issuerId: config.issuerId,
      keyId: config.keyId,
      appId: config.appId,
      webhookSecret: config.webhookSecret,
      webhookUrl: `${request.nextUrl.origin}/api/testflight/webhook`,
    },
  });
}
