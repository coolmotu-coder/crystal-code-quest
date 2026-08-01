import Link from "next/link";
import { requireChild } from "@/lib/auth/guards";
import {
  getChildProfileById,
  getLatestQuestSelectionForChild,
  getLearningStageById,
} from "@/lib/db/queries";
import { ChildShell } from "@/components/child/child-shell";

export const metadata = {
  title: "Child Builder — Crystal Code Quest",
};

const questSteps = [
  "Choose an idea",
  "Shape the prompt",
  "Review the AI plan",
  "Build the feature",
  "Test the game",
  "Learn what changed",
];

export default async function ChildHomePage() {
  const child = await requireChild();
  const profile = getChildProfileById(child.profileId);
  const latestQuest = getLatestQuestSelectionForChild(child.profileId);
  const currentStage = profile?.current_stage_id
    ? getLearningStageById(profile.current_stage_id)
    : null;
  const stageName = currentStage?.name ?? "Getting started";

  return (
    <ChildShell>
      <section className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Welcome back, <span className="text-teal">{child.displayName}</span>
        </h2>
        <p className="mt-2 max-w-2xl text-text-secondary">
          This is where your ideas become real features in{" "}
          <span className="font-medium text-violet">The Crystal Adventure</span>. Choose an idea,
          shape it into a clear request, and watch the builders turn it into something you can play.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-teal" aria-hidden="true" />
            Level {profile?.level ?? 1}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-warning" aria-hidden="true" />
            {profile?.streak_days ?? 0}-day streak
          </span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-text-primary">Today&apos;s quest</h3>
              <span className="bg-cyan/10 rounded-full px-3 py-1 text-xs font-medium text-cyan">
                {stageName}
              </span>
            </div>

            {latestQuest ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-elevated p-4">
                  <p className="text-sm font-medium text-text-primary">
                    {latestQuest.constructed_prompt ?? "Your quest is ready"}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    Status: <span className="text-text-secondary">{latestQuest.status}</span>
                  </p>
                </div>
                <Link
                  href={`/child/quests/${latestQuest.id}`}
                  className="block w-full rounded-xl bg-cyan px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-mint focus-visible:ring-2 focus-visible:ring-cyan"
                >
                  {latestQuest.status === "success" ? "View your quest" : "Continue your quest"}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-elevated/50 rounded-xl border border-dashed border-border p-6 text-center">
                  <p className="text-text-primary">No quest started yet.</p>
                  <p className="mt-1 text-sm text-text-muted">
                    Your first quest is waiting for you.
                  </p>
                </div>
                <Link
                  href="/child/quests"
                  className="block w-full rounded-xl bg-cyan px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-mint focus-visible:ring-2 focus-visible:ring-cyan"
                >
                  Start a new quest
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-medium text-text-primary">Your builder journey</h3>
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
            <h3 className="mb-2 text-lg font-medium text-text-primary">
              The Crystal Adventure preview
            </h3>
            <p className="text-sm text-text-secondary">
              When you finish a quest, the new feature will appear here so you can try it out.
            </p>
            <div className="bg-elevated/50 mt-4 rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-text-muted">Game preview is coming soon.</p>
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
                <p className="font-medium text-text-primary">Hi, I&apos;m your guide.</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  I&apos;ll help you turn a small idea into a clear request. When you are ready,
                  we&apos;ll check what the AI understood before anything is built. Take your time —
                  there is no rush.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="mb-3 text-lg font-medium text-text-primary">Next step</h3>
            <p className="text-sm text-text-secondary">
              {latestQuest
                ? "Continue your quest to review the request and see what happens next."
                : "Start your first quest to learn how ideas become prompts, and how prompts become real game features."}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
              <span
                className={`inline-block h-2 w-2 rounded-full ${latestQuest ? "bg-teal" : "bg-warning"}`}
                aria-hidden="true"
              />
              {latestQuest ? "A quest is in progress." : "No quests have been started yet."}
            </div>
          </section>
        </aside>
      </div>
    </ChildShell>
  );
}
