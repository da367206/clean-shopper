# Feature Spec: Ingredient Deep-Dive

**Feature name:** Ingredient Deep-Dive
**Status:** Spec — not yet implemented
**Source references:** `/docs/component-spec.md`, `/docs/design-system.md`, `tailwind.config.js`

---

## 1. What the feature does

Ingredient Deep-Dive is a detail view that opens when a user taps any `ProductCard`. It decomposes a product's overall clean/caution/avoid rating into a per-ingredient explanation so the user can understand *why* a product earned its score.

From this view the user can:

1. See the product's name, image, category, and overall safety badge/score at a glance.
2. Scan a full list of the product's ingredients, each tagged with its own clean/caution/avoid rating.
3. Expand any ingredient to read a plain-language explanation of what it does, why it's rated the way it is, and the source of the safety data (EWG Skin Deep).
4. Save or unsave the product from the detail view (same action as on the card).
5. Ask the AI assistant a follow-up question about a specific ingredient — the question is pre-populated into `ChatDrawer` with the ingredient name.

The view is reached from Browse results, Search results, and the Saved library. It replaces the active main-content area on mobile (full-screen) and is shown inline below the header on desktop. A back/close action returns the user to the previous list.

---

## 2. Components reused (existing — do not recreate)

| Component | Where it's used in this feature |
|---|---|
| `SafetyBadge` | In the header (`size="md"`, `variant="light"`) showing the product's overall rating. Inside each `IngredientRow` (`size="sm"`, `variant="light"`) showing the per-ingredient rating. |
| `CategoryTag` | In the header, display mode (non-interactive `<span>`), showing the product category. |
| `Button` | Primary `Save to list` / `Saved` action (variant `primary`, size `md`). Secondary `Ask about this ingredient` inside each expanded ingredient (variant `secondary`, size `sm`). Ghost `Back` / close button in the page header (variant `ghost`, size `sm`). |
| `EmptyState` | Rendered when a product has no ingredient data available — title "No ingredient data yet", with an action button that opens `ChatDrawer`. |
| `ChatDrawer` | Not modified, but invoked: tapping "Ask about this ingredient" opens the existing `ChatDrawer` and seeds the input with a prefilled question such as *"Tell me about [ingredient name] in [product name]."* |

No existing component should be altered to support this feature. If a need appears that would require altering an existing component, stop and raise it before proceeding.

---

## 3. New components required

Three new components are needed. All three are added to `/docs/component-spec.md` before implementation begins.

### 3a. `IngredientDeepDivePage`

**Purpose:** Top-level view/container for the deep-dive. Owns data fetching for the selected product's ingredients and orchestrates the header, list, and empty/error/loading states.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `productId` | string | Yes | Product to fetch ingredients for |
| `onClose` | function | Yes | Handler invoked when the user taps back/close |
| `onSaveToggle` | function | No | Handler for the Save/Saved action (optional to allow read-only contexts) |
| `isSaved` | boolean | No | Controls Save button label state |

**Visual structure (skeleton)**
```
section.flex.flex-col.gap-space-xl.pb-space-4xl
  // Header: back button, image, name, category, score + SafetyBadge, save CTA
  header.flex.flex-col.gap-space-md
    Button(variant="ghost", size="sm")                  // Back
    div.relative.w-full.h-img-card.rounded-radius-lg.overflow-hidden.bg-neutral-100
      img                                                // product image or placeholder
    div.flex.flex-col.gap-space-sm
      CategoryTag(label=category)
      h1.text-h1.text-neutral-900                        // product name
      div.flex.items-center.gap-space-md
        SafetyBadge(size="md", variant="light")
        span.text-body.text-neutral-600                  // "Overall score: 87"
    Button(variant="primary", size="md")                 // Save / Saved

  // Body
  IngredientList                                         // or EmptyState on no data
```

**States:** loading (skeleton rows), loaded, empty, error (inline error in `text-small text-error`).

### 3b. `IngredientList`

