import { syncTestFlightFeedback } from "@/lib/testflight";
import { authenticateToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const user = await authenticateToken(request);
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const results = await syncTestFlightFeedback(body.configId);
    return Response.json({ success: true, results });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
