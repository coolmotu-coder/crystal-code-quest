"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireChild } from "@/lib/auth/guards";
import {
  createAchievement,
  createBuildRecord,
  createImaginationJournalEntry,
  createLearningEvidence,
  createPlanRecord,
  createPromptRecord,
  createQuestSelection,
  getBuildRecord,
  getLatestQuestSelectionForChild,
  getPlanRecord,
  getPromptRecord,
  getQuestSelectionById,
  getQuestTemplateById,
  hasImaginationJournalEntryForQuest,
  hasLearningEvidenceForQuest,
  updateBuildRecord,
  updateQuestSelection,
} from "@/lib/db/queries";
import {
  constructPrompt,
  defaultSelectionsFromSchema,
  parsePromptSelections,
} from "@/lib/quest/prompt";

const selectQuestSchema = z.object({
  templateId: z.string().uuid(),
});

const selectionIdSchema = z.object({
  selectionId: z.string().uuid(),
});

const mockedPlanSteps = [
  "Listen for a correct hard maths answer.",
  "Give Super Jump to Lucas.",
  "Allow one approved obstacle.",
  "Remove the power after use.",
  "Verify existing questions still work.",
];

const mockedBuildResultSummary =
  "Mocked result: the feature passed its practice tests. No real game code was changed.";

const learningEvidence = [
  {
    skill: "Identified character and action",
    evidence: "Linus selected Lucas as the character and Super Jump as the power.",
  },
  {
    skill: "Combined two conditions",
    evidence:
      "Linus added two conditions that must both be true: the answer must be correct and the question must be hard.",
  },
];

const journalEntry = {
  idea: "Lucas should get Super Jump after answering a hard maths question.",
  whyInteresting:
    "Linus connected a learning moment (correct hard answer) to a gameplay reward (Super Jump).",
  whatLearned: "A rule can have more than one condition that must all be true.",
};

const firstPromptAchievement = {
  slug: "first-prompt",
  name: "Prompt Builder",
  description: "Built your first structured prompt.",
  icon: "Pencil",
};

export async function selectQuest(formData: FormData): Promise<void> {
  const child = await requireChild();

  const raw = {
    templateId: formData.get("templateId")?.toString() ?? "",
  };

  const parsed = selectQuestSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/child/quests");
  }

  const template = getQuestTemplateById(parsed.data.templateId);
  if (!template) {
    redirect("/child/quests");
  }

  const latestSelection = getLatestQuestSelectionForChild(child.profileId);
  const isActive = latestSelection
    ? latestSelection.status !== "success" && latestSelection.status !== "rollback"
    : false;

  if (latestSelection && isActive) {
    revalidatePath("/child");
    redirect(`/child/quests/${latestSelection.id}`);
  }

  const now = new Date().toISOString();
  const selectionId = crypto.randomUUID();

  const selections = defaultSelectionsFromSchema(template.options_schema);
  const constructed = constructPrompt(selections);

  createQuestSelection({
    id: selectionId,
    child_profile_id: child.profileId,
    template_id: template.id,
    status: "draft",
    selections: JSON.stringify(selections),
    constructed_prompt: constructed.text,
    current_step: "selected",
    created_at: now,
    updated_at: now,
  });

  revalidatePath("/child");
  redirect(`/child/quests/${selectionId}`);
}

export async function confirmSelectionAndContinue(formData: FormData): Promise<void> {
  const child = await requireChild();

  const raw = {
    selectionId: formData.get("selectionId")?.toString() ?? "",
  };
  const parsed = selectionIdSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/child/quests");
  }

  const selection = getQuestSelectionById(parsed.data.selectionId);
  if (!selection || selection.child_profile_id !== child.profileId) {
    redirect("/child/quests");
  }

  const now = new Date().toISOString();

  updateQuestSelection({
    id: selection.id,
    status: "draft",
    constructed_prompt: selection.constructed_prompt,
    current_step: "selected",
    updated_at: now,
  });

  redirect(`/child/quests/${selection.id}/prompt`);
}

export async function savePromptAndContinue(formData: FormData): Promise<void> {
  const child = await requireChild();

  const raw = {
    selectionId: formData.get("selectionId")?.toString() ?? "",
  };
  const parsed = selectionIdSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/child/quests");
  }

  const selection = getQuestSelectionById(parsed.data.selectionId);
  if (!selection || selection.child_profile_id !== child.profileId) {
    redirect("/child/quests");
  }

  const selections = parsePromptSelections(JSON.parse(selection.selections));
  const constructed = constructPrompt(selections);
  const now = new Date().toISOString();

  if (!getPromptRecord(selection.id)) {
    createPromptRecord({
      id: crypto.randomUUID(),
      quest_selection_id: selection.id,
      template_text:
        "When {character} answers a {difficulty} {subject} question {trigger}, give him {power} for {usage}.",
      final_prompt: constructed.text,
      free_written_prompt: null,
      created_at: now,
    });
  }

  updateQuestSelection({
    id: selection.id,
    status: "prompt_review",
    constructed_prompt: constructed.text,
    current_step: "prompt",
    updated_at: now,
  });

  redirect(`/child/quests/${selection.id}/plan`);
}

