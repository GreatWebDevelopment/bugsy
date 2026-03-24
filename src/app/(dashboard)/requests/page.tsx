import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Bug, Lightbulb, MessageCircle, HelpCircle } from "lucide-react";
import { RequestFilters } from "@/components/request-filters";

const typeIcons: Record<string, typeof Bug> = {
  BUG: Bug,
  FEATURE: Lightbulb,
  FEEDBACK: MessageCircle,
  QUESTION: HelpCircle,
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700",
  AWAITING_APPROVAL: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const priorityStyles: Record<string, string> = {
  LOW: "text-gray-500",
  MEDIUM: "text-amber-600",
  HIGH: "text-orange-600",
  URGENT: "text-red-600 font-semibold",
};

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, string> = {};
  if (params.status) where.status = params.status;
  if (params.type) where.type = params.type;

  const requests = await prisma.request.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      claimedBy: { select: { name: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Requests</h1>

      <RequestFilters currentStatus={params.status} currentType={params.type} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Assigned</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No requests found
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const TypeIcon = typeIcons[req.type] || Bug;
                  return (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/requests/${req.id}`}
                          className="text-gray-900 font-medium hover:text-violet-700"
                        >
                          {req.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-gray-600">
                          <TypeIcon className="w-4 h-4" />
                          {req.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={priorityStyles[req.priority] || ""}>
                          {req.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                            statusStyles[req.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {req.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {req.claimedBy?.name || "--"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
