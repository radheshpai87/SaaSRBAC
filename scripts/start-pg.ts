import { PGlite } from "@electric-sql/pglite";
import { fromNodeSocket } from "pg-gateway/node";
import net from "net";
import fs from "fs";
import path from "path";

const PORT = parseInt(process.env.PG_PORT || "54320", 10);
const DATA_DIR = path.resolve(process.cwd(), "prisma/pgdata");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function startServer() {
  const db = new PGlite(DATA_DIR);
  await db.waitReady;

  const server = net.createServer(async (socket) => {
    socket.on("error", () => {
      // ignore client socket disconnects
    });

    try {
      await fromNodeSocket(socket, {
        serverVersion: "16.3 (PGlite-Enterprise-SaaS)",
        auth: {
          strategy: "trust",
        } as any,
        async query(query: string) {
          return await db.query(query);
        },
      } as any);
    } catch {
      // ignore
    }
  });

  server.listen(PORT, "127.0.0.1", () => {
    console.log(`[POSTGRES] Server listening on 127.0.0.1:${PORT}`);
  });

  process.on("SIGINT", async () => {
    console.log("[POSTGRES] Shutting down server...");
    server.close();
    await db.close();
    process.exit(0);
  });
}

startServer().catch((err) => {
  console.error("[ERROR] Failed to start PostgreSQL server:", err);
  process.exit(1);
});
