import { PrismaClient } from "@prisma/client";
import { PGlite } from "@electric-sql/pglite";
import { PrismaPGlite } from "pglite-prisma-adapter";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import path from "path";

const globalForDb = globalThis as unknown as {
  prisma?: PrismaClient;
  pglite?: PGlite;
};

function getPrismaClient(): PrismaClient {
  if (globalForDb.prisma) {
    return globalForDb.prisma;
  }

  const dbUrl = process.env.DATABASE_URL?.trim();
  const isExternalPg = dbUrl && dbUrl !== "" && !dbUrl.includes("54320") && !dbUrl.includes("localhost:54320") && !dbUrl.startsWith("file:");

  if (isExternalPg) {
    try {
      const pool = new Pool({ connectionString: dbUrl });
      const adapter = new PrismaPg(pool);
      const client = new PrismaClient({ adapter });
      if (process.env.NODE_ENV !== "production") globalForDb.prisma = client;
      return client;
    } catch (e) {
      console.warn("External PG connection failed, falling back to embedded PG:", e);
    }
  }

  // Zero-friction persistent embedded PostgreSQL
  const dataDir = String(process.env.PG_DATA_DIR || process.env.DATA_DIR || path.resolve(process.cwd(), "prisma/pgdata"));
  const pglite = globalForDb.pglite || new PGlite(dataDir);
  if (process.env.NODE_ENV !== "production") {
    globalForDb.pglite = pglite;
  }

  const adapter = new PrismaPGlite(pglite);
  const client = new PrismaClient({ adapter } as any);
  if (process.env.NODE_ENV !== "production") {
    globalForDb.prisma = client;
  }
  return client;
}

export const db = getPrismaClient();
export const prisma = db;
export default db;
