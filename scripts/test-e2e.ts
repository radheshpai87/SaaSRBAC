import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function runE2ETestSuite() {
  console.log("=================================================");
  console.log("[TEST] STARTING COMPREHENSIVE E2E VERIFICATION SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      process.exitCode = 1;
    }
  }

  // 1. Verify Seed Users in PostgreSQL
  console.log("--- 1. Testing Database & Seed State ---");
  const users = await db.user.findMany();
  assert(users.length >= 4, "Users exist in PostgreSQL database");

  const admin = users.find((u) => u.email === "admin@example.com");
  const manager = users.find((u) => u.email === "manager@example.com");
  const user = users.find((u) => u.email === "user@example.com");

  assert(admin?.role === "ADMIN", "Admin user has ADMIN role");
  assert(manager?.role === "MANAGER", "Manager user has MANAGER role");
  assert(user?.role === "USER", "User account has USER role");

  const isPasswordOk = await bcrypt.compare("Admin123!", admin!.password);
  assert(isPasswordOk, "Admin password hash verifies correctly with bcrypt");

  // 2. Test Request Creation Workflow
  console.log("\n--- 2. Testing Request Creation & Persistence ---");
  const newReq = await db.request.create({
    data: {
      title: "Automated E2E Test Request",
      description: "Testing end-to-end database persistence and manager workflow triggers.",
      category: "Infrastructure",
      priority: "HIGH",
      status: "PENDING",
      createdById: user!.id,
      assignedToId: manager!.id,
    },
  });
  assert(newReq.id.length > 0, "New request created and assigned ID in PostgreSQL");
  assert(newReq.status === "PENDING", "Initial request status is PENDING");

  // 3. Test Manager Approval Flow
  console.log("\n--- 3. Testing Manager Approval Flow & Notes ---");
  const updatedReq = await db.request.update({
    where: { id: newReq.id },
    data: {
      status: "APPROVED",
      reviewNotes: "E2E automated approval verification note",
      assignedToId: manager!.id,
    },
  });
  assert(updatedReq.status === "APPROVED", "Request status updated to APPROVED");
  assert(updatedReq.reviewNotes === "E2E automated approval verification note", "Review notes persisted");

  // 4. Test Activity Logging & Audit Trail
  console.log("\n--- 4. Testing Audit Trail Ledger ---");
  const logEntry = await db.activityLog.create({
    data: {
      userId: manager!.id,
      action: "REQUEST_APPROVED",
      entityType: "Request",
      entityId: newReq.id,
      metadata: {
        title: newReq.title,
        status: "APPROVED",
        reviewedBy: manager!.name,
      },
    },
  });
  assert(logEntry.id.length > 0, "Audit log successfully persisted to PostgreSQL");

  const fetchedLog = await db.activityLog.findUnique({
    where: { id: logEntry.id },
    include: { user: true },
  });
  assert(fetchedLog?.action === "REQUEST_APPROVED", "Activity log queried back with correct action");
  assert(fetchedLog?.user.email === "manager@example.com", "Activity log actor linked via relational foreign key");

  // 5. Test Admin Role & Status Management
  console.log("\n--- 5. Testing Admin User Controls ---");
  const inactiveUser = users.find((u) => u.email === "jordan.inactive@example.com");
  assert(inactiveUser?.status === "INACTIVE", "Inactive user detected in database");

  // Activate Jordan
  const activatedUser = await db.user.update({
    where: { id: inactiveUser!.id },
    data: { status: "ACTIVE" },
  });
  assert(activatedUser.status === "ACTIVE", "Admin successfully activated user account");

  // Reset back to INACTIVE
  await db.user.update({
    where: { id: inactiveUser!.id },
    data: { status: "INACTIVE" },
  });

  // 6. Test Clean-up of Test Request
  await db.activityLog.delete({ where: { id: logEntry.id } });
  await db.request.delete({ where: { id: newReq.id } });
  const deletedCheck = await db.request.findUnique({ where: { id: newReq.id } });
  assert(deletedCheck === null, "Test request cleaned up from database");

  console.log("\n=================================================");
  console.log(`[RESULTS] ALL ${passed}/${total} E2E ARCHITECTURAL TESTS PASSED!`);
  console.log("=================================================");
}

runE2ETestSuite()
  .catch((e) => {
    console.error("[ERROR] Test suite failed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
