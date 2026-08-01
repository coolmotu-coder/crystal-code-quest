import { requireParentWithChild } from "@/lib/auth/guards";
import {
  getBuildRecord,
  getLatestQuestSelectionForChild,
  getLearningEvidenceForChild,
  getLearningEvidenceForQuest,
  getLearningStageById,
  getParentPolicyForChild,
  getPromptRecord,
  getQuestTemplateById,
} from "@/lib/db/queries";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyState, Panel, StatCard, StatusBadge } from "@/components/dashboard/content";
import { QuestStatus } from "@/lib/contracts";
import { constructPrompt, parsePromptSelections } from "@/lib/quest/prompt";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Parent Dashboard — Crystal Code Quest",
};

function getPlaceholderCards(childName: string) {
  return [
    {
      title: "Prompt History",
      description: `Review every prompt ${childName} has built. Coming soon.`,
    },
    {
      title: "Imagination Journal",
      description: `See how ${childName}’s ideas are developing. Coming soon.`,
    },
    { title: "Builds", description: "View mocked and real build history. Coming soon." },
    {
      title: "Learning Controls",
      description: "Adjust learning stage and daily limits. Coming soon.",
    },
    {
      title: "Safety Settings",
      description: "Review blocked requests and safety rules. Coming soon.",
    },
    { title: "Child Preview", description: "Preview the Child Builder experience. Coming soon." },
  ];
}

