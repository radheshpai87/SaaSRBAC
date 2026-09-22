"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SessionUser, RoleType, UserStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { updateUserRole, toggleUserStatus, createUser } from "@/server/actions/user-actions";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  UserPlus,
  Shield,
  CheckCircle2,
  AlertCircle,
  Power,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface UsersManagementTableProps {
  users: any[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  currentUser: SessionUser;
}

export function UsersManagementTable({
  users,
  pagination,
  currentUser,
}: UsersManagementTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // New user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("Password123!");
  const [newRole, setNewRole] = useState<RoleType>("USER");
  const [newDept, setNewDept] = useState("Engineering");
  const [isCreating, setIsCreating] = useState(false);

  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "ALL";
  const status = searchParams.get("status") || "ALL";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL" && value.trim() !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/admin/users?${params.toString()}`);
  };

  const handleRoleChange = async (userId: string, targetRole: RoleType) => {
    try {
      setLoadingUserId(userId);
      const res = await updateUserRole({ userId, role: targetRole });
      if (res.success) {
        setFeedback({
          type: "success",
          message: `User role successfully updated to ${targetRole} and logged in audit trail.`,
        });
        router.refresh();
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to update role" });
      }
    } catch (e: any) {
      setFeedback({ type: "error", message: e.message || "An error occurred" });
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: UserStatus) => {
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      setLoadingUserId(userId);
      const res = await toggleUserStatus({ userId, status: nextStatus });
      if (res.success) {
        setFeedback({
          type: "success",
          message: `User status changed to ${nextStatus}.`,
        });
        router.refresh();
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to update status" });
      }
    } catch (e: any) {
      setFeedback({ type: "error", message: e.message || "An error occurred" });
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      const res = await createUser({
        name: newName.trim(),
        email: newEmail.trim(),
        password: newPassword,
        role: newRole,
        department: newDept.trim(),
        status: "ACTIVE",
      });

      if (res.success) {
        setFeedback({
          type: "success",
          message: `User ${newEmail} created and provisioned successfully!`,
        });
        setIsCreateModalOpen(false);
        setNewName("");
        setNewEmail("");
        router.refresh();
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to provision user" });
      }
    } catch (e: any) {
      setFeedback({ type: "error", message: e.message || "Failed to create user" });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      {feedback && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-lg border text-xs font-medium ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
              : "bg-rose-500/10 text-rose-400 border-rose-500/25"
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs underline hover:no-underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Control Strip & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 shadow-xs">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search users by name, email..."
              defaultValue={search}
              onChange={(e) => {
                const val = e.target.value;
                const timeout = setTimeout(() => updateFilters("search", val), 350);
                return () => clearTimeout(timeout);
              }}
              className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900/90 pl-9 pr-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
          </div>

          <select
            value={role}
            onChange={(e) => updateFilters("role", e.target.value)}
            aria-label="Filter by Role"
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="USER">User</option>
          </select>

          <select
            value={status}
            onChange={(e) => updateFilters("status", e.target.value)}
            aria-label="Filter by Status"
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="h-9 text-xs bg-white hover:bg-zinc-200 text-zinc-950 font-medium">
          <UserPlus className="h-3.5 w-3.5 mr-1.5" />
          Provision User
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-400 font-medium">
              <th className="py-3 px-4 font-semibold text-zinc-300">User Identity</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Department</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Role Permission</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Status</th>
              <th className="py-3 px-4 font-semibold text-zinc-300">Joined</th>
              <th className="py-3 px-4 font-semibold text-zinc-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {users.map((u) => {
              const isSelf = u.id === currentUser.id;
              const isBusy = loadingUserId === u.id;

              return (
                <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-100 leading-tight flex items-center gap-1.5">
                          {u.name}
                          {isSelf && (
                            <span className="text-[10px] font-normal text-zinc-400 font-mono">(You)</span>
                          )}
                        </p>
                        <p className="text-[11px] text-zinc-400 leading-tight">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-medium">{u.department || "General"}</td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      disabled={isBusy}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as RoleType)}
                      className="h-8 rounded-md border border-zinc-800 bg-zinc-900/90 px-2 text-xs font-semibold text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700 cursor-pointer disabled:opacity-50"
                    >
                      <option value="USER">USER</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={u.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{formatDate(u.createdAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isBusy || (isSelf && u.status === "ACTIVE")}
                      onClick={() => handleToggleStatus(u.id, u.status)}
                      className={`h-7 px-2 text-xs ${
                        u.status === "ACTIVE"
                          ? "text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                          : "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                      }`}
                    >
                      <Power className="h-3 w-3 mr-1" />
                      {u.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-zinc-900/60 px-4 py-3 rounded-xl border border-zinc-800 text-xs">
          <span className="text-zinc-400">
            Showing Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong>
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage <= 1}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (pagination.currentPage - 1).toString());
                router.push(`/admin/users?${params.toString()}`);
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
                router.push(`/admin/users?${params.toString()}`);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Provision User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision User Account"
        description="Create a new team member account with role-based permissions."
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Dana Scully"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. dana.scully@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Role Assignment"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as RoleType)}
            >
              <option value="USER">USER (Employee)</option>
              <option value="MANAGER">MANAGER (Approver)</option>
              <option value="ADMIN">ADMIN (IT Operations)</option>
            </Select>

            <Input
              label="Department"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              required
            />
          </div>

          <Input
            label="Initial Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Minimum 8 characters."
            required
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isCreating}>
              Provision User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
