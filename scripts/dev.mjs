// Dev orchestrator: boots the 3 remotes, waits for their ports, then the shell host.
import { spawn } from "node:child_process";
import net from "node:net";

const PM = process.env.npm_execpath?.includes("pnpm") ? "pnpm" : "corepack pnpm";

/** @type {{name:string,filter:string,port:number,color:string}[]} */
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
    env: { ...process.env, FORCE_COLOR: "1" },
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
  child.on("exit", (code) => {
    process.stdout.write(prefix + `exited with code ${code}\n`);
  });
  children.push(child);
  return child;
}

function waitForPort(port, timeoutMs = 90_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const sock = net.connect(port, "127.0.0.1");
      sock.on("connect", () => {
        sock.destroy();
        resolve();
      });
      sock.on("error", () => {
        sock.destroy();
        if (Date.now() - start > timeoutMs) reject(new Error(`port ${port} timeout`));
        else setTimeout(tryOnce, 500);
      });
    };
    tryOnce();
  });
}

function shutdown() {
  for (const c of children) {
    try {
      c.kill("SIGTERM");
    } catch {}
  }
  setTimeout(() => process.exit(0), 500);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log("Starting remotes…");
for (const r of REMOTES) run(r);
try {
  await Promise.all(REMOTES.map((r) => waitForPort(r.port)));
  console.log("Remotes are up. Starting shell host on http://localhost:3000 …");
} catch (err) {
  console.warn("Warning: not all remotes came up in time —", err.message);
}
run(SHELL);
