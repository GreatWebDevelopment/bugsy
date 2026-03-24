import { BookOpen, Terminal, Plug, Server, ShieldCheck, Smartphone } from "lucide-react";

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-gray-900 text-green-400 rounded-xl p-5 overflow-x-auto text-sm font-mono leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

function SectionHeading({
  id,
  icon: Icon,
  children,
}: {
  id: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-2xl lg:text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-6 scroll-mt-24"
    >
      <Icon className="w-7 h-7 text-violet-600 shrink-0" />
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-bold text-gray-900 mt-8 mb-3">{children}</h3>
  );
}

export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-16">
        {/* Sidebar nav */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1 text-sm">
            {[
              { href: "#quick-start", label: "Quick Start" },
              { href: "#embedding-widget", label: "Embedding the Widget" },
              { href: "#mcp-server-setup", label: "MCP Server Setup" },
              { href: "#api-reference", label: "API Reference" },
              { href: "#testflight", label: "TestFlight Integration" },
              { href: "#approval-system", label: "Approval System" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-lg text-gray-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Documentation
          </h1>
          <p className="text-lg text-gray-500 mb-16 max-w-2xl">
            Everything you need to deploy Bugsy, embed the widget, and connect
            AI developers via MCP.
          </p>

          {/* Quick Start */}
          <section className="mb-20">
            <SectionHeading id="quick-start" icon={BookOpen}>
              Quick Start
            </SectionHeading>
            <p className="text-gray-600 mb-6">
              Get Bugsy running locally in under 5 minutes.
            </p>

            <SubHeading>1. Clone the repo</SubHeading>
            <CodeBlock>{`git clone https://github.com/greatwebdevelopment/bugsy.git
cd bugsy
npm install`}</CodeBlock>

            <SubHeading>2. Set up PostgreSQL</SubHeading>
            <p className="text-gray-600 mb-3">
              Create a PostgreSQL database and note the connection string.
            </p>
            <CodeBlock>{`createdb bugsy`}</CodeBlock>

            <SubHeading>3. Configure .env</SubHeading>
            <CodeBlock>{`DATABASE_URL="postgresql://user:password@localhost:5432/bugsy"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"`}</CodeBlock>

            <SubHeading>4. Run migrations</SubHeading>
            <CodeBlock>{`npx prisma migrate dev
npx prisma generate`}</CodeBlock>

            <SubHeading>5. Create your first admin user</SubHeading>
            <CodeBlock>{`curl -X POST http://localhost:3000/api/setup \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "your-password"
  }'`}</CodeBlock>

            <SubHeading>6. Start the server</SubHeading>
            <CodeBlock>{`npm run dev`}</CodeBlock>
            <p className="text-gray-600 mt-3">
              Open{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                http://localhost:3000
              </code>{" "}
              to access the dashboard.
            </p>
          </section>

          {/* Embedding the Widget */}
          <section className="mb-20">
            <SectionHeading id="embedding-widget" icon={Terminal}>
              Embedding the Widget
            </SectionHeading>
            <p className="text-gray-600 mb-6">
              Add the Bugsy chat widget to any website with a single script tag.
            </p>

            <SubHeading>Script tag</SubHeading>
            <CodeBlock>{`<script src="https://your-bugsy-instance.com/widget.js"></script>
<script>
  Bugsy.init({
    apiUrl: "https://your-bugsy-instance.com",
    position: "bottom-right",
    primaryColor: "#7c3aed",
    greeting: "Hi! How can I help you today?"
  });
</script>`}</CodeBlock>

            <SubHeading>Configuration options</SubHeading>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">
                      Option
                    </th>
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">
                      Default
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">
                      <code className="text-violet-600 font-mono text-xs">apiUrl</code>
                    </td>
                    <td className="py-3 pr-4">string</td>
                    <td className="py-3 pr-4">&mdash;</td>
                    <td className="py-3">
                      URL of your Bugsy instance (required)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">
                      <code className="text-violet-600 font-mono text-xs">position</code>
                    </td>
                    <td className="py-3 pr-4">string</td>
                    <td className="py-3 pr-4">
                      <code className="font-mono text-xs">bottom-right</code>
                    </td>
                    <td className="py-3">
                      Widget position:{" "}
                      <code className="font-mono text-xs">bottom-right</code> or{" "}
                      <code className="font-mono text-xs">bottom-left</code>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">
                      <code className="text-violet-600 font-mono text-xs">primaryColor</code>
                    </td>
                    <td className="py-3 pr-4">string</td>
                    <td className="py-3 pr-4">
                      <code className="font-mono text-xs">#7c3aed</code>
                    </td>
                    <td className="py-3">Theme color for the widget</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">
                      <code className="text-violet-600 font-mono text-xs">greeting</code>
                    </td>
                    <td className="py-3 pr-4">string</td>
                    <td className="py-3 pr-4">Auto</td>
                    <td className="py-3">Initial greeting message</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <SubHeading>Full HTML example</SubHeading>
            <CodeBlock>{`<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <h1>My Application</h1>

  <script src="https://your-bugsy-instance.com/widget.js"></script>
  <script>
    Bugsy.init({
      apiUrl: "https://your-bugsy-instance.com",
      position: "bottom-right",
      primaryColor: "#7c3aed",
      greeting: "Found a bug? Let me help you report it!"
    });
  </script>
</body>
</html>`}</CodeBlock>
          </section>

          {/* MCP Server Setup */}
          <section className="mb-20">
            <SectionHeading id="mcp-server-setup" icon={Plug}>
              MCP Server Setup
            </SectionHeading>
            <p className="text-gray-600 mb-6">
              Connect AI developer agents (like Claude Code) to Bugsy via the
              Model Context Protocol.
            </p>

            <SubHeading>Configure in Claude Code</SubHeading>
            <p className="text-gray-600 mb-3">
              Add the following to your{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                ~/.claude.json
              </code>{" "}
              file:
            </p>
            <CodeBlock>{`{
  "mcpServers": {
    "bugsy": {
      "command": "node",
      "args": ["/path/to/bugsy/mcp/index.js"],
      "env": {
        "BUGSY_API_URL": "http://localhost:3000",
        "BUGSY_API_TOKEN": "your-developer-api-token"
      }
    }
  }
}`}</CodeBlock>

            <SubHeading>Available MCP tools</SubHeading>
            <div className="space-y-4 mt-4">
              {[
                {
                  name: "list_requests",
                  desc: "List bug/feature requests with optional filters (status, type, limit)",
                },
                {
                  name: "get_request",
                  desc: "Get full details of a request including conversation history",
                },
                {
                  name: "claim_request",
                  desc: "Claim a request to work on it",
                },
                {
                  name: "submit_solution",
                  desc: "Submit a solution with summary and optional diff",
                },
                {
                  name: "approve_solution",
                  desc: "Approve a submitted solution (admin/developer only)",
                },
                {
                  name: "reject_solution",
                  desc: "Reject a submitted solution with reason",
                },
                {
                  name: "approve_request",
                  desc: "Approve a pending request for development",
                },
                {
                  name: "reject_request",
                  desc: "Reject a pending request with optional reason",
                },
              ].map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <code className="text-violet-600 font-mono text-sm font-semibold whitespace-nowrap">
                    {tool.name}
                  </code>
                  <span className="text-gray-600 text-sm">{tool.desc}</span>
                </div>
              ))}
            </div>

            <SubHeading>Example workflow</SubHeading>
            <CodeBlock>{`# 1. List open requests
list_requests --status APPROVED

# 2. Claim a request to work on
claim_request --request_id "abc123"

# 3. (Make your code changes)

# 4. Submit the solution
submit_solution \\
  --request_id "abc123" \\
  --summary "Fixed the export crash by handling null data" \\
  --diff "--- a/src/export.ts\\n+++ b/src/export.ts\\n..."`}</CodeBlock>
          </section>

          {/* API Reference */}
          <section className="mb-20">
            <SectionHeading id="api-reference" icon={Server}>
              API Reference
            </SectionHeading>

            <SubHeading>Authentication</SubHeading>
            <p className="text-gray-600 mb-3">
              MCP and developer endpoints require a Bearer token in the
              Authorization header:
            </p>
            <CodeBlock>{`Authorization: Bearer <your-api-token>`}</CodeBlock>

            <SubHeading>Widget endpoints</SubHeading>
            <div className="overflow-x-auto mt-4 mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">
                      Method
                    </th>
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">
                      Endpoint
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">
                      <code className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                        POST
                      </code>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs">
                      /api/widget/conversation
                    </td>
                    <td className="py-3">Start a new conversation</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">
                      <code className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                        POST
                      </code>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs">
                      /api/widget/conversation/:id/message
                    </td>
                    <td className="py-3">Send a message</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">
                      <code className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                        POST
                      </code>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs">
                      /api/widget/conversation/:id/submit
                    </td>
                    <td className="py-3">Submit feedback form</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <SubHeading>MCP endpoints</SubHeading>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">
                      Method
                    </th>
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">
                      Endpoint
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {[
                    ["GET", "/api/mcp/requests", "List requests"],
                    ["GET", "/api/mcp/requests/:id", "Get request details"],
                    ["POST", "/api/mcp/requests/:id/claim", "Claim a request"],
                    ["POST", "/api/mcp/requests/:id/approve", "Approve request"],
                    ["POST", "/api/mcp/requests/:id/reject", "Reject request"],
                    ["POST", "/api/mcp/requests/:id/solution", "Submit solution"],
                    ["POST", "/api/mcp/solutions/:id/approve", "Approve solution"],
                    ["POST", "/api/mcp/solutions/:id/reject", "Reject solution"],
                  ].map(([method, path, desc]) => (
                    <tr key={path} className="border-b border-gray-100">
                      <td className="py-3 pr-4">
                        <code
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            method === "GET"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {method}
                        </code>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs">{path}</td>
                      <td className="py-3">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TestFlight Integration */}
          <section className="mb-20">
            <SectionHeading id="testflight" icon={Smartphone}>
              TestFlight Integration
            </SectionHeading>

            <p className="text-gray-600 mb-6">
              Bugsy can automatically pull in beta feedback from Apple&apos;s TestFlight — including
              screenshots, crash reports, and tester comments. Feedback is ingested, AI-categorized,
              and routed through the approval pipeline.
            </p>

            <h3 className="text-lg font-bold text-gray-900 mb-3">1. Configure App Store Connect</h3>
            <p className="text-gray-600 mb-3">
              You&apos;ll need an App Store Connect API key with access to your app&apos;s TestFlight data.
              Create one at{" "}
              <span className="text-violet-600 font-medium">App Store Connect → Users and Access → Integrations → App Store Connect API</span>.
            </p>
            <CodeBlock>{`curl -X POST https://your-bugsy-instance.com/api/testflight/config \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "issuerId": "69a6de85-...",
    "keyId": "ABC123",
    "privateKey": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----",
    "appId": "1234567890"
  }'`}</CodeBlock>
            <p className="text-gray-600 mt-3 mb-6">
              This returns a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">webhookSecret</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">webhookUrl</code> for
              real-time ingestion.
            </p>

            <h3 className="text-lg font-bold text-gray-900 mb-3">2. Set Up Webhook (Recommended)</h3>
            <p className="text-gray-600 mb-3">
              Register the webhook URL in App Store Connect so feedback arrives in real-time:
            </p>
            <CodeBlock>{`Webhook URL: https://your-bugsy-instance.com/api/testflight/webhook

Events to subscribe:
  • BETA_FEEDBACK_SCREENSHOT_SUBMISSION_CREATED
  • BETA_FEEDBACK_CRASH_SUBMISSION_CREATED`}</CodeBlock>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">3. Or Sync On-Demand</h3>
            <p className="text-gray-600 mb-3">
              Use the MCP tool or API to pull feedback manually:
            </p>
            <CodeBlock>{`# Via API
curl -X POST https://your-bugsy-instance.com/api/testflight/sync \\
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Via MCP (in Claude Code)
bugsy.sync_testflight()`}</CodeBlock>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">4. Auto-Approve Trusted Testers</h3>
            <p className="text-gray-600 mb-3">
              Add tester emails to the auto-approve list. Their feedback skips review and goes
              straight to AI developers:
            </p>
            <CodeBlock>{`# Add an auto-approve rule
curl -X POST https://your-bugsy-instance.com/api/testflight/auto-approve \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "trusted-tester@example.com", "name": "Jane Doe"}'

# Via MCP
bugsy.add_auto_approve_rule({ email: "trusted-tester@example.com" })`}</CodeBlock>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h4 className="font-bold text-blue-900 mb-2">How the pipeline works</h4>
              <ul className="text-blue-800 space-y-1.5 text-sm">
                <li>1. TestFlight tester submits screenshot or crash feedback</li>
                <li>2. Bugsy ingests it via webhook (instant) or sync (on-demand)</li>
                <li>3. AI categorizes as bug/feature and sets priority</li>
                <li>4. If tester email matches an auto-approve rule → <strong>Request created as APPROVED</strong></li>
                <li>5. Otherwise → <strong>Request created as PENDING</strong> for admin/developer review</li>
                <li>6. AI developers pick up approved requests via MCP tools</li>
              </ul>
            </div>
          </section>

          {/* Approval System */}
          <section className="mb-20">
            <SectionHeading id="approval-system" icon={ShieldCheck}>
              Approval System
            </SectionHeading>

            <SubHeading>How auto-approve works</SubHeading>
            <p className="text-gray-600 mb-4">
              Developers can be marked as &quot;auto-approved&quot; in the admin
              dashboard. When an auto-approved developer submits a solution, it
              is immediately applied without manual review.
            </p>

            <SubHeading>Manual approval flow</SubHeading>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
              <li>Developer submits a solution via MCP</li>
              <li>
                Solution status is set to{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                  AWAITING_APPROVAL
                </code>
              </li>
              <li>Admin or another developer reviews and approves/rejects</li>
              <li>Approved solutions are marked as completed</li>
            </ol>

            <SubHeading>User roles</SubHeading>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 font-semibold text-gray-900">
                      Role
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Permissions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-semibold">Admin</td>
                    <td className="py-3">
                      Full access: manage users, approve/reject requests and
                      solutions, configure settings
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold">Developer</td>
                    <td className="py-3">
                      Claim requests, submit solutions, approve solutions (if
                      permitted)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
