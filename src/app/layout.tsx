import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "Nova Desk | IT Equipment & Access Platform",
    template: "%s | Nova Desk",
  },
  description:
    "Enterprise IT hardware, software licensing, and access request platform with role-based approvals and audit compliance.",
  keywords: [
    "SaaS",
    "IT Desk",
    "Equipment Requests",
    "Role-Based Access Control",
    "RBAC",
    "Workflow Approval",
    "Audit Trail",
    "Next.js 15",
    "PostgreSQL",
  ],
  authors: [{ name: "Nova Desk Team" }],
  creator: "Nova Desk",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Nova Desk — IT Equipment & Access Platform",
    description:
      "Modern IT equipment, software licenses, and access requests with 1-click approvals and immutable audit trails.",
    siteName: "Nova Desk",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nova Desk — IT Equipment & Access Platform",
    description:
      "Modern IT equipment, software licenses, and access requests with 1-click approvals and immutable audit trails.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full bg-zinc-950 text-zinc-100 antialiased font-sans selection:bg-zinc-800 selection:text-white">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
