export type RoleType = "ADMIN" | "MANAGER" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type RequestPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  status: UserStatus;
  department?: string | null;
  spendingLimit?: number | null;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}
