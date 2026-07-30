import { z } from "zod";

export const learningStageSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  name: z.string(),
  description: z.string(),
  order: z.number().int(),
  maxDailyQuests: z.number().int().min(1),
  allowsFreePrompt: z.boolean(),
});

export const learningEvidenceSchema = z.object({
  id: z.string().uuid(),
  childProfileId: z.string().uuid(),
  questSelectionId: z.string().uuid(),
  skill: z.string(),
  evidence: z.string(),
  createdAt: z.string().datetime(),
});

export const imaginationJournalEntrySchema = z.object({
  id: z.string().uuid(),
  childProfileId: z.string().uuid(),
  questSelectionId: z.string().uuid(),
  idea: z.string(),
  whyInteresting: z.string(),
  whatLearned: z.string(),
  createdAt: z.string().datetime(),
});

export const achievementSchema = z.object({
  id: z.string().uuid(),
  childProfileId: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  unlockedAt: z.string().datetime(),
});

export type LearningStage = z.infer<typeof learningStageSchema>;
export type LearningEvidence = z.infer<typeof learningEvidenceSchema>;
export type ImaginationJournalEntry = z.infer<typeof imaginationJournalEntrySchema>;
export type Achievement = z.infer<typeof achievementSchema>;
