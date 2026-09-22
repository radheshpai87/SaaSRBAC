"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { SessionUser } from "@/types";
import { ArrowRight, ChevronLeft, ChevronRight, Laptop } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface RequestsTableProps {
  requests: any[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  currentUser: SessionUser;
}

export function RequestsTable({ requests, pagination, currentUser }: RequestsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/requests?${params.toString()}`);
  };

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={Laptop}
        title="No equipment requests found"
        description="No requests match your current search or filter criteria."
        actionLabel="Request Equipment"
        actionHref="/requests/new"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-400 font-medium">
              <th className="py-3 px-4 font-semibold text-zinc-300">Item / Request</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Status</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Urgency</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Category</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Price</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Requested By</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Date</th>
              <th className="py-3 px-4 font-semibold text-zinc-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-zinc-800/40 transition-colors group">
                <td className="py-3 px-4 font-medium text-zinc-100 max-w-xs">
                  <Link
                    href={`/requests/${req.id}`}
                    className="group-hover:text-blue-400 transition-colors line-clamp-1 font-semibold"
                  >
                    {req.title}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <Badge status={req.status} size="sm" />
                </td>
                <td className="py-3 px-4">
                  <Badge priority={req.priority} size="sm" />
                </td>
                <td className="py-3 px-4 text-zinc-400 font-medium">
                  {req.category || "Hardware"}
                </td>
                <td className="py-3 px-4 font-medium text-zinc-200">
                  {req.estimatedCost > 0 ? `$${req.estimatedCost.toLocaleString()}` : "—"}
                </td>
                <td className="py-3 px-4">
                  <div className="text-zinc-200 font-medium">{req.createdBy.name}</div>
                  <div className="text-[10px] text-zinc-500">{req.createdBy.department}</div>
                </td>
                <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">{formatDate(req.createdAt)}</td>
                <td className="py-3 px-4 text-right">
                  <Link href={`/requests/${req.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-100">
                      <span>View</span>
                      <ArrowRight className="h-3 w-3 ml-1 text-zinc-500 group-hover:text-zinc-300" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {requests.map((req) => (
          <Link
            key={req.id}
            href={`/requests/${req.id}`}
            className="block rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-xs hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <Badge status={req.status} size="sm" />
              <Badge priority={req.priority} size="sm" />
            </div>

            <h4 className="text-sm font-semibold text-zinc-100 line-clamp-1 mb-1">{req.title}</h4>
            <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{req.description}</p>

            <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800">
              <span>{req.createdBy.name}</span>
              <span>{formatRelativeTime(req.createdAt)}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-zinc-900/60 px-4 py-3 rounded-xl border border-zinc-800 text-xs">
          <span className="text-zinc-400">
            Page <strong className="text-zinc-100">{pagination.currentPage}</strong> of{" "}
            <strong className="text-zinc-100">{pagination.totalPages}</strong> (
            {pagination.totalCount} items)
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={pagination.currentPage <= 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
