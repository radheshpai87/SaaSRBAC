"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Search, Filter } from "lucide-react";

export function RequestFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";
  const priority = searchParams.get("priority") || "ALL";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL" && value.trim() !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset pagination on filter change
    router.push(`/requests?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 shadow-xs">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search requests by title or keywords..."
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
        <div className="w-36">
          <select
            value={status}
            onChange={(e) => updateFilters("status", e.target.value)}
            aria-label="Filter by Status"
            className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="w-36">
          <select
            value={priority}
            onChange={(e) => updateFilters("priority", e.target.value)}
            aria-label="Filter by Priority"
            className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>
    </div>
  );
}
