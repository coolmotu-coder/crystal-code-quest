# Parent Guide — Asset Specification

> **Canonical visual reference:** `docs/design/concept-art/crystal-code-quest-master-visual-direction.png`
> See also the companion `crystal-builder.md` for the approved AI builder character.

## Files

- **Vector placeholder:** `public/parent-guide.svg`
  - 512 × 640 portrait viewBox
  - Original vector illustration
  - Transparent/dark-friendly
  - Teal, cyan, and subtle violet accent lighting
  - Soft glow and faint crystal hexagons
  - No text, no logos, no watermark
- **Future Rive source:** `public/animations/parent-guide.riv` (to be produced in Rive)
- **Production prompt:** this document

## Superseded rule

The historical line in this prompt that said “No robots” was written when the design direction only included the Parent Guide. The canonical master visual reference now introduces the **Crystal Builder** as the approved AI builder character inside Crystal Code Quest. That rule is superseded for the Parent Guide asset specifically: the Parent Guide remains human, while the Crystal Builder is the only approved robot in Code Quest.

## Image-generation prompt

Use this prompt with a trusted image generator or illustrator to create a final high-resolution raster portrait.

```text
Original illustrated waist-up portrait of a warm, calm, capable adult mentor character called the Parent Guide, for a premium dark-tech children’s coding-learning interface.

Style:
- Clean semi-realistic illustration, not cartoon, not anime, not photoreal.
- Premium dark hacker-style dashboard aesthetic.
- Modern, slightly futuristic, polished.
- Friendly and approachable for an eight-year-old child.

Subject:
- One adult, centered, waist-up, face and shoulders clearly visible.
- Gender-neutral or softly maternal/paternal friendly presence.
- Gentle smile, calm open expression, reassuring relaxed posture.
- Looking slightly toward the viewer.
- Should feel like a supportive mentor helping a child learn coding.

Visual design:
- Dark charcoal or near-black background, transparent-friendly.
- Soft teal, cyan, and subtle violet accent lighting around the figure.
- Soft glow / rim light behind the head and shoulders.
- Subtle tech/crystal motif details: faint geometric seams on clothing, a small glowing crystal accent on the collar, faint hexagonal halo in background.
- No childish costume, no fantasy armor, no photorealism, no emoji style.
- No text, no logos, no watermark, no copyrighted characters.

> Historical note: an older version of this prompt included “No robots.” That rule is superseded; the companion Crystal Builder is the only approved robot in Code Quest. The Parent Guide remains human.

Composition:
- Portrait orientation (4:5 or 3:4).
- Centered subject with clean padding for cropping inside a dashboard card.
- Face and shoulders remain readable at small thumbnail sizes.

Mood:
- Safe, trustworthy, patient, intelligent, encouraging, calm.
- Dark glassmorphism dashboard compatibility.
```

## Recommended export formats

| Use | Format | Size | Notes |
| --- | ------ | ---- | ----- |
| App default | WebP / AVIF | 512 × 640 | lossy at quality 85 |
| Fallback | PNG | 512 × 640 | preserve alpha if needed |
| Vector fallback | SVG | scalable | current `public/parent-guide.svg` |
| Rive animation | `.riv` | 512 × 640 source | `public/animations/parent-guide.riv` |
| Hi-res source | PSD / Procreate | 1024 × 1280+ | keep layers for future edits |

## Animation states (Rive)

From the canonical master visual reference:

1. **idle** — calm, breathing, subtle crystal glow.
2. **wave** — friendly greeting when the panel appears.
3. **explain** — gesturing with one hand while teaching.
4. **listen** — attentive, open posture, encouraging nod.
5. **encourage** — warm supportive gesture, slight smile.
6. **celebrate** — gentle, positive reaction to learner success.

Each state must loop cleanly and transition smoothly to any other state.

## Music cues

Played before selected spoken interactions, not on every animation.

- `attention` — panel appears or next step is introduced.
- `success` — learner completes a step or gate.
- `warning` — correction or important safety reminder.

## Usage in the app

- Child Builder home panel: `/child/home`
- Parent experience preview banner: `/parent/preview`
- Learning and quest help modals
- Use as a small circular/rounded card crop or full portrait card
- When the Rive file is available, it replaces the SVG via the planned character animation component

## Color reference

- Background: `#0f141c` to `#05070a`
- Teal glow: `#2dd4bf` / `#5eead4`
- Cyan glow: `#22d3ee`
- Violet accent: `#818cf8`
- Clothing: `#1e293b` to `#0f172a`

## Notes

- The SVG is a placeholder and can be swapped with a final raster once the prompt is produced.
- The future `.riv` file will be produced and exported from Rive; do not create empty placeholder `.riv` files.
- Keep the same filename and path (`/parent-guide.svg`) to avoid updating component references until the Rive integration is ready.