**Purpose:** Wraps the scrollable, filterable list of `IngredientRow`s. Handles "expand one at a time" vs. "expand multiple" behavior (default: multiple — tapping a second row leaves the first open).

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `ingredients` | `Ingredient[]` | Yes | Array of ingredient objects |
| `onAskAI` | `(ingredient) => void` | Yes | Handler forwarded to each row for the "Ask about this ingredient" button |

**Visual structure**
```
div.flex.flex-col.gap-space-sm
  h2.text-h3.text-neutral-900                           // "Ingredients"
  ul.flex.flex-col.rounded-radius-lg.border.border-neutral-200.bg-white.divide-y.divide-neutral-200
    IngredientRow × n
```

### 3c. `IngredientRow`

**Purpose:** Single collapsible row for one ingredient. Collapsed shows safety dot + name + chevron. Expanded reveals description, concerns, data source, and an "Ask about this ingredient" action.

**Props**
| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Ingredient name |
| `safetyScore` | `'clean' \| 'caution' \| 'avoid'` | Yes | Per-ingredient rating |
| `purpose` | string | No | What the ingredient does (1 sentence) |
| `concerns` | string | No | Why it's rated the way it is (1–3 sentences) |
| `source` | string | No | Data source attribution (e.g., "EWG Skin Deep") |
| `onAskAI` | function | Yes | Handler to open `ChatDrawer` with prefilled text |

**Visual structure**
```
li.flex.flex-col
  button.flex.items-center.justify-between.gap-space-md.p-space-md.w-full.text-left
         .hover:bg-neutral-50.transition-colors.duration-150
    div.flex.items-center.gap-space-sm
      SafetyBadge(size="sm", variant="light")
      span.text-body.text-neutral-900.font-medium               // ingredient name
    ChevronIcon (rotates 180° when expanded)

  // Expanded panel (conditionally rendered)
  div.flex.flex-col.gap-space-sm.px-space-md.pb-space-md
    p.text-body.text-neutral-900                                 // purpose
    p.text-small.text-neutral-600                                // concerns
    p.text-micro.text-neutral-400                                // source
    Button(variant="secondary", size="sm")                       // Ask about this ingredient
```

**States:** collapsed (default), expanded, keyboard-focused (browser default focus ring respected — no custom outline suppression).

---

## 4. Design tokens applied to the new components

All values below come from `tailwind.config.js` / `/docs/design-system.md`. No raw hex, px, or rem values appear in implementation.

### Colors
| Use | Token |
|---|---|
| Page background | body default (`neutral-50`) |
| Card / list surface | `bg-white` |
| Borders, dividers | `border-neutral-200`, `divide-neutral-200` |
| Primary text (name, headings) | `text-neutral-900` |
| Body / description text | `text-neutral-900` (purpose), `text-neutral-600` (concerns) |
| Metadata (source attribution) | `text-neutral-400` |
| Safety colors | driven by `SafetyBadge` — `bg-success/10 text-success`, `bg-warning/10 text-warning`, `bg-error/10 text-error` |
| Primary CTA | `bg-primary text-white` via `Button(variant="primary")` |
| Secondary CTA | `text-primary border-primary` via `Button(variant="secondary")` |
| Hover surface (rows) | `hover:bg-neutral-50` |
| Error inline message | `text-small text-error` |

### Typography
| Use | Token |
|---|---|
| Product name (header) | `text-h1` |
| Section heading ("Ingredients") | `text-h3` |
| Ingredient name | `text-body font-medium` |
| Ingredient purpose | `text-body` |
| Ingredient concerns | `text-small` |
| Source attribution | `text-micro` |
| Overall score sentence | `text-body` |

### Spacing
| Use | Token |
|---|---|
| Page vertical rhythm | `gap-space-xl`, bottom padding `pb-space-4xl` |
| Header internal gaps | `gap-space-md`, `gap-space-sm` |
| List row padding | `p-space-md` |
| Expanded panel padding | `px-space-md pb-space-md`, `gap-space-sm` |
| Icon / inline gaps | `gap-space-sm`, `gap-space-xs` |

### Radius
| Use | Token |
|---|---|
| Product image container | `rounded-radius-lg` |
| Ingredient list container | `rounded-radius-lg` |

