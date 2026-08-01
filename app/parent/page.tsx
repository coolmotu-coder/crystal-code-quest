import { requireParent } from "@/lib/auth/guards";
import { createChild, logout } from "@/lib/auth/actions";
import { listChildrenForParent } from "@/lib/db/queries";
import { CreateChildForm } from "@/components/parent/create-child-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Parent — Crystal Code Quest",
};

export default async function ParentOverviewPage() {
  const parent = await requireParent();
  const children = listChildrenForParent(parent.userId);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div
              className="bg-teal/10 flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold text-teal"
              aria-hidden="true"
            >
              P
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Parent account
              </p>
              <h1 className="text-lg font-semibold text-text-primary">Crystal Code Quest</h1>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-border bg-elevated px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-teal hover:text-teal focus-visible:ring-2 focus-visible:ring-teal"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Welcome, <span className="text-teal">{parent.displayName}</span>
          </h2>
          <p className="mt-2 max-w-2xl text-text-secondary">
            This is your supervisory view. Create a Child Builder account, then help your child sign
            in at <span className="font-medium text-cyan">/child/login</span>.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <h3 className="mb-4 text-lg font-medium text-text-primary">
                Create a Child Builder account
              </h3>
              <CreateChildForm createChild={createChild} />
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <h3 className="mb-3 text-lg font-medium text-text-primary">Child Builder accounts</h3>
              {children.length === 0 ? (
                <p className="text-sm text-text-muted">No Child Builder accounts yet.</p>
              ) : (
                <ul className="space-y-3">
                  {children.map((child) => (
                    <li
                      key={child.userId}
                      className="flex items-center justify-between rounded-xl border border-border bg-elevated px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-text-primary">{child.displayName}</p>
                        <p className="text-xs text-text-muted">{child.username}</p>
                      </div>
                      <span className="bg-cyan/10 rounded-full px-2 py-1 text-xs font-medium text-cyan">
                        Builder
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
