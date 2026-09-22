import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nova Desk — IT Equipment & Access Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          color: "#fafafa",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow effects */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0, 0, 0, 0) 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(0, 0, 0, 0) 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#18181b",
              border: "1px solid #3f3f46",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            N
          </div>
          <span style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px" }}>
            Nova Desk
          </span>
          <div
            style={{
              marginLeft: "12px",
              padding: "4px 12px",
              borderRadius: "9999px",
              background: "rgba(39, 39, 42, 0.8)",
              border: "1px solid #3f3f46",
              fontSize: "14px",
              fontWeight: 600,
              color: "#a1a1aa",
            }}
          >
            Enterprise RBAC
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
          <h1
            style={{
              fontSize: "58px",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              color: "#ffffff",
              margin: 0,
            }}
          >
            IT Equipment & Access Request Platform
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Multi-tier role authorization, real-time approval queues, and immutable audit logging for high-velocity teams.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(24, 24, 27, 0.6)",
              border: "1px solid #27272a",
              padding: "10px 18px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#d4d4d8",
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
            Role-Based Access
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(24, 24, 27, 0.6)",
              border: "1px solid #27272a",
              padding: "10px 18px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#d4d4d8",
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1" }} />
            PostgreSQL Persistence
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(24, 24, 27, 0.6)",
              border: "1px solid #27272a",
              padding: "10px 18px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#d4d4d8",
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }} />
            Immutable Audit Trail
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
