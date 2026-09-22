"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SessionUser } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { updateRequestStatus } from "@/server/actions/request-actions";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  X,
  Activity,
  Laptop,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ManagerDashboardProps {
  user: SessionUser;
  data: {
    metrics: {
      totalRequests: number;
      pendingRequests: number;
      approvedRequests: number;
      rejectedRequests: number;
      urgentPendingCount?: number;
    };
    pendingList: any[];
    approvedList: any[];
    rejectedList: any[];
    recentActivity: any[];
  };
}

export function ManagerDashboard({ user, data }: ManagerDashboardProps) {
  const router = useRouter();
  const { metrics, pendingList, approvedList, rejectedList, recentActivity } = data;

  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    requestId: string;
    requestTitle: string;
    actionType: "APPROVED" | "REJECTED";
  }>({
    isOpen: false,
    requestId: "",
    requestTitle: "",
    actionType: "APPROVED",
  });

  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleOpenModal = (req: any, type: "APPROVED" | "REJECTED") => {
    setActiveModal({
      isOpen: true,
      requestId: req.id,
      requestTitle: req.title,
      actionType: type,
    });
    setReviewNotes(
      type === "APPROVED"
        ? "Approved. Approved for team hardware & software tooling budget."
        : "Request declined. Please discuss alternative equipment specs with your team lead."
    );
  };

  const handleConfirmReview = async () => {
    try {
      setIsSubmitting(true);
      const res = await updateRequestStatus({
        requestId: activeModal.requestId,
        status: activeModal.actionType,
        reviewNotes: reviewNotes.trim(),
      });

      if (res.success) {
        setActionFeedback({
          type: "success",
          message: `Request successfully ${activeModal.actionType === "APPROVED" ? "approved" : "declined"}.`,
        });
        setActiveModal((prev) => ({ ...prev, isOpen: false }));
        router.refresh();
      } else {
        setActionFeedback({
          type: "error",
          message: res.error || "Failed to update request status.",
        });
      }
    } catch (e: any) {
      setActionFeedback({
        type: "error",
        message: e.message || "An error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              Team Approvals: {user.name}
            </h1>
            <Badge role={user.role} size="sm" />
          </div>
          <p className="text-xs text-zinc-400">
            Review equipment and access requests from your squad, verify budget, and approve or reject.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/requests">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              All Requests
            </Button>
          </Link>
          <Link href="/requests/new">
            <Button size="sm" className="h-8 text-xs bg-white hover:bg-zinc-200 text-zinc-950 font-medium">
              New Request
            </Button>
          </Link>
        </div>
      </div>

      {actionFeedback && (
        <div
          className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium ${
            actionFeedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
              : "bg-rose-500/10 text-rose-400 border-rose-500/25"
          }`}
        >
          <span>{actionFeedback.message}</span>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400">Pending Approval</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{metrics.pendingRequests}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-amber-500/10 text-amber-400 border-amber-500/20">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400">Urgent Priority</p>
              <p className="text-2xl font-bold text-orange-400 mt-1">
                {metrics.urgentPendingCount ?? 0}
              </p>
            </div>
            <div className="p-2.5 rounded-lg border bg-orange-500/10 text-orange-400 border-orange-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400">Approved</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{metrics.approvedRequests}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400">Declined</p>
              <p className="text-2xl font-bold text-rose-400 mt-1">{metrics.rejectedRequests}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-rose-500/10 text-rose-400 border-rose-500/20">
              <XCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Review Section: Pending Approval Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-amber-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-3 bg-amber-500/5 rounded-t-xl border-b border-amber-500/20">
              <div>
                <CardTitle className="flex items-center gap-2 text-zinc-100">
                  <Clock className="h-4 w-4 text-amber-400" />
                  Requests Requiring Sign-Off
                  <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {pendingList.length} pending
                  </span>
                </CardTitle>
                <CardDescription>
                  Review and sign off on equipment before IT provisioning
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pendingList.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-zinc-200">All caught up!</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    No requests are currently waiting for your approval.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/60">
                  {pendingList.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 hover:bg-zinc-800/40 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/requests/${req.id}`}
                            className="text-xs font-bold text-zinc-100 hover:text-blue-400 transition-colors"
                          >
                            {req.title}
                          </Link>
                          <Badge priority={req.priority} size="sm" />
                          {req.category && (
                            <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                              {req.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-2">{req.description}</p>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                          <span>
                            Requested by <strong className="text-zinc-300">{req.createdBy.name}</strong>
                          </span>
                          <span>•</span>
                          <span>{formatRelativeTime(req.createdAt)}</span>
                          {req.estimatedCost > 0 && (
                            <>
                              <span>•</span>
                              <span className="font-semibold text-zinc-300">
                                ${req.estimatedCost.toLocaleString()} USD
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Review Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(req, "APPROVED")}
                          className="h-8 px-2.5 text-xs text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                        >
                          <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(req, "REJECTED")}
                          className="h-8 px-2.5 text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                        >
                          <X className="h-3.5 w-3.5 mr-1 text-rose-400" />
                          Reject
                        </Button>
                        <Link href={`/requests/${req.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 px-2 text-xs text-zinc-400 hover:text-zinc-100">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historical Reviews Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Approved ({approvedList.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-zinc-800/60">
                {approvedList.slice(0, 3).map((r) => (
                  <Link
                    key={r.id}
                    href={`/requests/${r.id}`}
                    className="block p-3 text-xs hover:bg-zinc-800/40"
                  >
                    <p className="font-semibold text-zinc-200 truncate">{r.title}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      By {r.createdBy.name} • {formatRelativeTime(r.updatedAt)}
                    </p>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <XCircle className="h-3.5 w-3.5 text-rose-400" />
                  Declined ({rejectedList.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-zinc-800/60">
                {rejectedList.slice(0, 3).map((r) => (
                  <Link
                    key={r.id}
                    href={`/requests/${r.id}`}
                    className="block p-3 text-xs hover:bg-zinc-800/40"
                  >
                    <p className="font-semibold text-zinc-200 truncate">{r.title}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      By {r.createdBy.name} • {formatRelativeTime(r.updatedAt)}
                    </p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Stream */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-zinc-100">
                <Activity className="h-4 w-4 text-zinc-400" />
                Team Activity
              </CardTitle>
              <CardDescription>Recent team submissions and reviews</CardDescription>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-zinc-800/60">
              {recentActivity.map((act) => (
                <div key={act.id} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-medium text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                      {act.action}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {formatRelativeTime(act.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    <strong className="text-zinc-100">{act.user.name}</strong>:{" "}
                    {act.action.toLowerCase().replace(/_/g, " ")}
                  </p>
                  {act.metadata?.notes && (
                    <p className="text-[11px] text-zinc-400 italic bg-zinc-950/60 p-1.5 rounded border border-zinc-800">
                      &quot;{act.metadata.notes}&quot;
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Confirmation Modal */}
      <Modal
        isOpen={activeModal.isOpen}
        onClose={() => setActiveModal((prev) => ({ ...prev, isOpen: false }))}
        title={`${activeModal.actionType === "APPROVED" ? "Approve" : "Reject"} Request`}
        description={activeModal.requestTitle}
      >
        <div className="space-y-4">
          <Textarea
            label="Manager Note"
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            rows={3}
            helperText="Visible to the requester and recorded in the audit log."
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant={activeModal.actionType === "APPROVED" ? "primary" : "danger"}
              isLoading={isSubmitting}
              onClick={handleConfirmReview}
            >
              Confirm {activeModal.actionType === "APPROVED" ? "Approval" : "Rejection"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
