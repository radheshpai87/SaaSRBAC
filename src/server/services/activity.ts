import { db } from "@/lib/db";

export interface LogActivityParams {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown> | null;
}

export async function logActivity(params: LogActivityParams) {
  try {
    return await db.activityLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: (params.metadata as any) ?? undefined,
      },
    });
  } catch (error) {
    console.error("Failed to write activity log:", error);
    // Activity logging shouldn't crash primary business transaction, but is tracked
    return null;
  }
}
