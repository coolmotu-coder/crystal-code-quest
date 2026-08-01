import { describe, expect, it } from "vitest";
import { constructPrompt, defaultSelectionsFromSchema } from "@/lib/quest/prompt";

const superJumpOptionsSchema = JSON.stringify({
  category: ["Power"],
  character: ["Lucas"],
  power: ["Super Jump"],
  trigger: ["Correct Answer"],
  subject: ["Maths"],
  difficulty: ["Hard"],
  usage: ["One obstacle"],
});

describe("constructPrompt", () => {
  it("builds the exact Super Jump prompt from the starter options", () => {
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
});
