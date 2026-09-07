import { Fragment } from "react";
import { Link, Outlet, useLoaderData, useLocation } from "@modern-js/runtime/router";
import { Bell } from "lucide-react";
import { relativeTime } from "@bank/mock";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@bank/ui/components/ui/sidebar";
import { Separator } from "@bank/ui/components/ui/separator";
import { Button } from "@bank/ui/components/ui/button";
import { Badge } from "@bank/ui/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@bank/ui/components/ui/breadcrumb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@bank/ui/components/ui/popover";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import type { AppLayoutData } from "./layout.data";

const LABELS: Record<string, string> = {
  accounts: "Accounts",
  payments: "Payments",
  payees: "Payees",
  activity: "Activity",
  cards: "Cards",
  security: "Security",
  "two-factor": "Two-factor auth",
  devices: "Devices",
  sessions: "Sessions",
};

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "Rent payment scheduled",
    detail: "$3,250.00 to Hayes Valley Properties in 3 days",
    at: -2,
  },
  {
    id: "n2",
    title: "New sign-in from Austin, US",
    detail: "Firefox on Windows • review this device",
    at: -19,
  },
  { id: "n3", title: "Statement ready", detail: "Sapphire Credit Card — August", at: -5 },
];

export default function AppLayout() {
  const { user } = useLoaderData() as AppLayoutData;
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-5" />
          <Breadcrumb className="hidden md:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Overview</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {segments.map((seg, i) => {
                const to = "/" + segments.slice(0, i + 1).join("/");
                const label = LABELS[seg] ?? decodeURIComponent(seg);
                const last = i === segments.length - 1;
                return (
                  <Fragment key={to}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {last ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={to}>{label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-1.5">
            <div className="hidden sm:block">
              <CommandMenu />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" />
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <p className="text-sm font-semibold">Notifications</p>
                  <Badge variant="secondary">{NOTIFICATIONS.length} new</Badge>
                </div>
                <ul className="divide-y">
                  {NOTIFICATIONS.map((n) => (
                    <li key={n.id} className="px-4 py-3">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.detail}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {relativeTime(new Date(Date.now() + n.at * 86_400_000).toISOString())}
                      </p>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            <ThemeToggle />
            <Separator orientation="vertical" className="mx-1 h-5" />
            <UserMenu user={user} />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
