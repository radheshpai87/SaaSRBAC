"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SessionUser } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { signOut } from "next-auth/react";
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Laptop,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  user: SessionUser;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Header({ user, onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/requests?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const notifications = [
    {
      id: "1",
      title: "Equipment Request Approved",
      description: "MacBook Pro 16\" has been approved by Engineering Lead.",
      time: "10m ago",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
    },
    {
      id: "2",
      title: "New Team Request in Queue",
      description: "Figma Enterprise license submitted for review.",
      time: "1h ago",
      icon: Clock,
      iconColor: "text-amber-400",
    },
    {
      id: "3",
      title: "Security Policy Enforced",
      description: "Server-side RBAC session validated successfully.",
      time: "3h ago",
      icon: ShieldCheck,
      iconColor: "text-blue-400",
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 md:px-6 backdrop-blur-md select-none">
      {/* Left: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search requests, users, or hardware (Press Enter)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-8 pr-12 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all focus:bg-zinc-900"
          />
          <kbd className="absolute right-2.5 top-2 hidden rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 sm:inline-block border border-zinc-700/50">
            ↵
          </kbd>
        </form>
      </div>

      {/* Right: Environment Pill, Notifications & User Menu */}
      <div className="flex items-center gap-2.5">
        {/* Environment / Security Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11px] text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-zinc-300">Prod</span>
          <span className="text-zinc-600">•</span>
          <span>US-East</span>
        </div>

        {/* Quick New Request CTA */}
        <Link href="/requests/new" className="hidden sm:block">
          <button className="flex items-center gap-1.5 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2.5 text-xs font-medium text-zinc-200 transition-colors">
            <PlusCircle className="h-3.5 w-3.5 text-zinc-400" />
            <span>Request</span>
          </button>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-800 bg-zinc-900/95 p-3 shadow-2xl z-50 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
                <p className="text-xs font-semibold text-zinc-100">Notifications</p>
                <span className="text-[10px] font-medium text-zinc-500">Live Activity</span>
              </div>
              <div className="space-y-2">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-800/60 transition-colors text-xs"
                    >
                      <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${notif.iconColor}`} />
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <p className="font-semibold text-zinc-200 leading-tight truncate">{notif.title}</p>
                        <p className="text-[11px] text-zinc-400 leading-snug">{notif.description}</p>
                        <p className="text-[10px] text-zinc-500 pt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-zinc-800 mt-2 text-center">
                <Link
                  href="/requests"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-[11px] text-zinc-400 hover:text-white transition-colors"
                >
                  View all requests &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition-colors shadow-2xs"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-200 border border-zinc-700">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <span className="text-zinc-200 font-semibold max-w-[110px] truncate hidden sm:inline">
              {user.name}
            </span>
            <Badge role={user.role} size="sm" />
            <ChevronDown className="h-3 w-3 text-zinc-500" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-800 bg-zinc-900/95 p-2 shadow-2xl z-50 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
              {/* Profile Card Header */}
              <div className="p-2 border-b border-zinc-800/80 mb-1">
                <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                <p className="text-[11px] text-zinc-400 truncate leading-tight mt-0.5">{user.email}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Badge role={user.role} size="sm" />
                  <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                    {user.department || "Design & Engineering"}
                  </span>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="space-y-0.5">
                <Link
                  href="/dashboard"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Laptop className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Settings & RBAC Matrix</span>
                </Link>

                <Link
                  href="/requests"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <UserIcon className="h-3.5 w-3.5 text-zinc-400" />
                  <span>My Submissions</span>
                </Link>
              </div>

              {/* Sign Out Button */}
              <div className="pt-1.5 border-t border-zinc-800/80 mt-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-2 w-full rounded-lg px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
