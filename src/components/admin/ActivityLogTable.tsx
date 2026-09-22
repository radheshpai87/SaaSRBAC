"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { Search, History, ChevronLeft, ChevronRight, Filter } from "lucide-react";

interface ActivityLogTableProps {
  logs: any[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  filterOptions: {
    actions: string[];
    entities: string[];
  };
}

export function ActivityLogTable({
  logs,
  pagination,
  filterOptions,
}: ActivityLogTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const action = searchParams.get("action") || "ALL";
  const entityType = searchParams.get("entityType") || "ALL";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL" && value.trim() !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/admin/activity?${params.toString()}`);
  };

  const getActionColor = (actionName: string) => {
    if (actionName.includes("APPROVED") || actionName.includes("ACTIVATED")) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
    }
    if (actionName.includes("REJECTED") || actionName.includes("DEACTIVATED") || actionName.includes("DELETED")) {
      return "bg-rose-500/10 text-rose-400 border-rose-500/25";
    }
    if (actionName.includes("ROLE")) {
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/25";
    }
    return "bg-zinc-800 text-zinc-300 border-zinc-700";
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, ID..."
            defaultValue={search}
            onChange={(e) => {
              const val = e.target.value;
              const timeout = setTimeout(() => updateFilters("search", val), 350);
              return () => clearTimeout(timeout);
            }}
            className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900/90 pl-9 pr-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={action}
            onChange={(e) => updateFilters("action", e.target.value)}
            aria-label="Filter by Action"
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          >
            <option value="ALL">All Actions</option>
            {filterOptions.actions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>

          <select
            value={entityType}
            onChange={(e) => updateFilters("entityType", e.target.value)}
            aria-label="Filter by Entity"
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          >
            <option value="ALL">All Entities</option>
            {filterOptions.entities.map((ent) => (
              <option key={ent} value={ent}>
                {ent}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-400 font-medium">
              <th className="py-3 px-4 font-semibold text-zinc-300">Timestamp</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Actor</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Action Type</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Entity & Target</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Audit Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  No activity log entries found matching criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-zinc-500 font-mono text-[11px]">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-100">{log.user.name}</span>
                      <Badge role={log.user.role} size="sm" />
                    </div>
                    <span className="text-[10px] text-zinc-500">{log.user.email}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-medium text-zinc-300">{log.entityType}</div>
                    <span className="text-[10px] text-zinc-500 font-mono">#{log.entityId.slice(0, 10)}</span>
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    {log.metadata ? (
                      <div className="text-[11px] text-zinc-400 bg-zinc-950/60 p-1.5 rounded border border-zinc-800 font-mono truncate">
                        {JSON.stringify(log.metadata)}
                      </div>
                    ) : (
                      <span className="text-[11px] text-zinc-500 italic">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-zinc-900/60 px-4 py-3 rounded-xl border border-zinc-800 text-xs">
          <span className="text-zinc-400">
            Showing Page <strong>{pagination.currentPage}</strong> of{" "}
            <strong>{pagination.totalPages}</strong> ({pagination.totalCount} total entries)
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage <= 1}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (pagination.currentPage - 1).toString());
                router.push(`/admin/activity?${params.toString()}`);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (pagination.currentPage + 1).toString());
                router.push(`/admin/activity?${params.toString()}`);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
