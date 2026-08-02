# Parent Guide — Rive Production Handoff

> **Scope:** this document prepares the production boundary for the Parent Guide Rive implementation. It does not create a `.riv` file, install the Rive runtime, or modify production code.
>
> **Status:** awaiting editable source artwork and Rive production.

---

## A. Canonical references

| Reference | Path | Authority |
| --- | --- | --- |
| Master visual direction | `docs/design/concept-art/crystal-code-quest-master-visual-direction.png` | Single source of truth for overall product visual language: dark glassmorphism, cyan and violet palette, Parent Guide role, Crystal Builder role, dashboard integration, and premium educational-game tone. |
| Rigging reference | `docs/design/characters/parent-guide-rig-reference.png` | Single source of truth for Parent Guide face, hair, clothing, crystal pendant, proportions, full-body views, dashboard crop, facial expressions, pose references, separable Rive layers, and rigging guidance. |

Both references must be visible to the Rive animator before any source artwork is recreated. The rigging reference is the primary guide for layer hierarchy and pivots; the master visual direction is the primary guide for colour, mood, dashboard integration, and the distinction between the Parent Guide and the Crystal Builder.

---

## B. Character identity lock

The approved Parent Guide visual identity is:

- **Female-presenting adult mentor.** The reference shows a warm, capable, adult woman.
- **Long dark wavy hair**, with face-framing strands in front and a fuller mass behind.
- **Warm expressive face** with readable eyebrows, gentle eyes, and a friendly smile.
- **Dark hoodie or jacket** with subtle cyan trim and restrained geometric accents.
- **Glowing cyan crystal pendant** at the collar — the only crystal element on the character.
- **Premium illustrated game style**, not photorealistic, not anime, not childish or cartoonish.
- **Clearly human.** The Parent Guide is not the Crystal Builder robot and must never be confused with it.

The same face, clothing, hair, colours, and proportions must remain consistent across all animations. Any artwork that drifts from the two canonical references (e.g., different face shape, hair length, jacket style, or pendant colour) must be rejected.

---

## C. Required source artwork

The current PNG references are **visual targets only**. They cannot be imported directly into Rive as a finished rigged character.

The Rive animator must receive **editable source artwork**:

- **Preferred:** SVG, AI, or layered vector source with all named parts separated.
- **Acceptable:** PSD only if every major part is on its own clearly named layer and suitable for vector recreation.
- **Not acceptable:** flattened PNGs, JPGs, or any raster image presented as the rigged source.

The character must be recreated as editable layered vectors before rigging. This includes clean vector shapes for limbs, hands, facial features, hair strands, clothing, and the pendant glow.

---

## D. Exact layer hierarchy

The Rive file must use the following lowercase `snake_case` layer hierarchy. These names match the rigging reference and must not be renamed or flattened.

```
root
  body
    hips
    torso
      jacket_outer
      shirt_inner
      hood
      neck
      head
        hair_back
        hair_front
        hair_side_left
        hair_side_right
        eyebrow_left
        eyebrow_right
        eye_left
        eye_right
        eyelid_left
        eyelid_right
        pupil_left
        pupil_right
        nose
        mouth
      upper_arm_left
        lower_arm_left
          hand_left
      upper_arm_right
        lower_arm_right
          hand_right
      leg_left
      leg_right
      shoe_left
      shoe_right
      crystal_pendant
      cyan_accent_glow
      crystal_particles_optional
```

### Layers that must remain separate

Do **not** flatten:

- `hair_front` and `hair_back` — needed for readable head turns and secondary motion.
- `hair_side_left` and `hair_side_right` — needed for asymmetrical hair movement.
- `jacket_outer`, `shirt_inner`, and `hood` — needed for arm and shoulder deformation.
- `torso` and `hips` — needed for breathing and posture shifts.
- `upper_arm_*`, `lower_arm_*`, and `hand_*` — needed for clean elbow and wrist pivots.
- `eye_*`, `pupil_*`, and `eyelid_*` — needed for blinks, gaze direction, and expression.
- `eyebrow_*` and `mouth` — needed for expression controls.
- `crystal_pendant` and `cyan_accent_glow` — needed for independent glow and secondary motion.

`crystal_particles_optional` is optional visual sparkle around the pendant. If omitted, `cyan_accent_glow` must still animate.

---

## E. Rig points

The following pivots and controls must be present and cleanly placed at natural joint locations:

