# Portfolio Design System

This file describes the portfolio as it is built and deployed at https://hosea-felix-sanjaya.vercel.app/. It is the reference for any future change: when the site changes, update this file in the same commit.

## 1. Direction

An editorial, restrained portfolio for an Informatics student who works on data, databases and Linux theming. Typography, whitespace and alignment carry the design; color is one soft accent per theme. The motion layer (fluid smoke, directional cursor, click burst) is the one deliberately playful element, and it always stays behind or beside the content.

Dials: **ENERGY 2 / RHYTHM 2 / MOTION 2**

Keywords: `editorial` `precise` `quiet` `technical` `personal`

Avoided on purpose: gradient text, glassmorphism beyond the navbar, glow, badge pills, stock illustrations, fake statistics, testimonials.

## 2. Typography

| Role | Typeface | Weights | Used for |
|---|---|---|---|
| Display | Playfair Display | 500, 600, 700 | Hero name, section headings, organisation and project titles |
| Body | Plus Jakarta Sans | 400, 500, 600 | All running text, navigation, buttons |
| Mono | JetBrains Mono | 400 | Tags, years, experience monograms |

Fonts load through `next/font/google` with `display: swap`.

| Level | Style |
|---|---|
| Hero name | Display 700, `clamp(2.5rem, 7vw, 4.5rem)`, line height 1.05, tight tracking |
| Section heading | Display 600, 1.75rem (2.25rem from `md`), followed by an accent full stop |
| Section label | Body, 14px, faint color, above the heading |
| Card and entry titles | Display 500, 20px |
| Body | 16px, line height 1.6 |
| Metadata | 14px faint, or mono 12px inside tags |

## 3. Color

All colors are CSS variables in `app/globals.css`, exposed to Tailwind in `tailwind.config.ts`. The theme follows the system setting and can be switched in the navbar (`next-themes`, class strategy).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#FAFAFA` | `#0A0A0A` | Page background |
| `--raised` | `#FFFFFF` | `#121212` | Cards, inputs, preview card |
| `--line` | `#E5E5E5` | `#262626` | Dividers, card borders |
| `--line-strong` | `#737373` | `#666666` | Input borders, card hover border |
| `--ink` | `#171717` | `#F5F5F5` | Primary text |
| `--muted` | `#525252` | `#A3A3A3` | Secondary text |
| `--faint` | `#666666` | `#8A8A8A` | Labels, metadata |
| `--tag-bg` / `--tag-ink` | `#F5F5F5` / `#404040` | `#262626` / `#D4D4D4` | Tags |
| `--scrollbar` / `--scrollbar-hover` | `#C7C7C7` / `#A3A3A3` | `#3A3A3A` / `#555555` | Scrollbar thumb |

### Accent

One accent per theme: **purple in light mode, gold in dark mode.**

| Token | Light | Dark |
|---|---|---|
| `--accent` | `#8B7CC8` | `#D9C27A` |
| `--accent-soft` (button fill) | `#E6DFF5` | `#2E2716` |
| `--accent-soft-hover` | `#D9CEF0` | `#3B321C` |
| `--accent-border` | `#8B7CC8` | `#726642` |
| `--selection` | `#D9CEF0` | `#4A3F22` |

The accent appears on: button fill and border, link underlines, the heading full stop, the typing caret, the keyboard focus ring, the project card focus ring, current-role markers, the cursor arrow, click burst bars and the fluid smoke. It never colors body text; text on accent surfaces is always `--ink`.

### Contrast

- All text meets WCAG AA (4.5:1) on `--paper`, `--raised` and over the strongest fluid tint.
- Faint text: 5.50:1 light, 5.73:1 dark on the flat background; 4.74:1 and 4.52:1 over the fluid.
- Input borders meet the 3:1 non-text minimum in both themes.

## 4. Layout

- Content column: `max-w-4xl` (896px), side padding 16px, 24px from `sm`.
- Sections: 64px vertical padding, 96px from `md`, separated by a 1px `--line` border.
- Navbar height 64px; anchor jumps are offset by 80px (`scroll-padding-top`).
- Radius scale: 4px tags, 6px buttons and tiles, 8px cards and photo, 12px the project focus ring.
- Page order: **Hero, About, Projects, Experience, Contact, Footer.** The navbar links to About, Projects, Experience and Contact.

## 5. Components

### OS gate
Shown once per browser session before the portfolio (`components/OsGate.tsx`). Centered display heading "What is your Operating System?" with an accent question mark, and three `.btn-outline` choices (Windows, MacOS, Linux) that lift 2px and fill with accent-soft on hover. Windows and MacOS show "Sorry, you are not eligible to visit this website." for 3s, then "Just Kidding XD" for 1.5s; Linux shows "Cool.." for 2s. Then the gate fades out and the portfolio fades in: the hero plays its staggered reveal at that moment, and the name typing cycle only starts then, so the page always opens on "Hosea Felix Sanjaya." The fluid background, cursor and click burst stay live behind it. An inline script in `app/layout.tsx` adds `html.gate-open` before paint unless `sessionStorage["os-gate-done"]` is set; while it is open, the page is `visibility: hidden` (so it is out of the tab order too) and doesn't scroll.

### Navbar
Fixed, transparent at the top of the page. After 24px of scroll it gains `.nav-glass` (88% paper, 12px backdrop blur), the only translucent surface on the site. Left: home icon. Center (desktop): text links, muted to ink on hover. Right: music toggle, theme toggle, and a Menu button below `md` that opens a full-width list with 48px rows. Controls are 44px square with an accent border.