function getStatusBadge(status: QuestStatus | null): {
  status: "success" | "active" | "pending" | "mocked" | "rollback" | "neutral";
  label: string;
} {
  if (!status) return { status: "neutral", label: "No quest" };
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

function getConstructedPromptParts(selectionsJson: string | null) {
  if (!selectionsJson) return null;
  try {
    const parsed = JSON.parse(selectionsJson);
    const selections = parsePromptSelections(parsed);
    return constructPrompt(selections);
  } catch {
    return null;
  }
}

export default async function ParentDashboardPage() {
  const parent = await requireParentWithChild();
  // MVP limitation: this page shows the first associated child only.
  // Multi-child selection is intentionally not implemented in this milestone.
  const childProfile = parent.childProfile;
  const currentStage = childProfile.current_stage_id
    ? getLearningStageById(childProfile.current_stage_id)
    : null;
  const policy = getParentPolicyForChild(childProfile.id);
  const approvedStage = policy?.current_stage_id
    ? getLearningStageById(policy.current_stage_id)
    : currentStage;

  const latestQuest = getLatestQuestSelectionForChild(childProfile.id);
  const template = latestQuest ? getQuestTemplateById(latestQuest.template_id) : null;
  const promptRecord = latestQuest ? getPromptRecord(latestQuest.id) : undefined;
  const buildRecord = latestQuest ? getBuildRecord(latestQuest.id) : undefined;
  const questEvidence = latestQuest ? getLearningEvidenceForQuest(latestQuest.id) : [];
  const allEvidence = getLearningEvidenceForChild(childProfile.id);

  const questStatus: QuestStatus | null = latestQuest ? (latestQuest.status as QuestStatus) : null;
  const badge = getStatusBadge(questStatus);
  const constructedPrompt = promptRecord?.final_prompt ?? latestQuest?.constructed_prompt ?? null;
  const isMocked = buildRecord?.status?.startsWith("mocked_") ?? true;
  const constructedParts = latestQuest ? getConstructedPromptParts(latestQuest.selections) : null;

  const promptParts = constructedParts
    ? [
        { label: "Who", value: constructedParts.who },
        { label: "What", value: constructedParts.what },
        { label: "When", value: constructedParts.when },
        { label: "How long", value: constructedParts.howLong },
      ]
    : [];

  const childName = childProfile.display_name;
  const placeholderCards = getPlaceholderCards(childName);

  return (
    <DashboardShell
      userRole="parent"
      currentPath="/parent"
      userName={parent.displayName}
      childName={childProfile.display_name}
      childLevel={childProfile.level}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Hi {parent.displayName}
            </h1>
            <p className="mt-2 max-w-2xl text-text-secondary">
              Monitoring <span className="text-primary font-bold">{childName}</span>
              &apos;s learning progress.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {approvedStage ? (
              <span className="border-primary/30 bg-primary/10 text-primary rounded-full border px-3 py-1 text-xs font-bold">
                {approvedStage.name}
              </span>
            ) : null}
            <span className="rounded-full border border-border bg-elevated px-3 py-1 text-xs font-bold text-text-muted">
              Daily limit {policy?.daily_quest_limit ?? 3}
            </span>
          </div>
        </section>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Current objective */}
          <div className="lg:col-span-8">
            <Panel
              title="Current objective"
              action={<StatusBadge status={badge.status} label={badge.label} />}
              ariaLabelledBy="objective-heading"
            >
              {latestQuest ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-primary text-sm font-bold uppercase tracking-wider">
                      {template?.category ?? "Quest"}
                    </p>
                    <h2
                      id="objective-heading"
                      className="mt-1 text-2xl font-bold text-text-primary"
                    >
                      {template?.name ?? "Current quest"}
                    </h2>
                    <p className="mt-2 text-sm text-text-secondary">
                      {template?.description ?? `${childName} has a quest in progress.`}
                    </p>
                  </div>

                  {constructedPrompt ? (
                    <div className="bg-surface-container-high rounded-xl border border-border p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                        Latest prompt
                      </p>
                      <p className="mt-1 text-base font-semibold text-text-primary">
                        {constructedPrompt}
                      </p>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    {isMocked ? (
                      <span className="border-violet/30 bg-violet/10 rounded-full border px-2.5 py-1 text-xs font-bold text-violet">
                        Mocked build
                      </span>
                    ) : null}
                    <span className="rounded-full border border-border bg-elevated px-2.5 py-1 text-xs font-bold text-text-muted">
                      No real game repository was changed
                    </span>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No quest started"
                  description={`${childName} has not started a quest yet. The first Super Jump quest is ready when they sign in.`}
                />
              )}
            </Panel>
          </div>

          {/* Child account summary */}
          <div className="lg:col-span-4">
            <Panel title="Child account summary" ariaLabelledBy="summary-heading">
              <div className="space-y-4">
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
                    childProfile.streak_days > 0
                      ? `${childProfile.streak_days} day${childProfile.streak_days === 1 ? "" : "s"}`
                      : "Not started"
                  }
                  empty={childProfile.streak_days === 0}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-high rounded-xl border border-border p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Level
                    </p>
                    <p className="mt-1 text-xl font-bold text-text-primary">{childProfile.level}</p>
                  </div>
                  <div className="bg-surface-container-high rounded-xl border border-border p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted">XP</p>
                    <p className="mt-1 text-xl font-bold text-text-primary">{childProfile.xp}</p>
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          {/* Structured prompt parts */}
          <div className="lg:col-span-7">
            <Panel title="Latest structured prompt" ariaLabelledBy="prompt-heading">
              {constructedPrompt ? (
                <div className="space-y-4">
                  <div className="border-primary/20 bg-primary/5 rounded-xl border p-4">
                    <p className="text-sm italic text-text-secondary">
                      &quot;{constructedPrompt}&quot;
                    </p>
                  </div>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {promptParts.map((part) => (
                      <div
                        key={part.label}
                        className="border-primary bg-surface-container-high rounded-xl border-l-2 p-3"
                      >
                        <dt className="text-primary text-xs font-bold uppercase tracking-wider">
                          {part.label}
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-text-primary">
                          {part.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : (
                <EmptyState
                  title="No prompt yet"
                  description={`${childName} has not shaped a prompt yet. It will appear here after their first quest step.`}
                />
              )}
            </Panel>
          </div>

          {/* Learning evidence */}
          <div className="lg:col-span-5">
            <Panel
              title="Latest learning evidence"
              action={
                allEvidence.length > 0 ? (
                  <span className="bg-secondary/10 text-secondary rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {allEvidence.length} recorded
                  </span>
                ) : null
              }
              ariaLabelledBy="evidence-heading"
            >
              {questEvidence.length > 0 ? (
                <ul className="space-y-3">
                  {questEvidence.slice(0, 3).map((evidence) => (
                    <li
                      key={evidence.id}
                      className="bg-surface-container-high hover:border-secondary/50 rounded-xl border border-border p-4 transition"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                          {new Date(evidence.created_at).toLocaleDateString()}
                        </span>
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-4 w-4 text-success"
                          aria-hidden="true"
                        >
                          <path d="M3 8L6.5 11.5L13 5" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-text-primary">{evidence.skill}</p>
                      <p className="mt-1 text-xs text-text-secondary">{evidence.evidence}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="No learning evidence yet"
                  description="Understanding Gates are planned for the agent workflow. No learning quiz has been recorded yet."
                />
              )}
            </Panel>
          </div>

          {/* Mocked build status */}
          <div className="lg:col-span-12">
            <Panel title="Build status" ariaLabelledBy="build-heading">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="border-violet/30 bg-violet/5 rounded-xl border p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-violet">Status</p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">
                    {buildRecord?.status
                      ? buildRecord.status
                          .replace("_", " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())
                      : "No build started"}
                  </p>
                </div>
                <p className="text-sm text-text-secondary">
                  {buildRecord?.result_summary ??
                    "No build has run yet. When it does, it will be a mocked practice build until the agent workflow is approved."}
                </p>
              </div>
              {isMocked ? (
                <p className="mt-3 text-xs text-text-muted">
                  This is a mocked build. No real game repository was changed.
                </p>
              ) : null}
            </Panel>
          </div>

          {/* Parent attention */}
          <div className="lg:col-span-12">
            <Panel title="Attention" ariaLabelledBy="attention-heading">
              <ul className="space-y-2">
                {latestQuest?.status === "success" ? (
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                    <span
                      className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-success"
                      aria-hidden="true"
                    />
                    {childName} completed the Super Jump quest. Review the learning evidence below.
                  </li>
                ) : null}
                {latestQuest?.status === "building" ? (
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                    <span
                      className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-warning"
                      aria-hidden="true"
                    />
                    A practice build is in progress. No real game change is happening.
                  </li>
                ) : null}
                {!latestQuest ? (
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                    <span
                      className="bg-primary mt-0.5 h-2 w-2 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                    {childName} has not started a quest yet. Let them know the Child Builder login
                    is at /child/login.
                  </li>
                ) : null}
                <li className="flex items-start gap-3 text-sm text-text-secondary">
                  <span
                    className="bg-secondary mt-0.5 h-2 w-2 shrink-0 rounded-full"
                    aria-hidden="true"
                  />
                  Understanding Gates are planned for the agent workflow. No real model calls are
                  being made.
                </li>
              </ul>
            </Panel>
          </div>

          {/* Placeholder secondary destinations */}
          <div className="lg:col-span-12">
            <h2 className="mb-4 text-lg font-bold text-text-primary">More areas</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {placeholderCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-dashed border-border bg-surface p-5"
                >
                  <h3 className="text-sm font-bold text-text-primary">{card.title}</h3>
                  <p className="mt-1 text-xs text-text-muted">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
