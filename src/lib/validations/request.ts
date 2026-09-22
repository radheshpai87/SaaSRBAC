import { z } from "zod";

export const createRequestSchema = z.object({
  title: z
    .string()
    .min(3, "Item name must be at least 3 characters long")
    .max(160, "Item name must not exceed 160 characters"),
  description: z
    .string()
    .min(5, "Please provide a brief justification (at least 5 characters)")
    .max(5000, "Description must not exceed 5000 characters"),
  category: z
    .string()
    .optional()
    .default("Hardware"),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .optional()
    .default("MEDIUM"),
  estimatedCost: z
    .number()
    .min(0, "Cost must be a positive number")
    .optional()
    .default(0),
  costCenter: z
    .string()
    .optional()
    .default("IT-ENG-101"),
  vendorName: z
    .string()
    .optional()
    .default("Apple / Authorized Vendor"),
  paybackMonths: z
    .number()
    .optional()
    .default(12),
  assignedToId: z
    .string()
    .optional()
    .nullable(),
});

export const updateRequestStatusSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  reviewNotes: z
    .string()
    .max(2000, "Review directive must not exceed 2000 characters")
    .optional(),
  fiscalResolution: z
    .string()
    .max(100, "Resolution code must not exceed 100 characters")
    .optional(),
});

export const updateRequestDetailsSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  title: z.string().min(3).max(160),
  description: z.string().min(5).max(5000),
  category: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  estimatedCost: z.number().min(0).optional(),
  costCenter: z.string().optional(),
  vendorName: z.string().optional(),
  paybackMonths: z.number().min(1).optional(),
});

export type CreateRequestInput = z.input<typeof createRequestSchema>;
export type UpdateRequestStatusInput = z.input<typeof updateRequestStatusSchema>;
export type UpdateRequestDetailsInput = z.input<typeof updateRequestDetailsSchema>;
