import { redirect } from "next/navigation";
import { z } from "zod";
import { requireChild } from "@/lib/auth/guards";
import { getPlanRecord, getQuestSelectionById } from "@/lib/db/queries";
import { ChildShell } from "@/components/child/child-shell";
import { savePlanAndContinue } from "@/lib/quest/actions";
import { buildMockedPlanSteps, parsePromptSelections } from "@/lib/quest/prompt";

const paramsSchema = z.object({ id: z.string().uuid() });

export const metadata = {
  title: "Review the AI plan — Crystal Code Quest",
};

export default async function QuestPlanPage({ params }: { params: Promise<{ id: string }> }) {
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
  const planRecord = getPlanRecord(selection.id);
  const planSteps = planRecord
    ? (JSON.parse(planRecord.plan_steps) as string[])
    : buildMockedPlanSteps(selections.character);

  return (
    <ChildShell
      title="AI plan"
      backHref={`/child/quests/${selection.id}/prompt`}
      backLabel="Change my idea"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="border-warning/30 bg-warning/5 mb-4 rounded-xl border border-dashed p-4">
              <p className="text-sm font-medium text-warning">
                Mocked plan — no real game code is being changed.
              </p>
            </div>

            <h3 className="mb-4 text-lg font-medium text-text-primary">The AI understood:</h3>
            <ol className="space-y-3">
              {planSteps.map((step, index) => (
                <li
                  key={index}
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

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={`/child/quests/${selection.id}/prompt`}
                className="block w-full rounded-xl border border-border bg-elevated px-4 py-3 text-center text-sm font-semibold text-text-secondary transition hover:border-teal hover:text-teal focus-visible:ring-2 focus-visible:ring-teal"
              >
                Change my idea
              </a>
              <form action={savePlanAndContinue} className="contents">
                <input type="hidden" name="selectionId" value={selection.id} />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-cyan px-4 py-3 text-sm font-semibold text-black transition hover:bg-mint focus-visible:ring-2 focus-visible:ring-cyan"
                >
                  Build my idea
                </button>
              </form>
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
                <p className="font-medium text-text-primary">Check every step.</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  This is the plan the AI will follow. If it does not match your idea, change your
                  idea. If it does match, you can start the practice build.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </ChildShell>
  );
}
