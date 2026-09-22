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
  Activity,
  Cpu,
  Database,
  Terminal,
  ChevronRight,
  Check,
  Server,
  Key,
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

  const corePillars = [
    {
      icon: Laptop,
      title: "Self-Service IT Catalog",
      tag: "Fleet Provisioning",
      desc: "Instant submission for laptops, 4K displays, developer SaaS licenses, or AWS/GCP cloud permissions.",
    },
    {
      icon: CheckCircle2,
      title: "Multi-Tier Approval Queues",
      tag: "Workflow Engine",
      desc: "Squad leads triage team requests, verify departmental budget allocations, and sign off in real time.",
    },
    {
      icon: Shield,
      title: "Server-Enforced RBAC",
      tag: "Zero Trust",
      desc: "Granular role boundaries validated server-side on database mutations, API actions, and edge routes.",
    },
    {
      icon: Activity,
      title: "Immutable Compliance Ledger",
      tag: "SOC2 Audit Trail",
      desc: "Cryptographic activity recording every authentication, role transition, status change, and approval note.",
    },
    {
      icon: Database,
      title: "PostgreSQL Relational Core",
      tag: "ACID Guaranteed",
      desc: "Foreign-key integrity linking requesters, approvers, cost allocations, and timestamped audit logs.",
    },
    {
      icon: Server,
      title: "Docker & Self-Hosted Ready",
      tag: "Home Server & Cloud",
      desc: "Deploy in seconds on home servers, Unraid, Proxmox, or cloud VPS with zero external cloud dependencies.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Background Decorative Gradients & Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-radial-gradient pointer-events-none -z-10 blur-3xl" />

      {/* Top Banner */}
      <div className="w-full bg-zinc-900/60 border-b border-zinc-800/80 py-1.5 px-4 text-center text-[11px] text-zinc-400 hidden sm:block">
        <span className="font-semibold text-zinc-200">Nova Desk 1.4</span>
        <span className="mx-2 text-zinc-600">•</span>
        <span>Enterprise IT Equipment & Workflow Authorization Platform</span>
        <span className="mx-2 text-zinc-600">•</span>
        <span className="text-emerald-400 font-medium">All Systems Operational</span>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white border border-zinc-700 shadow-xs group-hover:border-zinc-500 transition-colors">
                <Laptop className="h-4 w-4 text-zinc-200" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white">Nova Desk</span>
                <span className="hidden md:inline-block text-[10px] font-mono font-medium text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                  v1.4
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-5 text-xs text-zinc-400 font-medium">
              <a href="#features" className="hover:text-zinc-100 transition-colors">
                Platform
              </a>
              <a href="#how-it-works" className="hover:text-zinc-100 transition-colors">
                Workflows
              </a>
              <a href="#security" className="hover:text-zinc-100 transition-colors">
                Security & RBAC
              </a>
              <a href="#architecture" className="hover:text-zinc-100 transition-colors">
                Architecture
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-zinc-400 pr-2 border-r border-zinc-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SOC2 Compliant</span>
            </div>

            {user ? (
              <Link href="/dashboard">
                <Button size="sm" className="text-xs font-medium h-8 bg-white text-zinc-950 hover:bg-zinc-200 shadow-xs">
                  <span>Dashboard</span>
                  <ArrowRight className="h-3 w-3 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-medium h-8 text-zinc-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="text-xs font-semibold h-8 bg-white text-zinc-950 hover:bg-zinc-200 shadow-xs">
                    <span>Get Started</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-14 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-md px-3.5 py-1 text-xs text-zinc-300 shadow-sm transition-all hover:border-zinc-700">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-semibold text-white">Nova IT Desk</span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-400">Next-gen hardware & software request platform</span>
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
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-zinc-850">
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

      {/* 6 Core Platform Pillars */}
      <section id="features" className="bg-zinc-900/30 border-y border-zinc-800/80 py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Engineered for Enterprise Reliability
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Everything high-velocity squads need to automate internal equipment and licensing requests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {corePillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-5 rounded-xl border border-zinc-800/90 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700/80 transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center border border-zinc-700 group-hover:border-zinc-500 transition-colors">
                      <Icon className="h-4 w-4 text-zinc-200" />
                    </div>
                    <span className="text-[10px] font-mono font-medium text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700">
                      {pillar.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white pt-1">{pillar.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & RBAC Matrix Highlight */}
      <section id="security" className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-8 sm:p-10 space-y-8 relative overflow-hidden">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              Enterprise Security Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Strict Multi-Tier Role Governance
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every request mutation, status transition, and user role update is validated at the edge middleware and server action layers before hitting PostgreSQL.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <Lock className="h-4 w-4 text-emerald-400" />
                <span>JWT Session Tokens</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Cryptographically signed Auth.js v5 session cookies with server-side validation.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <Shield className="h-4 w-4 text-indigo-400" />
                <span>Zero Trust Scoping</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Database queries scoped strictly to user tenant boundaries and assigned squads.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <Activity className="h-4 w-4 text-amber-400" />
                <span>Append-Only Ledger</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                All state transitions recorded in immutable PostgreSQL activity logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-850 bg-zinc-950 py-12 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 text-white text-xs font-bold border border-zinc-700">
                  N
                </div>
                <span className="font-bold text-white">Nova Desk</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enterprise IT hardware, software licensing, and access request platform.
              </p>
            </div>

            <div className="space-y-2.5">
              <p className="font-semibold text-zinc-200 text-xs">Product</p>
              <ul className="space-y-1.5 text-zinc-400">
                <li><a href="#features" className="hover:text-white transition-colors">Catalog</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Approval Queues</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Audit Logging</a></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="font-semibold text-zinc-200 text-xs">Deployment</p>
              <ul className="space-y-1.5 text-zinc-400">
                <li><Link href="/login" className="hover:text-white transition-colors">Docker Setup</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Self-Hosting</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">PostgreSQL Sync</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="font-semibold text-zinc-200 text-xs">Security</p>
              <ul className="space-y-1.5 text-zinc-400">
                <li><a href="#security" className="hover:text-white transition-colors">RBAC Matrix</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">SOC2 Compliance</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Session Verification</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
            <div>
              &copy; {new Date().getFullYear()} Nova Desk. Crafted for enterprise speed and security.
            </div>
            <div className="flex items-center gap-4">
              <span>Next.js 15</span>
              <span>•</span>
              <span>PostgreSQL</span>
              <span>•</span>
              <span>Docker Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
