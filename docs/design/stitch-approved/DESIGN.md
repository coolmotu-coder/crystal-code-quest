---
name: Obsidian Cipher
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bacac5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#859490'
  outline-variant: '#3c4a46'
  surface-tint: '#3cddc7'
  primary: '#57f1db'
  on-primary: '#003731'
  primary-container: '#2dd4bf'
  on-primary-container: '#00574d'
  inverse-primary: '#006b5f'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#e2d3ff'
  on-tertiary: '#3c0091'
  tertiary-container: '#c9b2ff'
  on-tertiary-container: '#5b22c4'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#62fae3'
  primary-fixed-dim: '#3cddc7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  touch-target-min: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  panel-gap: 12px
---

## Brand & Style

The design system is engineered to evoke a "Junior Elite" hacker aesthetic. It shuns typical primary-colored "toy" interfaces in favor of a sophisticated, high-performance environment that treats children like emerging engineers. The brand personality is precise, mysterious, and empowering.

The design style is **Modern Technical**. It utilizes deep charcoal foundations paired with luminous, neon-adjacent accents that simulate the glow of a high-end terminal. Visual interest is driven by subtle "glass-on-void" effects, where surfaces feel like polished obsidian floating in deep space. Interaction patterns are snappy and tactile, ensuring that while the look is "pro," the usability remains accessible for an 8-year-old’s motor skills.

## Colors

The palette is built on a "Dark Mode First" philosophy to reduce eye strain during long coding sessions.

- **Foundations:** The primary canvas is `#121212`. Modular panels and elevated surfaces use `#1E293B` to create a clear visual hierarchy without needing heavy lines.
- **Accents:** Teal (`#2DD4BF`) serves as the primary "Success" and "Action" color. Cyan (`#22D3EE`) is used for informational data and interactive "Hacker" elements.
- **Secondary Actions:** Blue (`#3B82F6`) is reserved for navigational or utility buttons that are not the primary focus of the current quest.
- **Specialty:** Violet (`#8B5CF6`) is strictly gated for "The Crystal Adventure" story beats and mystical quest elements.
- **Feedback:** Use Mint (`#4ADE80`) for positive validation and code execution success states.

## Typography

The typography system balances the warmth of a modern grotesque with the technical precision of a monospaced font.

- **Headlines:** Use **Hanken Grotesk** for all major titles. It provides a clean, contemporary "tech startup" feel that respects the user's intelligence.
- **Body:** **Inter** is the workhorse for instructions and quest dialogue, chosen for its exceptional legibility at small sizes.
- **Technical/Labels:** **JetBrains Mono** is used for code snippets, data readouts, and small metadata labels to reinforce the hacker theme.
- **Accessibility:** Minimum font size for instructions is 16px to ensure readability for younger users. Use the `label-caps` role sparingly for "system status" indicators.

## Layout & Spacing

The layout uses a **Fluid Module System** rather than a traditional rigid grid. This allows the UI to feel like a "Command Center" with adjustable panels.

- **Rhythm:** All spacing is derived from an 8px base unit.
- **Targets:** A strict 48px minimum height/width for all interactive elements to accommodate developing motor skills and touch screens.
- **Module Hierarchy:** 
    - **Studio:** Uses a three-pane layout (Navigation | Editor | Preview).
    - **Quest:** Uses a centered, linear flow with generous vertical padding (64px+) to focus on progression.
    - **Command Centre:** Uses a dense, dashboard-style layout with 12px gaps between data "tiles."
- **Breakpoints:** 
    - Mobile (<768px): Single column, bottom-anchored navigation.
    - Tablet (768px - 1024px): Two-pane split view.
    - Desktop (>1024px): Full multi-panel dashboard.

## Elevation & Depth

This design system uses **Tonal Layering** and **Inner Glows** to create depth without traditional drop shadows.

- **Surface 0 (Base):** `#121212`. The background "void."
- **Surface 1 (Panels):** `#1E293B`. Used for the main editor and container areas. Features a 1px solid border of `#334155`.
- **Surface 2 (Interactive):** Elements that are clickable use a subtle inner-glow (0.5px white at 10% opacity) to appear "raised."
- **Focus State:** When an element is focused via keyboard or touch, it gains a 2px outer glow in Primary Teal (`#2DD4BF`) with a 4px blur.
- **Active State:** On press, elements shift 1px downward and increase in saturation to provide haptic-like visual feedback.

## Shapes

The shape language is **Technical-Soft**. We use a `Soft` (0.25rem / 4px) base corner radius to maintain a professional, "machined" look while preventing the interface from feeling sharp or aggressive.

- **Cards/Panels:** Use `rounded-lg` (8px) to define major workspace areas.
- **Buttons:** Use `rounded-lg` (8px) to create a clear distinction from smaller UI components.
- **Progress Paths:** In the Quest view, paths and connectors are strictly 90-degree angles with 4px radii to mimic circuit board traces.

## Components

- **Buttons:** 
    - **Primary:** Solid Teal (`#2DD4BF`) with Black text. No gradient. 
    - **Secondary:** Transparent with 1px Blue (`#3B82F6`) border.
    - **Quest-Special:** Solid Violet (`#8B5CF6`) with a subtle pulse animation for "The Crystal Adventure."
- **Command Tiles:** Used in the Game-Builder. Dark slate backgrounds with Cyan (`#22D3EE`) header text in JetBrains Mono.
- **Code Blocks:** Deep black background with 4px left-accent border in Mint (`#4ADE80`). 
- **Checkboxes/Radios:** Oversized (24px) for easy tapping. When checked, they glow with a primary accent color.
- **Input Fields:** Darker than the surface (`#0F172A`) with a bottom-only border that illuminates on focus.
- **Quest Markers:** Hexagonal shapes rather than circles to reinforce the "Crystal" and "Tech" theme.