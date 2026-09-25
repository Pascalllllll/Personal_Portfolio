# Personal Portfolio — Design Enhancement Specification

## 1. Objective

Redesign the **visual appearance and interaction design** of the existing personal portfolio website so it feels:

* Elegant
* Minimalist
* Professional
* Modern but timeless
* Premium without looking excessive
* Suitable for a professional software engineer / informatics student portfolio
* Clean enough to be credible to recruiters, companies, and technical professionals

**IMPORTANT:** This is a **visual redesign only**.

Do NOT change the portfolio's existing:

* Content
* Text
* Personal information
* Projects
* Skills
* Experience
* Education
* Contact information
* Section meaning
* URLs
* Project descriptions
* Existing functionality

Preserve all existing information exactly unless a visual implementation requires restructuring the DOM without changing the actual content.

The goal is to make the existing portfolio **look significantly more refined**, not to rewrite or expand it.

---

# 2. Overall Design Direction

Use a design language inspired by **high-end professional technology companies, architecture portfolios, premium editorial websites, and modern developer portfolios**.

Avoid the stereotypical "AI-generated portfolio" appearance.

Do NOT use:

* Excessive gradients
* Excessive glassmorphism
* Neon colors
* Huge glowing text
* Generic purple/blue AI gradients
* Excessive rounded cards
* Random decorative blobs
* Excessive floating elements
* Overuse of shadows
* Excessive animations
* Generic "AI SaaS landing page" aesthetics

The website should feel intentionally designed by a professional human designer.

### Visual keywords

`minimal`
`editorial`
`precise`
`quiet luxury`
`professional`
`technical`
`architectural`
`refined`
`timeless`
`high-end`
`restrained`

---

# 3. Typography

Typography is one of the most important aspects of the redesign.

Use professional, established typefaces that are widely used in real-world corporate, editorial, technology, and design environments.

Avoid fonts that strongly resemble current AI-generated website trends.

### Preferred typography direction

Use a combination of:

**Primary Sans Serif**

Prefer established professional typefaces such as:

* Helvetica Neue
* Helvetica
* Neue Haas Grotesk
* Arial
* Inter
* IBM Plex Sans
* Avenir / Avenir Next
* Univers
* Frutiger

**Optional Editorial / Display Typeface**

For very limited headings or visual accents, consider:

* Garamond
* Baskerville
* Georgia
* Times New Roman
* Source Serif

Do not use decorative display fonts.

### Typography hierarchy

Create a clear hierarchy:

```text
Large Hero Heading
↓
Section Heading
↓
Subheading
↓
Body Text
↓
Metadata / Labels
```

Typography should rely primarily on:

* Size
* Weight
* Line height
* Letter spacing
* Whitespace

rather than decorative effects.

Avoid excessive bold text.

---

# 4. Color System

Use a restrained professional color palette.

### Preferred base

Light mode:

```text
Background: warm off-white / very light neutral
Primary text: near-black
Secondary text: muted gray
Borders: subtle neutral gray
Accent: one restrained professional accent color
```

Dark mode, if the existing website supports it:

```text
Background: deep charcoal / near-black
Primary text: off-white
Secondary text: muted gray
Borders: subtle dark gray
Accent: restrained
```

Do not introduce multiple accent colors.

The design should remain visually coherent even if the accent color is removed.

---

# 5. Layout Philosophy

Use generous whitespace.

The website should not feel crowded.

Use:

* Large margins
* Consistent horizontal alignment
* Strong vertical rhythm
* Clear section boundaries
* Asymmetric layouts where appropriate
* Editorial-style composition
* Controlled content width

Avoid making every section look like a collection of cards.

Not every piece of information needs to be inside a box.

---

# 6. Navigation

Redesign the navigation to feel extremely clean.

The navigation should:

* Remain visually lightweight
* Have strong alignment
* Use small but readable typography
* Have subtle hover states
* Avoid excessive borders
* Avoid large rounded navigation containers

If appropriate, implement a sticky navigation bar with subtle backdrop treatment.

When scrolling:

* Navigation may slightly reduce in height
* Background may transition subtly
* Do not create an exaggerated animation

