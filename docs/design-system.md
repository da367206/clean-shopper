# Design System: Clean Shopper
**Version:** 3.0
**Last Updated:** 2026-04-17
**Source:** Synced from `tailwind.config.js` and the Figma file `Clean Shopper — Design System` (fileKey `Oc1VccIt8sNUUi33tTpCYt`).

---

## How to Use This Document
This file is referenced by `CLAUDE.md` and read by Claude Code at the start of every session.
Apply these tokens for all UI work. Do not hardcode hex values, pixel sizes, or spacing
values in components. Reference token names from `tailwind.config.js` instead.

When checking or updating design tokens, also read the current values from Figma via the
`get_variable_defs` tool and compare against this file and `tailwind.config.js`.

---

## Brand Direction
Clean Shopper's v3.0 identity is warm, editorial, and confident. The palette is anchored
in a saturated terracotta primary (`#BC5724`) set against soft peach and cream surfaces,
with sage-green accents for secondary interactivity. Typography pairs a classic
Playfair Display serif for headings with a clean geometric Jost sans for body, signaling
"thoughtful magazine" rather than "clinical lab report." The feel is approachable and
trustworthy — research-grade content delivered through a warm, human-first interface.

---

## Color System

### Primary Colors
| Token Name | Hex Value | Usage Rule |
|---|---|---|
| primary | #BC5724 | Primary buttons, active navigation states, key CTAs. Not for decorative fills or large background surfaces. |
| primary-light | #D4713A | Hover states on primary interactive elements. Not used as a standalone interactive color. |
| primary-dark | #9A4519 | Pressed/active states on primary buttons. Not for large surface fills. |

### Secondary Colors
| Token Name | Hex Value | Usage Rule |
|---|---|---|
| secondary | #FFE7DC | Section fills, card surfaces, warm backgrounds that recede behind content. Not for interactive elements or text. |
| secondary-dark | #FFC0A1 | Card borders, input highlights, subtle dividers. Not for text or interactive fills. |

### Accent Colors
| Token Name | Hex Value | Usage Rule |
|---|---|---|
| accent | #D7E0BF | Sage-green secondary interactive elements — chips, tag highlights, success-adjacent moments. Not for primary CTAs or destructive actions. |
| accent-light | #E8EDD6 | Accent hover states, subtle tag fills. Not used as a standalone interactive color. |
| accent-cool | #CDDCE0 | Cool-sage alternate for chips or tinted backgrounds when warm sage would clash with adjacent content. |

### Semantic Colors
| Token Name | Hex Value | Usage Rule |
|---|---|---|
| success | #16803A | Clean product ratings, confirmed saves, positive state indicators. Not for decorative use. |
| warning | #D97706 | Moderate ingredient concerns, caution ratings, non-blocking alerts. Not for errors or destructive actions. |
| error | #EB5757 | Error states, "avoid" ingredient ratings, destructive actions, form validation failures. Not for general alerts or warnings. |

### Neutral Colors
| Token Name | Hex Value | Usage Rule |
|---|---|---|
| neutral-50 | #FFF5EF | Page background. The base canvas for all layouts. |
| neutral-100 | #FFE7DC | Card backgrounds, elevated surface fills, input field fills. (Shares a hex with `secondary`.) |
| neutral-200 | #FFC0A1 | Borders, dividers, table row separators. (Shares a hex with `secondary-dark`.) |
| neutral-400 | #B89080 | Placeholder text, disabled element text, inactive icon fills. |
| neutral-600 | #8B5A4A | Secondary body text, metadata, supporting copy, labels. |
| neutral-900 | #212121 | Primary text, headings, high-emphasis labels. Never use pure black (#000000). |

---

## Typography

**Heading font:** Playfair Display — a contrast-heavy transitional serif with an editorial
personality, used for all display/h1/h2/h3 headings to anchor the brand's warm, considered
tone.
**Body font:** Jost — a geometric sans-serif with excellent legibility at small sizes, used
for h4, body, small, and micro text.
**Source:** Google Fonts.

