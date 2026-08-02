# Character Asset Specifications — Crystal Code Quest

This document is the index for the two approved animated characters in Crystal Code Quest.

## Canonical visual reference

`docs/design/concept-art/crystal-code-quest-master-visual-direction.png`

That image is the single source of truth for:

- Parent Guide appearance
- Crystal Builder appearance
- dark glassmorphism style
- cyan and violet colour palette
- clothing and crystal motifs
- character proportions
- overall premium educational game direction

## Characters

| Character | File | Role | Location |
| --- | --- | --- | --- |
| Parent Guide | `docs/assets/parent-guide.md` | Warm human mentor | Child Builder home, Parent preview, help modals |
| Crystal Builder | `docs/assets/crystal-builder.md` | Friendly AI builder | Builder Workspace, build-progress journey |

## Asset paths

| Asset | Current fallback | Future Rive source |
| --- | --- | --- |
| Parent Guide | `public/parent-guide.svg` | `public/animations/parent-guide.riv` |
| Crystal Builder | static icon or SVG | `public/animations/crystal-builder.riv` |

No `.riv` files exist yet. Do not create empty placeholder `.riv` files.

## Superseded design rule

Earlier documentation and the original `design-reference.png` stated:

- “Crystal Code Quest does not use a robot as the main guide.”
- “Robots and the colourful crystal world belong inside The Crystal Adventure previews.”
- “No robots” in the Parent Guide asset prompt.

These rules are **superseded** by the canonical master visual reference, which introduces the **Crystal Builder** as the only approved robot character inside Crystal Code Quest.

The replacement rule is narrower:

- The **Parent Guide** remains a warm human mentor.
- The **Crystal Builder** is the only approved robot character.
- The **Crystal Builder** belongs only in the Builder Workspace and build-progress journey.
- The **Crystal Builder** must not merge with The Crystal Adventure player character.
- The **Crystal Adventure** remains a separate game repository.

The original documents are preserved and annotated; they are not deleted.

## Animation states

### Parent Guide

idle, wave, explain, listen, encourage, celebrate.

### Crystal Builder

idle, scan, build, check, success, safe-failure.

## Music cues

Music is a short identity cue played before selected spoken interactions, not on every animation.

### Parent Guide

- attention
- success
- warning

### Crystal Builder

- start
- thinking
- success
- safe-failure

## Interaction sequence

```
user action
  → character response animation starts
  → short music cue
  → cue ends or fades nearly silent
  → speech begins with captions
  → character returns safely to idle
```

No sound should autoplay on initial dashboard load.

## Phase 1 scope

In this milestone:

- The Parent Guide uses the existing `public/parent-guide.svg`.
- The Crystal Builder has a static fallback or icon.
- Rive runtime is not installed.
- Animation components are not implemented.
- Audio hooks are not implemented.
- Music files are not generated.
- The future Rive integration boundary is documented here.
- The verified music service integration boundary is documented in `docs/assets/music-service-boundary.md`.

Real `.riv` files and approved `.ogg` music files will be produced and integrated in a later phase.

## Related files

- `docs/assets/parent-guide.md`
- `docs/assets/crystal-builder.md`
- `docs/design/concept-art/crystal-code-quest-master-visual-direction.png`
- `docs/START_INTERFACE_DEVELOPMENT.md` (updated with superseded notes)
- `docs/crystal-code-quest-spec.md` (updated with superseded notes)
- `AGENTS.md` (updated with superseded notes)
- `public/parent-guide.svg`
