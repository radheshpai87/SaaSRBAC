import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-utils";
import { Button } from "@/components/ui/Button";
import {
  Laptop,
  ArrowRight,
  Shield,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Lock,
  Layers,
} from "lucide-react";

export default async function LandingPage() {
  const user = await getCurrentUser();

  const sampleItems = [
    {
      title: 'Apple MacBook Pro 16" (M3 Max, 36GB)',
      category: "Hardware",
      requester: "Alex Chen",
      cost: "$3,499",
      status: "PENDING",
      statusLabel: "Pending Approval",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    },
    {
      title: "Figma Enterprise & FigJam Seats",
      category: "Software",
      requester: "Alex Chen",
      cost: "$540",
      status: "APPROVED",
      statusLabel: "Approved",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    },
    {
      title: 'Dell UltraSharp 32" 4K USB-C Hub Monitor',
      category: "Accessories",
      requester: "Alex Chen",
      cost: "$799",
      status: "APPROVED",
      statusLabel: "Provisioned",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/25",
    },
  ];

  const features = [
    {
      icon: Laptop,
      title: "Fast Equipment Requests",
      desc: "Order laptops, displays, SaaS licenses, or cloud access with clear specs and instant tracking.",
    },
    {
      icon: CheckCircle2,
      title: "1-Click Approvals",
      desc: "Managers review budget allocation, add notes, and approve or reject in real time.",
    },
    {
      icon: Shield,
      title: "Server-Enforced RBAC",
      desc: "Multi-tiered role permissions protected at database, API, and route levels.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-white border border-zinc-700/80 shadow-xs">
              <Laptop className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">Nova Desk</span>
            <span className="hidden sm:inline-block text-[11px] font-medium text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
              IT Equipment & Access
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" className="text-xs font-medium h-8">
                  <span>Open Dashboard</span>
                  <ArrowRight className="h-3 w-3 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm" className="text-xs font-semibold h-8 bg-white text-zinc-950 hover:bg-zinc-200">
                  <span>Sign In</span>
                  <ArrowRight className="h-3 w-3 ml-1.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Background Decorative Gradients & Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-radial-gradient pointer-events-none -z-10 blur-2xl" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-14 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-md px-3.5 py-1 text-xs text-zinc-300 shadow-sm transition-all hover:border-zinc-700">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-semibold text-white">Nova IT Desk</span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-400">Streamlined hardware & software requests</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Request equipment. <br />
          <span className="text-zinc-400 font-bold">Get approved in minutes.</span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
          The modern IT desk for high-velocity teams. Employees request laptops, tools, and access; managers approve; admins provision with complete audit compliance.
        </p>

        <div className="flex items-center justify-center gap-3 pt-3">
          <Link href={user ? "/dashboard" : "/login"}>
            <Button size="lg" className="h-10 px-6 text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 shadow-lg hover:shadow-white/10 transition-all">
              <span>{user ? "Open Dashboard" : "Sign In to Nova Desk"}</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="outline" size="lg" className="h-10 px-5 text-xs font-medium">
              See How It Works
            </Button>
          </a>
        </div>
      </section>

      {/* Visual Live UI Preview Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 shadow-2xl overflow-hidden backdrop-blur-md glow-indigo">
          {/* Header Bar */}
          <div className="bg-zinc-900/90 px-4 py-3 border-b border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="font-mono text-zinc-400 text-[11px] ml-2">novadesk.internal/dashboard</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 border-b border-zinc-800/80 bg-zinc-950/40 divide-x divide-zinc-800/80 p-3 sm:p-4 text-center">
            <div>
              <p className="text-[11px] text-zinc-400 font-medium">Total Requests</p>
              <p className="text-xl font-bold text-white mt-0.5">24</p>
            </div>
            <div>
              <p className="text-[11px] text-amber-400 font-medium">Pending Sign-off</p>
              <p className="text-xl font-bold text-amber-300 mt-0.5">3</p>
            </div>
            <div>
              <p className="text-[11px] text-emerald-400 font-medium">Approved & Active</p>
              <p className="text-xl font-bold text-emerald-300 mt-0.5">21</p>
            </div>
          </div>

          {/* Request Rows */}
          <div className="divide-y divide-zinc-800/60 text-xs">
            {sampleItems.map((item) => (
              <div key={item.title} className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-zinc-100">{item.title}</p>
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded font-medium border border-zinc-700">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Requested by {item.requester} • {item.cost}
                  </p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${item.badgeColor}`}>
                    {item.statusLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Workflow Lifecycle */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            End-to-End Request Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            From squad request to budget approval and IT provisioning in 3 continuous steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-zinc-200 border border-zinc-700">
                01
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Employee</span>
            </div>
            <h3 className="text-sm font-bold text-white">Instant Request Creation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Select hardware models, software subscriptions, or access roles with estimated pricing and justification.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-zinc-200 border border-zinc-700">
                02
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400">Manager</span>
            </div>
            <h3 className="text-sm font-bold text-white">Budget & Scope Sign-Off</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Team leads review urgency, verify budget allocations, append feedback notes, and approve or decline.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-zinc-200 border border-zinc-700">
                03
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">IT Ops</span>
            </div>
            <h3 className="text-sm font-bold text-white">Provisioning & Audit Trail</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Admins fulfill orders and manage user directories with every change recorded in the immutable compliance log.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Core Architecture Pillars */}
      <section className="bg-zinc-900/40 border-y border-zinc-800/80 py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2.5 hover:border-zinc-700 transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center">
                    <Icon className="h-4 w-4 text-zinc-300" />
                  </div>
                  <h3 className="text-sm font-bold text-white pt-1">{feat.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-850 bg-zinc-950 py-8 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-white text-[10px] font-bold border border-zinc-700">
              N
            </div>
            <span className="font-semibold text-zinc-300">Nova Desk</span>
            <span>• IT Equipment & Access Platform</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-zinc-500">
            <span>Secure Enterprise Architecture</span>
            <span>•</span>
            <span>Role-Based Access Control</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