### Type Scale
| Token Name | Size | Weight | Line Height | Family | Usage Rule |
|---|---|---|---|---|---|
| display | 48px | 700 | 1.1 | Playfair Display | Hero headlines, marketing moments, landing anchors. One per view maximum. |
| h1 | 40px | 700 | 1.15 | Playfair Display | Page titles, primary view headings. One per page. |
| h2 | 32px | 700 | 1.2 | Playfair Display | Section headers that divide major content areas within a page. |
| h3 | 24px | 700 | 1.2 | Playfair Display | Card titles, subsection headers, modal headings. |
| h4 | 20px | 400 | 1.4 | Jost | Component labels, small headers, list group titles. |
| body | 16px | 400 | 1.6 | Jost | All body copy, product descriptions, ingredient explanations. Default text size. |
| small | 14px | 400 | 1.5 | Jost | Supporting text, metadata, tag labels, form helper text. |
| micro | 12px | 400 | 1.4 | Jost | Timestamps, legal text, attribution, minimal UI labels. |

---

## Spacing Scale

Base unit: 4px.

| Token Name | Value | Usage Rule |
|---|---|---|
| space-3xs | 2px | Tight badges and pills (e.g. SafetyBadge sm vertical padding). |
| space-2xs | 6px | Minimal vertical padding inside compact components (e.g. Button sm size). |
| space-xs | 4px | Icon internal padding, tight inline gaps between adjacent elements. |
| space-sm | 8px | Compact padding within small components (badges, tags, chips). |
| space-md | 16px | Standard internal component padding (buttons, inputs, list items). |
| space-lg | 24px | Card internal padding, section internal spacing, form group gaps. |
| space-xl | 32px | Between distinct components within a section. |
| space-2xl | 48px | Between major sections on a page. |
| space-3xl | 64px | Page-level top/bottom margins, large section gaps at breakpoints. |
| space-4xl | 96px | Hero sections, full-bleed spacing, generous top-of-page breathing room. |

### Sizing Tokens

| Token Name | Value | Usage Rule |
|---|---|---|
| icon-sm | 18px | Small inline icon dimensions (e.g. spinner inside Button). |
| touch | 48px | Minimum touch target height. Apply via `min-h-touch` when needed. |
| img-card | 200px | Fixed height for product card image areas. |
| score-badge | 44px | Width and height of the score badge overlay on product cards. |

---

## Border Radius

| Token Name | Value | Usage Rule |
|---|---|---|
| radius-sm | 3px | Badges, small status chips, tight pills. |
| radius-md | 8px | Inputs, buttons, dropdowns, small cards. |
| radius-lg | 12px | Full product cards, modals, sheet overlays, search panels. |
| radius-full | 9999px | Pill buttons, avatar thumbnails, fully rounded toggles. |

---

## Shadows

v3.0 uses a warm offset shadow aesthetic — a slightly playful, magazine-style elevation
rather than neutral drop shadows. The `shadow-sm` resting state uses a terracotta-tinted
color to harmonize with the primary palette.

| Token Name | Value | Usage Rule |
|---|---|---|
| shadow-sm | 3px 3px 0px rgba(188,87,36,0.12) | Resting card state, subtle warm lift. Default for all cards. |
| shadow-md | 6px 6px 9px rgba(0,0,0,0.12) | Hover state on cards, dropdown menus, floating elements. |
| shadow-lg | 12px 12px 50px rgba(0,0,0,0.20) | Modals, overlays, focused search panels. |

---

## Usage Rules Summary

These rules apply to every component Claude Code builds for this project:

1. Never hardcode a hex value. Use the token name from `tailwind.config.js`.
2. Never hardcode a pixel font size. Use the type scale token classes (`text-h3`, `text-body`, etc.).
3. Never hardcode spacing. Use the spacing scale token classes (`p-space-lg`, `gap-space-md`, etc.).
4. `primary` is for the single most important interactive element per view — primary buttons and active nav states only. Not for decorative fills or secondary actions.
5. `neutral-900` for primary text, `neutral-600` for secondary text. Never use pure black (`#000000`).
6. Semantic colors carry meaning. Do not use `success` for anything other than positive states, or `error` for anything other than errors and destructive actions.
7. `secondary` (#FFE7DC) is a warm surface color, not an interactive color. Never apply it to buttons, links, or focus states.
8. `accent` (sage green) is for secondary interactivity only — chips, tag highlights, supporting icons. It does not replace `primary` for CTAs.
9. Heading tokens (`display`, `h1`, `h2`, `h3`) use Playfair Display at weight 700. `h4` and below use Jost at weight 400.
10. Shadows are warm-offset, not neutral drop shadows. Do not substitute a generic `shadow` class; always use `shadow-shadow-sm|md|lg`.
