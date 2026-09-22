import { db } from "@/lib/db";

export interface GetActivityLogsOptions {
  page?: number;
  limit?: number;
  action?: string;
  entityType?: string;
  userId?: string;
  search?: string;
}

export async function getActivityLogs(options: GetActivityLogsOptions) {
  const { page = 1, limit = 25, action, entityType, userId, search } = options;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (action && action !== "ALL") {
    whereClause.action = action;
  }

  if (entityType && entityType !== "ALL") {
    whereClause.entityType = entityType;
  }

  if (userId && userId !== "ALL") {
    whereClause.userId = userId;
  }

  if (search && search.trim() !== "") {
    whereClause.OR = [
      { action: { contains: search, mode: "insensitive" } },
      { entityType: { contains: search, mode: "insensitive" } },
      { entityId: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [logs, totalCount, distinctActions, distinctEntities] = await Promise.all([
    db.activityLog.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    }),
    db.activityLog.count({ where: whereClause }),
    db.activityLog.findMany({
      select: { action: true },
      distinct: ["action"],
    }),
    db.activityLog.findMany({
      select: { entityType: true },
      distinct: ["entityType"],
    }),
  ]);

  return {
    logs,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit) || 1,
      currentPage: page,
      limit,
    },
    filterOptions: {
      actions: distinctActions.map((a) => a.action),
      entities: distinctEntities.map((e) => e.entityType),
    },
  };
}
