import React from "react";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import { getRequestById } from "@/server/queries/requests";
import { RequestDetailView } from "@/components/requests/RequestDetailView";

interface RequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const user = await requireAuth();
  const { id } = await params;

  try {
    const data = await getRequestById(id, user.id, user.role);

    if (!data || !data.request) {
      notFound();
    }

    return (
      <RequestDetailView
        request={data.request}
        activityLogs={data.activityLogs}
        currentUser={user}
      />
    );
  } catch (error: any) {
    if (error.statusCode === 403 || error.message?.includes("FORBIDDEN")) {
      return (
        <div className="p-8 text-center bg-zinc-900/60 rounded-xl border border-rose-500/25 shadow-xs max-w-lg mx-auto mt-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 mx-auto mb-4 border border-rose-500/20">
            <span className="text-lg font-bold">403</span>
          </div>
          <h2 className="text-base font-bold text-zinc-100">Access Denied (403 Forbidden)</h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            You do not have permission to view this request. Standard tenant users can only access their own submitted requests.
          </p>
        </div>
      );
    }
    throw error;
  }
}
