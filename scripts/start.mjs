// Production orchestrator: runs each app's built custom server.
import { spawn } from "node:child_process";

const APPS = [
  { name: "accounts", dir: "apps/accounts", port: 3001, color: "\x1b[36m" },
  { name: "payments", dir: "apps/payments", port: 3002, color: "\x1b[35m" },
  { name: "security", dir: "apps/security", port: 3003, color: "\x1b[33m" },
  { name: "shell", dir: "apps/shell", port: 3000, color: "\x1b[32m" },
];
const RESET = "\x1b[0m";
const children = [];

for (const app of APPS) {
  const child = spawn("node", ["server.js"], {
    cwd: app.dir,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "production", PORT: String(app.port) },
  });
  const prefix = `${app.color}[${app.name}]${RESET} `;
  child.stdout.on("data", (d) => process.stdout.write(prefix + d));
  child.stderr.on("data", (d) => process.stderr.write(prefix + d));
  children.push(child);
}

const shutdown = () => {
  for (const c of children) {
    try {
      c.kill("SIGTERM");
    } catch {}
  }
  setTimeout(() => process.exit(0), 500);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
