"use client";

import { useRouter, useSearchParams } from "next/navigation";

const statuses = ["", "PENDING", "APPROVED", "IN_PROGRESS", "AWAITING_APPROVAL", "COMPLETED", "REJECTED"];
const types = ["", "BUG", "FEATURE", "FEEDBACK", "QUESTION"];

export function RequestFilters({
  currentStatus,
  currentType,
}: {
  currentStatus?: string;
  currentType?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/requests?${params.toString()}`);
  }

  return (
    <div className="flex gap-3 mb-4">
      <select
        value={currentStatus || ""}
        onChange={(e) => update("status", e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
      >
        <option value="">All Statuses</option>
        {statuses.filter(Boolean).map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, " ")}
          </option>
        ))}
      </select>

      <select
        value={currentType || ""}
        onChange={(e) => update("type", e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
      >
        <option value="">All Types</option>
        {types.filter(Boolean).map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
