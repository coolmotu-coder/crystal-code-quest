"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireChild } from "@/lib/auth/guards";
import {
  createQuestSelection,
  getLatestQuestSelectionForChild,
  getQuestTemplateById,
} from "@/lib/db/queries";
import { defaultSelectionsFromSchema, constructPrompt } from "@/lib/quest/prompt";

const selectQuestSchema = z.object({
  templateId: z.string().uuid(),
});

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
  if (latestSelection && latestSelection.template_id === template.id) {
    revalidatePath("/child");
    redirect("/child/quest");
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
  revalidatePath("/child/quest");
  redirect("/child/quest");
}
