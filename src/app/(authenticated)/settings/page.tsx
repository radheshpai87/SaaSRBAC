import React from "react";
import { requireAuth } from "@/lib/auth-utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Settings, Shield, User, Key, Database, CheckCircle2 } from "lucide-react";

export default async function SettingsPage() {
  const user = await requireAuth();

  const permissionsMatrix = [
    {
      action: "Create Equipment Requests",
      allowed: true,
      notes: "Available for USER, MANAGER, and ADMIN",
    },
    {
      action: "View Personal Requests",
      allowed: true,
      notes: "Filtered by your user ID in database query",
    },
    {
      action: "Review, Approve & Reject Team Requests",
      allowed: user.role === "MANAGER" || user.role === "ADMIN",
      notes: "Server-enforced authorization for MANAGER and ADMIN",
    },
    {
      action: "Manage Users & Role Permissions",
      allowed: user.role === "ADMIN",
      notes: "Strict ADMIN authorization enforced",
    },
    {
      action: "View System Activity & Audit Trail",
      allowed: user.role === "ADMIN",
      notes: "Full system event history and compliance ledger",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <Settings className="h-5 w-5 text-zinc-400" />
          Settings & Role Permissions
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          View your session profile and active role permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Identity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-zinc-100">
              <User className="h-4 w-4 text-zinc-400" />
              User Profile
            </CardTitle>
            <CardDescription>Current signed-in user details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="text-[11px] text-zinc-500 font-medium">Name</p>
              <p className="font-semibold text-zinc-100 mt-0.5">{user.name}</p>
            </div>
            <div>
              <p className="text-[11px] text-zinc-500 font-medium">Email</p>
              <p className="font-mono text-zinc-300 mt-0.5">{user.email}</p>
            </div>
            <div>
              <p className="text-[11px] text-zinc-500 font-medium">Department</p>
              <p className="font-medium text-zinc-300 mt-0.5">
                {user.department || "Design & Engineering"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-zinc-500 font-medium">Role & Account Status</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge role={user.role} size="sm" />
                <Badge status={user.status} size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & System Context */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-zinc-100">
              <Shield className="h-4 w-4 text-zinc-400" />
              Security & Access Control
            </CardTitle>
            <CardDescription>Session and authentication context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <p className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-zinc-400" />
                Data Integrity
              </p>
              <p className="text-zinc-400 mt-1 leading-relaxed">
                Relational record persistence with referential integrity constraints.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <p className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-zinc-400" />
                Session Authentication
              </p>
              <p className="text-zinc-400 mt-1 leading-relaxed">
                Encrypted JWT session tokens with server-side signature verification.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Breakdown Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-zinc-100">Role Permissions Matrix</CardTitle>
          <CardDescription>
            Features enabled for your current role: <strong className="text-zinc-200">{user.role}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-800/60">
            {permissionsMatrix.map((item) => (
              <div key={item.action} className="p-3.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-zinc-200">{item.action}</p>
                  <p className="text-[11px] text-zinc-500">{item.notes}</p>
                </div>
                <div>
                  {item.allowed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                      <CheckCircle2 className="h-3 w-3" /> Granted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-800">
                      Restricted
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
