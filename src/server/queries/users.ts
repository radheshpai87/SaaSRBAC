import { db } from "@/lib/db";
import { RoleType, UserStatus } from "@/types";

export interface GetUsersOptions {
  page?: number;
  limit?: number;
  role?: RoleType | "ALL";
  status?: UserStatus | "ALL";
  search?: string;
}

export async function getUsersList(options: GetUsersOptions) {
  const { page = 1, limit = 20, role, status, search } = options;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (role && role !== "ALL") {
    whereClause.role = role;
  }

  if (status && status !== "ALL") {
    whereClause.status = status;
  }

  if (search && search.trim() !== "") {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { department: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, totalCount] = await Promise.all([
    db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        department: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            createdRequests: true,
            assignedRequests: true,
            activityLogs: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.user.count({ where: whereClause }),
  ]);

  return {
    users,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit) || 1,
      currentPage: page,
      limit,
    },
  };
}
