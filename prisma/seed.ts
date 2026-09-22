import { PrismaClient, RoleType, UserStatus, RequestStatus, RequestPriority } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/saas_rbac";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("[SEED] Starting corporate database seeding...");

  await prisma.activityLog.deleteMany({});
  await prisma.request.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  console.log("[SEED] Creating System Roles...");
  await prisma.role.createMany({
    data: [
      {
        name: "ADMIN",
        description: "Global system governance, identity lifecycle, role provisioning, and audit oversight",
        permissions: ["users:read", "users:write", "requests:read_all", "requests:write", "logs:read", "system:manage"],
      },
      {
        name: "MANAGER",
        description: "Department operational review, resource allocation, and workflow authorization",
        permissions: ["requests:read_assigned", "requests:approve", "requests:reject", "requests:create", "logs:read_team"],
      },
      {
        name: "USER",
        description: "Standard corporate employee, request submission, and department tracking",
        permissions: ["requests:create", "requests:read_own"],
      },
    ],
  });

  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const managerPassword = await bcrypt.hash("Manager123!", 10);
  const userPassword = await bcrypt.hash("User123!", 10);

  console.log("[SEED] Creating Enterprise Users...");
  const adminUser = await prisma.user.create({
    data: {
      name: "Sarah Chen",
      email: "sarah.chen@acrois.com",
      password: adminPassword,
      role: RoleType.ADMIN,
      status: UserStatus.ACTIVE,
      department: "Information Security & Infrastructure",
      jobTitle: "Principal Systems Architect",
    },
  });

  await prisma.user.create({
    data: {
      name: "Sarah Chen (Admin)",
      email: "admin@example.com",
      password: adminPassword,
      role: RoleType.ADMIN,
      status: UserStatus.ACTIVE,
      department: "Information Security & Infrastructure",
      jobTitle: "Principal Systems Architect",
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      name: "David Reynolds",
      email: "david.reynolds@acrois.com",
      password: managerPassword,
      role: RoleType.MANAGER,
      status: UserStatus.ACTIVE,
      department: "Cloud Operations & SRE",
      jobTitle: "Director of Engineering Operations",
    },
  });

  await prisma.user.create({
    data: {
      name: "David Reynolds (Manager)",
      email: "manager@example.com",
      password: managerPassword,
      role: RoleType.MANAGER,
      status: UserStatus.ACTIVE,
      department: "Cloud Operations & SRE",
      jobTitle: "Director of Engineering Operations",
    },
  });

  const standardUser = await prisma.user.create({
    data: {
      name: "Elena Rostova",
      email: "elena.rostova@acrois.com",
      password: userPassword,
      role: RoleType.USER,
      status: UserStatus.ACTIVE,
      department: "Cloud Operations & SRE",
      jobTitle: "Senior Platform Engineer",
    },
  });

  await prisma.user.create({
    data: {
      name: "Elena Rostova (Staff)",
      email: "user@example.com",
      password: userPassword,
      role: RoleType.USER,
      status: UserStatus.ACTIVE,
      department: "Cloud Operations & SRE",
      jobTitle: "Senior Platform Engineer",
    },
  });

  await prisma.user.create({
    data: {
      name: "Marcus Vance",
      email: "marcus.vance@acrois.com",
      password: userPassword,
      role: RoleType.USER,
      status: UserStatus.INACTIVE,
      department: "Contractor Services",
      jobTitle: "External Consultant",
    },
  });

  await prisma.user.create({
    data: {
      name: "Jordan Inactive",
      email: "jordan.inactive@example.com",
      password: userPassword,
      role: RoleType.USER,
      status: UserStatus.INACTIVE,
      department: "Contractor Services",
      jobTitle: "External Consultant",
    },
  });

  console.log("[SEED] Creating Production Requests...");
  const req1 = await prisma.request.create({
    data: {
      title: "AWS Aurora PostgreSQL Multi-AZ Cluster Scaling & Read Replicas",
      description: "Scaling database IOPS and provisioning two r6g.4xlarge read replicas in us-east-1 and us-west-2 to handle projected 4.5x transaction volume increase for upcoming enterprise tenant migration.",
      category: "Cloud Infrastructure",
      priority: RequestPriority.HIGH,
      status: RequestStatus.PENDING,
      estimatedCost: 4800.0,
      costCenter: "CC-INFRA-802",
      createdById: standardUser.id,
      assignedToId: managerUser.id,
    },
  });

  const req2 = await prisma.request.create({
    data: {
      title: "Datadog Enterprise APM & Distributed Tracing Ingestion License Expansion",
      description: "Procuring additional 150 host APM licenses and 10TB/month distributed trace ingestion capacity for microservice observability across production Kubernetes clusters.",
      category: "Software & Tools",
      priority: RequestPriority.MEDIUM,
      status: RequestStatus.APPROVED,
      estimatedCost: 12500.0,
      costCenter: "CC-OPS-410",
      reviewNotes: "Authorized under Q3 observability budget allocation. Purchase Order PO-88219 dispatched to vendor billing.",
      createdById: standardUser.id,
      assignedToId: managerUser.id,
    },
  });

  const req3 = await prisma.request.create({
    data: {
      title: "Production GPU Node Pool Allocation for Generative Model Inference (NVIDIA H100 Fleet)",
      description: "Provisioning dedicated 8x NVIDIA H100 GPU compute cluster on CoreWeave private cloud for fine-tuned LLM inference pipeline with <50ms P99 latency SLA requirements.",
      category: "Hardware & Compute",
      priority: RequestPriority.URGENT,
      status: RequestStatus.APPROVED,
      estimatedCost: 28000.0,
      costCenter: "CC-AI-900",
      reviewNotes: "Expedited executive authorization granted. Direct interconnect established via AWS DirectConnect 10Gbps line.",
      createdById: standardUser.id,
      assignedToId: managerUser.id,
    },
  });

  const req4 = await prisma.request.create({
    data: {
      title: "Public S3 Bucket Storage Policy Override for Legacy Asset Migration",
      description: "Requesting temporary bypass of strict corporate S3 Block Public Access security policy to allow unsecured third-party file transfer without mutual TLS.",
      category: "Information Security",
      priority: RequestPriority.HIGH,
      status: RequestStatus.REJECTED,
      estimatedCost: 0.0,
      costCenter: "CC-SEC-100",
      reviewNotes: "Rejected by SecOps: Violates corporate SOC2 Type II and ISO 27001 data isolation policies. Must utilize encrypted SFTP partner portal or presigned AWS KMS URL mechanism.",
      createdById: standardUser.id,
      assignedToId: managerUser.id,
    },
  });

  const req5 = await prisma.request.create({
    data: {
      title: "Apple Silicon M3 Max Workstation Refresh for Core Infrastructure Team",
      description: "Procuring 6x Apple MacBook Pro 16\" (M3 Max, 64GB Unified Memory, 2TB SSD) for core SRE engineers compiling local emulation environments and kernel modules.",
      category: "Hardware & Compute",
      priority: RequestPriority.MEDIUM,
      status: RequestStatus.PENDING,
      estimatedCost: 21600.0,
      costCenter: "CC-IT-304",
      createdById: standardUser.id,
      assignedToId: managerUser.id,
    },
  });

  console.log("[SEED] Generating Corporate Audit Activity Logs...");
  await prisma.activityLog.createMany({
    data: [
      {
        userId: adminUser.id,
        action: "IDENTITY_PROVISIONED",
        entityType: "User",
        entityId: managerUser.id,
        metadata: { role: "MANAGER", email: managerUser.email },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
      },
      {
        userId: adminUser.id,
        action: "IDENTITY_PROVISIONED",
        entityType: "User",
        entityId: standardUser.id,
        metadata: { role: "USER", email: standardUser.email },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      },
      {
        userId: standardUser.id,
        action: "REQUEST_SUBMITTED",
        entityType: "Request",
        entityId: req3.id,
        metadata: { title: req3.title, cost: 28000, costCenter: "CC-AI-900" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      },
      {
        userId: managerUser.id,
        action: "REQUEST_APPROVED",
        entityType: "Request",
        entityId: req3.id,
        metadata: { title: req3.title, notes: "Expedited executive authorization granted." },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
      },
      {
        userId: standardUser.id,
        action: "REQUEST_SUBMITTED",
        entityType: "Request",
        entityId: req2.id,
        metadata: { title: req2.title, cost: 12500, costCenter: "CC-OPS-410" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      },
      {
        userId: managerUser.id,
        action: "REQUEST_APPROVED",
        entityType: "Request",
        entityId: req2.id,
        metadata: { title: req2.title, notes: "Authorized under Q3 observability budget." },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      },
      {
        userId: standardUser.id,
        action: "REQUEST_SUBMITTED",
        entityType: "Request",
        entityId: req4.id,
        metadata: { title: req4.title, priority: "HIGH" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
      },
      {
        userId: managerUser.id,
        action: "REQUEST_REJECTED",
        entityType: "Request",
        entityId: req4.id,
        metadata: { title: req4.title, reason: "SOC2 compliance policy violation" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      },
      {
        userId: standardUser.id,
        action: "REQUEST_SUBMITTED",
        entityType: "Request",
        entityId: req1.id,
        metadata: { title: req1.title, cost: 4800 },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      },
      {
        userId: standardUser.id,
        action: "REQUEST_SUBMITTED",
        entityType: "Request",
        entityId: req5.id,
        metadata: { title: req5.title, cost: 21600 },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
      },
    ],
  });

  console.log("[SEED] Enterprise database seeded successfully.");
}

main()
  .catch((e) => {
    console.error("[ERROR] Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
