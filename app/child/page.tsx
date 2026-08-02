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
import {
  CheckIcon,
  EmptyState,
  HexStep,
  Panel,
  StatCard,
  StatusBadge,
} from "@/components/dashboard/content";
import {
  ConceptIcon,
  CrystalPreviewVisual,
  QuestHeroVisual,
  SparklesIcon,
} from "@/components/dashboard/decorations";
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

const starterSkills = [
  { name: "Clear instructions", hint: "Saying exactly what should happen" },
  { name: "Conditions", hint: "When something is true" },
  { name: "State", hint: "What the game remembers" },
  { name: "Testing", hint: "Checking it works" },
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="glass-chip">
              <SparklesIcon className="text-primary h-4 w-4" />
              Level {profile?.level ?? 1}
            </span>
            {currentStage ? (
              <span className="glass-chip-accent">
                <CheckIcon className="h-4 w-4" />
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
              variant="accent"
              action={
                latestQuest ? <StatusBadge status={badge.status} label={badge.label} /> : null
              }
              ariaLabelledBy="current-quest-heading"
            >
              {latestQuest ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-primary text-xs font-bold uppercase tracking-wider">
                          {template?.category ?? "Quest"}
                        </p>
                        <span className="glass-chip text-[10px]">First quest</span>
                      </div>
                      <h2
                        id="current-quest-heading"
                        className="mt-2 text-2xl font-bold text-text-primary sm:text-3xl"
                      >
                        {template?.name ?? "Your quest"}
                      </h2>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
                        {template?.description ?? "Check your quest to see the next step."}
                      </p>
                    </div>

                    {constructedPrompt ? (
                      <div className="border-cyan-300/10 to-cyan-950/10 mt-4 rounded-xl border bg-gradient-to-br from-slate-950/60 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                          Your prompt
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-relaxed text-text-primary">
                          {constructedPrompt}
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Link
                        href={continueHref}
                        className="bg-primary text-on-primary focus-visible:ring-primary inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold shadow-[0_8px_24px_rgba(34,211,238,0.18)] transition hover:brightness-110 focus-visible:ring-2"
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
                  <div className="order-first sm:order-last">
                    <QuestHeroVisual className="h-48 sm:h-full" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col justify-center">
                    <span className="glass-chip-accent w-fit">First quest waiting</span>
                    <h2
                      id="current-quest-heading"
                      className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl"
                    >
                      Ready to build your first idea?
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      You will start with a Super Jump quest. The Crystal Guide will help you turn a
                      small idea into a clear request.
                    </p>
                    <Link
                      href="/child/quests"
                      className="bg-primary text-on-primary focus-visible:ring-primary mt-5 inline-flex min-h-[48px] w-fit items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold shadow-[0_8px_24px_rgba(34,211,238,0.18)] transition hover:brightness-110 focus-visible:ring-2"
                    >
                      Start a new quest
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                  <div className="order-first sm:order-last">
                    <QuestHeroVisual className="h-48 sm:h-full" />
                  </div>
                </div>
              )}
            </Panel>
          </div>

          {/* Learning journey */}
          <div className="lg:col-span-4">
            <Panel title="Your learning journey" ariaLabelledBy="journey-heading">
              <div>
                {learningJourneySteps.map((step, index) => (
                  <HexStep
                    key={step.label}
                    status={getStepStatus(index, questStatus)}
                    number={index + 1}
                    label={step.label}
                    description={step.description}
                    isLast={index === learningJourneySteps.length - 1}
                  />
                ))}
              </div>
            </Panel>
          </div>

          {/* Current concept */}
          <div className="lg:col-span-4">
            <Panel title="Current coding concept" ariaLabelledBy="concept-heading">
              <div className="border-cyan-300/10 to-cyan-950/10 rounded-xl border bg-gradient-to-br from-slate-950/60 p-4">
                <div className="flex items-start gap-4">
                  <div className="border-cyan-300/20 bg-cyan-400/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-[0_0_20px_rgba(34,211,238,0.12)]">
                    <ConceptIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Condition</h3>
                    <p className="mt-1 text-xs text-text-muted">A rule that can be true or false</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-text-secondary">
                    <span className="text-primary font-semibold">For Super Jump:</span> the game
                    asks, did {questCharacter ?? "the character"} answer a hard maths question
                    correctly? Only then does the power turn on.
                  </p>
                  <p className="text-xs leading-relaxed text-text-muted">
                    Why it matters: conditions let a game decide when something should happen, not
                    every time.
                  </p>
                </div>
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
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                    >
                      <span className="bg-success/15 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-success">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{evidence.skill}</p>
                        <p className="mt-0.5 text-xs text-text-muted">{evidence.evidence}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-text-secondary">
                    These are the skills you will practise on your first quest.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {starterSkills.map((skill) => (
                      <span
                        key={skill.name}
                        className="glass-chip text-text-muted"
                        title={skill.hint}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Panel>
          </div>

          {/* Parent guide */}
          <div className="lg:col-span-4">
            <GuidePanel
              title="Parent Guide"
              name="Crystal"
              message={`Hi ${child.displayName}! I’m here to help you turn a small idea into a clear request. When you are ready, we’ll check what the AI understood before anything is built. Take your time — there is no rush.`}
              action={{ href: "/child/quests", label: "Start a quest" }}
            />
          </div>

          {/* Crystal Adventure preview */}
          <div className="lg:col-span-8">
            <Panel
              title="The Crystal Adventure preview"
              variant="adventure"
              ariaLabelledBy="preview-heading"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="glass-chip-violet text-[10px] font-bold uppercase tracking-wider">
                      Practice preview
                    </span>
                    <span className="glass-chip text-[10px] text-text-muted">Mocked</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    When you finish a quest, the new feature will appear here so you can try it.
                    This is a mocked preview — no real game code has been changed.
                  </p>
                  {isMockedSuccess && constructedPrompt ? (
                    <div className="border-violet-300/15 bg-violet-400/5 mt-4 rounded-xl border p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-violet">
                        Latest feature
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">{constructedPrompt}</p>
                    </div>
                  ) : null}
                  <p className="mt-4 text-xs text-text-muted">
                    No real game repository was changed.
                  </p>
                </div>
                <div className="order-first sm:order-last">
                  <CrystalPreviewVisual className="h-48 sm:h-full" />
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
                    className="h-7 w-7"
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
                    className="h-7 w-7"
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
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="bg-success/15 flex h-5 w-5 items-center justify-center rounded-full text-success">
                          <CheckIcon className="h-3 w-3" />
                        </span>
                        <p className="text-sm font-semibold text-text-primary">{evidence.skill}</p>
                      </div>
                      <p className="text-xs text-text-muted">{evidence.evidence}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="No learning evidence yet"
                  description="Finish your current quest to see what you learned recorded here."
                  compact
                />
              )}
            </Panel>
          </div>

          {/* Reflection prompt */}
          <div className="lg:col-span-12">
            <Panel title="Think about it" ariaLabelledBy="reflection-heading">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-text-secondary">
                  What would happen if {questCharacter ?? "the character"} answered an easy question
                  instead of a hard one? Talk it through with your parent or think about it before
                  your next quest.
                </p>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
