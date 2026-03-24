import { prisma } from "@/lib/prisma";
import { LayoutDashboard, Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [total, pending, inProgress, completed, recentRequests] = await Promise.all([
    prisma.request.count(),
    prisma.request.count({ where: { status: "PENDING" } }),
    prisma.request.count({ where: { status: "IN_PROGRESS" } }),
    prisma.request.count({ where: { status: "COMPLETED" } }),
    prisma.request.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        claimedBy: { select: { name: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Total Requests", value: total, icon: LayoutDashboard, color: "bg-violet-100 text-violet-700" },
    { label: "Pending", value: pending, icon: Clock, color: "bg-amber-100 text-amber-700" },
    { label: "In Progress", value: inProgress, icon: Loader2, color: "bg-blue-100 text-blue-700" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "bg-green-100 text-green-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
        </div>
        {recentRequests.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            No requests yet
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentRequests.map((req) => (
              <Link
                key={req.id}
                href={`/requests/${req.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{req.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {req.type} &middot; {req.priority} &middot;{" "}
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={req.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-indigo-100 text-indigo-700",
    AWAITING_APPROVAL: "bg-purple-100 text-purple-700",
    COMPLETED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
