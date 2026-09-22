import React, { Suspense } from "react";
import { requireRole } from "@/lib/auth-utils";
import { getActivityLogs } from "@/server/queries/activity";
import { ActivityLogTable } from "@/components/admin/ActivityLogTable";
import { History } from "lucide-react";

interface AdminActivityPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    action?: string;
    entityType?: string;
  }>;
}

export default async function AdminActivityPage({ searchParams }: AdminActivityPageProps) {
  await requireRole(["ADMIN"]);
  const resolvedParams = await searchParams;

  const page = parseInt(resolvedParams.page || "1", 10);
  const search = resolvedParams.search || "";
  const action = (resolvedParams.action as any) || "ALL";
  const entityType = (resolvedParams.entityType as any) || "ALL";

  const { logs, pagination, filterOptions } = await getActivityLogs({
    page,
    limit: 20,
    search,
    action,
    entityType,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <History className="h-5 w-5 text-zinc-400" />
          System Audit Trail & Activity Logs
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Immutable audit log tracking all user authentications, role mutations, status toggles, and request approvals.
        </p>
      </div>

      <Suspense fallback={<div className="h-96 bg-zinc-900/60 rounded-xl border border-zinc-800 animate-pulse" />}>
        <ActivityLogTable
          logs={logs}
          pagination={pagination}
          filterOptions={filterOptions}
        />
      </Suspense>
    </div>
  );
}
