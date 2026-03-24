import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BUGSY_API_URL = process.env.BUGSY_API_URL || "http://localhost:3000";
const BUGSY_API_TOKEN = process.env.BUGSY_API_TOKEN;

async function apiRequest(path, method = "GET", body = null, prefix = "/api/mcp") {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BUGSY_API_TOKEN}`,
    },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${BUGSY_API_URL}${prefix}${path}`, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error (${res.status}): ${text}`);
  }
  return res.json();
}

const server = new McpServer({
  name: "bugsy",
  version: "1.0.0",
});

// ─── Request Tools ──────────────────────────────────────────

server.tool(
  "list_requests",
  "List bug/feature requests with optional filters",
  {
    status: z
      .enum(["PENDING", "APPROVED", "IN_PROGRESS", "AWAITING_APPROVAL", "COMPLETED", "REJECTED"])
      .optional()
      .describe("Filter by status"),
    type: z
      .enum(["BUG", "FEATURE", "FEEDBACK", "QUESTION"])
      .optional()
      .describe("Filter by type"),
    limit: z.number().optional().describe("Max results (default 20)"),
  },
  async ({ status, type, limit }) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    if (limit) params.set("limit", String(limit));
    const data = await apiRequest(`/requests?${params}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_request",
  "Get full details of a request including conversation history",
  {
    request_id: z.string().describe("The request ID"),
  },
  async ({ request_id }) => {
    const data = await apiRequest(`/requests/${request_id}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "claim_request",
  "Claim a request to work on it",
  {
    request_id: z.string().describe("The request ID to claim"),
  },
  async ({ request_id }) => {
    const data = await apiRequest(`/requests/${request_id}/claim`, "POST");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "submit_solution",
  "Submit a solution for a request",
  {
    request_id: z.string().describe("The request ID"),
    summary: z.string().describe("Summary of what was done"),
    diff: z.string().optional().describe("Code diff or changes made"),
  },
  async ({ request_id, summary, diff }) => {
    const data = await apiRequest(`/requests/${request_id}/solution`, "POST", {
      summary,
      diff,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "approve_solution",
  "Approve a submitted solution (admin/developer only)",
  {
    solution_id: z.string().describe("The solution ID to approve"),
  },
  async ({ solution_id }) => {
    const data = await apiRequest(`/solutions/${solution_id}/approve`, "POST");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "reject_solution",
  "Reject a submitted solution with reason",
  {
    solution_id: z.string().describe("The solution ID to reject"),
    reason: z.string().describe("Reason for rejection"),
  },
  async ({ solution_id, reason }) => {
    const data = await apiRequest(`/solutions/${solution_id}/reject`, "POST", { reason });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "approve_request",
  "Approve a pending request for development",
  {
    request_id: z.string().describe("The request ID to approve"),
  },
  async ({ request_id }) => {
    const data = await apiRequest(`/requests/${request_id}/approve`, "POST");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "reject_request",
  "Reject a pending request",
  {
    request_id: z.string().describe("The request ID to reject"),
    reason: z.string().optional().describe("Reason for rejection"),
  },
  async ({ request_id, reason }) => {
    const data = await apiRequest(`/requests/${request_id}/reject`, "POST", { reason });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ─── TestFlight Tools ───────────────────────────────────────

server.tool(
  "sync_testflight",
  "Sync TestFlight feedback from App Store Connect into the request queue",
  {},
  async () => {
    const data = await apiRequest("/sync", "POST", {}, "/api/testflight");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "list_auto_approve_rules",
  "List TestFlight tester emails that are set to auto-approve",
  {},
  async () => {
    const data = await apiRequest("/auto-approve", "GET", null, "/api/testflight");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "add_auto_approve_rule",
  "Add a TestFlight tester email to the auto-approve list",
  {
    email: z.string().describe("Tester email to auto-approve"),
    name: z.string().optional().describe("Tester name"),
  },
  async ({ email, name }) => {
    const data = await apiRequest("/auto-approve", "POST", { email, name }, "/api/testflight");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "remove_auto_approve_rule",
  "Remove a tester email from the auto-approve list",
  {
    email: z.string().describe("Tester email to remove"),
  },
  async ({ email }) => {
    const data = await apiRequest("/auto-approve", "DELETE", { email }, "/api/testflight");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ─── Start Server ───────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
