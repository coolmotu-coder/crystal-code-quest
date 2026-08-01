import { redirect } from "next/navigation";
import { z } from "zod";
import { requireChild } from "@/lib/auth/guards";
import { getBuildRecord, getQuestSelectionById } from "@/lib/db/queries";
import { ChildShell } from "@/components/child/child-shell";
import { BuildProgress } from "@/components/child/build-progress";
import { completeBuild } from "@/lib/quest/actions";

const paramsSchema = z.object({ id: z.string().uuid() });

export const metadata = {
  title: "Building your feature — Crystal Code Quest",
};

export default async function QuestBuildPage({ params }: { params: Promise<{ id: string }> }) {
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

  const buildRecord = getBuildRecord(selection.id);
  const alreadyComplete =
    selection.status === "success" ||
    buildRecord?.status === "mocked_success" ||
    buildRecord?.status === "success";

  if (alreadyComplete) {
    redirect(`/child/quests/${selection.id}/success`);
  }

  return (
    <ChildShell
      title="Building your feature"
      backHref={`/child/quests/${selection.id}/plan`}
      backLabel="Back to plan"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <BuildProgress selectionId={selection.id} completeBuild={completeBuild} />

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="mb-2 text-lg font-medium text-text-primary">What we are building</h3>
            <p className="font-mono text-sm leading-relaxed text-text-primary">
              {selection.constructed_prompt}
            </p>
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
                <p className="font-medium text-text-primary">Builders at work.</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  This is a practice run. In the future, this step will safely change the real game
                  code. For now, watch the states and remember that every build must pass checks
                  before it is kept.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </ChildShell>
  );
}
