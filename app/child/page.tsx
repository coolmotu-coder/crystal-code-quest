import Link from "next/link";
import { requireChild } from "@/lib/auth/guards";
import {
  getAchievementsForChild,
  getBuildRecord,
  getChildProfileById,
  getLatestQuestSelectionForChild,
  getLearningEvidenceForChild,
  getLearningEvidenceForQuest,
  getLearningStageById,
  getPromptRecord,
  getQuestTemplateById,
} from "@/lib/db/queries";
import { DashboardShell } from "@/components/dashboard/shell";
import { GuidePanel } from "@/components/dashboard/guide-panel";
import { EmptyState, HexStep, Panel, StatCard, StatusBadge } from "@/components/dashboard/content";
import { QuestStatus } from "@/lib/contracts";
import { constructPrompt, parsePromptSelections } from "@/lib/quest/prompt";

export const metadata = {
  title: "Child Dashboard — Crystal Code Quest",
};

const learningJourneySteps = [
  { label: "Choose an idea", description: "Pick a feature to build" },
  { label: "Shape the prompt", description: "Make your idea clear" },
  { label: "Review the AI plan", description: "Check what the builder understood" },
  { label: "Build the feature", description: "Create the game change" },
  { label: "Test the game", description: "Make sure everything works" },
  { label: "Learn what changed", description: "Understand what happened" },
];

function getStepStatus(
  stepIndex: number,
  questStatus: QuestStatus | null,
): "complete" | "active" | "pending" {
  if (!questStatus) return "pending";

  const statusOrder: Record<QuestStatus, number> = {
    draft: 0,
    prompt_review: 1,
    plan_review: 2,
    building: 3,
    success: 5,
    rollback: 5,
  };

  const current = statusOrder[questStatus] ?? -1;
  if (stepIndex < current) return "complete";
  if (stepIndex === current) return "active";
  return "pending";
}

function getContinueHref(questId: string, status: QuestStatus | null): string {
  if (!status) return `/child/quests/${questId}`;
  switch (status) {
    case "draft":
      return `/child/quests/${questId}`;
    case "prompt_review":
      return `/child/quests/${questId}/prompt`;
    case "plan_review":
      return `/child/quests/${questId}/plan`;
    case "building":
      return `/child/quests/${questId}/build`;
    case "success":
      return `/child/quests/${questId}/success`;
    case "rollback":
      return `/child/quests/${questId}`;
    default:
      return `/child/quests/${questId}`;
  }
}

function getContinueLabel(status: QuestStatus | null): string {
  if (!status) return "Continue your quest";
  if (status === "success") return "View your quest";
  return "Continue your quest";
}

function getQuestCharacter(selectionsJson: string | null): string | null {
  if (!selectionsJson) return null;
  try {
    const parsed = JSON.parse(selectionsJson);
    const selections = parsePromptSelections(parsed);
    const constructed = constructPrompt(selections);
    return constructed.who;
  } catch {
    return null;
  }
}

function getStatusBadge(status: QuestStatus | null): {
  status: "success" | "active" | "pending" | "mocked" | "rollback" | "neutral";
  label: string;
} {
  if (!status) return { status: "neutral", label: "Not started" };
  switch (status) {
    case "draft":
      return { status: "pending", label: "Idea chosen" };
    case "prompt_review":
      return { status: "active", label: "Prompt review" };
    case "plan_review":
      return { status: "active", label: "Plan review" };
    case "building":
      return { status: "active", label: "Building" };
    case "success":
      return { status: "success", label: "Complete" };
    case "rollback":
      return { status: "rollback", label: "Rolled back" };
    default:
      return { status: "neutral", label: status };
  }
}

