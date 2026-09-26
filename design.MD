# Portfolio Design System

This file describes the portfolio as it is built and deployed at https://hosea-felix-sanjaya.vercel.app/. It is the reference for any future change: when the site changes, update this file in the same commit.

## 1. Direction

An editorial, restrained portfolio for an Informatics student who works on data, databases and Linux theming. Typography, whitespace and alignment carry the design; color is one soft accent per theme. The motion layer (fluid smoke, directional cursor, click burst) is the one deliberately playful element, and it always stays behind or beside the content.

Dials: **ENERGY 2 / RHYTHM 2 / MOTION 2**

Keywords: `editorial` `precise` `quiet` `technical` `personal`

Avoided on purpose: gradient text, glassmorphism beyond the navbar, glow, badge pills, stock illustrations, fake statistics, testimonials.

## 2. Typography

Apple-style type: one sans family, with hierarchy carried by weight and size rather than by mixing typefaces.

| Role | Stack | Weights | Used for |
|---|---|---|---|
| Display | `-apple-system`, SF Pro Display, then Inter | 600 | Hero name, section headings, organisation and project titles |
| Body | `-apple-system`, SF Pro Text, then Inter | 400, 500, 600 | All running text, navigation, buttons |
| Mono | `ui-monospace`, SF Mono, Menlo, then JetBrains Mono | 400 | Tags, years, experience monograms |

Apple devices render the real San Francisco fonts from the system. SF Pro can't be served on the web, so every other device gets Inter (the closest open match), loaded through `next/font/google` with its optical-size axis so large text uses Inter's display cut, like SF Display. JetBrains Mono is only the fallback for SF Mono.

| Level | Style |
|---|---|
| Hero name | Display 600, `clamp(2.75rem, 8vw, 5rem)`, line height 1.05, tracking -0.025em |
| Section heading | Display 600, 2rem (2.5rem from `md`), line height 1.1, tracking -0.02em, followed by an accent full stop |
| Section label | Body, 14px, faint color, above the heading |
| Card and entry titles | Display 600, 21px |
| Body | 17px, line height 1.47, tracking -0.015em |
| Metadata | 14px faint, or mono 12px inside tags |

The Tailwind scale (`tailwind.config.ts`) follows Apple's sizes: xs 12, sm 14, base 17, lg 19, xl 21, 2xl 24, with tracking tightening as size grows.

## 3. Color

All colors are CSS variables in `app/globals.css`, exposed to Tailwind in `tailwind.config.ts`. The theme follows the system setting and can be switched in the navbar (`next-themes`, class strategy).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#F4F3F0` | `#0A0A0A` | Page background (light is a warm, slightly dimmed off-white to cut glare) |
| `--raised` | `#FBFAF8` | `#121212` | Cards, inputs, preview card |
| `--line` | `#E2E0DB` | `#262626` | Dividers, card borders |
| `--line-strong` | `#737373` | `#666666` | Input borders, card hover border |
| `--ink` | `#171717` | `#F5F5F5` | Primary text |
| `--muted` | `#525252` | `#A3A3A3` | Secondary text |
| `--faint` | `#666666` | `#8A8A8A` | Labels, metadata |
| `--tag-bg` / `--tag-ink` | `#EAE8E3` / `#404040` | `#262626` / `#D4D4D4` | Tags |

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
- Faint text: 5.17:1 light, 5.73:1 dark on the flat background; 4.69:1 and 4.52:1 over the fluid.
- Faint text is never dimmed further with opacity (the GPA note once sat at 1.8:1 that way).
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
Two columns from `md` (3:2). Left: bio paragraphs. Right: 80px portrait (hovering it opens a 240px zoom in the same card and motion as the project previews, `components/ui/photo-zoom.tsx`; mouse only), name, CV download link, and a facts list with `--line` dividers. Below: "What I work on" as divided rows (title left, description and mono tags right) and a wrap of technology logos: 44px tiles on `--tag-bg` with a 22px monochrome logo in `--tag-ink`, so both follow the theme (including the circular theme switch). Each tile carries its name as a tooltip and screen-reader text; the logos come from Simple Icons 16.32.0 (CC0), copied into `lib/tech-icons.ts`. Order: programming and web (Python, Java, TypeScript, React, Next.js, Tailwind CSS, Git), then data (pandas, PostgreSQL, MySQL), then Linux ricing (Debian, GNOME). The Java coffee cup comes from Simple Icons 6.23.0, the last release that included it.

### Projects
A 2-column grid of 3D cards from `md` (one column below), built on `components/ui/3d-card.tsx`. Each card on `--raised` holds the project screenshot (`public/project/*.webp`, 16:10 frame cropped from the top), then title and year, description, tech tags and a "Live site" or "Source on GitHub" label. With a mouse, the card tilts up to 6 degrees toward the pointer (spring, damping 15, stiffness 150) and its layers lift toward the viewer (screenshot 40px, text 24px) over 300ms; at rest they lie flat so the card keeps its exact size. Touch and reduced motion keep it flat. The whole card is clickable; the title link is the single keyboard stop, and focus draws a 2px accent ring around the card.

