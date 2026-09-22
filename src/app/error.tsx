"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mb-4 border border-rose-500/25 shadow-xs">
        <AlertTriangle className="h-7 w-7 stroke-[1.5]" />
      </div>
      <h1 className="text-xl font-bold text-zinc-100">An unexpected error occurred</h1>
      <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-6 leading-relaxed">
        {error.message || "A server or network error was encountered while processing your request."}
      </p>
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={() => reset()} className="bg-white text-zinc-950 hover:bg-zinc-200">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Try Again
        </Button>
        <a href="/dashboard">
          <Button variant="outline" size="sm">
            Dashboard
          </Button>
        </a>
      </div>
    </div>
  );
}