The navigation should always feel secondary to the content.

---

# 7. Hero Section

Enhance the existing hero section without changing its content.

The hero should immediately communicate that this is a **personal professional portfolio**.

Use:

* Strong typography
* Large whitespace
* Precise alignment
* Minimal visual decoration
* Subtle motion

Avoid:

* Giant gradient text
* Excessive 3D objects
* Random floating icons
* Stock illustrations
* Artificial-looking AI visuals

The existing personal information must remain unchanged.

---

# 8. Scroll-Based Layer Animation

One of the primary visual enhancements should be a **layered scroll interaction**.

Each major portfolio segment should feel like it has its own visual layer.

Concept:

```text
SECTION 01
──────────────

      ↓ scroll

SECTION 02
──────────────

      ↓ scroll

SECTION 03
──────────────
```

Instead of simply moving vertically, sections should transition with subtle depth.

### Recommended behavior

When entering a new major section:

1. Current section gradually moves out of focus.
2. Next section appears as a new visual layer.
3. Background or surface transitions subtly.
4. Typography moves slightly slower/faster than surrounding elements.
5. Content remains readable throughout the animation.

Use subtle:

* `translateY`
* `scale`
* `opacity`
* `clip-path`
* `transform`
* parallax
* z-index layering

Do NOT make the animation feel like a slideshow.

The user should still feel that they are naturally scrolling through a website.

---

# 9. Section Layer Concept

Treat each major section as a visual plane.

Example conceptual structure:

```text
┌───────────────────────────────┐
│                               │
│        ABOUT / SECTION        │
│                               │
└───────────────────────────────┘
              ↓
       subtle transition
              ↓
┌───────────────────────────────┐
│                               │
│       PROJECTS / SECTION      │
│                               │
└───────────────────────────────┘
              ↓
       subtle transition
              ↓
┌───────────────────────────────┐
│                               │
│       EXPERIENCE / SECTION    │
│                               │
└───────────────────────────────┘
```

The layers should feel connected rather than isolated.

---

# 10. Scroll Animation Principles

Animations must follow these principles:

### Subtle

The animation should enhance the interface rather than become the interface.

### Fast enough

Do not force the visitor to wait for animations.

### Responsive to scrolling

Animations should be connected to scroll progress where appropriate.

### Professional

Avoid:

* exaggerated bouncing
* excessive rotations
* spinning cards
* aggressive zooming
* unnecessary 3D effects

### Accessibility

Respect:

```css
prefers-reduced-motion
```

When reduced motion is enabled, significantly reduce or disable non-essential animation.

---

# 11. Custom Mouse Cursor

Add a custom mouse interaction while preserving normal usability.

The cursor should feel:

* Minimal
* Elegant
* Technical
* Subtle

Avoid giant custom cursors.

### Recommended design

Use:

```text
small central dot
+
subtle outer ring
```

The outer ring can react to interactive elements.

Example states:

```text
Normal
→ small dot + thin ring

Hover link
→ ring expands slightly

Hover button
→ subtle scale transition

Hover project
→ subtle visual response
```

Use smooth interpolation rather than instant changes.

The cursor must never interfere with clicking or text selection.

Use:

```css
pointer-events: none;
```

for the visual cursor layer.

On touch devices:

* Disable the custom cursor
* Use the native touch interaction

---

# 12. Hover Interactions

Use micro-interactions throughout the website.

Examples:

### Links

Subtle underline animation:

```text
──────────────
     →
──────────────
```

### Buttons

Small movement or background transition.

### Project items

Subtle image scale or typography movement.

### Navigation

Small opacity / position transition.

Avoid excessive hover effects.

---

# 13. Project Section

Do NOT change the projects themselves.

Only improve their presentation.

Possible visual treatment:

* Large project thumbnails
* Editorial project rows
* Numbered project list
* Large typography
* Minimal metadata
* Hover image preview

Avoid turning every project into a generic:

```text
┌─────────────┐
│   IMAGE     │
├─────────────┤
│ TITLE       │
│ DESCRIPTION │
│ TECH STACK  │
└─────────────┘
```

