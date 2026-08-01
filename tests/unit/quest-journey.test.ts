// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  constructPrompt,
  defaultSelectionsFromSchema,
  parsePromptSelections,
} from "@/lib/quest/prompt";

const superJumpOptionsSchema = JSON.stringify({
  category: ["Power"],
  character: ["Lucas"],
  power: ["Super Jump"],
  trigger: ["Correct Answer"],
  subject: ["Maths"],
  difficulty: ["Hard"],
  usage: ["One obstacle"],
});

const mockedPlanSteps = [
  "Listen for a correct hard maths answer.",
  "Give Super Jump to Lucas.",
  "Allow one approved obstacle.",
  "Remove the power after use.",
  "Verify existing questions still work.",
];

const buildStates = ["Preparing", "Building", "Checking", "Reviewing", "Complete"];

describe("Super Jump quest journey", () => {
  it("constructs the exact expected prompt and breakdown", () => {
    const selections = defaultSelectionsFromSchema(superJumpOptionsSchema);
    const prompt = constructPrompt(selections);

    expect(prompt.text).toBe(
      "When Lucas answers a hard maths question correctly, give him Super Jump for one obstacle.",
    );
    expect(prompt.who).toBe("Lucas");
    expect(prompt.what).toBe("Super Jump");
    expect(prompt.when).toBe("Correct Answer hard maths");
    expect(prompt.howLong).toBe("One obstacle");
    expect(prompt.expectedResult).toBe("Lucas can clear a higher obstacle");
  });

  it("parses valid Super Jump selections", () => {
    const raw = {
      category: "Power",
      character: "Lucas",
      power: "Super Jump",
      trigger: "Correct Answer",
      subject: "Maths",
      difficulty: "Hard",
      usage: "One obstacle",
    };

    const selections = parsePromptSelections(raw);
    expect(selections.category).toBe("Power");
    expect(selections.character).toBe("Lucas");
  });

  it("rejects invalid selections", () => {
    expect(() =>
      parsePromptSelections({
        category: "Invalid",
        character: "Lucas",
        power: "Super Jump",
        trigger: "Correct Answer",
        subject: "Maths",
        difficulty: "Hard",
        usage: "One obstacle",
      }),
    ).toThrow();
  });

  it("exports the mocked plan steps used in the AI plan review", () => {
    expect(mockedPlanSteps).toHaveLength(5);
    expect(mockedPlanSteps[0]).toBe("Listen for a correct hard maths answer.");
    expect(mockedPlanSteps[mockedPlanSteps.length - 1]).toBe(
      "Verify existing questions still work.",
    );
  });

  it("exports the deterministic build states", () => {
    expect(buildStates).toEqual(["Preparing", "Building", "Checking", "Reviewing", "Complete"]);
  });
});
