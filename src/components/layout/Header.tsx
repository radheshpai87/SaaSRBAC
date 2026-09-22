"use client";

import React, { useState } from "react";
import { SessionUser } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { signIn, signOut } from "next-auth/react";
import {
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  Laptop,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  user: SessionUser;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Header({ user, onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();

  const teamProfiles = [
    {
      name: "Marcus Vance",
      email: "admin@example.com",
      password: "Admin123!",
      role: "ADMIN",
      dept: "IT & Infrastructure",
      title: "IT Operations Director",
    },
    {
      name: "Sarah Jenkins",
      email: "manager@example.com",
      password: "Manager123!",
      role: "MANAGER",
      dept: "Engineering & Product",
      title: "Engineering Team Lead",
    },
    {
      name: "Alex Chen",
      email: "user@example.com",
      password: "User123!",
      role: "USER",
      dept: "Design & Product",
      title: "Senior Product Designer",
    },
  ];

  const handleSwitchAccount = async (email: string, pass: string) => {
    try {
      setIsSwitching(true);
      setIsSwitcherOpen(false);
      await signOut({ redirect: false });
      const result = await signIn("credentials", {
        email,
        password: pass,
        redirect: false,
      });
      if (result?.ok) {
        router.refresh();
        window.location.href = "/dashboard";
      }
    } catch (e) {
      console.error("Account switch error:", e);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 px-4 md:px-6 backdrop-blur-sm select-none">
      {/* Left: Mobile Toggle & Department */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-medium text-zinc-200">
            <Laptop className="h-3.5 w-3.5 text-zinc-400" />
            {user.department || "Design & Engineering"}
          </span>
        </div>
      </div>

      {/* Right: User Profile & Role Switcher */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            disabled={isSwitching}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors shadow-2xs"
          >
            <Badge role={user.role} size="sm" />
            <span className="text-zinc-200 font-semibold max-w-[120px] truncate hidden sm:inline">
              {user.name}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
          </button>

          {isSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1.5 border-b border-zinc-800 mb-1">
                <p className="text-xs font-semibold text-white">Switch Profile</p>
                <p className="text-[11px] text-zinc-400">Change active user session</p>
              </div>

              <div className="space-y-1">
                {teamProfiles.map((prof) => {
                  const isCurrent = prof.email === user.email;
                  return (
                    <button
                      key={prof.email}
                      onClick={() => handleSwitchAccount(prof.email, prof.password)}
                      className="flex items-start justify-between w-full rounded-lg p-2 text-left text-xs transition-colors hover:bg-zinc-800/80"
                    >
                      <div className="flex items-start gap-2 min-w-0 pr-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-200 border border-zinc-700 mt-0.5">
                          {prof.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-100 leading-tight flex items-center gap-1.5 truncate">
                            {prof.name}
                            <Badge role={prof.role as any} size="sm" />
                          </p>
                          <p className="text-[11px] text-zinc-400 truncate mt-0.5">{prof.title}</p>
                        </div>
                      </div>
                      {isCurrent && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
