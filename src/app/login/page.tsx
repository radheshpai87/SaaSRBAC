import React, { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Laptop } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 text-zinc-100">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 text-white border border-zinc-700 shadow-sm">
            <Laptop className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nova Desk</span>
        </Link>
        <p className="text-xs text-zinc-400">
          Sign in to request hardware, software licenses, or cloud access
        </p>
      </div>

      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto h-80 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 animate-pulse" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
