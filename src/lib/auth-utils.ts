import { auth } from "@/auth";
import { SessionUser, RoleType } from "@/types";

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user as unknown as SessionUser;
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    const error = new Error("UNAUTHORIZED: Authentication required");
    (error as any).statusCode = 401;
    throw error;
  }
  if (user.status !== "ACTIVE") {
    const error = new Error("FORBIDDEN: Account is inactive");
    (error as any).statusCode = 403;
    throw error;
  }
  return user;
}

export async function requireRole(allowedRoles: RoleType[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    const error = new Error(
      `FORBIDDEN: Access denied. Required role: [${allowedRoles.join(", ")}]. Current role: ${user.role}`
    );
    (error as any).statusCode = 403;
    throw error;
  }
  return user;
}

export function hasPermission(
  userRole: RoleType,
  requiredRole: "ADMIN_ONLY" | "MANAGER_OR_ADMIN" | "ANY_AUTHENTICATED"
): boolean {
  if (requiredRole === "ADMIN_ONLY") return userRole === "ADMIN";
  if (requiredRole === "MANAGER_OR_ADMIN") return userRole === "ADMIN" || userRole === "MANAGER";
  return true;
}
