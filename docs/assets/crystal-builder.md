# Crystal Builder — Asset Specification

> **Canonical visual reference:** `docs/design/concept-art/crystal-code-quest-master-visual-direction.png`  
> **See also:** `parent-guide.md` for the warm human Parent Guide.

## Role

The Crystal Builder is Linus’s AI builder companion in Crystal Code Quest. It is the **only approved robot character** inside the learning interface. It appears in the Builder Workspace and the mocked build-progress journey, where it represents the safe, careful process that turns ideas into working features.

- It is **not** a generic mascot.
- It is **not** a player character inside The Crystal Adventure.
- It is **not** a replacement for the Parent Guide.
- It is **not** the real parent or a real AI assistant.

## Files

- **Future Rive source:** `public/animations/crystal-builder.riv` (to be produced in Rive)
- **Static fallback:** use a small, approved SVG or icon only if the Rive file is not yet available.

## Character description

Based on the canonical master visual reference.

### Visual design

- Friendly, rounded robot with a clean white/light-grey body.
- Large cyan glowing face/eyes on a dark screen.
- Two violet/purple crystals on the head, one cyan crystal on the chest.
- Soft metallic surfaces, subtle shading, no harsh industrial details.
- Glowing cyan and violet accents that match the Code Quest palette.
- Transparent or dark-friendly background.

### Pose and proportions

- Compact, approachable proportions.
- Centered, upper-body or bust view for dashboard panels.
- Clear silhouette at small thumbnail sizes.
- Welcoming, non-threatening stance.

### Mood and personality

- Safe, careful, capable, encouraging, patient.
- Represents trustworthy AI building, not magical instant creation.
- Never pretends a failed build succeeded.
- Speaks through captions and short, child-friendly status messages.

### Visual style

- Clean semi-realistic illustration, not cartoonish or emoji-like.
- Premium dark hacker-style dashboard aesthetic.
- Modern, polished, slightly futuristic.
- Friendly for an eight-year-old child.
- No photorealism, no text, no logos, no watermarks, no copyrighted characters.

## Animation states (Rive)

From the canonical master visual reference:

1. **idle** — gentle breathing glow, waiting for the next step.
2. **scan** — searching for game systems or checking requirements.
3. **build** — actively working, small holographic tool effect.
4. **check** — inspecting or verifying the feature.
5. **success** — positive completion, subtle happy glow.
6. **safe-failure** — calm, protective reaction; rollback is safe.

Each state must loop cleanly and transition smoothly to any other state.

## Music cues

Played before selected spoken interactions, not on every animation.

- `start` — the build journey begins.
- `thinking` — planning or scanning.
- `success` — the feature passed its checks.
- `safe-failure` — a check failed and the previous version was kept safe.

## Usage in the app

- Builder Workspace dashboard card.
- Build-progress journey: `/child/quests/[id]/build`.
- Safe-failure / rollback screen.
- Anywhere the build process is shown to Linus.
- When the Rive file is available, it replaces the static fallback via the planned character animation component.

## Color reference

- Body: light grey `#e2e8f0` to `#94a3b8`
- Dark screen/face: `#0f172a` to `#020617`
- Cyan glow: `#22d3ee` / `#67e8f9`
- Violet crystals: `#a78bfa` / `#c4b5fd`
- Cyan chest crystal: `#22d3ee` / `#2dd4bf`
- Background: `#0f141c` to `#05070a`

## Notes

- The `.riv` file will be produced and exported from Rive; do not create empty placeholder `.riv` files.
- The Crystal Builder must remain visually distinct from any robot character inside The Crystal Adventure.
- All build states shown by the Crystal Builder are clearly labelled **mocked** in this milestone.