| Rig point | Location | Purpose |
| --- | --- | --- |
| `root` | Bottom of the feet / ground contact | Global position, safe return anchor. |
| `hips` | Centre of pelvis / waistline | Lower-body posture and breathing base. |
| `torso` | Upper chest, above stomach | Upper-body rotation and breathing. |
| `neck` | Base of neck | Head movement and orientation. |
| `head` | Centre of skull | Head turns, nods, and tilts. |
| `shoulder_left` / `shoulder_right` | Outer shoulder seam | Arm raising and lowering. |
| `elbow_left` / `elbow_right` | Elbow joint | Arm bending for wave, speak, and celebrate. |
| `wrist_left` / `wrist_right` | Wrist joint | Hand rotation and gesture readability. |
| `eye_direction` | Both eye groups | Horizontal and vertical gaze control (subtle range only). |
| `eyelid_left` / `eyelid_right` | Eyelid shapes | Blink and half-lid expression. |
| `eyebrow_left` / `eyebrow_right` | Eyebrow shapes | Expression: neutral, smile, concern, encouragement. |
| `mouth_shape` | Mouth group | Simple mouth opening and shape for speaking state. |
| `pendant_secondary` | Crystal pendant | Subtle sway and glow pulse tied to torso movement. |
| `hair_secondary` | Hair back and side strands | Restrained follow-through motion, never exaggerated. |

Hands must remain readable at dashboard-card size. Fingers do not need individual joints in v1, but the hand shape should clearly read as a wave, open palm, or small fist.

---

## F. Version-one animations

V1 is limited to four animations. Future poses such as `explain`, `listen`, and `encourage` are reference poses for v2; they are not separate v1 animations.

### 1. idle

| Property | Value |
| --- | --- |
| Purpose | Default resting state. |
| Duration | Continuous loop. |
| Loops | Yes. |
| Body movement | Subtle breathing: torso expands slightly, shoulders rise and fall, hips stay grounded. |
| Face movement | Occasional blink (every 3–5 seconds), soft neutral-to-slight-smile expression, rare micro head tilt. |
| Hand movement | Hands rest at sides or in a relaxed neutral pose; minimal motion. |
| Entry transition | Cut or short fade from any previous state. |
| Exit transition | Immediate response to trigger; no lingering motion. |
| Reduced motion equivalent | Static standing pose, breathing removed, occasional blink only. |

### 2. wave

| Property | Value |
| --- | --- |
| Purpose | Friendly greeting when the panel appears or when the user returns. |
| Duration | Approximately 1.5–2.0 seconds. |
| Loops | No. |
| Body movement | Slight lean forward, shoulder and torso turn toward the user. |
| Face movement | Warm smile, eyes open and engaged. |
| Hand movement | One natural friendly wave (raise, two small waggles, lower). |
| Entry transition | Begin from idle pose. |
| Exit transition | Return safely to idle pose and expression. |
| Reduced motion equivalent | Short smile and slight hand lift without repeated motion. |

### 3. speak

| Property | Value |
| --- | --- |
| Purpose | Active while the guide is delivering text or captions. |
| Duration | Active while `speak_active` boolean is true. |
| Loops | Yes (continuous while active). |
| Body movement | Subtle head and hand gestures; restrained, not theatrical. |
| Face movement | Mouth shape changes without phoneme-level lip sync; occasional blink; engaged expression. |
| Hand movement | Small open-palm or gesturing motions that do not obscure the face. |
| Entry transition | Begin from idle. |
| Exit transition | When `speak_active` becomes false, mouth closes and returns to idle within ~0.3 s. |
| Reduced motion equivalent | Static speaking pose, mouth slightly open, no repeated hand or head motion. |

### 4. celebrate

| Property | Value |
| --- | --- |
| Purpose | Positive reaction to learner success, not a party animation. |
| Duration | Approximately 2.0–2.5 seconds. |
| Loops | No. |
| Body movement | Small, grounded upward motion; no jumping or leaving the ground. |
| Face movement | Warm smile, eyes bright, possible quick blink. |
| Hand movement | Small fist or open-hand celebration near chest/shoulder height. |
| Entry transition | Begin from idle. |
| Exit transition | Return safely to idle pose and expression. |
| Reduced motion equivalent | Brief smile and small hand lift, no body bounce. |

---

## G. State machine contract

**Name:** `parent_guide_state_machine`

### Inputs

| Input name | Type | Purpose |
| --- | --- | --- |
| `wave_trigger` | Trigger | Play the wave animation once, then return to idle. |
| `speak_active` | Boolean | While true, play the speak animation loop; when false, return to idle. |
| `celebrate_trigger` | Trigger | Play the celebrate animation once, then return to idle. |
| `reduced_motion` | Boolean | When true, all animations use their reduced-motion equivalent. |

### Allowed transitions

```
idle ──wave_trigger──► wave ──► idle
idle ──speak_active=true──► speak ──speak_active=false──► idle
idle ──celebrate_trigger──► celebrate ──► idle
```

