// Production orchestrator: `modern serve` for each built app.
import { spawn } from "node:child_process";
import net from "node:net";

const REMOTES = [
  { name: "accounts", filter: "@bank/accounts", port: 3001, color: "\x1b[36m" },
  { name: "payments", filter: "@bank/payments", port: 3002, color: "\x1b[35m" },
  { name: "security", filter: "@bank/security", port: 3003, color: "\x1b[33m" },
];
const SHELL = { name: "shell", filter: "@bank/shell", port: 3000, color: "\x1b[32m" };
const RESET = "\x1b[0m";
const PM = "corepack pnpm";
const children = [];

function run({ name, filter, port, color }) {
  const child = spawn(`${PM} --filter ${filter} exec modern serve`, {
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "production", PORT: String(port), FORCE_COLOR: "1" },
  });
  const prefix = `${color}[${name}]${RESET} `;
  child.stdout.on("data", (d) => process.stdout.write(prefix + d));
  child.stderr.on("data", (d) => process.stderr.write(prefix + d));
  children.push(child);
}

const waitForPort = (port, timeout = 60_000) =>
  new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      const s = net.connect(port, "127.0.0.1");
      s.on("connect", () => (s.destroy(), resolve()));
      s.on("error", () => {
        s.destroy();
        Date.now() - start > timeout ? reject(new Error(`port ${port}`)) : setTimeout(tick, 500);
      });
    };
    tick();
  });

const shutdown = () => {
  for (const c of children) try { c.kill("SIGTERM"); } catch {}
  setTimeout(() => process.exit(0), 500);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log("Starting remotes…");
REMOTES.forEach(run);
try {
  await Promise.all(REMOTES.map((r) => waitForPort(r.port)));
  console.log("Remotes up. Starting shell → http://localhost:3000");
} catch (e) {
  console.warn("Warning:", e.message);
}
run(SHELL);
