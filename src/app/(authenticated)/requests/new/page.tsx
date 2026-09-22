import React from "react";
import { requireAuth } from "@/lib/auth-utils";
import { CreateRequestForm } from "@/components/requests/CreateRequestForm";

export default async function NewRequestPage() {
  await requireAuth();

  return (
    <div className="py-2">
      <CreateRequestForm />
    </div>
  );
}