card grid unless the current structure strongly requires it.

Prefer a more editorial presentation.

---

# 14. Skills Section

Keep the existing skills exactly as they are.

Improve visual presentation through:

* Typography
* Spacing
* Grouping
* Subtle separators
* Minimal interaction

Avoid excessive skill bars.

Do NOT use fake percentage indicators such as:

```text
JavaScript ██████████ 95%
```

unless they already exist in the original portfolio.

---

# 15. About / Profile Section

Preserve all existing content.

Use an editorial layout with:

* Strong section heading
* Large whitespace
* Carefully controlled text width
* Optional visual divider
* Subtle typography contrast

Do not add fabricated personal information.

---

# 16. Experience / Education

Maintain the original information.

Use a clean timeline or editorial list if appropriate.

Example visual structure:

```text
2026
│
├── Experience / Education
│
│   Description
│
2025
│
├── Experience / Education
│
│   Description
```

Use subtle lines rather than heavy cards.

---

# 17. Footer

Keep the footer minimal.

Use:

* Existing contact information
* Existing social links
* Existing copyright information

Do not add unnecessary content.

The footer should feel like a natural conclusion to the page.

---

# 18. Image Treatment

Existing images should remain recognizable.

Improve presentation using:

* Aspect-ratio consistency
* Controlled cropping
* Subtle border radius
* Editorial framing
* Hover scale
* Grayscale-to-color transitions only if appropriate

Do not replace personal/project images with AI-generated imagery unless explicitly requested.

---

# 19. Motion Language

The entire website should use one consistent motion system.

Recommended principles:

```text
Duration:
200–700ms for micro interactions

Easing:
ease-out / cubic-bezier

Large section transitions:
smooth and controlled

Hover:
fast

Page-level transitions:
slow but subtle
```

Avoid random animation durations.

All animations should feel like part of the same design system.

---

# 20. Responsive Design

The redesign must work well on:

* Desktop
* Laptop
* Tablet
* Mobile

Desktop should take advantage of:

* Large whitespace
* Horizontal composition
* Layered scrolling
* Custom cursor

Mobile should prioritize:

* Readability
* Touch interaction
* Simple vertical flow
* Reduced animation
* No custom cursor

Do not simply scale the desktop design down.

Create appropriate responsive behavior.

---

# 21. Performance

Animations must remain performant.

Prefer:

```css
transform
opacity
will-change
```

when appropriate.

Avoid excessive layout-triggering animations.

Do not animate:

```text
width
height
top
left
margin
padding
```

continuously during scroll if transform-based alternatives are possible.

Use GPU-friendly transitions where appropriate.

---

# 22. Technical Implementation Principles

If the project already uses a framework, preserve the existing framework.

Do not rewrite the application architecture unnecessarily.

Do not replace the existing stack just for visual redesign.

Modify:

* CSS
* Styling
* Components
* Animation logic
* Layout
* Interaction behavior

only where required for the visual enhancement.

Keep the implementation maintainable.

Avoid unnecessary dependencies.

If an animation library already exists, reuse it when appropriate.

Otherwise, prefer lightweight native CSS/JavaScript solutions.

---

# 23. Anti-AI Design Rule

The final website must **not look like it was generated from a generic AI website template**.

Avoid the visual patterns commonly associated with AI-generated portfolios:

* Purple-blue gradients
* Huge centered hero text
* Glassmorphism everywhere
* Excessive rounded rectangles
* Floating gradient blobs
* Excessive glowing effects
* Generic "creative developer" layouts
* Excessive animated text
* Random geometric decorations
* Too many badges
* Excessive icons
* Overly futuristic interfaces

Instead, prioritize:

```text
Typography
Whitespace
Grid
Hierarchy
Alignment
Contrast
Rhythm
Editorial composition
Subtle motion
```

The design should look believable as a portfolio created by a professional designer/developer.

---

# 24. Content Preservation Rule

This is extremely important.

### DO NOT:

* Rewrite text
* Improve grammar
* Change descriptions
* Add projects
* Remove projects
* Invent experience
* Invent achievements
* Change personal information
* Change skills
* Change education
* Change contact information
* Add fake statistics
* Add testimonials
* Add fabricated clients
* Add fabricated companies

