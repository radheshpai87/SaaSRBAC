"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { createRequest } from "@/server/actions/request-actions";
import { AlertCircle, ArrowLeft, CheckCircle2, Send, Laptop } from "lucide-react";
import Link from "next/link";

export function CreateRequestForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Hardware");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [estimatedCost, setEstimatedCost] = useState<string>("1999");
  const [vendorName, setVendorName] = useState("Apple Corporate");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);
    setSuccessMessage(null);

    const errs: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 3) {
      errs.title = "Please enter an item name (at least 3 characters).";
    }
    if (!description.trim() || description.trim().length < 5) {
      errs.description = "Please provide a brief justification (at least 5 characters).";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setIsLoading(true);
      const res = await createRequest({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        estimatedCost: parseFloat(estimatedCost) || 0,
        vendorName: vendorName.trim() || "Standard Vendor",
      });

      if (res.success && res.data?.id) {
        setSuccessMessage("Request submitted successfully! Redirecting to details...");
        setTimeout(() => {
          router.push(`/requests/${res.data?.id}`);
          router.refresh();
        }, 600);
      } else {
        setGeneralError(res.error || "Failed to submit request");
      }
    } catch (e: any) {
      setGeneralError(e.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link
        href="/requests"
        className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to all requests</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Request Equipment or Access</CardTitle>
          <CardDescription>
            Order laptops, monitors, developer tools, or cloud permissions with team lead sign-off.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {generalError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-xs text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{generalError}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            <Input
              label="Item / Service Name"
              placeholder={'e.g. Apple MacBook Pro 14" (M3 Pro, 18GB RAM)'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              helperText="Specific hardware model or software title"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Hardware">Hardware (Laptops, Workstations)</option>
                <option value="Accessories">Accessories (Monitors, Keyboards)</option>
                <option value="Software & SaaS">Software & SaaS Licenses</option>
                <option value="Cloud Access">Cloud & Security Access</option>
                <option value="Other">Other IT Equipment</option>
              </Select>

              <Select
                label="Urgency"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
              >
                <option value="LOW">Low - Routine upgrade</option>
                <option value="MEDIUM">Medium - Standard requirement</option>
                <option value="HIGH">High - Needed for upcoming sprint</option>
                <option value="URGENT">Urgent - Blocking current work</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Estimated Price ($ USD)"
                type="number"
                placeholder="e.g. 1999"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                helperText="Approximate cost (leave 0 if access request)"
                required
              />

              <Input
                label="Vendor / Store (Optional)"
                placeholder="e.g. Apple Store, Amazon, Figma"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                helperText="Preferred provider if known"
              />
            </div>

            <Textarea
              label="Reason & Business Purpose"
              placeholder="Explain how this equipment or tool supports your role and team goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
              rows={4}
              helperText="Brief justification for your manager to review."
              required
            />

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
              <Link href="/requests">
                <Button variant="outline" type="button" size="sm" className="h-8 text-xs">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" size="sm" className="h-8 text-xs bg-white hover:bg-zinc-200 text-zinc-950 font-medium" isLoading={isLoading}>
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
