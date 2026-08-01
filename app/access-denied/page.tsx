import Link from "next/link";
import { PublicShell } from "@/components/auth/public-shell";

export default function AccessDeniedPage() {
  return (
    <PublicShell title="That area is off-limits" subtitle="Choose where you want to go.">
      <div className="space-y-6 text-center">
        <p className="text-text-secondary">
          Your current account cannot open that page. Parents and Child Builders each have their own
          spaces.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-xl bg-teal px-4 py-3 text-sm font-semibold text-black transition hover:bg-mint focus-visible:ring-2 focus-visible:ring-teal"
          >
            Go to sign-in choice
          </Link>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-elevated px-4 py-3 text-sm font-medium text-text-primary transition hover:border-teal hover:text-teal focus-visible:ring-2 focus-visible:ring-teal"
          >
            Back to welcome page
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