### Shadows
| Use | Token |
|---|---|
| Resting state (none on the list — relies on border) | n/a |
| If the header image card uses an elevated card style | `shadow-shadow-sm` default, `hover:shadow-shadow-md` |

### Sizing tokens
| Use | Token |
|---|---|
| Product image height | `h-img-card` |
| Icon size for chevron / spinner | `w-icon-sm h-icon-sm` |
| Minimum tap target on row header | `min-h-touch` |

---

## 5. Acceptance criteria

The feature is considered complete when **all** of the following are true:

### Functional
1. Tapping a `ProductCard` anywhere in the app (Browse, Search, Saved) opens the Ingredient Deep-Dive for that product.
2. The header displays the product's image (or fallback placeholder), name, category, overall `SafetyBadge`, and numeric score if provided — all populated from the same product record used by `ProductCard`.
3. The ingredient list renders one row per ingredient returned for the product, each with a per-ingredient `SafetyBadge`.
4. Tapping a row toggles its expanded panel showing purpose, concerns, and source. Multiple rows may be expanded at once.
5. Tapping "Ask about this ingredient" opens `ChatDrawer` with an input pre-seeded as `Tell me about [ingredient] in [product name].` and the assistant ready to respond.
6. Tapping Save / Saved toggles the product in the Saved library with the same optimistic-update behavior used in `BrowsePage`.
7. Tapping the back/close button returns the user to the originating list with scroll position preserved.

### Data / loading
8. While ingredients are fetching, a skeleton list (5 placeholder rows using `animate-pulse` and token-based neutral colors) is shown — never a blank screen.
9. If the ingredient fetch fails, an inline error message is shown in `text-small text-error` below the header, with a retry button (`Button` variant `ghost`).
10. If the product has zero ingredients on file, `EmptyState` renders with title "No ingredient data yet" and an action button that opens `ChatDrawer`.

### Visual / design-system compliance
11. Every color, font size, spacing, radius, and shadow value in all three new components comes from a Tailwind theme token — no hex codes, px values, or rem values appear in JSX or CSS.
12. `SafetyBadge`, `CategoryTag`, `Button`, `EmptyState`, and `ChatDrawer` are reused unchanged — no new props added, no styles overridden, no duplicate pattern created.
13. The three new components are documented in `/docs/component-spec.md` before the PR merges.

### Accessibility
14. Row header is a real `<button>` element. Expand/collapse toggles on `Enter` and `Space`, not just click.
15. Expanded panel is associated with its trigger via `aria-expanded` and `aria-controls`.
16. Focus ring is visible on keyboard navigation — no global `outline: none` used.
17. All interactive targets meet `min-h-touch` (48px) on mobile.
18. Every image has `alt` text (product name for the product image; decorative placeholder uses `alt=""`).

### Responsive
19. On mobile (`< md`): the view occupies the full content area; header and list stack vertically; the bottom-anchored `NavBar` remains visible and functional.
20. On desktop (`>= md`): the view is centered with `max-w-3xl` and appears alongside the persistent `Sidebar`; list items remain full width within the container.

### State & persistence
21. Save state reflects the same `savedIds` source used elsewhere (`lib/api/savedProducts`). Toggling from the deep-dive updates lists in other views on the next read.
22. The deep-dive view itself holds no persistent state — it is re-hydrated from `productId` on every open.

### Out of scope (explicitly not part of V1)
- Per-ingredient editorial images.
- User-submitted ingredient feedback or voting.
- Ingredient comparison across multiple products.
- Deep links / shareable URLs (app has no router yet).
- Offline caching of ingredient data.

---

## 6. Implementation order (suggested)

1. Add the three new components to `/docs/component-spec.md` as stubs.
2. Build `IngredientRow` in isolation with fixture data.
3. Build `IngredientList` around it.
4. Build `IngredientDeepDivePage` with a mock product.
5. Wire up data fetching (`lib/api/ingredients.js`) and connect Save + Ask-AI actions.
6. Add the `onClick` on `ProductCard` usages in Browse/Search/Saved to open the deep-dive.
7. Verify every acceptance criterion before opening a PR.
