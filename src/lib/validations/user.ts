import { z } from "zod";

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["ADMIN", "MANAGER", "USER"]),
});

export const toggleUserStatusSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "MANAGER", "USER"]).default("USER"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  department: z.string().min(2, "Department name required").default("Engineering"),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type ToggleUserStatusInput = z.infer<typeof toggleUserStatusSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
