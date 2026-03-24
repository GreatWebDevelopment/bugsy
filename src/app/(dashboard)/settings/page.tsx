import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";
import { Code, Copy, Globe } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { apiToken: true },
  });

  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "https://your-bugsy-instance.com";

  const embedCode = `<script src="${baseUrl}/widget.js" data-bugsy-url="${baseUrl}"><\/script>`;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Widget Embed Code */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Widget Embed Code</h2>
            <p className="text-sm text-gray-500">
              Add this snippet to your website to enable the Bugsy widget
            </p>
          </div>
        </div>
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono">
            {embedCode}
          </pre>
          <CopyButton text={embedCode} />
        </div>
      </div>

      {/* API Token */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your API Token</h2>
            <p className="text-sm text-gray-500">
              Use this token to authenticate with the Bugsy API and MCP tools
            </p>
          </div>
        </div>
        <div className="relative">
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-mono text-gray-700">
            {user?.apiToken || "No token generated"}
          </pre>
          {user?.apiToken && <CopyButton text={user.apiToken} />}
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Instance URL</dt>
            <dd className="text-gray-900 font-mono">{baseUrl}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">API Base</dt>
            <dd className="text-gray-900 font-mono">{baseUrl}/api</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">MCP Endpoint</dt>
            <dd className="text-gray-900 font-mono">{baseUrl}/api/mcp</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
