import { cn } from "@bank/ui/lib/utils";
import { formatCurrency } from "@bank/mock";

/** Signed, tabular currency with semantic color. */
export function Money({
  cents,
  className,
  showSign = false,
  colorize = false,
  compact = false,
}: {
  cents: number;
  className?: string;
  showSign?: boolean;
  colorize?: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "tabular-nums",
        colorize && cents > 0 && "text-[color:var(--pos)]",
        colorize && cents < 0 && "text-[color:var(--neg)]",
        className,
      )}
    >
      {formatCurrency(cents, { sign: showSign, compact })}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
      {children}
    </h2>
  );
}
