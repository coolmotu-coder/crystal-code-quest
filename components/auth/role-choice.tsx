import Link from "next/link";

export function RoleChoice() {
  return (
    <nav aria-label="Sign in as">
      <p className="mb-4 text-center text-sm text-text-muted">Who are you signing in as?</p>
      <div className="grid gap-4">
        <Link
          href="/parent/login"
          className="group flex items-center gap-4 rounded-xl border border-border bg-elevated p-5 transition hover:border-teal hover:shadow-glow focus-visible:border-teal"
        >
          <div
            className="bg-teal/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-teal"
            aria-hidden="true"
          >
            P
          </div>
          <div>
            <h3 className="text-lg font-medium text-text-primary group-hover:text-teal">Parent</h3>
            <p className="text-sm text-text-secondary">Review prompts, learning, and settings.</p>
          </div>
        </Link>

        <Link
          href="/child/login"
          className="group flex items-center gap-4 rounded-xl border border-border bg-elevated p-5 transition hover:border-cyan hover:shadow-glow focus-visible:border-cyan"
        >
          <div
            className="bg-cyan/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-cyan"
            aria-hidden="true"
          >
            B
          </div>
          <div>
            <h3 className="text-lg font-medium text-text-primary group-hover:text-cyan">
              Child Builder
            </h3>
            <p className="text-sm text-text-secondary">Start a quest and build something new.</p>
          </div>
        </Link>
      </div>
    </nav>
  );
}
