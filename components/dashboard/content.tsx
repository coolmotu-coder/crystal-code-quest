import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StepStatus = "complete" | "active" | "pending";

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn("h-4 w-4", className)}
    >
      <path d="M3 8L6.5 11.5L13 5" />
    </svg>
  );
}

export function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn("h-4 w-4", className)}
    >
      <rect x="3" y="7" width="10" height="7" rx="1" />
      <path d="M5 7V5C5 3.5 6.5 2.5 8 2.5C9.5 2.5 11 3.5 11 5V7" />
    </svg>
  );
}

export function HexStep({
  status,
  number,
  label,
  description,
  isLast = false,
}: {
  status: StepStatus;
  number: number;
  label: string;
  description?: string;
  isLast?: boolean;
}) {
  const isComplete = status === "complete";
  const isActive = status === "active";

  return (
    <div className="relative flex items-start gap-4">
      {!isLast ? (
        <div
          className={cn(
            "absolute left-5 top-10 h-[calc(100%-2.25rem)] w-px",
            isComplete ? "bg-primary/40" : "bg-white/10",
          )}
          aria-hidden="true"
        />
      ) : null}
      <div
        className={cn(
          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition",
          isComplete
            ? "border-primary bg-primary/15 text-primary shadow-[0_0_12px_rgba(87,241,219,0.25)]"
            : isActive
              ? "border-primary bg-primary text-on-primary shadow-[0_0_16px_rgba(87,241,219,0.45)]"
              : "border-white/10 bg-slate-950/55 text-text-muted",
        )}
        aria-hidden="true"
      >
        {isComplete ? <CheckIcon /> : isActive ? number : <LockIcon />}
        <span className="sr-only">Step {number}</span>
      </div>
      <div className="min-w-0 flex-1 pb-6">
        <p
          className={cn(
            "text-sm font-semibold",
            isActive ? "text-primary" : isComplete ? "text-text-secondary" : "text-text-muted",
          )}
        >
          {label}
        </p>
        {description ? <p className="mt-0.5 text-xs text-text-muted">{description}</p> : null}
      </div>
    </div>
  );
}

export function StatusBadge({
  status,
  label,
}: {
  status: "success" | "active" | "pending" | "mocked" | "rollback" | "neutral";
  label: string;
}) {
  const variants = {
    success: "border-success/20 bg-success/10 text-success shadow-[0_0_16px_rgba(74,222,128,0.10)]",
    active: "border-primary/20 bg-primary/10 text-primary shadow-[0_0_16px_rgba(87,241,219,0.12)]",
    pending: "border-warning/20 bg-warning/10 text-warning shadow-[0_0_16px_rgba(251,191,36,0.10)]",
    mocked: "border-violet/20 bg-violet/10 text-violet shadow-[0_0_16px_rgba(139,92,246,0.12)]",
    rollback: "border-danger/20 bg-danger/10 text-danger shadow-[0_0_16px_rgba(248,113,113,0.10)]",
    neutral: "border-white/10 bg-white/[0.045] text-text-muted",
  };

  const dotColor = {
    success: "bg-success",
    active: "bg-primary",
    pending: "bg-warning",
    mocked: "bg-violet",
    rollback: "bg-danger",
    neutral: "bg-text-muted",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md",
        variants[status],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[status])} aria-hidden="true" />
      {label}
    </span>
  );
}

export function StatCard({
  icon,
  label,
  value,
  empty = false,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  empty?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("glass-panel glass-blur p-4", className)}>
      <div className="text-primary mb-3" aria-hidden="true">
        {icon}
      </div>
      <p className="label-caps text-text-muted">{label}</p>
      <div
        className={cn(
          "mt-1 text-2xl font-bold tracking-tight",
          empty ? "text-text-muted" : "text-text-primary",
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  compact = false,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-col items-center text-center", compact ? "py-6" : "panel py-8")}>
      {icon ? <div className="mb-3 flex justify-center text-text-muted">{icon}</div> : null}
      <p className="text-sm font-medium text-text-primary">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-text-muted">{description}</p>
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
  ariaLabelledBy,
  variant = "default",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  ariaLabelledBy?: string;
  variant?: "default" | "accent" | "adventure";
}) {
  const panelClass = {
    default: "glass-panel glass-blur",
    accent: "glass-panel-accent glass-blur",
    adventure: "glass-panel-adventure glass-blur",
  }[variant];

  return (
    <section
      className={cn(panelClass, "p-5", className)}
      {...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {})}
    >
      <div className="glass-shine" aria-hidden="true" />
      {title || action ? (
        <div className="relative mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h2 id={ariaLabelledBy} className="text-base font-bold text-text-primary">
              {title}
            </h2>
          ) : (
            <div />
          )}
          {action ? <div className="relative">{action}</div> : null}
        </div>
      ) : null}
      <div className="relative">{children}</div>
    </section>
  );
}
