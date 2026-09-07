import { appTools, defineConfig } from "@modern-js/app-tools";
import { moduleFederationPlugin } from "@module-federation/modern-js-v3";

const PORT = Number(process.env.PORT || 3000);

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  server: {
    port: PORT,
    ssr: {
      mode: "stream",
    },
  },
  html: {
    title: "Northwind Bank",
    tags: [
      { tag: "meta", attrs: { name: "viewport", content: "width=device-width, initial-scale=1" } },
      { tag: "meta", attrs: { name: "color-scheme", content: "light dark" } },
      { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" } },
      {
        tag: "link",
        attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
      },
      {
        tag: "link",
        attrs: {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
        },
      },
    ],
  },
  plugins: [appTools(), moduleFederationPlugin()],
});
