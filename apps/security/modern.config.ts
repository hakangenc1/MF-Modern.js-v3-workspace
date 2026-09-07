import { appTools, defineConfig } from "@modern-js/app-tools";
import { moduleFederationPlugin } from "@module-federation/modern-js-v3";

const PORT = Number(process.env.PORT || 3003);
const ASSET_PREFIX = process.env.SECURITY_ORIGIN ?? `http://localhost:${PORT}`;

export default defineConfig({
  server: {
    port: PORT,
    ssr: { mode: "stream" },
  },
  dev: {
    assetPrefix: ASSET_PREFIX,
  },
  output: {
    assetPrefix: ASSET_PREFIX,
  },
  html: {
    title: "Northwind · Security",
  },
  plugins: [appTools(), moduleFederationPlugin()],
});
