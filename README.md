# Northwind Bank — SSR Micro‑Frontend Banking App

A production‑style enterprise banking UI built as a **micro‑frontend architecture on
Module Federation 2.0** with **server‑side rendering and streaming**. Mock data only.

- **Host shell** owns routing, the login + 2FA gate, the app chrome, and composes the
  remotes.
- **3 domain remotes** (`accounts`, `payments`, `security`) are independently built and
  served, expose their UI + a framework‑agnostic data layer over Module Federation, and
  are server‑rendered **inside the shell's HTML stream**.
- **Streaming SSR**: slow data is returned from loaders as unresolved promises and
  rendered through `<Suspense>` / `<Await>` with shadcn skeleton fallbacks, so the shell
  HTML flushes first and charts / tables / activity stream in.

## Stack

| Concern | Choice |
|---|---|
| Framework | **Modern.js 3.5** (`@modern-js/app-tools`, Rspack, React‑Router‑7 file routing) — *not Next.js*, the Module Federation team's own framework |
| Federation | **`@module-federation/modern-js-v3` 2.8.2** (MF 2.0 runtime + `@module-federation/node` for SSR), `server.ssr.mode: "stream"` |
| UI | **React 18.3** + **shadcn/ui** (new‑york, unmodified) + **Tailwind v4** tokens |
| Charts | Recharts via shadcn `chart`, palette validated with the `dataviz` skill |
| Data | `@bank/mock` — deterministic seeded banking data, HMAC‑cookie session, artificial latency to make streaming visible |

> The originally‑planned React‑Router‑v8 *framework mode* (`rsbuild-plugin-react-router`) +
> Module Federation SSR does **not** work in current releases (the plugin's own docs point
> to Modern.js for MFE); this project pivoted accordingly.

## Layout

```
packages/
  mock/   @bank/mock   framework-agnostic data + types + session
  ui/     @bank/ui      shadcn components + Tailwind tokens + patterns/ (Money, PageHeader, charts, skeletons)
apps/
  shell/     :3000  routing, /login + /login/verify (2FA), chrome, /, /cards; composes remotes
  accounts/  :3001  exposes AccountsView, AccountDetailView, dashboard widgets, data
  payments/  :3002  exposes TransferView, PayeesView, ActivityView, QuickTransferCard, data
  security/  :3003  exposes SecurityView, TwoFactorView, Devices/SessionsView, TwoFactorChallenge, data
```

Each remote also runs standalone on its own port (its own `src/routes/`) for isolated
development.

### How federation is wired

- MF `shared`: **only `react` + `react-dom`** as singletons. The shell owns **all routing,
  data loading and `<Suspense>`/`<Await>` streaming**; it imports plain async functions
  from `<remote>/data` in its `page.data.ts` loaders and renders the remote's
  **router‑free presentational components** with the resolved data.
- Remote components use `<a href>` / GET `<form>` (never router hooks) so they render
  identically standalone or federated inside the shell's SSR stream.

## Run

```bash
corepack pnpm install
corepack pnpm dev          # scripts/dev.mjs: builds remotes one‑by‑one, then the shell
```

Open **http://localhost:3000** → any email + password → 2FA code **`123456`** → dashboard.

- `corepack pnpm typecheck` — per‑package `tsc`
- `corepack pnpm build` — production build of every app (`--workspace-concurrency=1`)

## Pages

| Route | Served by | Notes |
|---|---|---|
| `/login`, `/login/verify` | shell + `security/TwoFactorChallenge` | password → 2FA (`input-otp`) |
| `/` | shell + `accounts/widgets` + `payments/QuickTransferCard` + `security/SecurityStatusCard` | net worth, **streamed** cash‑flow + spending charts + recent activity |
| `/accounts`, `/accounts/:id` | `accounts` remote | grouped accounts, account detail with **streamed** filtered/paginated transactions |
| `/payments`, `/payments/payees`, `/payments/activity` | `payments` remote | transfer review + confirm, payees, scheduled/past transfers |
| `/cards` | shell | card visuals, freeze toggle, monthly limit |
| `/security`, `/security/two-factor`, `/security/devices`, `/security/sessions` | `security` remote | security score, 2FA + recovery codes, device/session revoke |

## Known limitations

- **Production serving** (`modern serve`) doesn't expose the SSR remote‑entry at
  `/bundles/static/remoteEntry.js`, so cross‑app SSR federation currently works in **dev**
  (`pnpm dev`) but not in a plain `modern serve` prod deploy. The fix is a small static
  middleware that serves `apps/<remote>/dist/bundles/static/` — `@module-federation/modern-js-v3`
  ships a `staticServePlugin` for this but it panics at build time in `2.8.2` on this
  Modern.js version.
- Modern.js 3.5's client data layer doesn't follow redirects returned from route
  **actions** (only loaders), so the auth actions return `{ next }` + a `Set-Cookie` and
  the component navigates.
- Parallel Rspack builds can panic (`should mgm exist`) on a cold/stale cache — `dev.mjs`
  clears the caches on start and boots the remotes serially.
