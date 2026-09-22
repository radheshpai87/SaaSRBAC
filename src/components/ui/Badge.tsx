import React from "react";
import { cn } from "@/lib/utils";
import { RequestStatus, RequestPriority, RoleType, UserStatus } from "@/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "status" | "priority" | "role" | "outline";
  status?: RequestStatus | UserStatus;
  priority?: RequestPriority;
  role?: RoleType;
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  status,
  priority,
  role,
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const sizeClasses = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1 font-medium";

  // Request & User Status styles
  if (status) {
    let colorClasses = "bg-zinc-800 text-zinc-300 border-zinc-700";
    if (status === "PENDING") {
      colorClasses = "bg-amber-500/10 text-amber-400 border-amber-500/25";
    } else if (status === "APPROVED" || status === "ACTIVE") {
      colorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
    } else if (status === "REJECTED" || status === "INACTIVE") {
      colorClasses = "bg-rose-500/10 text-rose-400 border-rose-500/25";
    }

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border font-medium",
          sizeClasses,
          colorClasses,
          className
        )}
        {...props}
      >
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-amber-400": status === "PENDING",
            "bg-emerald-400": status === "APPROVED" || status === "ACTIVE",
            "bg-rose-400": status === "REJECTED" || status === "INACTIVE",
          })}
        />
        {children || status}
      </span>
    );
  }

  // Priority styles
  if (priority) {
    let colorClasses = "bg-zinc-800 text-zinc-300 border-zinc-700";
    if (priority === "LOW") colorClasses = "bg-zinc-800/80 text-zinc-400 border-zinc-700/80";
    if (priority === "MEDIUM") colorClasses = "bg-blue-500/10 text-blue-400 border-blue-500/25";
    if (priority === "HIGH") colorClasses = "bg-orange-500/10 text-orange-400 border-orange-500/25";
    if (priority === "URGENT") colorClasses = "bg-red-500/15 text-red-400 border-red-500/30 font-semibold";

    return (
      <span
        className={cn(
          "inline-flex items-center rounded border font-medium",
          sizeClasses,
          colorClasses,
          className
        )}
        {...props}
      >
        {children || priority}
      </span>
    );
  }

  // Role styles
  if (role) {
    let colorClasses = "bg-zinc-800 text-zinc-300 border-zinc-700";
    if (role === "ADMIN") colorClasses = "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
    if (role === "MANAGER") colorClasses = "bg-sky-500/15 text-sky-300 border-sky-500/30";
    if (role === "USER") colorClasses = "bg-zinc-800/80 text-zinc-300 border-zinc-700";

    return (
      <span
        className={cn(
          "inline-flex items-center rounded-md border font-medium tracking-wide uppercase text-[10px]",
          sizeClasses,
          colorClasses,
          className
        )}
        {...props}
      >
        {children || role}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-300 font-medium",
        sizeClasses,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
