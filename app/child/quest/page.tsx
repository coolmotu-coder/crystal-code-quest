import Link from "next/link";
import { redirect } from "next/navigation";
import { requireChild } from "@/lib/auth/guards";
import { getLatestQuestSelectionForChild, getQuestTemplateById } from "@/lib/db/queries";

export const metadata = {
  title: "Your quest — Crystal Code Quest",
};

const questSteps = [
  "Choose an idea",
  "Shape the prompt",
  "Review the AI plan",
  "Build the feature",
  "Test the game",
  "Learn what changed",
];

export default async function ChildQuestHomePage() {
  const child = await requireChild();
  const selection = getLatestQuestSelectionForChild(child.profileId);

  if (!selection) {
    redirect("/child/quests");
  }

  const template = getQuestTemplateById(selection.template_id);

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
          <Link
            href="/child"
            className="rounded-lg border border-border bg-elevated px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-teal hover:text-teal focus-visible:ring-2 focus-visible:ring-teal"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            {template?.name ?? "Your quest"}
          </h2>
          <p className="mt-2 max-w-2xl text-text-secondary">
            {template?.description ??
              "Shape your idea into a clear request so the builders know what to make."}
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <h3 className="mb-4 text-lg font-medium text-text-primary">Your request</h3>
              {selection.constructed_prompt ? (
                <div className="rounded-xl border border-border bg-elevated p-4">
                  <p className="font-mono text-sm leading-relaxed text-text-primary">
                    {selection.constructed_prompt}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-text-muted">
                  Your request will appear here once you shape your idea.
                </p>
              )}
              <div className="bg-elevated/50 mt-4 rounded-xl border border-dashed border-border p-4">
                <p className="text-sm text-text-secondary">
                  <span className="font-medium text-teal">Coming next:</span> choose the exact
                  details of your idea, then review what the AI understood before anything is built.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <h3 className="mb-4 text-lg font-medium text-text-primary">Builder journey</h3>
              <ol className="grid gap-3 sm:grid-cols-2">
                {questSteps.map((step, index) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 rounded-xl border border-border bg-elevated p-4"
                  >
                    <span
                      className="bg-teal/10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-teal"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm text-text-secondary">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <h3 className="mb-2 text-lg font-medium text-text-primary">Build status</h3>
              <div className="bg-elevated/50 rounded-xl border border-dashed border-border p-6 text-center">
                <p className="text-sm font-medium text-text-secondary">Build step coming next</p>
                <p className="mt-1 text-xs text-text-muted">
                  The builders are waiting for you to finish shaping the prompt.
                </p>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <h3 className="mb-4 text-lg font-medium text-text-primary">Guide</h3>
              <div className="flex items-start gap-4">
                <div
                  className="bg-teal/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl"
                  aria-hidden="true"
                >
                  👋
                </div>
                <div>
                  <p className="font-medium text-text-primary">Great choice!</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    You picked a quest. Next we will turn it into a clear request. Take your time
                    and remember: we always check what the AI understood before it builds anything.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
