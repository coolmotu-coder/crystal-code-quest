import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireChild } from "@/lib/auth/guards";
import {
  getBuildRecord,
  getLearningEvidenceForQuest,
  getPromptRecord,
  getQuestSelectionById,
} from "@/lib/db/queries";
import { ChildShell } from "@/components/child/child-shell";
import { parsePromptSelections } from "@/lib/quest/prompt";

const paramsSchema = z.object({ id: z.string().uuid() });

export const metadata = {
  title: "Quest complete — Crystal Code Quest",
};

export default async function QuestSuccessPage({ params }: { params: Promise<{ id: string }> }) {
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

  if (selection.status !== "success") {
    redirect(`/child/quests/${selection.id}/build`);
  }

  const selections = parsePromptSelections(JSON.parse(selection.selections));
  const promptRecord = getPromptRecord(selection.id);
  const buildRecord = getBuildRecord(selection.id);
  const learningEvidence = getLearningEvidenceForQuest(selection.id);

  const reflectionQuestion = `What would happen if ${selections.character} answered an easy question instead of a hard one?`;

  return (
    <ChildShell title="Quest complete">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-medium text-text-primary">What you chose</h3>
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Character", value: selections.character },
                { label: "Power", value: selections.power },
                { label: "Trigger", value: selections.trigger },
                { label: "Subject", value: selections.subject },
                { label: "Difficulty", value: selections.difficulty },
                { label: "Usage", value: selections.usage },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-border bg-elevated px-4 py-3">
                  <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-text-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-medium text-text-primary">Final prompt</h3>
            <div className="rounded-xl border border-border bg-elevated p-4">
              <p className="font-mono text-sm leading-relaxed text-text-primary">
                {promptRecord?.final_prompt ?? selection.constructed_prompt}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-medium text-text-primary">What the build did</h3>
            <div className="border-success/30 bg-success/5 rounded-xl border border-dashed p-4">
              <p className="text-sm text-text-secondary">
                {buildRecord?.result_summary ??
                  "Mocked result: the feature passed its practice tests. No real game code was changed."}
              </p>
            </div>
            <p className="mt-3 text-sm text-text-muted">
              This was a practice build. The real game will be changed only after your parent
              approves the next milestone.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-medium text-text-primary">What you learned</h3>
            {learningEvidence.length > 0 ? (
              <ul className="space-y-3">
                {learningEvidence.map((evidence) => (
                  <li key={evidence.id} className="rounded-xl border border-border bg-elevated p-4">
                    <p className="text-sm font-medium text-text-primary">{evidence.skill}</p>
                    <p className="mt-1 text-sm text-text-secondary">{evidence.evidence}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-secondary">
                You created a rule with two conditions: the answer must be correct and the question
                must be hard. Only then does {selections.character} receive {selections.power}.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="mb-2 text-lg font-medium text-text-primary">Reflection question</h3>
            <p className="text-sm text-text-secondary">{reflectionQuestion}</p>
          </section>

          <Link
            href="/child"
            className="block w-full rounded-xl bg-cyan px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-mint focus-visible:ring-2 focus-visible:ring-cyan"
          >
            Back to Child home
          </Link>
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
                <p className="font-medium text-text-primary">Well done!</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  You turned an idea into a clear prompt, checked the AI plan, and completed a
                  practice build. Tell your parent what you noticed.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </ChildShell>
  );
}
