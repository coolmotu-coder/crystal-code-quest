import Link from "next/link";
import { GuideAvatar } from "./avatar";

export type GuidePanelProps = {
  title?: string;
  message: string;
  action?: {
    href: string;
    label: string;
  };
  variant?: "child" | "parent";
};

export function GuidePanel({
  title = "Guide",
  message,
  action,
  variant = "child",
}: GuidePanelProps) {
  const accentColor = variant === "parent" ? "text-secondary" : "text-teal";
  const borderColor = variant === "parent" ? "border-secondary/30" : "border-teal/30";
  const bgTint = variant === "parent" ? "bg-secondary/5" : "bg-teal/5";

  return (
    <section
      className={`panel-elevated overflow-hidden ${borderColor} ${bgTint}`}
      aria-labelledby="guide-heading"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="bg-surface-container-high flex shrink-0 items-center justify-center p-4 sm:w-28 sm:p-0">
          <div className="h-24 w-24 sm:h-full sm:w-full">
            <GuideAvatar
              alt="Warm human guide illustration"
              className="rounded-lg sm:rounded-none"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center p-5">
          <h3 id="guide-heading" className={`label-caps mb-2 ${accentColor}`}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-text-secondary">{message}</p>
          {action ? (
            <div className="mt-3">
              <Link
                href={action.href}
                className={`inline-flex items-center gap-1 text-sm font-semibold transition hover:underline ${accentColor}`}
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
