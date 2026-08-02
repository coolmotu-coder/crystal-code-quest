import Link from "next/link";
import { GuideAvatar } from "./avatar";

export type GuidePanelProps = {
  title?: string;
  name?: string;
  message: string;
  action?: {
    href: string;
    label: string;
  };
  variant?: "child" | "parent";
};

export function GuidePanel({
  title = "Parent Guide",
  name = "Crystal",
  message,
  action,
  variant = "child",
}: GuidePanelProps) {
  const isParent = variant === "parent";
  const accentColor = isParent ? "text-secondary" : "text-teal";
  const borderColor = isParent ? "border-secondary/25" : "border-teal-300/25";
  const glowColor = isParent
    ? "shadow-[0_0_60px_rgba(96,165,250,0.12)]"
    : "shadow-[0_0_60px_rgba(34,211,238,0.14)]";

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border ${borderColor} to-cyan-950/20 bg-gradient-to-br from-slate-900/70 via-slate-950/60 ${glowColor} ring-1 ring-inset ring-white/[0.03] backdrop-blur-xl`}
      aria-labelledby="guide-heading"
    >
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
      <div
        className="via-teal-300/10 absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent to-transparent"
        aria-hidden="true"
      />
      <div className="flex flex-col sm:flex-row">
        <div className="relative flex shrink-0 items-center justify-center bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:w-32 sm:p-0">
          <div className="relative h-28 w-28 sm:h-full sm:w-full">
            <div
              className="from-teal-300/10 absolute inset-0 rounded-lg bg-gradient-to-br to-transparent"
              aria-hidden="true"
            />
            <GuideAvatar
              alt="Warm human guide illustration"
              className="relative h-full w-full rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center p-5 sm:py-5">
          <div className="mb-2 flex items-center gap-2">
            <h3 id="guide-heading" className={`label-caps ${accentColor}`}>
              {title}
            </h3>
            <span className="text-xs font-semibold text-text-muted">— {name}</span>
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">{message}</p>
          {action ? (
            <div className="mt-3">
              <Link
                href={action.href}
                className={`inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold transition hover:underline focus-visible:ring-2 focus-visible:ring-teal ${accentColor}`}
              >
                {action.label}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