Below the grid, a centred "View more" outline button fades the portfolio out and shows "Trust me, I have more…" (display 600, accent ellipsis) for 2s over the live background, then fades the portfolio back in (`components/ViewMore.tsx`). Nothing navigates or scrolls, so the visitor returns to the same spot, the music keeps playing, and focus goes back to the button. Escape returns early.

### Experience
A timeline grouped by organisation, newest first. Each organisation has a 44px mono monogram tile, a vertical rail to the next one (fading out under the last), its name, and its roles. Current roles get a filled accent marker, finished roles a hollow ring. Dates show month and year plus a computed duration.

### Contact
Two columns from `md` (2:3). Left: intro text and a divided list of GitHub, LinkedIn and email links. Right: the form (name, email, message) with inline validation. Sending goes to Web3Forms from the browser. States: idle, sending, success card, and an error card whose message names the cause (connection, too many messages, or a server problem) and always offers the email address.

### Footer
One line: `© <year> Hosea Felix Sanjaya`

### Shared pieces
- `.btn-primary`: accent-soft fill, accent border, ink text, 44px tall.
- `.btn-outline`: accent border only, fills with accent-soft on hover.
- `.link`: ink text with a 1px accent underline that thickens to 2px on hover.
- `.tag`: mono 12px on `--tag-bg`, 4px radius.
- Icons: Lucide at stroke width 1.5, functional only.
- Brand logos (Technologies only): Simple Icons paths in `lib/tech-icons.ts`, filled with `currentColor`.
- Scrollbar: hidden on the page (it still scrolls with wheel, touch and keyboard); the contact message box keeps its own.

## 6. Motion

One motion system: ease-out curve `cubic-bezier(0.22, 1, 0.36, 1)`, 200ms for hover and small state changes, 650 to 700ms for larger transitions.

| Element | Behavior |
|---|---|
| Scroll reveal | Elements with `data-reveal` fade and slide 28px in when they enter the middle 84% of the viewport, and back out when they leave, from the side they left. 700ms, with small staggered delays. |
| Theme switch | The new theme grows as a circle from the toggle (View Transitions API, 650ms). |
| Directional cursor | Figma-style arrow in the accent color with a white outline. Its tip is the exact click point and it rotates so the tip leads the direction of movement (70ms easing, 6px jitter threshold). Grows 18% over links and buttons. Text fields and disabled controls show the native cursor. |
| Click burst | Each click sends 7 thin accent bars outward from the pointer, fading within about 0.6s. |
| Fluid background | WebGL stable-fluids smoke behind the content, drifting on curl noise. Moving the mouse leaves a light trail from the back of the cursor arrow; a click adds a small push. Purple in light mode, gold in dark, capped at `#EBE6F4` / `#28231A` so text contrast holds. |
| Marker highlight | Solid accent block behind a phrase (purple light, gold dark) that springs across it (stiffness 100, damping 14, slight overshoot) when the phrase is 80% in view; the text turns dark once it is 60% covered (4.96:1 on purple, 11.26:1 on gold). Waits for the OS gate; already drawn under reduced motion. Mark a phrase in `lib/content.ts` with `[[...]]` (`components/ui/marker-highlight.tsx`). Three highlights, one per claim a reader should take away: personality ("I use Debian, btw.", hero), leadership ("Head of Event at HMTC", About), result ("160+ companies", Experience). Keep phrases short: they do not wrap. |
| Photo zoom | 200ms fade with a 6px lift over the About portrait; drifts slightly toward the pointer. |
| Project card tilt | Up to 6 degrees toward the pointer on a spring; layers lift 24 to 40px on hover. Mouse only. |
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
- Contact form: name and email skip spellcheck; the browser asks before leaving while a typed message is unsent.
- Dates and years use tabular numbers; month names come from `Intl.DateTimeFormat` (fixed `en` locale, UTC).
- Headings use `text-wrap: balance`; controls use `touch-action: manipulation`; `theme-color` matches the page background per theme.
- **Increase contrast** (`prefers-contrast: more`): muted, faint, tag text, dividers and borders step up in both themes (faint 8.10:1 light, 10.54:1 dark; input borders 7.81:1 and 6.58:1), and the dark accent border uses full gold.
- **Reduce transparency** (`prefers-reduced-transparency`): the scrolled navbar turns solid paper instead of blurred.
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
| Site URL | `lib/site.ts` |
| Page metadata, Open Graph, Twitter card | `app/layout.tsx` |
| Link-preview image (1200 x 630, generated) | `app/opengraph-image.tsx` |
| Structured data (ProfilePage + Person) | `app/page.tsx` |
| robots.txt and sitemap | `app/robots.ts`, `app/sitemap.ts` |
| Security headers and Content-Security-Policy (production only; allows only this origin plus `api.web3forms.com`) | `next.config.mjs` |

Stack: Next.js 16 (App Router), React 18, TypeScript, Tailwind CSS 3, framer-motion, Radix Hover Card, next-themes, lucide-react.
