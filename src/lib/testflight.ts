import { prisma } from "./prisma";
import { categorizeRequest } from "./ai";
import * as jose from "jose";

const ASC_BASE_URL = "https://api.appstoreconnect.apple.com/v1";

interface TestFlightConfigData {
  issuerId: string;
  keyId: string;
  privateKey: string;
  appId: string;
}

async function generateJWT(config: TestFlightConfigData): Promise<string> {
  const privateKey = await jose.importPKCS8(config.privateKey, "ES256");
  const now = Math.floor(Date.now() / 1000);

  return new jose.SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: config.keyId, typ: "JWT" })
    .setIssuer(config.issuerId)
    .setIssuedAt(now)
    .setExpirationTime(now + 20 * 60)
    .setAudience("appstoreconnect-v1")
    .sign(privateKey);
}

async function ascRequest(config: TestFlightConfigData, endpoint: string) {
  const token = await generateJWT(config);
  const res = await fetch(`${ASC_BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`App Store Connect API error (${res.status}): ${text}`);
  }
  return res.json();
}

/**
 * Fetch and sync TestFlight screenshot feedback
 */
async function syncScreenshotFeedback(configId: string, config: TestFlightConfigData) {
  const results: string[] = [];

  const data = await ascRequest(
    config,
    `/apps/${config.appId}/betaFeedbackScreenshotSubmissions?include=betaTester,build&limit=50`
  );

  for (const item of data.data || []) {
    const appleFeedbackId = item.id;

    // Skip if already synced
    const existing = await prisma.testFlightFeedback.findUnique({
      where: { appleFeedbackId },
    });
    if (existing) continue;

    // Find tester info from included data
    const testerRel = item.relationships?.betaTester?.data;
    const tester = testerRel
      ? data.included?.find((i: { type: string; id: string }) => i.type === "betaTesters" && i.id === testerRel.id)
      : null;

    const buildRel = item.relationships?.build?.data;
    const build = buildRel
      ? data.included?.find((i: { type: string; id: string }) => i.type === "builds" && i.id === buildRel.id)
      : null;

    const attrs = item.attributes || {};
    const testerAttrs = tester?.attributes || {};
    const buildAttrs = build?.attributes || {};

    const feedback = await prisma.testFlightFeedback.create({
      data: {
        configId,
        appleFeedbackId,
        feedbackType: "SCREENSHOT",
        testerEmail: testerAttrs.email || null,
        testerName: [testerAttrs.firstName, testerAttrs.lastName].filter(Boolean).join(" ") || null,
        deviceModel: attrs.deviceModel || null,
        osVersion: attrs.osVersion || null,
        appVersion: buildAttrs.version || null,
        buildVersion: buildAttrs.buildNumber || null,
        comment: attrs.comment || null,
        screenshotUrl: attrs.screenshotUrl || null,
        metadata: { raw: item },
        submittedAt: attrs.timestamp ? new Date(attrs.timestamp) : new Date(),
      },
    });

    // Create a Request from this feedback
    await createRequestFromFeedback(feedback.id);
    results.push(appleFeedbackId);
  }

  return results;
}

/**
 * Fetch and sync TestFlight crash feedback
 */
async function syncCrashFeedback(configId: string, config: TestFlightConfigData) {
  const results: string[] = [];

  const data = await ascRequest(
    config,
    `/apps/${config.appId}/betaFeedbackCrashSubmissions?include=betaTester,build&limit=50`
  );

  for (const item of data.data || []) {
    const appleFeedbackId = item.id;

    const existing = await prisma.testFlightFeedback.findUnique({
      where: { appleFeedbackId },
    });
    if (existing) continue;

    const testerRel = item.relationships?.betaTester?.data;
    const tester = testerRel
      ? data.included?.find((i: { type: string; id: string }) => i.type === "betaTesters" && i.id === testerRel.id)
      : null;

    const buildRel = item.relationships?.build?.data;
    const build = buildRel
      ? data.included?.find((i: { type: string; id: string }) => i.type === "builds" && i.id === buildRel.id)
      : null;

    const attrs = item.attributes || {};
    const testerAttrs = tester?.attributes || {};
    const buildAttrs = build?.attributes || {};

    const feedback = await prisma.testFlightFeedback.create({
      data: {
        configId,
        appleFeedbackId,
        feedbackType: "CRASH",
        testerEmail: testerAttrs.email || null,
        testerName: [testerAttrs.firstName, testerAttrs.lastName].filter(Boolean).join(" ") || null,
        deviceModel: attrs.deviceModel || null,
        osVersion: attrs.osVersion || null,
        appVersion: buildAttrs.version || null,
        buildVersion: buildAttrs.buildNumber || null,
        comment: attrs.comment || null,
        crashLog: attrs.crashLog || null,
        metadata: { raw: item },
        submittedAt: attrs.timestamp ? new Date(attrs.timestamp) : new Date(),
      },
    });

    await createRequestFromFeedback(feedback.id);
    results.push(appleFeedbackId);
  }

  return results;
}

/**
 * Create a Request from TestFlight feedback, applying auto-approve rules
 */
async function createRequestFromFeedback(feedbackId: string) {
  const feedback = await prisma.testFlightFeedback.findUnique({
    where: { id: feedbackId },
  });
  if (!feedback || feedback.requestId) return;

  const title = feedback.feedbackType === "CRASH"
    ? `[TestFlight Crash] ${feedback.deviceModel || "Unknown device"} - ${feedback.appVersion || "Unknown version"}`
    : `[TestFlight Feedback] ${feedback.comment?.slice(0, 80) || "Screenshot feedback"} - ${feedback.testerName || feedback.testerEmail || "Anonymous"}`;

  const description = [
    feedback.comment,
    feedback.feedbackType === "CRASH" && feedback.crashLog ? `\n\nCrash Log:\n${feedback.crashLog}` : null,
    `\nDevice: ${feedback.deviceModel || "Unknown"}`,
    `OS: ${feedback.osVersion || "Unknown"}`,
    `App Version: ${feedback.appVersion || "Unknown"} (${feedback.buildVersion || "?"})`,
    `Tester: ${feedback.testerName || "Unknown"} (${feedback.testerEmail || "no email"})`,
    feedback.screenshotUrl ? `\nScreenshot: ${feedback.screenshotUrl}` : null,
  ].filter(Boolean).join("\n");

  // Auto-categorize
  const categorization = await categorizeRequest(description);
  const type = feedback.feedbackType === "CRASH" ? "BUG" : categorization.type;
  const priority = feedback.feedbackType === "CRASH" ? "HIGH" : categorization.priority;

  // Check auto-approve rules
  const autoApproveRule = feedback.testerEmail
    ? await prisma.autoApproveRule.findUnique({ where: { email: feedback.testerEmail } })
    : null;

  const isAutoApproved = autoApproveRule?.enabled ?? false;

  const request = await prisma.request.create({
    data: {
      title,
      description,
      type: type as "BUG" | "FEATURE" | "FEEDBACK" | "QUESTION",
      priority: priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      status: isAutoApproved ? "APPROVED" : "PENDING",
      source: "TESTFLIGHT",
      approvedAt: isAutoApproved ? new Date() : null,
    },
  });

  await prisma.testFlightFeedback.update({
    where: { id: feedbackId },
    data: { requestId: request.id },
  });

  return request;
}

/**
 * Full sync - pulls all new feedback from TestFlight
 */
export async function syncTestFlightFeedback(configId?: string) {
  const configs = configId
    ? await prisma.testFlightConfig.findMany({ where: { id: configId, enabled: true } })
    : await prisma.testFlightConfig.findMany({ where: { enabled: true } });

  const results = [];

  for (const config of configs) {
    try {
      const screenshots = await syncScreenshotFeedback(config.id, {
        issuerId: config.issuerId,
        keyId: config.keyId,
        privateKey: config.privateKey,
        appId: config.appId,
      });

      const crashes = await syncCrashFeedback(config.id, {
        issuerId: config.issuerId,
        keyId: config.keyId,
        privateKey: config.privateKey,
        appId: config.appId,
      });

      await prisma.testFlightConfig.update({
        where: { id: config.id },
        data: { lastSyncAt: new Date() },
      });

      results.push({
        configId: config.id,
        appId: config.appId,
        newScreenshots: screenshots.length,
        newCrashes: crashes.length,
      });
    } catch (error) {
      results.push({
        configId: config.id,
        appId: config.appId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

/**
 * Process an incoming webhook from App Store Connect
 */
export async function processTestFlightWebhook(payload: {
  signedPayload?: string;
  data?: {
    type: string;
    id: string;
    attributes?: Record<string, unknown>;
    relationships?: Record<string, { data?: { type: string; id: string } }>;
  };
}) {
  // Find a config to use for API calls (needed if we need to fetch more details)
  const config = await prisma.testFlightConfig.findFirst({ where: { enabled: true } });
  if (!config) throw new Error("No TestFlight configuration found");

  const feedbackData = payload.data;
  if (!feedbackData) throw new Error("No feedback data in webhook payload");

  const isCrash = feedbackData.type === "betaFeedbackCrashSubmissions";
  const appleFeedbackId = feedbackData.id;

  // Skip duplicates
  const existing = await prisma.testFlightFeedback.findUnique({
    where: { appleFeedbackId },
  });
  if (existing) return { duplicate: true, feedbackId: existing.id };

  const attrs = (feedbackData.attributes || {}) as Record<string, string>;

  const feedback = await prisma.testFlightFeedback.create({
    data: {
      configId: config.id,
      appleFeedbackId,
      feedbackType: isCrash ? "CRASH" : "SCREENSHOT",
      testerEmail: attrs.testerEmail || null,
      testerName: attrs.testerName || null,
      deviceModel: attrs.deviceModel || null,
      osVersion: attrs.osVersion || null,
      appVersion: attrs.appVersion || null,
      buildVersion: attrs.buildVersion || null,
      comment: attrs.comment || null,
      screenshotUrl: attrs.screenshotUrl || null,
      crashLog: attrs.crashLog || null,
      metadata: JSON.parse(JSON.stringify({ webhook: true, raw: payload })),
      submittedAt: attrs.timestamp ? new Date(attrs.timestamp) : new Date(),
    },
  });

  const request = await createRequestFromFeedback(feedback.id);

  return { feedbackId: feedback.id, requestId: request?.id, autoApproved: request?.status === "APPROVED" };
}
