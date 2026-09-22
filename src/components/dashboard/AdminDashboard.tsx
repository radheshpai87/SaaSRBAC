"use client";

import React from "react";
import Link from "next/link";
import { SessionUser } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import {
  Users,
  FileText,
  ShieldCheck,
  History,
  ArrowRight,
  PlusCircle,
  Activity,
  Laptop,
} from "lucide-react";

interface AdminDashboardProps {
  user: SessionUser;
  data: {
    metrics: {
      totalUsers: number;
      activeUsers: number;
      totalRequests: number;
      pendingRequests: number;
      approvedRequests: number;
      rejectedRequests: number;
    };
    recentRequests: any[];
    recentActivity: any[];
    userRoleDistribution: any[];
  };
}

export function AdminDashboard({ user, data }: AdminDashboardProps) {
  const { metrics, recentRequests, recentActivity, userRoleDistribution } = data;

  const adminStatCards = [
    {
      title: "Team Members",
      value: metrics.totalUsers,
      subValue: `${metrics.activeUsers} Active Accounts`,
      icon: Users,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Total Requests",
      value: metrics.totalRequests,
      subValue: `${metrics.pendingRequests} Pending Sign-Off`,
      icon: FileText,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Approved & Provisioned",
      value: metrics.approvedRequests,
      subValue: "Equipment Active",
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Audit Log Entries",
      value: recentActivity.length > 0 ? `${recentActivity.length}+` : "0",
      subValue: "Audit Trail Active",
      icon: History,
      color: "text-zinc-300 bg-zinc-800 border-zinc-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              IT Administration: {user.name}
            </h1>
            <Badge role={user.role} size="sm" />
          </div>
          <p className="text-xs text-zinc-400">
            Manage company users, role permissions, fleet requests, and activity audit trails.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/users">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/activity">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <History className="h-3.5 w-3.5 mr-1.5" />
              Activity Log
            </Button>
          </Link>
          <Link href="/requests/new">
            <Button size="sm" className="h-8 text-xs bg-white hover:bg-zinc-200 text-zinc-950 font-medium">
              <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
              New Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStatCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-zinc-100 mt-1">{stat.value}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{stat.subValue}</p>
                </div>
                <div className={`p-2.5 rounded-lg border ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-200 mb-1">User Role Breakdown</p>
            <div className="space-y-2 mt-3">
              {userRoleDistribution.map((item: any) => (
                <div key={item.role} className="flex items-center justify-between text-xs">
                  <Badge role={item.role} size="sm" />
                  <span className="font-semibold text-zinc-300">{item._count.role} users</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/admin/users" className="mt-4 text-[11px] text-zinc-300 font-semibold hover:text-white flex items-center gap-1 transition-colors">
            <span>Manage user directory</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-200 mb-1">Request Pipeline</p>
            <div className="space-y-2 mt-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Pending Sign-Off
                </span>
                <span className="font-semibold text-zinc-200">{metrics.pendingRequests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Approved
                </span>
                <span className="font-semibold text-zinc-200">{metrics.approvedRequests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-rose-400" /> Declined
                </span>
                <span className="font-semibold text-zinc-200">{metrics.rejectedRequests}</span>
              </div>
            </div>
          </div>
          <Link href="/requests" className="mt-4 text-[11px] text-zinc-300 font-semibold hover:text-white flex items-center gap-1 transition-colors">
            <span>View all requests</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>

        <Card className="p-4 flex flex-col justify-between bg-zinc-900/90 text-white border-zinc-800">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-zinc-200">Security & Access Controls</p>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Enforced server-side role validation, audit log tracking, and session integrity verification.
            </p>
          </div>
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Status</span>
            <span className="text-emerald-400 font-medium">Active & Protected</span>
          </div>
        </Card>
      </div>

      {/* Global Activity Log and Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent System Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Equipment Requests</CardTitle>
              <CardDescription>Company-wide submissions</CardDescription>
            </div>
            <Link
              href="/requests"
              className="text-xs font-medium text-zinc-400 hover:text-zinc-100 flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-zinc-800/60">
            {recentRequests.map((req) => (
              <Link
                key={req.id}
                href={`/requests/${req.id}`}
                className="flex items-center justify-between p-3.5 hover:bg-zinc-800/40 transition-colors group"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-zinc-100 truncate group-hover:text-blue-400">
                      {req.title}
                    </p>
                    <Badge priority={req.priority} size="sm" />
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    By {req.createdBy.name} • {formatRelativeTime(req.createdAt)}
                  </p>
                </div>
                <Badge status={req.status} size="sm" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Real-time System Audit Trail */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-zinc-400" />
                Live Activity Stream
              </CardTitle>
              <CardDescription>Real-time log of all state mutations</CardDescription>
            </div>
            <Link
              href="/admin/activity"
              className="text-xs font-medium text-zinc-400 hover:text-zinc-100 flex items-center gap-1 transition-colors"
            >
              <span>Full audit log</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-zinc-800/60">
            {recentActivity.map((act) => (
              <div key={act.id} className="p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-medium text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                    {act.action}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {formatRelativeTime(act.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-zinc-300">
                  <strong className="text-zinc-100">{act.user.name}</strong>{" "}
                  <span className="text-zinc-400">({act.user.role})</span> on {act.entityType}{" "}
                  <span className="font-mono text-[10px] text-zinc-500">#{act.entityId.slice(0, 8)}</span>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