### ONLY:

Improve how the existing information is presented.

If a content change appears necessary for layout reasons, preserve the exact wording and meaning.

---

# 25. Final Visual Target

The final result should feel like:

> A carefully art-directed professional personal portfolio belonging to a technically skilled developer, combining Swiss/editorial design principles with modern web interaction.

It should be:

**Minimal without being empty.**

**Elegant without being luxurious.**

**Technical without being overly futuristic.**

**Animated without being distracting.**

**Professional without feeling corporate or boring.**

**Personal without becoming visually chaotic.**

---

# 26. Final Implementation Checklist

Before considering the redesign complete, verify:

* [ ] Existing content is unchanged
* [ ] Existing personal information is unchanged
* [ ] Existing projects are unchanged
* [ ] Existing links still work
* [ ] Existing functionality still works
* [ ] Typography looks professional
* [ ] Typography does not resemble generic AI-generated websites
* [ ] Layout has strong whitespace
* [ ] Sections have clear visual hierarchy
* [ ] Scroll transitions use subtle layered motion
* [ ] Custom cursor works on desktop
* [ ] Custom cursor is disabled on touch devices
* [ ] Hover states are subtle
* [ ] Animations are consistent
* [ ] `prefers-reduced-motion` is respected
* [ ] Mobile layout remains usable
* [ ] No unnecessary gradients
* [ ] No excessive glassmorphism
* [ ] No excessive rounded cards
* [ ] No unnecessary decorative elements
* [ ] Performance remains smooth
* [ ] The final result feels human-designed rather than AI-template-generated

## Core Principle

**Do not redesign the person's identity or content. Redesign the experience of viewing it.**

📝 7. Implementation Decisions (added by Claude, 2026-09-26)

Dial: ENERGY 1 / RHYTHM 2 / MOTION 1, plus one owner-requested exception below

Choices the owner made where this file offered options:

Headings: Playfair Display. Body: Plus Jakarta Sans. Metadata: JetBrains Mono.

Accent: soft gold and soft purple instead of blue. Purple fills the primary button (#E6DFF5 light, #2E2742 dark) with ink text on top, and draws the keyboard focus ring (#8B7CC8 light, #B7A8E6 dark). Gold (#C8A64E light, #D9C27A dark) is used only for link underlines and the full stop after headings. It never carries text, because the soft gold is 2.2:1 on the light background.

Icons: Lucide at strokeWidth 1.5, functional icons only (GitHub, LinkedIn, mail, download, theme, menu, external link). Kept by owner choice despite antislop R-04.

Contrast fixes (WCAG AA 4.5:1):

Text Tertiary light: #A3A3A3 fails (2.42:1 on #FAFAFA), use #666666 (5.50:1). #737373 passed on the flat background but not over the fluid tint.

Text Tertiary dark: #525252 fails (2.53:1 on #0A0A0A), use #8A8A8A (5.73:1).

Input borders use #737373 in both modes so they meet the 3:1 non-text minimum.

Structure: Hero, Projects, About (bio, facts, focus areas, technologies), Contact. The Writing section is left out until there are real articles. Project screenshots and metrics are left out until real ones exist.

Click burst (owner override of "No Unnecessary Animations" and antislop R-19): each pointer click sends 7 thin purple bars outward from the click point, each rotated along its own random radial angle, fading within about 0.6s. It is decorative, ignores keyboard activation, and is disabled under prefers-reduced-motion.

Fluid background (owner override of "No Unnecessary Animations", "Content-First, Not Decor-First" and antislop R-07/R-19): a WebGL stable-fluids field behind the content, stirred by curl noise and pushed by the pointer, with a small impulse on click. Its color never goes past #ECE7F7 (purple) and #F5EFDA (gold) in light mode, or #242034 and #24201A in dark mode, so all text keeps AA contrast over it, including where the two colors overlap (4.65:1 light, 4.57:1 dark for tertiary text). Mobile gets ambient motion only at low resolution; tablets get half-strength touch interaction; prefers-reduced-motion shows one still frame with no interaction.
