import { db } from "@/lib/db";
import { RoleType, RequestStatus, RequestPriority } from "@/types";

export interface GetRequestsOptions {
  page?: number;
  limit?: number;
  status?: RequestStatus | "ALL";
  priority?: RequestPriority | "ALL";
  search?: string;
  userId: string;
  role: RoleType;
}

export async function getRequestsList(options: GetRequestsOptions) {
  const { page = 1, limit = 20, status, priority, search, userId, role } = options;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  // Role scoping: standard users only see their own requests
  if (role === "USER") {
    whereClause.createdById = userId;
  }

  // Filter by status
  if (status && status !== "ALL") {
    whereClause.status = status;
  }

  // Filter by priority
  if (priority && priority !== "ALL") {
    whereClause.priority = priority;
  }

  // Search filter
  if (search && search.trim() !== "") {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, totalCount] = await Promise.all([
    db.request.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        createdBy: { select: { id: true, name: true, email: true, department: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    }),
    db.request.count({ where: whereClause }),
  ]);

  return {
    items,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit) || 1,
      currentPage: page,
      limit,
    },
  };
}

export async function getRequestById(id: string, userId: string, role: RoleType) {
  const request = await db.request.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true, department: true, role: true } },
      assignedTo: { select: { id: true, name: true, email: true, role: true } },
    },
  });

  if (!request) {
    return null;
  }

  // Role authorization: users can only view their own requests
  if (role === "USER" && request.createdById !== userId) {
    const error = new Error("FORBIDDEN: You do not have permission to access this request");
    (error as any).statusCode = 403;
    throw error;
  }

  // Fetch activity log audit trail for this specific request
  const activityLogs = await db.activityLog.findMany({
    where: {
      entityType: "Request",
      entityId: id,
    },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, name: true, role: true, email: true } },
    },
  });

  return {
    request,
    activityLogs,
  };
}
