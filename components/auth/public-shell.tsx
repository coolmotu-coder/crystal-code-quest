import Link from "next/link";

export type PublicShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  extraFooter?: React.ReactNode;
};

export function PublicShell({
  title,
  subtitle,
  children,
  backHref,
  backLabel,
  extraFooter,
}: PublicShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            <span className="text-teal">Crystal</span> Code Quest
          </h1>
          {subtitle ? (
            <p className="mt-2 text-base text-text-secondary">{subtitle}</p>
          ) : (
            <p className="mt-2 text-base text-text-secondary">{title}</p>
          )}
        </header>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
          <h2 className="mb-6 text-center text-xl font-medium text-text-primary">{title}</h2>
          {children}
        </div>

        {backHref ? (
          <div className="mt-6 text-center">
            <Link
              href={backHref}
              className="inline-block text-sm text-text-secondary underline decoration-transparent underline-offset-4 transition hover:text-teal hover:decoration-teal focus-visible:rounded"
            >
              {backLabel ?? "Back"}
            </Link>
          </div>
        ) : null}

        {extraFooter ? (
          <div className="mt-4 text-center text-sm text-text-muted">{extraFooter}</div>
        ) : null}
      </div>
    </main>
  );
}
