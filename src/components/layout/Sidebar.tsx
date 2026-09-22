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
} from "lucide-react";

interface SidebarProps {
  user: SessionUser;
  className?: string;
}

export function Sidebar({ user, className }: SidebarProps) {
  const pathname = usePathname();

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
    <aside
      className={cn(
        "flex flex-col h-screen w-60 border-r border-zinc-800/80 bg-zinc-950 select-none shrink-0",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-zinc-800/80">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-white">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-white border border-zinc-700 shadow-xs">
            <Laptop className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight">Nova Desk</span>
        </Link>
        <Badge role={user.role} size="sm" />
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <Link
          href="/requests/new"
          className="flex items-center justify-center gap-1.5 w-full h-8 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-xs"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>New Request</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2.5 py-1 space-y-0.5">
        <div className="px-2 pb-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
          Menu
        </div>
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-zinc-900 text-white font-semibold border border-zinc-800/80"
                  : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                />
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

      {/* User Footer Profile */}
      <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-950">
        <div className="flex items-center justify-between rounded-lg p-2 bg-zinc-900 border border-zinc-800 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white text-xs font-semibold border border-zinc-700">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-zinc-200 truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-zinc-500 truncate leading-tight">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
