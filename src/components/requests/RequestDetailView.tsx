"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionUser } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { updateRequestStatus, deleteRequest } from "@/server/actions/request-actions";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  X,
  Trash2,
  Clock,
  User,
  History,
  ShieldCheck,
  Laptop,
} from "lucide-react";

interface RequestDetailViewProps {
  request: any;
  activityLogs: any[];
  currentUser: SessionUser;
}

export function RequestDetailView({
  request,
  activityLogs,
  currentUser,
}: RequestDetailViewProps) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const canReview = currentUser.role === "MANAGER" || currentUser.role === "ADMIN";
  const canDelete =
    currentUser.role === "ADMIN" ||
    (request.createdById === currentUser.id && request.status === "PENDING");

  const handleOpenReviewModal = (action: "APPROVED" | "REJECTED") => {
    setModalAction(action);
    setReviewNotes(
      action === "APPROVED"
        ? "Approved. Provisioning and procurement order created for team equipment."
        : "Request declined. Please follow up with your manager regarding hardware allocations."
    );
    setIsModalOpen(true);
  };

  const handleConfirmReview = async () => {
    try {
      setIsSubmitting(true);
      const res = await updateRequestStatus({
        requestId: request.id,
        status: modalAction,
        reviewNotes: reviewNotes.trim(),
      });

      if (res.success) {
        setFeedback({
          type: "success",
          message: `Request successfully ${modalAction === "APPROVED" ? "approved" : "declined"}.`,
        });
        setIsModalOpen(false);
        router.refresh();
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to update status",
        });
      }
    } catch (e: any) {
      setFeedback({
        type: "error",
        message: e.message || "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to withdraw and delete this request?")) return;
    try {
      setIsSubmitting(true);
      const res = await deleteRequest(request.id);
      if (res.success) {
        router.push("/requests");
        router.refresh();
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to delete" });
      }
    } catch (e: any) {
      setFeedback({ type: "error", message: e.message || "Failed to delete" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/requests"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to all requests</span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {canReview && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenReviewModal("APPROVED")}
                className="h-8 text-xs text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                Approve Request
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenReviewModal("REJECTED")}
                className="h-8 text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
              >
                <X className="h-3.5 w-3.5 mr-1 text-rose-400" />
                Reject Request
              </Button>
            </>
          )}

          {canDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="h-8 text-xs text-zinc-400 hover:text-rose-400 hover:border-rose-500/30"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Withdraw
            </Button>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
              : "bg-rose-500/10 text-rose-400 border-rose-500/25"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Request Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge status={request.status} size="md" />
                <Badge priority={request.priority} size="md" />
                <span className="text-xs text-zinc-400 font-medium bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                  {request.category || "Hardware"}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">{request.title}</h1>
              <p className="text-[11px] text-zinc-500">
                Submitted on {formatDate(request.createdAt)}
              </p>
            </CardHeader>

            <CardContent className="space-y-5 pt-0">
              <div>
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Reason & Business Purpose
                </h4>
                <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {request.description}
                </div>
              </div>

              {request.reviewNotes && (
                <div>
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Manager Review Note
                  </h4>
                  <div className="p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-xs text-blue-300 leading-relaxed whitespace-pre-wrap">
                    {request.reviewNotes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit Trail Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-zinc-100">
                <History className="h-4 w-4 text-zinc-400" />
                Activity Timeline
              </CardTitle>
              <CardDescription>
                Chronological record of status changes for this request
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {activityLogs.length === 0 ? (
                <div className="p-5 text-center text-xs text-zinc-500">
                  No activity logs recorded.
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/60">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="p-3.5 flex items-start gap-3">
                      <div className="mt-0.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 text-[11px] font-bold">
                          {log.user.name[0]}
                        </span>
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-zinc-100">
                              {log.user.name}
                            </span>
                            <Badge role={log.user.role} size="sm" />
                          </div>
                          <span className="text-[10px] text-zinc-500">
                            {formatDate(log.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">
                          <span className="font-mono font-medium text-zinc-300 bg-zinc-800 px-1.5 py-0.2 rounded text-[10px] border border-zinc-700">
                            {log.action}
                          </span>
                        </p>
                        {log.metadata?.notes && (
                          <p className="text-[11px] text-zinc-400 italic bg-zinc-950/60 p-1.5 rounded border border-zinc-800 mt-1">
                            &quot;{log.metadata.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Metadata Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-xs font-semibold text-zinc-200">
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div>
                <p className="text-[11px] text-zinc-500 uppercase font-medium">Requester</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700">
                    {request.createdBy.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-200">{request.createdBy.name}</p>
                    <p className="text-[11px] text-zinc-500">{request.createdBy.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-zinc-500 uppercase font-medium">Department</p>
                <p className="font-medium text-zinc-300 mt-0.5">
                  {request.createdBy.department || "Design & Engineering"}
                </p>
              </div>

              {request.estimatedCost > 0 && (
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase font-medium">Estimated Price</p>
                  <p className="text-base font-bold text-zinc-100 mt-0.5">
                    ${request.estimatedCost.toLocaleString()} USD
                  </p>
                </div>
              )}

              {request.vendorName && (
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase font-medium">Vendor / Provider</p>
                  <p className="font-medium text-zinc-300 mt-0.5">{request.vendorName}</p>
                </div>
              )}

              <div className="pt-2 border-t border-zinc-800">
                <p className="text-[11px] text-zinc-500 uppercase font-medium">Last Updated</p>
                <p className="text-zinc-400 mt-0.5">{formatDate(request.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalAction === "APPROVED" ? "Approve" : "Reject"} Equipment Request`}
        description={request.title}
      >
        <div className="space-y-4">
          <Textarea
            label="Manager Note"
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            rows={3}
            helperText="Recorded in activity log and visible to requester."
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant={modalAction === "APPROVED" ? "primary" : "danger"}
              isLoading={isSubmitting}
              onClick={handleConfirmReview}
            >
              Confirm {modalAction === "APPROVED" ? "Approval" : "Rejection"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
