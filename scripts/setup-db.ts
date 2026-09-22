import { PGlite } from "@electric-sql/pglite";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DATA_DIR = path.resolve(process.cwd(), "prisma/pgdata");
const MIGRATION_FILE = path.resolve(process.cwd(), "prisma/migrations/0_init/migration.sql");

async function setup() {
  console.log("[DB] Initializing PostgreSQL database storage engine at:", DATA_DIR);
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const db = new PGlite(DATA_DIR);
  await db.waitReady;
  console.log("[DB] PostgreSQL engine ready.");

  console.log("[DB] Applying database schema...");
  const sql = fs.readFileSync(MIGRATION_FILE, "utf-8");
  await db.exec(sql);
  console.log("[DB] Database schema verified.");

  console.log("[DB] Populating Nova IT Desk records...");
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const managerPassword = await bcrypt.hash("Manager123!", 10);
  const userPassword = await bcrypt.hash("User123!", 10);

  // Clear existing
  await db.exec(`
    DELETE FROM "ActivityLog";
    DELETE FROM "Request";
    DELETE FROM "User";
    DELETE FROM "Role";
  `);

  // Insert Roles
  await db.query(`
    INSERT INTO "Role" ("id", "name", "description", "permissions") VALUES
    ('role_admin', 'ADMIN', 'IT Operations Administrator with full device inventory, user provisioning, and audit access', '["users:read", "users:write", "requests:read_all", "requests:write", "logs:read", "system:manage"]'),
    ('role_manager', 'MANAGER', 'Team Lead / Engineering Manager with team request approval & budget sign-off permissions', '["requests:read_assigned", "requests:approve", "requests:reject", "requests:create", "logs:read_team"]'),
    ('role_user', 'USER', 'Team member with access to request hardware, software licenses, and cloud access', '["requests:create", "requests:read_own"]')
    ON CONFLICT ("name") DO NOTHING;
  `);

  // Insert Users
  await db.query(`
    INSERT INTO "User" ("id", "name", "email", "password", "role", "status", "department", "jobTitle", "spendingLimit", "createdAt", "updatedAt") VALUES
    ('usr_admin', 'Marcus Vance', 'marcus.vance@novadesk.internal', '${adminPassword}', 'ADMIN', 'ACTIVE', 'IT & Operations', 'IT Operations Director', 50000.0, NOW(), NOW()),
    ('usr_admin_alias', 'Marcus Vance (Admin)', 'admin@example.com', '${adminPassword}', 'ADMIN', 'ACTIVE', 'IT & Operations', 'IT Operations Director', 50000.0, NOW(), NOW()),
    ('usr_manager', 'Sarah Jenkins', 'sarah.jenkins@novadesk.internal', '${managerPassword}', 'MANAGER', 'ACTIVE', 'Engineering & Product', 'Engineering Team Lead', 15000.0, NOW(), NOW()),
    ('usr_manager_alias', 'Sarah Jenkins (Manager)', 'manager@example.com', '${managerPassword}', 'MANAGER', 'ACTIVE', 'Engineering & Product', 'Engineering Team Lead', 15000.0, NOW(), NOW()),
    ('usr_user', 'Alex Chen', 'alex.chen@novadesk.internal', '${userPassword}', 'USER', 'ACTIVE', 'Design & Engineering', 'Senior Product Designer', 3000.0, NOW(), NOW()),
    ('usr_user_alias', 'Alex Chen (Staff)', 'user@example.com', '${userPassword}', 'USER', 'ACTIVE', 'Design & Engineering', 'Senior Product Designer', 3000.0, NOW(), NOW()),
    ('usr_inactive', 'James Wilson', 'james.wilson@novadesk.internal', '${userPassword}', 'USER', 'INACTIVE', 'Contractor Services', 'External Consultant', 0.0, NOW(), NOW()),
    ('usr_inactive_alias', 'Jordan Inactive', 'jordan.inactive@example.com', '${userPassword}', 'USER', 'INACTIVE', 'Contractor Services', 'External Consultant', 0.0, NOW(), NOW())
    ON CONFLICT ("email") DO NOTHING;
  `);

  // Insert IT Requests
  await db.query(`
    INSERT INTO "Request" ("id", "title", "description", "category", "priority", "status", "estimatedCost", "costCenter", "vendorName", "paybackMonths", "reviewNotes", "fiscalResolution", "createdById", "assignedToId", "createdAt", "updatedAt") VALUES
    ('req_1', 'Apple MacBook Pro 16" (M3 Max, 36GB Unified Memory, 1TB SSD)', 'Primary development and design machine refresh. Upgrading from 2020 Intel MacBook Pro for faster local build times and Figma rendering.', 'Hardware', 'HIGH', 'PENDING', 3499.00, 'IT-ENG-204', 'Apple Store for Business', 24, NULL, NULL, 'usr_user', 'usr_manager', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
    ('req_2', 'Figma Enterprise & FigJam Team License (Annual Subscription)', 'Seat license for the product design team to collaborate with engineering on high-fidelity prototypes and user flows.', 'Software & SaaS', 'MEDIUM', 'APPROVED', 540.00, 'IT-DES-101', 'Figma Inc.', 12, 'Approved. Charged to Q3 Product Design tooling budget.', 'APV-2026-DES-102', 'usr_user', 'usr_manager', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
    ('req_3', 'Dell UltraSharp 32" 4K USB-C Hub Monitor (U3223QE)', 'External 4K color-accurate monitor for desk setup in the SF engineering hub.', 'Accessories', 'LOW', 'APPROVED', 799.00, 'IT-ENG-204', 'Dell Direct', 36, 'Approved. Equipment scheduled for office delivery.', 'APV-2026-HW-882', 'usr_user', 'usr_manager', NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),
    ('req_4', 'GitHub Enterprise Copilot & Advanced Security Tier', 'AI developer pairing assistant license and code scanning tool for automated pull request reviews.', 'Software & SaaS', 'HIGH', 'APPROVED', 1200.00, 'IT-ENG-204', 'GitHub Inc.', 12, 'Approved for engineering team roll-out.', 'APV-2026-ENG-491', 'usr_user', 'usr_manager', NOW() - INTERVAL '6 days', NOW() - INTERVAL '4 days'),
    ('req_5', 'AWS Staging VPC Access & CloudWatch Observability Credentials', 'IAM developer role and read-only staging credentials for diagnosing latency anomalies in the payment service.', 'Cloud Access', 'URGENT', 'PENDING', 0.00, 'IT-SEC-001', 'AWS Identity Center', 12, NULL, NULL, 'usr_user', 'usr_manager', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour')
    ON CONFLICT ("id") DO NOTHING;
  `);

  // Insert Activity Logs
  await db.query(`
    INSERT INTO "ActivityLog" ("id", "userId", "action", "entityType", "entityId", "metadata", "createdAt") VALUES
    ('act_1', 'usr_admin', 'USER_PROVISIONED', 'User', 'usr_manager', '{"email": "sarah.jenkins@novadesk.internal", "role": "MANAGER"}', NOW() - INTERVAL '7 days'),
    ('act_2', 'usr_admin', 'USER_PROVISIONED', 'User', 'usr_user', '{"email": "alex.chen@novadesk.internal", "role": "USER"}', NOW() - INTERVAL '6 days'),
    ('act_3', 'usr_user', 'REQUEST_CREATED', 'Request', 'req_4', '{"title": "GitHub Enterprise Copilot Seats", "cost": 1200}', NOW() - INTERVAL '6 days'),
    ('act_4', 'usr_manager', 'REQUEST_APPROVED', 'Request', 'req_4', '{"title": "GitHub Enterprise Copilot Seats", "approver": "Sarah Jenkins"}', NOW() - INTERVAL '4 days'),
    ('act_5', 'usr_user', 'REQUEST_CREATED', 'Request', 'req_3', '{"title": "Dell UltraSharp 32\\" 4K Monitor", "cost": 799}', NOW() - INTERVAL '5 days'),
    ('act_6', 'usr_manager', 'REQUEST_APPROVED', 'Request', 'req_3', '{"title": "Dell UltraSharp 32\\" 4K Monitor", "approver": "Sarah Jenkins"}', NOW() - INTERVAL '3 days'),
    ('act_7', 'usr_user', 'REQUEST_CREATED', 'Request', 'req_2', '{"title": "Figma Enterprise License", "cost": 540}', NOW() - INTERVAL '2 days'),
    ('act_8', 'usr_manager', 'REQUEST_APPROVED', 'Request', 'req_2', '{"title": "Figma Enterprise License", "approver": "Sarah Jenkins"}', NOW() - INTERVAL '1 day'),
    ('act_9', 'usr_user', 'REQUEST_CREATED', 'Request', 'req_1', '{"title": "Apple MacBook Pro 16\\"", "cost": 3499}', NOW() - INTERVAL '3 hours'),
    ('act_10', 'usr_user', 'REQUEST_CREATED', 'Request', 'req_5', '{"title": "AWS Staging VPC Access", "priority": "URGENT"}', NOW() - INTERVAL '1 hour');
  `);

  console.log("[DB] Nova IT Desk database initialized and populated successfully.");
  await db.close();
}

setup().catch((err) => {
  console.error("[ERROR] Setup error:", err);
  process.exit(1);
});
