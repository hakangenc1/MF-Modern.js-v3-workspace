import { Outlet } from "@modern-js/runtime/router";
import { UIProviders } from "@bank/ui/components/providers";
import { Toaster } from "@bank/ui/components/ui/sonner";
import "../app.css";

export default function RootLayout() {
  return (
    <UIProviders>
      <div className="mx-auto min-h-svh max-w-6xl p-6 md:p-10">
        <Outlet />
      </div>
      <Toaster position="top-right" richColors closeButton />
    </UIProviders>
  );
}
