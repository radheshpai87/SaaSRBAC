"use client";

import React from "react";
import Link from "next/link";
import { SessionUser } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import {
  Laptop,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ArrowRight,
  Activity,
} from "lucide-react";

interface UserDashboardProps {
  user: SessionUser;
  data: {
    metrics: {
      totalRequests: number;
      pendingRequests: number;
      approvedRequests: number;
      rejectedRequests: number;
    };
    recentRequests: any[];
    recentActivity: any[];
  };
}

export function UserDashboard({ user, data }: UserDashboardProps) {
  const { metrics, recentRequests, recentActivity } = data;

  const statCards = [
    {
      title: "Total Requests",
      value: metrics.totalRequests,
      icon: Laptop,
      color: "text-zinc-300 bg-zinc-800 border-zinc-700",
    },
    {
      title: "Pending Approval",
      value: metrics.pendingRequests,
      icon: Clock,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Approved & Provisioned",
      value: metrics.approvedRequests,
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Declined",
      value: metrics.rejectedRequests,
      icon: XCircle,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-900/80 border border-zinc-800 p-5 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Welcome back, {user.name}
            </h1>
            <Badge role={user.role} size="sm" />
          </div>
          <p className="text-xs text-zinc-400">
            Request new equipment, software licenses, or cloud access and track approval progress.
          </p>
        </div>
        <Link href="/requests/new">
          <Button className="h-9 text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200">
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            Request Equipment
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg border ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>My Equipment & Access Requests</CardTitle>
                <CardDescription>Live status of your submitted hardware and tool requests</CardDescription>
              </div>
              <Link
                href="/requests"
                className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentRequests.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title="No requests yet"
                    description="You have not submitted any equipment requests yet."
                    actionLabel="Request Equipment"
                    actionHref="/requests/new"
                  />
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/80">
                  {recentRequests.map((req) => (
                    <Link
                      key={req.id}
                      href={`/requests/${req.id}`}
                      className="flex items-center justify-between p-4 hover:bg-zinc-800/40 transition-colors group"
                    >
                      <div className="space-y-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-semibold text-zinc-100 truncate group-hover:text-blue-400 transition-colors">
                            {req.title}
                          </p>
                          <Badge priority={req.priority} size="sm" />
                          {req.category && (
                            <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                              {req.category}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate max-w-md">
                          {req.description}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Submitted on {formatDate(req.createdAt)}
                          {req.estimatedCost > 0 && ` • $${req.estimatedCost.toLocaleString()} USD`}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <Badge status={req.status} size="sm" />
                        <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-zinc-400" />
                Recent Updates
              </CardTitle>
              <CardDescription>Activity on your requests</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {recentActivity.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">No recent activity</div>
              ) : (
                <div className="divide-y divide-zinc-800/80">
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
                        <span className="font-semibold text-white">{act.user.name}</span>{" "}
                        {act.action === "REQUEST_CREATED" || act.action === "REQUEST_SUBMITTED"
                          ? "submitted a request"
                          : act.action === "REQUEST_APPROVED"
                          ? "approved the request"
                          : act.action === "REQUEST_REJECTED"
                          ? "declined the request"
                          : act.action.toLowerCase()}
                      </p>
                      {act.metadata?.notes && (
                        <p className="text-[11px] text-zinc-400 italic bg-zinc-950/60 p-1.5 rounded border border-zinc-800 mt-1">
                          &quot;{act.metadata.notes}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
