import { Zap } from "lucide-react";
import { requireChild } from "@/lib/auth/guards";
import { listQuestTemplates } from "@/lib/db/queries";
import { selectQuest } from "@/lib/quest/actions";

export const metadata = {
  title: "Choose a quest — Crystal Code Quest",
};

export default async function ChildQuestsPage() {
  await requireChild();
  const templates = listQuestTemplates();

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
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Choose a quest
          </h2>
          <p className="mt-2 max-w-2xl text-text-secondary">
            Pick an idea to turn into a real feature in{" "}
            <span className="font-medium text-violet">The Crystal Adventure</span>.
          </p>
        </section>

        {templates.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <p className="text-text-secondary">
              No quests are available right now. Ask your parent to check your learning stage.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <li key={template.id}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition hover:border-cyan">
                  <div className="bg-violet/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full text-violet">
                    <Zap size={24} aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-text-primary">{template.name}</h3>
                  <p className="mb-6 flex-grow text-sm leading-relaxed text-text-secondary">
                    {template.description}
                  </p>
                  <div className="mb-4 rounded-xl bg-elevated p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                      You will learn
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      How to turn an idea into a clear prompt the AI can understand.
                    </p>
                  </div>
                  <form action={selectQuest}>
                    <input type="hidden" name="templateId" value={template.id} />
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-cyan px-4 py-3 text-sm font-semibold text-black transition hover:bg-mint focus-visible:ring-2 focus-visible:ring-cyan"
                    >
                      Choose this quest
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
