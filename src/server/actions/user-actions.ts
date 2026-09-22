"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-utils";
import {
  updateUserRoleSchema,
  toggleUserStatusSchema,
  createUserSchema,
  UpdateUserRoleInput,
  ToggleUserStatusInput,
  CreateUserInput,
} from "@/lib/validations/user";
import { logActivity } from "@/server/services/activity";
import { ActionResult } from "@/types";

/**
 * Updates a user's system role (ADMIN, MANAGER, USER).
 * Restricted strictly to ADMIN role server-side.
 */
export async function updateUserRole(
  input: UpdateUserRoleInput
): Promise<ActionResult<{ id: string; role: string }>> {
  try {
    const admin = await requireRole(["ADMIN"]);

    const parsed = updateUserRoleSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid payload",
        statusCode: 400,
      };
    }

    const { userId, role } = parsed.data;

    const targetUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return { success: false, error: "Target user not found", statusCode: 404 };
    }

    // Guard against removing the last active admin
    if (targetUser.id === admin.id && role !== "ADMIN") {
      const adminCount = await db.user.count({
        where: { role: "ADMIN", status: "ACTIVE" },
      });
      if (adminCount <= 1) {
        return {
          success: false,
          error: "Cannot demote the only remaining active Administrator",
          statusCode: 400,
        };
      }
    }

    const previousRole = targetUser.role;
    const updated = await db.user.update({
      where: { id: userId },
      data: { role },
    });

    await logActivity({
      userId: admin.id,
      action: "ROLE_CHANGED",
      entityType: "User",
      entityId: userId,
      metadata: {
        userName: targetUser.name,
        userEmail: targetUser.email,
        previousRole,
        newRole: role,
        changedBy: admin.name,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/activity");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { id: updated.id, role: updated.role },
    };
  } catch (error: any) {
    console.error("updateUserRole error:", error);
    return {
      success: false,
      error: error.message || "Failed to update user role",
      statusCode: error.statusCode || 500,
    };
  }
}

/**
 * Toggles a user's status between ACTIVE and INACTIVE.
 * Restricted strictly to ADMIN role server-side.
 */
export async function toggleUserStatus(
  input: ToggleUserStatusInput
): Promise<ActionResult<{ id: string; status: string }>> {
  try {
    const admin = await requireRole(["ADMIN"]);

    const parsed = toggleUserStatusSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid payload",
        statusCode: 400,
      };
    }

    const { userId, status } = parsed.data;

    const targetUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return { success: false, error: "Target user not found", statusCode: 404 };
    }

    // Guard against deactivating oneself if the only admin
    if (targetUser.id === admin.id && status === "INACTIVE") {
      return {
        success: false,
        error: "Cannot deactivate your own administrator account",
        statusCode: 400,
      };
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { status },
    });

    const actionName = status === "ACTIVE" ? "USER_ACTIVATED" : "USER_DEACTIVATED";

    await logActivity({
      userId: admin.id,
      action: actionName,
      entityType: "User",
      entityId: userId,
      metadata: {
        userName: targetUser.name,
        userEmail: targetUser.email,
        status,
        performedBy: admin.name,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/activity");

    return {
      success: true,
      data: { id: updated.id, status: updated.status },
    };
  } catch (error: any) {
    console.error("toggleUserStatus error:", error);
    return {
      success: false,
      error: error.message || "Failed to update user status",
      statusCode: error.statusCode || 500,
    };
  }
}

/**
 * Provisions a new user in PostgreSQL.
 * Restricted strictly to ADMIN role server-side.
 */
export async function createUser(
  input: CreateUserInput
): Promise<ActionResult<{ id: string; email: string }>> {
  try {
    const admin = await requireRole(["ADMIN"]);

    const parsed = createUserSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid user payload",
        statusCode: 400,
      };
    }

    const { name, email, password, role, status, department } = parsed.data;

    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return {
        success: false,
        error: "A user with this email address already exists",
        statusCode: 409,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        status,
        department,
      },
    });

    await logActivity({
      userId: admin.id,
      action: "USER_PROVISIONED",
      entityType: "User",
      entityId: newUser.id,
      metadata: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        provisionedBy: admin.name,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/activity");

    return {
      success: true,
      data: { id: newUser.id, email: newUser.email },
    };
  } catch (error: any) {
    console.error("createUser error:", error);
    return {
      success: false,
      error: error.message || "Failed to provision user",
      statusCode: error.statusCode || 500,
    };
  }
}