export default async function ChildDashboardPage() {
  const child = await requireChild();
  const profile = getChildProfileById(child.profileId);
  const currentStage = profile?.current_stage_id
    ? getLearningStageById(profile.current_stage_id)
    : null;
  const latestQuest = getLatestQuestSelectionForChild(child.profileId);
  const template = latestQuest ? getQuestTemplateById(latestQuest.template_id) : null;
  const promptRecord = latestQuest ? getPromptRecord(latestQuest.id) : undefined;
  const buildRecord = latestQuest ? getBuildRecord(latestQuest.id) : undefined;
  const questEvidence = latestQuest ? getLearningEvidenceForQuest(latestQuest.id) : [];
  const allEvidence = getLearningEvidenceForChild(child.profileId);
  const achievements = getAchievementsForChild(child.profileId);
  const latestAchievement = achievements[0] ?? null;

  const questStatus: QuestStatus | null = latestQuest ? (latestQuest.status as QuestStatus) : null;
  const badge = getStatusBadge(questStatus);
  const continueHref = latestQuest ? getContinueHref(latestQuest.id, questStatus) : "/child/quests";
  const continueLabel = latestQuest ? getContinueLabel(questStatus) : "Start a new quest";

  const constructedPrompt = promptRecord?.final_prompt ?? latestQuest?.constructed_prompt ?? null;
  const isMockedSuccess = buildRecord?.status === "mocked_success";
  const hasEvidence = allEvidence.length > 0;
  const questCharacter = latestQuest ? getQuestCharacter(latestQuest.selections) : null;

  return (
    <DashboardShell
      userRole="child"
      currentPath="/child"
      userName={child.displayName}
      streakDays={profile?.streak_days ?? 0}
      childLevel={profile?.level ?? 1}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Greeting */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Hi {child.displayName}
            </h1>
            <p className="mt-2 max-w-2xl text-text-secondary">
              This is your learning studio. Your ideas become real features in{" "}
              <span className="font-medium text-violet">The Crystal Adventure</span>.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border bg-elevated px-3 py-1 text-xs font-bold text-text-muted">
              Level {profile?.level ?? 1}
            </span>
            {currentStage ? (
              <span className="border-primary/30 bg-primary/10 text-primary rounded-full border px-3 py-1 text-xs font-bold">
                {currentStage.name}
              </span>
            ) : null}
          </div>
        </section>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Current quest hero */}
          <div className="lg:col-span-8">
            <Panel
              title="Current quest"
              action={
                latestQuest ? <StatusBadge status={badge.status} label={badge.label} /> : null
              }
              ariaLabelledBy="current-quest-heading"
            >
              {latestQuest ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-primary text-sm font-bold uppercase tracking-wider">
                      {template?.category ?? "Quest"}
                    </p>
                    <h2
                      id="current-quest-heading"
                      className="mt-1 text-2xl font-bold text-text-primary"
                    >
                      {template?.name ?? "Your quest"}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-text-secondary">
                      {template?.description ?? "Check your quest to see the next step."}
                    </p>
                  </div>

                  {constructedPrompt ? (
                    <div className="bg-surface-container-high rounded-xl border border-border p-4">
                      <p className="text-sm font-medium text-text-secondary">Your prompt</p>
                      <p className="mt-1 text-base font-semibold text-text-primary">
                        {constructedPrompt}
                      </p>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                      href={continueHref}
                      className="bg-primary text-on-primary focus-visible:ring-primary inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition hover:brightness-110 focus-visible:ring-2"
                    >
                      {continueLabel}
                      <span aria-hidden="true">→</span>
                    </Link>
                    {isMockedSuccess ? (
                      <span className="text-xs text-text-muted">
                        Practice build. No real game code was changed.
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="text-text-secondary">
                    No quest started yet. Your first Super Jump quest is waiting.
                  </p>
                  <Link
                    href="/child/quests"
                    className="bg-primary text-on-primary focus-visible:ring-primary inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition hover:brightness-110 focus-visible:ring-2"
                  >
                    Start a new quest
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              )}
            </Panel>
          </div>

          {/* Learning journey */}
          <div className="lg:col-span-4">
            <Panel title="Your learning journey" ariaLabelledBy="journey-heading">
              <div className="space-y-4">
                {learningJourneySteps.map((step, index) => (
                  <HexStep
                    key={step.label}
                    status={getStepStatus(index, questStatus)}
                    number={index + 1}
                    label={step.label}
                    description={step.description}
                  />
                ))}
              </div>
            </Panel>
          </div>

          {/* Current concept */}
          <div className="lg:col-span-4">
            <Panel title="Current coding concept" ariaLabelledBy="concept-heading">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="border-primary/30 bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg border">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path d="M10 2L12 7H17L13 11L14 16L10 13L6 16L7 11L3 7H8L10 2Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">Condition</h3>
                </div>
                <p className="text-sm text-text-secondary">
                  A condition is a rule the game checks. For Super Jump, the game asks: did{" "}
                  {questCharacter ?? "the character"} answer a hard maths question correctly? Only
                  then does the power turn on.
                </p>
              </div>
            </Panel>
          </div>

          {/* Skills & evidence */}
          <div className="lg:col-span-4">
            <Panel title="Skills being practised" ariaLabelledBy="skills-heading">
              {hasEvidence ? (
                <ul className="space-y-3">
                  {allEvidence.slice(0, 3).map((evidence) => (
                    <li
                      key={evidence.id}
                      className="bg-surface-container-high rounded-xl border border-border p-3"
                    >
                      <p className="text-sm font-semibold text-text-primary">{evidence.skill}</p>
                      <p className="mt-1 text-xs text-text-secondary">{evidence.evidence}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="No skills recorded yet"
                  description="Start a quest to build your first learning evidence."
                />
              )}
            </Panel>
          </div>

          {/* Parent guide */}
          <div className="lg:col-span-4">
            <GuidePanel
              title="Parent Guide"
              message={`Hi ${child.displayName}! I’m here to help you turn a small idea into a clear request. When you are ready, we’ll check what the AI understood before anything is built. Take your time — there is no rush.`}
              action={{ href: "/child/quests", label: "Start a quest" }}
            />
          </div>

          {/* Crystal Adventure preview */}
          <div className="lg:col-span-8">
            <Panel title="The Crystal Adventure preview" ariaLabelledBy="preview-heading">
              <div className="border-violet/30 bg-surface-container-high relative overflow-hidden rounded-xl border">
                <div
                  className="from-violet/10 absolute inset-0 bg-gradient-to-br to-transparent"
                  aria-hidden="true"
                />
                <div className="relative p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5 text-violet"
                      aria-hidden="true"
                    >
                      <path d="M10 2L12 7H17L13 11L14 16L10 13L6 16L7 11L3 7H8L10 2Z" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider text-violet">
                      Practice preview
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-text-secondary">
                    When you finish a quest, the new feature will appear here so you can try it.
                    Right now this is a mocked preview — no real game code has been changed.
                  </p>
                  {isMockedSuccess && constructedPrompt ? (
                    <div className="border-violet/30 bg-violet/5 mt-4 rounded-lg border p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-violet">
                        Latest feature
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">{constructedPrompt}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </Panel>
          </div>

          {/* Streak & achievement */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <StatCard
                icon={
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M10 2C10 2 6 6 6 10C6 12.5 7.5 15 10 15C12.5 15 14 12.5 14 10C14 6 10 2 10 2ZM10 13C8.5 13 8 11.5 8 10C8 8 9.5 5.5 10 4.5C10.5 5.5 12 8 12 10C12 11.5 11.5 13 10 13Z" />
                  </svg>
                }
                label="Learning streak"
                value={
                  profile?.streak_days && profile.streak_days > 0
                    ? `${profile.streak_days} day${profile.streak_days === 1 ? "" : "s"}`
                    : "Not started yet"
                }
                empty={!profile?.streak_days || profile.streak_days === 0}
              />
              <StatCard
                icon={
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M5 4H15V8C15 11 12.5 13 10 13C7.5 13 5 11 5 8V4Z" />
                    <path d="M8 13V16H12V13" />
                    <path d="M5 17H15" />
                    <path d="M2 4H5M15 4H18" />
                  </svg>
                }
                label="Latest achievement"
                value={latestAchievement?.name ?? "None yet"}
                empty={!latestAchievement}
              />
            </div>
          </div>

          {/* Recent learning */}
          <div className="lg:col-span-12">
            <Panel title="Recent learning" ariaLabelledBy="recent-learning-heading">
              {questEvidence.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {questEvidence.slice(0, 3).map((evidence) => (
                    <li
                      key={evidence.id}
                      className="bg-surface-container-high rounded-xl border border-border p-4"
                    >
                      <p className="text-sm font-semibold text-text-primary">{evidence.skill}</p>
                      <p className="mt-1 text-xs text-text-secondary">{evidence.evidence}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="No learning evidence yet"
                  description="Finish your current quest to see what you learned recorded here."
                />
              )}
            </Panel>
          </div>

          {/* Reflection prompt */}
          <div className="lg:col-span-12">
            <Panel title="Think about it" ariaLabelledBy="reflection-heading">
              <p className="text-sm text-text-secondary">
                What would happen if {questCharacter ?? "the character"} answered an easy question
                instead of a hard one? Talk it through with your parent or think about it before
                your next quest.
              </p>
            </Panel>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
