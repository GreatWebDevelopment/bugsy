import { processTestFlightWebhook } from "@/lib/testflight";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { createHmac } from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.text();

  // Verify webhook secret if configured
  const config = await prisma.testFlightConfig.findFirst({ where: { enabled: true } });
  if (config?.webhookSecret) {
    const signature = request.headers.get("x-apple-signature");
    if (signature) {
      const expected = createHmac("sha256", config.webhookSecret).update(body).digest("hex");
      if (signature !== expected) {
        return Response.json({ error: "Invalid signature" }, { status: 401 });
      }
    }
  }

  try {
    const payload = JSON.parse(body);
    const result = await processTestFlightWebhook(payload);
    return Response.json({ success: true, ...result });
  } catch (error) {
    console.error("TestFlight webhook error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
