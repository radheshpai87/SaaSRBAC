import React from "react";
import { requireAuth } from "@/lib/auth-utils";
import { getDashboardData } from "@/server/queries/dashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

export default async function DashboardPage() {
  const user = await requireAuth();
  const data = await getDashboardData(user.id, user.role);

  if (user.role === "ADMIN") {
    return <AdminDashboard user={user} data={data as any} />;
  }

  if (user.role === "MANAGER") {
    return <ManagerDashboard user={user} data={data as any} />;
  }

  return <UserDashboard user={user} data={data as any} />;
}
