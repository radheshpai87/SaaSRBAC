import { db } from "@/lib/db";
import { RoleType } from "@/types";

export interface DashboardMetrics {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalUsers?: number;
  activeUsers?: number;
  urgentPendingCount?: number;
}

export async function getDashboardData(userId: string, role: RoleType) {
  if (role === "USER") {
    // User Dashboard Data
    const [totalRequests, pendingRequests, approvedRequests, rejectedRequests, recentRequests, recentActivity] =
      await Promise.all([
        db.request.count({ where: { createdById: userId } }),
        db.request.count({ where: { createdById: userId, status: "PENDING" } }),
        db.request.count({ where: { createdById: userId, status: "APPROVED" } }),
        db.request.count({ where: { createdById: userId, status: "REJECTED" } }),
        db.request.findMany({
          where: { createdById: userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { assignedTo: { select: { name: true, email: true } } },
        }),
        db.activityLog.findMany({
          where: {
            OR: [
              { userId },
              {
                entityType: "Request",
                entityId: {
                  in: (
                    await db.request.findMany({
                      where: { createdById: userId },
                      select: { id: true },
                    })
                  ).map((r) => r.id),
                },
              },
            ],
          },
          orderBy: { createdAt: "desc" },
          take: 7,
          include: { user: { select: { name: true, role: true } } },
        }),
      ]);

    return {
      metrics: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
      } as DashboardMetrics,
      recentRequests,
      recentActivity,
    };
  }

  if (role === "MANAGER") {
    // Manager Dashboard Data
    const [
      totalAssigned,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      pendingList,
      approvedList,
      rejectedList,
      urgentPending,
      recentActivity,
    ] = await Promise.all([
      db.request.count(),
      db.request.count({ where: { status: "PENDING" } }),
      db.request.count({ where: { status: "APPROVED" } }),
      db.request.count({ where: { status: "REJECTED" } }),
      db.request.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" }, // Oldest pending first for queue triage
        take: 6,
        include: { createdBy: { select: { name: true, email: true, department: true } } },
      }),
      db.request.findMany({
        where: { status: "APPROVED" },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { createdBy: { select: { name: true, email: true } } },
      }),
      db.request.findMany({
        where: { status: "REJECTED" },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { createdBy: { select: { name: true, email: true } } },
      }),
      db.request.count({
        where: { status: "PENDING", priority: { in: ["HIGH", "URGENT"] } },
      }),
      db.activityLog.findMany({
        where: {
          entityType: "Request",
        },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { user: { select: { name: true, role: true } } },
      }),
    ]);

    return {
      metrics: {
        totalRequests: totalAssigned,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        urgentPendingCount: urgentPending,
      } as DashboardMetrics,
      pendingList,
      approvedList,
      rejectedList,
      recentActivity,
    };
  }

  // Admin Dashboard Data
  const [
    totalUsers,
    activeUsers,
    totalRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    recentRequests,
    recentActivity,
    userRoleDistribution,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { status: "ACTIVE" } }),
    db.request.count(),
    db.request.count({ where: { status: "PENDING" } }),
    db.request.count({ where: { status: "APPROVED" } }),
    db.request.count({ where: { status: "REJECTED" } }),
    db.request.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        createdBy: { select: { name: true, email: true } },
        assignedTo: { select: { name: true } },
      },
    }),
    db.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true, role: true } } },
    }),
    db.user.groupBy({
      by: ["role"],
      _count: { role: true },
    }),
  ]);

  return {
    metrics: {
      totalUsers,
      activeUsers,
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    } as DashboardMetrics,
    recentRequests,
    recentActivity,
    userRoleDistribution,
  };
}
