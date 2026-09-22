import React, { Suspense } from "react";
import Link from "next/link";
import { requireAuth } from "@/lib/auth-utils";
import { getRequestsList } from "@/server/queries/requests";
import { RequestFilters } from "@/components/requests/RequestFilters";
import { RequestsTable } from "@/components/requests/RequestsTable";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Laptop } from "lucide-react";

interface RequestsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    priority?: string;
  }>;
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const user = await requireAuth();
  const resolvedParams = await searchParams;

  const page = parseInt(resolvedParams.page || "1", 10);
  const search = resolvedParams.search || "";
  const status = (resolvedParams.status as any) || "ALL";
  const priority = (resolvedParams.priority as any) || "ALL";

  const { items, pagination } = await getRequestsList({
    page,
    limit: 15,
    search,
    status,
    priority,
    userId: user.id,
    role: user.role,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Laptop className="h-5 w-5 text-zinc-400" />
            Equipment & Access Requests
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {user.role === "USER"
              ? "Track your submitted hardware, software, and access requests"
              : "Review and manage team equipment and tool requests"}
          </p>
        </div>

        <Link href="/requests/new">
          <Button className="h-9 text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 font-medium">
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Filters with Suspense */}
      <Suspense fallback={<div className="h-14 bg-zinc-900/60 rounded-xl border border-zinc-800 animate-pulse" />}>
        <RequestFilters />
      </Suspense>

      {/* Table & Cards */}
      <Suspense fallback={<div className="h-64 bg-zinc-900/60 rounded-xl border border-zinc-800 animate-pulse" />}>
        <RequestsTable
          requests={items}
          pagination={pagination}
          currentUser={user}
        />
      </Suspense>
    </div>
  );
}