### Fallback rule

All unexpected transitions must fall back safely to `idle`. If a trigger fires during an active animation, the current animation should complete its natural exit, then the new state may play, or the animator may choose to queue the trigger and return to idle first. Under no circumstances may the character freeze, loop an unfinished pose, or enter an undefined state.

---

## H. Dashboard integration boundary

| Asset | Path | Status |
| --- | --- | --- |
| Future Rive file | `public/animations/parent-guide.riv` | To be produced later; not created in this task. |
| Current fallback | `public/parent-guide.svg` | Must remain in place and working until the real `.riv` file is validated. |

The React component integration is **not** implemented in this task. The handoff only documents the boundary so a future integration can swap the SVG for the validated Rive file using the exact state machine name and inputs above.

---

## I. Accessibility

The Rive animation must respect the following accessibility requirements:

- **Reduced motion support:** `reduced_motion` boolean disables non-essential motion and uses static equivalents.
- **Static fallback:** `public/parent-guide.svg` remains the fallback for users who disable animations or when Rive fails to load.
- **Captions:** Captions must always be visible when the guide is speaking. No essential information may be conveyed by animation alone.
- **No autoplay sound:** The animation may autoplay on panel entry, but no sound may play on initial page load.
- **Skippable animation:** Users must be able to skip or hide the animated panel without losing the guide's message.
- **Keyboard interaction:** The guide panel must be keyboard focusable and operable.
- **Visible focus:** The panel container must have a clear visible focus state matching the design system.
- **Respect `prefers-reduced-motion`:** The component must map the system preference to the `reduced_motion` state machine input.

---

## J. Rive acceptance checklist

Before the `.riv` file is accepted for integration, verify:

- [ ] Visual match to `docs/design/concept-art/crystal-code-quest-master-visual-direction.png` for colour, mood, and dashboard integration.
- [ ] Visual match to `docs/design/characters/parent-guide-rig-reference.png` for face, hair, clothing, pendant, and proportions.
- [ ] Character identity remains consistent across all four v1 animations: female-presenting adult mentor, dark hoodie/jacket, cyan crystal pendant.
- [ ] Parent Guide is visually distinct from the Crystal Builder robot.
- [ ] All required layers from Section D are present and named exactly as specified.
- [ ] No layers that must remain separate are flattened together.
- [ ] Shoulder, elbow, and wrist pivots are clean and do not tear clothing.
- [ ] Hands are readable at dashboard-card size.
- [ ] Four v1 animations are present: `idle`, `wave`, `speak`, `celebrate`.
- [ ] State machine is named exactly `parent_guide_state_machine`.
- [ ] Inputs are named exactly `wave_trigger`, `speak_active`, `celebrate_trigger`, `reduced_motion`.
- [ ] All animations return safely to `idle`.
- [ ] Unexpected triggers fall back to `idle`.
- [ ] Reduced-motion behaviour works for every animation.
- [ ] `public/parent-guide.svg` fallback remains in the repository and continues to work.
- [ ] Animation is usable at dashboard-card size without loss of expression.
- [ ] No resemblance to copyrighted or real-world characters.
- [ ] No photorealism, no anime style, no childish cartoon style.

---

## Unresolved production requirements

The following items are intentionally deferred until Rive production begins:

1. **Editable source artwork delivery.** A vector or layered PSD source must be produced before rigging can begin.
2. **Rive file export.** The `.riv` file at `public/animations/parent-guide.riv` must be produced in Rive and validated.
3. **Runtime installation.** The `@rive-app/react-canvas-lite` or equivalent runtime is not installed in this milestone.
4. **React component integration.** The SVG-to-Rive swap component will be implemented in a later phase.
5. **Audio coordination.** Music cues are documented elsewhere (`docs/assets/music-service-boundary.md`) and remain out of scope for this handoff.
6. **Future v2 animations.** `explain`, `listen`, and `encourage` are documented as reference poses but not implemented as separate v1 animations.

---

## Related files

- `docs/assets/parent-guide.md` — Parent Guide asset specification
- `docs/assets/character-specs.md` — Character index and superseded-rule history
- `docs/assets/crystal-builder.md` — Crystal Builder specification
- `docs/assets/music-service-boundary.md` — Music cue boundary (deferred)
- `docs/design/concept-art/crystal-code-quest-master-visual-direction.png` — Canonical master visual direction
- `docs/design/characters/parent-guide-rig-reference.png` — Rigging reference
- `public/parent-guide.svg` — Current static fallback
- `public/animations/parent-guide.riv` — Future Rive file (not yet created)
