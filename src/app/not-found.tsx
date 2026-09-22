import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 mb-4 border border-zinc-800 shadow-xs">
        <FileQuestion className="h-7 w-7 stroke-[1.5]" />
      </div>
      <h1 className="text-xl font-bold text-zinc-100">404 - Page Not Found</h1>
      <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-6 leading-relaxed">
        The workflow resource or page you requested does not exist or has been moved.
      </p>
      <Link href="/dashboard">
        <Button size="sm" className="bg-white text-zinc-950 hover:bg-zinc-200">
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
