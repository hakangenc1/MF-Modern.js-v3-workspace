import { Outlet } from "@modern-js/runtime/router";
import { UIProviders } from "@bank/ui/components/providers";
import { Toaster } from "@bank/ui/components/ui/sonner";
import "../app.css";

export default function RootLayout() {
  return (
    <UIProviders>
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
    </UIProviders>
  );
}
