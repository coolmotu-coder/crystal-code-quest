import { redirect } from "next/navigation";
import { z } from "zod";
import { requireChild } from "@/lib/auth/guards";
import { getQuestSelectionById } from "@/lib/db/queries";
import { ChildShell } from "@/components/child/child-shell";
import { savePromptAndContinue } from "@/lib/quest/actions";
import { parsePromptSelections } from "@/lib/quest/prompt";

const paramsSchema = z.object({ id: z.string().uuid() });

export const metadata = {
  title: "Review your prompt — Crystal Code Quest",
};

export default async function QuestPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const child = await requireChild();
  const parsedParams = paramsSchema.safeParse(await params);
  if (!parsedParams.success) {
    redirect("/child/quests");
  }
  const { id } = parsedParams.data;
  const selection = getQuestSelectionById(id);

  if (!selection || selection.child_profile_id !== child.profileId) {
    redirect("/child/quests");
  }

  const selections = parsePromptSelections(JSON.parse(selection.selections));
  const constructed = selection.constructed_prompt;

  const breakdown = [
    { label: "Who", value: selections.character },
    { label: "What", value: selections.power },
    {
      label: "When",
      value: `${selections.trigger} ${selections.difficulty.toLowerCase()} ${selections.subject.toLowerCase()}`,
    },
    { label: "How long", value: selections.usage },
    { label: "Expected result", value: `${selections.character} can clear a higher obstacle` },
  ];

  return (
    <ChildShell
      title="Your request"
      backHref={`/child/quests/${selection.id}`}
      backLabel="Change my idea"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-medium text-text-primary">Constructed prompt</h3>
            <div className="rounded-xl border border-border bg-elevated p-4">
              <p className="font-mono text-sm leading-relaxed text-text-primary">{constructed}</p>
            </div>
            <p className="mt-3 text-sm text-text-secondary">
              This is exactly what the AI will read. Read it out loud. Does it say what you mean?
            </p>

            <form action={savePromptAndContinue} className="mt-6">
              <input type="hidden" name="selectionId" value={selection.id} />
              <button
                type="submit"
                className="w-full rounded-xl bg-cyan px-4 py-3 text-sm font-semibold text-black transition hover:bg-mint focus-visible:ring-2 focus-visible:ring-cyan"
              >
                Continue to AI plan
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-medium text-text-primary">Prompt parts</h3>
            <dl className="grid gap-3 sm:grid-cols-2">
              {breakdown.map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-border bg-elevated px-4 py-3">
                  <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-text-primary">{value}</dd>
                </div>
              ))}
            </dl>
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
                <p className="font-medium text-text-primary">Read it carefully.</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  A clear prompt has a who, a what, a when, and a how long. If anything feels wrong,
                  go back and change it before the AI starts building.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </ChildShell>
  );
}
