"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error.includes("deactivated")) {
          setErrorMessage("This account is currently deactivated. Please contact an administrator.");
        } else {
          setErrorMessage("Invalid email or password. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Main Authentication Card */}
      <Card className="border-zinc-800 bg-zinc-900/80 shadow-2xl backdrop-blur-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 text-xs text-rose-400 border border-rose-500/20">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <p className="font-medium">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  className="flex h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 pl-9 text-sm text-zinc-100 shadow-xs transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:border-zinc-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-zinc-300">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="flex h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 pl-9 text-sm text-zinc-100 shadow-xs transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:border-zinc-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-9 mt-2 text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200"
              isLoading={isLoading}
            >
              <span>Sign In</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-zinc-500">
        <span>Protected by enterprise authentication and role-based access controls.</span>
      </div>
    </div>
  );
}