export async function savePlanAndContinue(formData: FormData): Promise<void> {
  const child = await requireChild();

  const raw = {
    selectionId: formData.get("selectionId")?.toString() ?? "",
  };
  const parsed = selectionIdSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/child/quests");
  }

  const selection = getQuestSelectionById(parsed.data.selectionId);
  if (!selection || selection.child_profile_id !== child.profileId) {
    redirect("/child/quests");
  }

  const now = new Date().toISOString();

  if (!getPlanRecord(selection.id)) {
    createPlanRecord({
      id: crypto.randomUUID(),
      quest_selection_id: selection.id,
      plan_steps: JSON.stringify(mockedPlanSteps),
      changes_requested: null,
      status: "approved",
      created_at: now,
      updated_at: now,
    });
  }

  updateQuestSelection({
    id: selection.id,
    status: "plan_review",
    constructed_prompt: selection.constructed_prompt,
    current_step: "plan",
    updated_at: now,
  });

  redirect(`/child/quests/${selection.id}/build`);
}

export async function startBuild(formData: FormData): Promise<void> {
  const child = await requireChild();

  const raw = {
    selectionId: formData.get("selectionId")?.toString() ?? "",
  };
  const parsed = selectionIdSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/child/quests");
  }

  const selection = getQuestSelectionById(parsed.data.selectionId);
  if (!selection || selection.child_profile_id !== child.profileId) {
    redirect("/child/quests");
  }

  const now = new Date().toISOString();

  if (!getBuildRecord(selection.id)) {
    createBuildRecord({
      id: crypto.randomUUID(),
      quest_selection_id: selection.id,
      current_state: "preparing",
      status: "running",
      result_summary: null,
      failure_reason: null,
      created_at: now,
      completed_at: null,
    });
  }

  updateQuestSelection({
    id: selection.id,
    status: "building",
    constructed_prompt: selection.constructed_prompt,
    current_step: "build",
    updated_at: now,
  });

  redirect(`/child/quests/${selection.id}/build`);
}

export async function completeBuild(formData: FormData): Promise<void> {
  const child = await requireChild();

  const raw = {
    selectionId: formData.get("selectionId")?.toString() ?? "",
  };
  const parsed = selectionIdSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/child/quests");
  }

  const selection = getQuestSelectionById(parsed.data.selectionId);
  if (!selection || selection.child_profile_id !== child.profileId) {
    redirect("/child/quests");
  }

  const selections = parsePromptSelections(JSON.parse(selection.selections));
  const constructed = constructPrompt(selections);
  const now = new Date().toISOString();

  if (!getPromptRecord(selection.id)) {
    createPromptRecord({
      id: crypto.randomUUID(),
      quest_selection_id: selection.id,
      template_text:
        "When {character} answers a {difficulty} {subject} question {trigger}, give him {power} for {usage}.",
      final_prompt: constructed.text,
      free_written_prompt: null,
      created_at: now,
    });
  }

  if (!getPlanRecord(selection.id)) {
    createPlanRecord({
      id: crypto.randomUUID(),
      quest_selection_id: selection.id,
      plan_steps: JSON.stringify(mockedPlanSteps),
      changes_requested: null,
      status: "approved",
      created_at: now,
      updated_at: now,
    });
  }

  const buildRecord = getBuildRecord(selection.id);
  if (!buildRecord) {
    createBuildRecord({
      id: crypto.randomUUID(),
      quest_selection_id: selection.id,
      current_state: "preparing_preview",
      status: "mocked_success",
      result_summary: mockedBuildResultSummary,
      failure_reason: null,
      created_at: now,
      completed_at: now,
    });
  } else {
    updateBuildRecord({
      id: buildRecord.id,
      current_state: "preparing_preview",
      status: "mocked_success",
      result_summary: mockedBuildResultSummary,
      failure_reason: null,
      completed_at: now,
    });
  }

  if (!hasLearningEvidenceForQuest(selection.id)) {
    for (const item of learningEvidence) {
      createLearningEvidence({
        id: crypto.randomUUID(),
        child_profile_id: child.profileId,
        quest_selection_id: selection.id,
        skill: item.skill,
        evidence: item.evidence,
        created_at: now,
      });
    }
  }

  if (!hasImaginationJournalEntryForQuest(selection.id)) {
    createImaginationJournalEntry({
      id: crypto.randomUUID(),
      child_profile_id: child.profileId,
      quest_selection_id: selection.id,
      idea: journalEntry.idea,
      why_interesting: journalEntry.whyInteresting,
      what_learned: journalEntry.whatLearned,
      created_at: now,
    });
  }

  createAchievement({
    id: crypto.randomUUID(),
    child_profile_id: child.profileId,
    slug: firstPromptAchievement.slug,
    name: firstPromptAchievement.name,
    description: firstPromptAchievement.description,
    icon: firstPromptAchievement.icon,
    unlocked_at: now,
  });

  updateQuestSelection({
    id: selection.id,
    status: "success",
    constructed_prompt: constructed.text,
    current_step: "success",
    updated_at: now,
  });

  revalidatePath("/child");
  redirect(`/child/quests/${selection.id}/success`);
}