### Hero
Left-aligned. The name types out and cycles through the phrases in `lib/content.ts` (type 80ms, delete 40ms, hold 1.8s, hold on the name 3.5s) with a blinking accent caret; screen readers only get the name. Below: role, description, and two buttons ("See my projects" primary, "Send me a message" outline).

### Section heading
Faint label, display heading with accent full stop, optional action on the right (the GitHub link in Projects).

### About
Two columns from `md` (3:2). Left: bio paragraphs. Right: 80px portrait, name, CV download link, and a facts list with `--line` dividers. Below: "What I work on" as divided rows (title left, description and mono tags right) and a wrap of technology tags.

### Projects
A vertical list of bordered cards on `--raised`. Title and year on the first line, description, then tags and a "Live site" or "Source on GitHub" link. The whole card is clickable; the border darkens on hover. Hovering or focusing the title opens a 240 x 150 preview card above it (`components/ui/link-preview.tsx`) showing the project screenshot from `public/project/*.webp`. Keyboard focus draws a 2px accent ring around the card.

### Experience
A timeline grouped by organisation, newest first. Each organisation has a 44px mono monogram tile, a vertical rail to the next one (fading out under the last), its name, and its roles. Current roles get a filled accent marker, finished roles a hollow ring. Dates show month and year plus a computed duration.

### Contact
Two columns from `md` (2:3). Left: intro text and a divided list of GitHub, LinkedIn and email links. Right: the form (name, email, message) with inline validation. Sending goes to Web3Forms from the browser. States: idle, sending, success card, and an error card whose message names the cause (connection, too many messages, or a server problem) and always offers the email address.

### Footer
One line: `© <year> Hosea Felix Sanjaya, Department of Informatics, Institut Teknologi Sepuluh Nopember.`

### Shared pieces
- `.btn-primary`: accent-soft fill, accent border, ink text, 44px tall.
- `.btn-outline`: accent border only, fills with accent-soft on hover.
- `.link`: ink text with a 1px accent underline that thickens to 2px on hover.
- `.tag`: mono 12px on `--tag-bg`, 4px radius.
- Icons: Lucide at stroke width 1.5, functional only.
- Scrollbar: thin, neutral thumb on a transparent track, following the theme. Kept visible on purpose as the page's position cue; Safari gets a 10px rounded thumb inset from the edge.

## 6. Motion

One motion system: ease-out curve `cubic-bezier(0.22, 1, 0.36, 1)`, 200ms for hover and small state changes, 650 to 700ms for larger transitions.

| Element | Behavior |
|---|---|
| Scroll reveal | Elements with `data-reveal` fade and slide 28px in when they enter the middle 84% of the viewport, and back out when they leave, from the side they left. 700ms, with small staggered delays. |
| Theme switch | The new theme grows as a circle from the toggle (View Transitions API, 650ms). |
| Directional cursor | Figma-style arrow in the accent color with a white outline. Its tip is the exact click point and it rotates so the tip leads the direction of movement (70ms easing, 6px jitter threshold). Grows 18% over links and buttons. Text fields and disabled controls show the native cursor. |
| Click burst | Each click sends 7 thin accent bars outward from the pointer, fading within about 0.6s. |
| Fluid background | WebGL stable-fluids smoke behind the content, drifting on curl noise. Moving the mouse leaves a light trail from the back of the cursor arrow; a click adds a small push. Purple in light mode, gold in dark, capped at `#ECE7F7` / `#28231A` so text contrast holds. |
| Link preview | 200ms fade with a 6px lift; drifts slightly toward the pointer along the title. |
| Music | "Misery" by Pupsies at 30% volume. Tries to start 5s after the portfolio appears (after the OS gate hands off, or 5s after load when the gate is skipped), otherwise on the first interaction; the navbar toggle always wins. The file only downloads when playback starts. |

## 7. Responsive behavior

- **Desktop (fine pointer):** full fluid simulation at 60fps, directional cursor, click burst.
- **Tablet:** lower-resolution fluid with half-strength interaction, native cursor.
- **Mobile:** fluid at low resolution and 30fps as ambient motion only, native cursor, single-column layouts, 44px minimum tap targets, no horizontal scroll.

## 8. Accessibility

- Skip link to `#main`, visible on focus.
- Visible 2px accent focus ring on every interactive element.
- Theme and music toggles have descriptive `aria-label`s; the typing heading exposes only the name.
- Decorative layers (fluid canvas, cursor, click burst, heading full stops) are `aria-hidden` and ignore pointer events.
- **Reduced motion:** reveals are skipped (content is visible immediately), the fluid shows one still frame with no interaction, the click burst is off, the cursor stays but does not rotate, the theme switches instantly, and all CSS transitions are cut to near zero.

## 9. Content rules

- Every project, role, fact and link on the site is real; nothing is invented.
- No statistics, testimonials or client logos unless they are real and verifiable.
- Text is English only.
- Project images are real screenshots of the projects.

## 10. Where things live

| Area | File |
|---|---|
| All site text | `lib/content.ts` |
| Experience entries | `lib/experience.ts` |
| Contact validation and Web3Forms key | `lib/contact.ts` |
| Color tokens and shared classes | `app/globals.css` |
| Fonts and page shell | `app/layout.tsx` |
| Project screenshots | `public/project/` (WebP, 720px wide) |

Stack: Next.js 16 (App Router), React 18, TypeScript, Tailwind CSS 3, framer-motion, Radix Hover Card, next-themes, lucide-react.
