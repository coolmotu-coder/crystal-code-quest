import { redirect } from "next/navigation";
import { z } from "zod";
import { requireChild } from "@/lib/auth/guards";
import { getQuestSelectionById, getQuestTemplateById } from "@/lib/db/queries";
import { ChildShell } from "@/components/child/child-shell";
import { confirmSelectionAndContinue } from "@/lib/quest/actions";
import { parsePromptSelections } from "@/lib/quest/prompt";

const paramsSchema = z.object({ id: z.string().uuid() });

export const metadata = {
  title: "Review your quest — Crystal Code Quest",
};

export default async function QuestSelectionPage({ params }: { params: Promise<{ id: string }> }) {
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

  const template = getQuestTemplateById(selection.template_id);
  const selections = parsePromptSelections(JSON.parse(selection.selections));

  const selectionCards = [
    { label: "Category", value: selections.category },
    { label: "Character", value: selections.character },
    { label: "Power", value: selections.power },
    { label: "Trigger", value: selections.trigger },
    { label: "Subject", value: selections.subject },
    { label: "Difficulty", value: selections.difficulty },
    { label: "Usage", value: selections.usage },
  ];

  return (
    <ChildShell
      title={template?.name ?? "Your quest"}
      backHref="/child/quests"
      backLabel="Choose a different quest"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-medium text-text-primary">Review your idea</h3>
            <p className="mb-6 text-sm text-text-secondary">
              {template?.description ??
                "Check that each choice matches what you want the builders to make."}
            </p>

            <dl className="grid gap-3 sm:grid-cols-2">
              {selectionCards.map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-border bg-elevated px-4 py-3">
                  <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-text-primary">{value}</dd>
                </div>
              ))}
            </dl>

            <form action={confirmSelectionAndContinue} className="mt-6">
              <input type="hidden" name="selectionId" value={selection.id} />
              <button
                type="submit"
                className="w-full rounded-xl bg-cyan px-4 py-3 text-sm font-semibold text-black transition hover:bg-mint focus-visible:ring-2 focus-visible:ring-cyan"
              >
                Looks good — continue
              </button>
            </form>
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
                  You picked a quest. Next we will turn it into a clear request. Take your time and
                  remember: we always check what the AI understood before it builds anything.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </ChildShell>
  );
}
