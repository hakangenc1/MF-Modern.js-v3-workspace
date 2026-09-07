// Dev orchestrator: boots the 3 remotes one at a time (waiting for each to
// finish its first build before starting the next — parallel Rspack builds can
// panic on this machine), then the shell host.
import { spawn } from "node:child_process";
import http from "node:http";
import { rmSync } from "node:fs";

// Stale Rspack / Modern.js caches trigger a "should mgm exist" panic on restart.
for (const app of ["accounts", "payments", "security", "shell"]) {
  for (const dir of ["node_modules/.cache", "node_modules/.modern-js", "dist"]) {
    rmSync(new URL(`../apps/${app}/${dir}`, import.meta.url), { recursive: true, force: true });
  }
}

const PM = process.env.npm_execpath?.includes("pnpm") ? "pnpm" : "corepack pnpm";

const REMOTES = [
  { name: "accounts", filter: "@bank/accounts", port: 3001, color: "\x1b[36m" },
  { name: "payments", filter: "@bank/payments", port: 3002, color: "\x1b[35m" },
  { name: "security", filter: "@bank/security", port: 3003, color: "\x1b[33m" },
];
const SHELL = { name: "shell", filter: "@bank/shell", port: 3000, color: "\x1b[32m" };
const RESET = "\x1b[0m";
const children = [];

function run({ name, filter, color }) {
  const child = spawn(`${PM} --filter ${filter} dev`, {
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, FORCE_COLOR: "1", NODE_OPTIONS: "--max-old-space-size=4096" },
  });
  const prefix = `${color}[${name}]${RESET} `;
  const pipe = (stream, out) => {
    let buf = "";
    stream.on("data", (d) => {
      buf += d.toString();
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) out.write(prefix + line + "\n");
    });
  };
  pipe(child.stdout, process.stdout);
  pipe(child.stderr, process.stderr);
  child.on("exit", (code) => process.stdout.write(prefix + `exited with code ${code}\n`));
  children.push(child);
}

const ping = (port, path) =>
  new Promise((resolve) => {
    const req = http.get({ host: "127.0.0.1", port, path, timeout: 4000 }, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => (req.destroy(), resolve(false)));
  });

async function waitReady(port, path, timeoutMs = 120_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await ping(port, path)) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

function shutdown() {
  for (const c of children) try { c.kill("SIGTERM"); } catch {}
  setTimeout(() => process.exit(0), 500);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log("Starting remotes (one at a time)…");
for (const r of REMOTES) {
  run(r);
  const ok = await waitReady(r.port, "/static/mf-manifest.json");
  console.log(ok ? `  ✓ ${r.name} ready on :${r.port}` : `  ! ${r.name} not ready (continuing)`);
  await new Promise((res) => setTimeout(res, 2000));
}
console.log("Remotes up. Starting shell → http://localhost:3000");
run(SHELL);
