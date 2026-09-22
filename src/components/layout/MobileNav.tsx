"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Users,
  History,
  Settings,
  LogOut,
  Laptop,
  PlusCircle,
  X,
} from "lucide-react";

interface MobileNavProps {
  user: SessionUser;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ user, isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const navigationItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "MANAGER", "USER"],
    },
    {
      label: "IT Requests",
      href: "/requests",
      icon: FileText,
      roles: ["ADMIN", "MANAGER", "USER"],
    },
    {
      label: "Activity Log",
      href: "/admin/activity",
      icon: History,
      roles: ["ADMIN"],
      tag: "Audit",
    },
    {
      label: "Users & IAM",
      href: "/admin/users",
      icon: Users,
      roles: ["ADMIN"],
      tag: "Admin",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["ADMIN", "MANAGER", "USER"],
    },
  ];

  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <div className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 flex flex-col w-72 max-w-[85vw] h-full bg-zinc-950 border-r border-zinc-800 shadow-2xl animate-in slide-in-from-left duration-200 text-zinc-100">
        {/* Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-white border border-zinc-700">
              <Laptop className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-white">Nova Desk</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Action */}
        <div className="p-3">
          <Link
            href="/requests/new"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full h-8 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Request</span>
          </Link>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-zinc-900 text-white font-semibold border border-zinc-800"
                    : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-zinc-400" />
                  <span>{item.label}</span>
                </div>
                {item.tag && (
                  <span className="rounded bg-zinc-900 px-1.5 py-0.2 text-[10px] font-medium text-zinc-400 border border-zinc-800">
                    {item.tag}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-zinc-200">{user.name}</p>
              <p className="text-[11px] text-zinc-500">{user.email}</p>
            </div>
            <Badge role={user.role} size="sm" />
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-2 w-full h-8 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
