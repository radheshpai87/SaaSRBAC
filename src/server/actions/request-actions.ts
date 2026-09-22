"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth-utils";
import {
  createRequestSchema,
  updateRequestStatusSchema,
  CreateRequestInput,
  UpdateRequestStatusInput,
} from "@/lib/validations/request";
import { logActivity } from "@/server/services/activity";
import { ActionResult } from "@/types";

/**
 * Creates a new Capital Expenditure Request (CER) in PostgreSQL.
 */
export async function createRequest(
  input: CreateRequestInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireAuth();

    const parsed = createRequestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid CapEx proposal payload",
        statusCode: 400,
      };
    }

    const {
      title,
      description,
      category,
      priority,
      estimatedCost,
      costCenter,
      vendorName,
      paybackMonths,
      assignedToId,
    } = parsed.data;

    let targetManagerId = assignedToId;
    if (!targetManagerId) {
      const defaultManager = await db.user.findFirst({
        where: { role: "MANAGER", status: "ACTIVE" },
        select: { id: true },
      });
      targetManagerId = defaultManager?.id || null;
    }

    const newRequest = await db.request.create({
      data: {
        title,
        description,
        category: category || "Data Center & Cloud Infrastructure",
        priority: priority || "MEDIUM",
        status: "PENDING",
        estimatedCost: estimatedCost || 0.0,
        costCenter: costCenter || "GL-7040-INFRA",
        vendorName: vendorName || "Amazon Web Services",
        paybackMonths: paybackMonths || 12,
        createdById: user.id,
        assignedToId: targetManagerId,
      },
    });

    // Write audit log
    await logActivity({
      userId: user.id,
      action: "CAPEX_PROPOSAL_SUBMITTED",
      entityType: "Request",
      entityId: newRequest.id,
      metadata: {
        title: newRequest.title,
        priority: newRequest.priority,
        category: newRequest.category,
        estimatedCost: newRequest.estimatedCost,
        costCenter: newRequest.costCenter,
        vendorName: newRequest.vendorName,
        paybackMonths: newRequest.paybackMonths,
        submittedBy: user.name,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/requests");
    revalidatePath("/admin/activity");

    return {
      success: true,
      data: { id: newRequest.id },
    };
  } catch (error: any) {
    console.error("createRequest error:", error);
    return {
      success: false,
      error: error.message || "Failed to submit CapEx request",
      statusCode: error.statusCode || 500,
    };
  }
}

/**
 * Authorizes or declines a Capital Expenditure Request.
 * Restricted strictly to MANAGER and ADMIN roles on the server-side.
 */
export async function updateRequestStatus(
  input: UpdateRequestStatusInput
): Promise<ActionResult<{ id: string; status: string }>> {
  try {
    const user = await requireRole(["MANAGER", "ADMIN"]);

    const parsed = updateRequestStatusSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid payload",
        statusCode: 400,
      };
    }

    const { requestId, status, reviewNotes, fiscalResolution } = parsed.data;

    const existingRequest = await db.request.findUnique({
      where: { id: requestId },
      include: { createdBy: true },
    });

    if (!existingRequest) {
      return {
        success: false,
        error: "CapEx request record not found",
        statusCode: 404,
      };
    }

    const resolutionCode =
      fiscalResolution ||
      (status === "APPROVED"
        ? `RES-${new Date().getFullYear()}-CAPEX-${Math.floor(100 + Math.random() * 900)}`
        : null);

    const updatedRequest = await db.request.update({
      where: { id: requestId },
      data: {
        status,
        fiscalResolution: resolutionCode,
        reviewNotes:
          reviewNotes ||
          (status === "APPROVED"
            ? "Authorized by Capital Infrastructure & Treasury Committee."
            : "Declined under fiscal threshold constraints."),
        assignedToId: user.id,
      },
    });

    const actionName = status === "APPROVED" ? "CAPEX_AUTHORIZED" : "CAPEX_DECLINED";

    await logActivity({
      userId: user.id,
      action: actionName,
      entityType: "Request",
      entityId: requestId,
      metadata: {
        requestId,
        title: existingRequest.title,
        previousStatus: existingRequest.status,
        newStatus: status,
        fiscalResolution: resolutionCode,
        authorizedAmount: existingRequest.estimatedCost,
        reviewerRole: user.role,
        reviewerName: user.name,
        notes: reviewNotes || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/requests");
    revalidatePath(`/requests/${requestId}`);
    revalidatePath("/admin/activity");

    return {
      success: true,
      data: { id: updatedRequest.id, status: updatedRequest.status },
    };
  } catch (error: any) {
    console.error("updateRequestStatus error:", error);
    return {
      success: false,
      error: error.message || "Failed to process CapEx authorization",
      statusCode: error.statusCode || 500,
    };
  }
}

/**
 * Deletes / withdraws a proposal.
 */
export async function deleteRequest(
  requestId: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireAuth();

    const request = await db.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return { success: false, error: "CapEx request not found", statusCode: 404 };
    }

    if (user.role !== "ADMIN" && request.createdById !== user.id) {
      return {
        success: false,
        error: "FORBIDDEN: You do not have permission to withdraw this proposal",
        statusCode: 403,
      };
    }

    if (user.role !== "ADMIN" && request.status !== "PENDING") {
      return {
        success: false,
        error: "Cannot withdraw proposals that have already undergone committee review",
        statusCode: 400,
      };
    }

    await db.request.delete({
      where: { id: requestId },
    });

    await logActivity({
      userId: user.id,
      action: "CAPEX_PROPOSAL_WITHDRAWN",
      entityType: "Request",
      entityId: requestId,
      metadata: {
        title: request.title,
        amount: request.estimatedCost,
        withdrawnBy: user.name,
        withdrawnByRole: user.role,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/requests");
    revalidatePath("/admin/activity");

    return { success: true, data: { id: requestId } };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to withdraw proposal",
      statusCode: error.statusCode || 500,
    };
  }
}
