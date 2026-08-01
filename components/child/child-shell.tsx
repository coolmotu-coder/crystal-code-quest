import Link from "next/link";
import { logout } from "@/lib/auth/actions";

export type ChildShellProps = {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
  backLabel?: string;
};

export function ChildShell({ children, title, backHref, backLabel }: ChildShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div
              className="bg-cyan/10 flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold text-cyan"
              aria-hidden="true"
            >
              B
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Child Builder
              </p>
              <h1 className="text-lg font-semibold text-text-primary">Crystal Code Quest</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {backHref ? (
              <Link
                href={backHref}
                className="rounded-lg border border-border bg-elevated px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-teal hover:text-teal focus-visible:ring-2 focus-visible:ring-teal"
              >
                {backLabel ?? "Back"}
              </Link>
            ) : null}
            <Link
              href="/child"
              className="rounded-lg border border-border bg-elevated px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-teal hover:text-teal focus-visible:ring-2 focus-visible:ring-teal"
            >
              Home
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-border bg-elevated px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-teal hover:text-teal focus-visible:ring-2 focus-visible:ring-teal"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {title ? (
          <section className="mb-8 animate-fade-in">
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              {title}
            </h2>
          </section>
        ) : null}
        {children}
      </main>
    </div>
  );
}
