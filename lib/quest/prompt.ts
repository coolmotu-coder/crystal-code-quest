import {
  constructedPromptSchema,
  promptSelectionsSchema,
  type ConstructedPrompt,
  type PromptSelections,
} from "@/lib/contracts";

export function constructPrompt(selections: PromptSelections): ConstructedPrompt {
  const prompt: ConstructedPrompt = {
    text: "",
    who: "",
    what: "",
    when: "",
    howLong: "",
    expectedResult: "",
  };

  const subject = selections.subject.toLowerCase();
  const triggerMap: Record<string, string> = {
    "Correct Answer": "correctly",
  };
  const trigger = triggerMap[selections.trigger] ?? selections.trigger.toLowerCase();

  switch (selections.category) {
    case "Power":
      prompt.text = `When ${selections.character} answers a ${selections.difficulty.toLowerCase()} ${subject} question ${trigger}, give them ${selections.power} for ${selections.usage.toLowerCase()}.`;
      prompt.who = selections.character;
      prompt.what = selections.power;
      prompt.when = `${selections.trigger} ${selections.difficulty.toLowerCase()} ${subject}`;
      prompt.howLong = selections.usage;
      prompt.expectedResult = `${selections.character} can clear a higher obstacle`;
      break;
  }

  return constructedPromptSchema.parse(prompt);
}

export function parsePromptSelections(raw: unknown): PromptSelections {
  return promptSelectionsSchema.parse(raw);
}

export function defaultSelectionsFromSchema(optionsSchema: string): PromptSelections {
  const parsed = JSON.parse(optionsSchema) as Record<string, string[]>;

  const selections: Record<string, string> = {};
  for (const key of Object.keys(parsed)) {
    const values = parsed[key];
    if (!values || values.length === 0) {
      throw new Error(`No options available for ${key}`);
    }
    selections[key] = values[0] as string;
  }

  return parsePromptSelections(selections);
}

export function buildMockedPlanSteps(character: string): string[] {
  return [
    "Listen for a correct hard maths answer.",
    `Give Super Jump to ${character}.`,
    `Let ${character} clear one approved obstacle.`,
    "Remove the power after it is used.",
    "Verify existing questions still work.",
  ];
}
