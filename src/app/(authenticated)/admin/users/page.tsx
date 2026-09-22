import React, { Suspense } from "react";
import { requireRole } from "@/lib/auth-utils";
import { getUsersList } from "@/server/queries/users";
import { UsersManagementTable } from "@/components/admin/UsersManagementTable";
import { Users } from "lucide-react";

interface AdminUsersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    status?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const user = await requireRole(["ADMIN"]);
  const resolvedParams = await searchParams;

  const page = parseInt(resolvedParams.page || "1", 10);
  const search = resolvedParams.search || "";
  const role = (resolvedParams.role as any) || "ALL";
  const status = (resolvedParams.status as any) || "ALL";

  const { users, pagination } = await getUsersList({
    page,
    limit: 15,
    search,
    role,
    status,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <Users className="h-5 w-5 text-zinc-400" />
          User & Role Administration
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage user permissions, assign RBAC roles, and control active tenant access.
        </p>
      </div>

      <Suspense fallback={<div className="h-96 bg-zinc-900/60 rounded-xl border border-zinc-800 animate-pulse" />}>
        <UsersManagementTable
          users={users}
          pagination={pagination}
          currentUser={user}
        />
      </Suspense>
    </div>
  );
}
