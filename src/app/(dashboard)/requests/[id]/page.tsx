import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RequestActions } from "@/components/request-actions";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      conversation: {
        include: {
          messages: { orderBy: { createdAt: "asc" } },
          screenshots: true,
        },
      },
      claimedBy: { select: { id: true, name: true, email: true } },
      approvedBy: { select: { id: true, name: true } },
      solutions: {
        include: { developer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!request) notFound();

  const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-indigo-100 text-indigo-700",
    AWAITING_APPROVAL: "bg-purple-100 text-purple-700",
    COMPLETED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  const solutionStatusStyles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    APPLIED: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
          <span
            className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
              statusStyles[request.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {request.status.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>Type: <strong className="text-gray-700">{request.type}</strong></span>
          <span>Priority: <strong className="text-gray-700">{request.priority}</strong></span>
          {request.claimedBy && (
            <span>Assigned: <strong className="text-gray-700">{request.claimedBy.name}</strong></span>
          )}
          <span>Created: {new Date(request.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Description</h2>
        <p className="text-gray-800 whitespace-pre-wrap">{request.description}</p>
      </div>

      {/* Actions */}
      <RequestActions requestId={request.id} status={request.status} />

      {/* Conversation */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Conversation ({request.conversation.messages.length} messages)
          </h2>
        </div>
        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {request.conversation.messages.map((msg) => (
            <div key={msg.id} className="px-6 py-4">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    msg.sender === "VISITOR"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-violet-100 text-violet-700"
                  }`}
                >
                  {msg.sender}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Screenshots */}
      {request.conversation.screenshots.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Screenshots ({request.conversation.screenshots.length})
            </h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            {request.conversation.screenshots.map((ss) => (
              <div key={ss.id} className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-700 truncate">{ss.fileName}</p>
                <p className="text-xs text-gray-500">
                  {(ss.fileSize / 1024).toFixed(1)} KB &middot; {ss.mimeType}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Solutions */}
      {request.solutions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Solutions ({request.solutions.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {request.solutions.map((sol) => (
              <div key={sol.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {sol.developer.name}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        solutionStatusStyles[sol.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {sol.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(sol.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap mb-2">{sol.summary}</p>
                {sol.diff && (
                  <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto">
                    {sol.diff}
                  </pre>
                )}
                {sol.status === "PENDING" && (
                  <SolutionActions solutionId={sol.id} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SolutionActions({ solutionId }: { solutionId: string }) {
  return (
    <div className="flex gap-2 mt-3">
      <form action={`/api/dashboard/solutions/${solutionId}/approve`} method="POST">
        <button
          type="submit"
          className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Approve Solution
        </button>
      </form>
      <form action={`/api/dashboard/solutions/${solutionId}/reject`} method="POST">
        <button
          type="submit"
          className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reject Solution
        </button>
      </form>
    </div>
  );
}
