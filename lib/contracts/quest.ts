import { z } from "zod";

export const questCategorySchema = z.enum(["Power", "Obstacle", "Reward", "Character", "World"]);

export const questStatusSchema = z.enum([
  "draft",
  "prompt_review",
  "plan_review",
  "building",
  "success",
  "rollback",
]);

export const buildStatusSchema = z.enum([
  "pending",
  "running",
  "mocked_success",
  "mocked_rollback",
]);

export const superJumpSelectionsSchema = z.object({
  category: z.literal("Power"),
  character: z.string().min(1),
  power: z.literal("Super Jump"),
  trigger: z.literal("Correct Answer"),
  subject: z.literal("Maths"),
  difficulty: z.literal("Hard"),
  usage: z.literal("One obstacle"),
});

export const promptSelectionsSchema = z.discriminatedUnion("category", [superJumpSelectionsSchema]);

export type QuestCategory = z.infer<typeof questCategorySchema>;
export type QuestStatus = z.infer<typeof questStatusSchema>;
export type BuildStatus = z.infer<typeof buildStatusSchema>;
export type PromptSelections = z.infer<typeof promptSelectionsSchema>;

export const constructedPromptSchema = z.object({
  text: z.string(),
  who: z.string(),
  what: z.string(),
  when: z.string(),
  howLong: z.string(),
  expectedResult: z.string(),
});

export type ConstructedPrompt = z.infer<typeof constructedPromptSchema>;
