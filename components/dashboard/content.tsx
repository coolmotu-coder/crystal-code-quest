import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StepStatus = "complete" | "active" | "pending";

export function HexStep({
  status,
  number,
  label,
  description,
}: {
  status: StepStatus;
  number: number;
  label: string;
  description?: string;
}) {
  const isComplete = status === "complete";
  const isActive = status === "active";

  return (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition",
          isComplete
            ? "border-primary bg-primary/10 text-primary"
            : isActive
              ? "border-primary bg-primary text-on-primary shadow-[0_0_12px_rgba(87,241,219,0.35)]"
              : "bg-surface-container border-border text-text-muted",
        )}
        aria-hidden="true"
      >
        {isComplete ? (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M3 8L6.5 11.5L13 5" />
          </svg>
        ) : (
          number
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-semibold",
            isActive ? "text-primary" : isComplete ? "text-text-secondary" : "text-text-muted",
          )}
        >
          {label}
        </p>
        {description ? <p className="text-xs text-text-muted">{description}</p> : null}
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
    success: "bg-success/10 text-success border-success/30",
    active: "bg-primary/10 text-primary border-primary/30",
    pending: "bg-warning/10 text-warning border-warning/30",
    mocked: "bg-violet/10 text-violet border-violet/30",
    rollback: "bg-danger/10 text-danger border-danger/30",
    neutral: "bg-elevated text-text-muted border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
        variants[status],
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "success" && "bg-success",
          status === "active" && "bg-primary",
          status === "pending" && "bg-warning",
          status === "mocked" && "bg-violet",
          status === "rollback" && "bg-danger",
          status === "neutral" && "bg-text-muted",
        )}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

export function StatCard({
  icon,
  label,
  value,
  empty = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="panel p-4">
      <div className="text-primary mb-2" aria-hidden="true">
        {icon}
      </div>
      <p className="label-caps text-text-muted">{label}</p>
      <div
        className={cn("mt-1 text-xl font-bold", empty ? "text-text-muted" : "text-text-primary")}
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
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="panel p-6 text-center">
      {icon ? <div className="mb-3 flex justify-center text-text-muted">{icon}</div> : null}
      <p className="text-sm font-medium text-text-primary">{title}</p>
      <p className="mt-1 text-xs text-text-muted">{description}</p>
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
  ariaLabelledBy,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  ariaLabelledBy?: string;
}) {
  return (
    <section
      className={cn("panel p-5", className)}
      {...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {})}
    >
      {title || action ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h2 id={ariaLabelledBy} className="text-base font-bold text-text-primary">
              {title}
            </h2>
          ) : (
            <div />
          )}
          {action ? <div>{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
