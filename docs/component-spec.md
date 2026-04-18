# Component Spec: Clean Shopper V1

**Version:** 1.0
**Last Updated:** 2026-04-11
**Source:** Derived from CLAUDE.md, docs/design-system.md, and tailwind.config.js

This is the canonical component inventory for V1. Before creating a new component, check this list. Do not duplicate a pattern already covered here. All visual values must use Tailwind theme classes from tailwind.config.js — no hardcoded hex colors, pixel sizes, or spacing values.

---

## ProductCard

**Purpose:** The primary display unit for a single product — shows name, safety score, category, and description. Used in search results, category browsing, and saved product lists.

### Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Product name |
| `safetyScore` | `'clean' \| 'caution' \| 'avoid'` | Yes | Drives badge color and label |
| `score` | number | No | Numeric safety score (0–100); displayed in top row when provided |
| `category` | string | Yes | Product category label |
| `description` | string | Yes | Short product description (1–2 sentences) |
| `imageUrl` | string | No | Product image URL — renders image at top of card; falls back to placeholder icon if absent |
| `onClick` | function | No | Handler for card tap/click |
| `onSave` | function | No | When provided, renders a Save to list button |
| `isSaved` | boolean | No | Changes save button label to "Saved" when true |
| `onScoreClick` | function | No | When provided, the `SafetyBadge` overlay and (if shown) the numeric score badge become a dedicated button that opens the Ingredient Deep-Dive. Additive only — the rest of the card still fires `onClick`. |

### Visual Structure
```
div.bg-white.border.border-neutral-200.rounded-radius-lg.overflow-hidden.flex.flex-col
  div.relative.w-full.h-img-card.bg-neutral-50    // image area (always first)
    img.w-full.h-full.object-cover               // product image (if imageUrl provided)
    OR div.flex.flex-col.items-center            // placeholder: Clean Shopper logo + wordmark
       .text-primary.opacity-30
    div.absolute.top-space-sm.left-space-sm      // category tag overlay — top-left
      CategoryTag
    div.absolute.top-space-sm.right-space-sm     // score badge overlay — top-right (if score provided)
      span.inline-flex.flex-col.items-center.justify-center
           .w-score-badge.h-score-badge.rounded-radius-md.shadow-shadow-md
           .bg-success|bg-warning|bg-error       // color matches safetyScore
        span.text-h4.font-semibold.text-white    // numeric score
        span.text-micro.text-white/80            // "score" label
  div.flex.flex-col.gap-space-sm.p-space-lg      // card body
    h3.text-h3.text-neutral-900                  // product name
    div.flex.items-center.gap-space-sm           // badge row
      SafetyBadge(size="sm")                     // clean/caution/avoid badge
    p.text-small.text-neutral-600                // description
    Button(variant="secondary", size="sm")       // "Save to list" / "Saved" (if onSave provided)
```

### States
- **Default:** `shadow-shadow-sm`, `border-neutral-200`
- **Hover:** `shadow-shadow-md`, `transition-shadow duration-200`
- **Saved:** Save button label changes to "Saved" when `isSaved` is true
- **Loading:** Render skeleton — `bg-neutral-100 animate-pulse` blocks replacing name, badge, and description

### Usage Rules
- Use for every product displayed in a list or grid
- Do not use for a single featured product that needs full detail — that warrants a product detail view
- Always pass all required props (`name`, `safetyScore`, `category`, `description`); do not render with partial data
- Pass `onSave` only when the save action is contextually appropriate (e.g., browse and search results, not inside the saved library)

---

## SafetyBadge

**Purpose:** Displays the Clean, Caution, or Avoid safety rating as a color-coded pill with a status dot. Used inside ProductCard and standalone on product detail pages.

### Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `score` | `'clean' \| 'caution' \| 'avoid'` | Yes | Determines color and label |
| `size` | `'sm' \| 'md'` | No | `md` default; `sm` for compact contexts |
| `variant` | `'light' \| 'solid'` | No | `light` default (tinted bg, colored text); `solid` for white bg with colored text — use on image overlays |

### Visual Structure
```
span.inline-flex.items-center.rounded-radius-sm.font-medium
  span.rounded-radius-full                         // status dot
  text label
```

**Size variants:**
| Size | Padding | Font | Dot | Gap | Usage |
|---|---|---|---|---|---|
| `sm` | `px-space-sm py-space-3xs` | `text-small` | `w-[6px] h-[6px]` | `gap-space-xs` | Inside ProductCard |
| `md` | `px-space-md py-space-xs` | `text-body` | `w-[8px] h-[8px]` | `gap-space-xs` | Product detail page |

**Color mapping (Tailwind classes):**
| Score | Badge classes | Dot class |
|---|---|---|
| `clean` | `bg-success/10 text-success` | `bg-success` |
| `caution` | `bg-warning/10 text-warning` | `bg-warning` |
| `avoid` | `bg-error/10 text-error` | `bg-error` |

### States
- **Default:** Colored pill per score mapping above
- **Unknown score:** Falls back to `caution` styling

### Usage Rules
- Use whenever a safety score needs to be communicated visually
- Do not create custom color variants — only clean/caution/avoid are valid scores
- Do not use SafetyBadge for non-safety status indicators (e.g., "saved", "new") — use a different pattern

---

## SearchBar

**Purpose:** Product search input with submit action for natural-language queries. Used on the home screen and in the header during browsing.

### Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `value` | string | Yes | Controlled input value |
| `onChange` | function | Yes | Handler for input changes |
| `onSubmit` | function | Yes | Handler for search submission |
| `placeholder` | string | No | Input placeholder text |
| `isLoading` | boolean | No | Shows loading state on submit button |

### Visual Structure
```
div.flex.items-center.gap-space-sm.w-full
  div.flex-1.relative
    input.w-full.bg-white.border.border-neutral-200.rounded-radius-md
          .px-space-md.py-space-sm.text-body.text-neutral-900
          .placeholder:text-neutral-400
          .focus:outline-none.focus:border-primary.focus:ring-1.focus:ring-primary
  Button(variant="primary")                       // search submit
```

### States
- **Default:** `border-neutral-200`
- **Focus:** `border-primary ring-1 ring-primary`
- **Loading:** Submit button shows spinner; input `disabled`
- **Error:** `border-error ring-1 ring-error` with error message below in `text-small text-error`

### Usage Rules
- Use for the main product search entry point
- Do not use SearchBar for non-search filtering — use InputField instead
- Always pair with a submit Button; do not rely on Enter key alone

---

## CategoryTag

**Purpose:** A small pill-shaped label showing a product category. Used inside ProductCard and as a filter chip in browse/filter UI.

### Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `label` | string | Yes | Category name |
| `isActive` | boolean | No | Active/selected state for filter use |
| `onClick` | function | No | Handler for filter tap — makes tag interactive |

### Visual Structure
```
// Default (display only)
span.inline-block.text-small.font-medium.text-neutral-600
     .bg-neutral-100.rounded-radius-sm.px-space-sm.py-space-3xs

// Interactive (filter mode)
button.text-small.font-medium.rounded-radius-sm.px-space-sm.py-space-3xs
       .transition-colors.duration-150
```

**Active state classes:** `bg-primary text-white`
**Inactive interactive:** `bg-neutral-100 text-neutral-600 hover:bg-neutral-200`

### States
- **Default (display):** `bg-neutral-100 text-neutral-600`
- **Active (filter):** `bg-primary text-white`
- **Hover (filter):** `bg-neutral-200`

### Usage Rules
- Render as a `<span>` when display-only (inside ProductCard image overlay)
- Render as a `<button>` when interactive (filter chips)
- Do not use CategoryTag for safety scores — use SafetyBadge

---

## NavBar

**Purpose:** Bottom navigation bar with tabs for the app's four main sections. Persistent across all primary views.

### Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `activeTab` | `'home' \| 'search' \| 'lists' \| 'profile'` | Yes | Highlights the current section |
| `onNavigate` | function | Yes | Handler called with tab key on tap |

### Visual Structure
```
nav.fixed.bottom-0.left-0.right-0
   .bg-white.border-t.border-neutral-200.shadow-shadow-md
   .flex.items-center.justify-around
   .px-space-md.py-space-sm

  // Each tab
  button.flex.flex-col.items-center.gap-space-xs
         .text-micro.font-medium
         .transition-colors.duration-150
    Icon                                          // tab icon
    span                                          // tab label
```

**Tab color states:**
- Active: `text-primary`
- Inactive: `text-neutral-400 hover:text-neutral-600`

### States
- **Default:** Inactive tabs `text-neutral-400`
- **Active:** Active tab `text-primary`

### Usage Rules
- Render on every primary app screen
- Do not show NavBar inside modals, overlays, or onboarding flows
- Always keep all four tabs visible — do not conditionally hide tabs

---

## Button

**Purpose:** Primary and secondary action triggers used throughout the app for CTAs, form submissions, and navigation actions.

### Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | No | Defaults to `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | No | Defaults to `'md'` |
| `isLoading` | boolean | No | Shows spinner, disables interaction |
| `disabled` | boolean | No | Disables the button |
| `onClick` | function | No | Click handler |
| `type` | `'button' \| 'submit'` | No | Defaults to `'button'` |
| `children` | ReactNode | Yes | Button label or content |

### Visual Structure

**Primary**
```
button.bg-primary.text-white.font-medium.rounded-radius-md
       .px-space-lg.py-space-sm.text-body
       .hover:bg-primary-dark.active:bg-primary-dark
       .transition-colors.duration-150
       .disabled:opacity-50.disabled:cursor-not-allowed
```

**Secondary**
```
button.bg-transparent.text-primary.font-medium.rounded-radius-md
       .border.border-primary.px-space-lg.py-space-sm.text-body
       .hover:bg-primary/10.active:bg-primary/20
       .transition-colors.duration-150
       .disabled:opacity-50.disabled:cursor-not-allowed
```

**Ghost**
```
button.bg-transparent.text-neutral-600.font-medium.rounded-radius-md
       .px-space-lg.py-space-sm.text-body
       .hover:bg-neutral-100.active:bg-neutral-200
       .transition-colors.duration-150
       .disabled:opacity-50.disabled:cursor-not-allowed
```

**Size modifiers:**
| Size | Padding | Font |
|---|---|---|
| `sm` | `px-space-md py-space-2xs` | `text-small` |
| `md` | `px-space-lg py-space-sm` | `text-body` |
| `lg` | `px-space-xl py-space-md` | `text-body font-semibold` |

### States
- **Default:** Per variant above
- **Hover:** Darker fill for primary/secondary; light fill for ghost
- **Active/Pressed:** One step darker than hover
- **Loading:** Replace label with spinner; keep button width stable; `disabled` behavior
- **Disabled:** `opacity-50 cursor-not-allowed`

### Usage Rules
- Use `primary` for the single most important action on a screen
- Use `secondary` for supporting actions alongside a primary button
- Use `ghost` for low-emphasis actions like Cancel or Back
- Do not put two `primary` buttons side by side

---

## InputField

**Purpose:** Styled text input for forms and non-search text entry. Used for preference settings and any form fields.

### Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `label` | string | Yes | Field label displayed above input |
| `value` | string | Yes | Controlled value |
| `onChange` | function | Yes | Change handler |
| `placeholder` | string | No | Input placeholder |
| `type` | string | No | HTML input type, defaults to `'text'` |
| `error` | string | No | Error message displayed below field |
| `hint` | string | No | Helper text displayed below field |
| `disabled` | boolean | No | Disables the field |

### Visual Structure
```
div.flex.flex-col.gap-space-xs
  label.text-small.font-medium.text-neutral-600    // label
  input.w-full.bg-white.border.rounded-radius-md
        .px-space-md.py-space-sm.text-body.text-neutral-900
        .placeholder:text-neutral-400
        .focus:outline-none.focus:border-primary.focus:ring-1.focus:ring-primary
        .disabled:bg-neutral-100.disabled:text-neutral-400.disabled:cursor-not-allowed
  p.text-micro.text-neutral-400                    // hint (optional)
  p.text-micro.text-error                          // error (conditional)
```

**Border states:**
- Default: `border-neutral-200`
- Focus: `border-primary ring-1 ring-primary`
- Error: `border-error ring-1 ring-error`
- Disabled: `border-neutral-200 bg-neutral-100`

### States
- **Default:** `border-neutral-200`
- **Focus:** `border-primary ring-1 ring-primary`
- **Error:** `border-error ring-1 ring-error` + error message in `text-micro text-error`
- **Disabled:** `bg-neutral-100 text-neutral-400 cursor-not-allowed`

### Usage Rules
- Always include a `label` — do not use placeholder text as a substitute for a label
- Use `SearchBar` for search interactions, not `InputField`
- Show error messages below the field, not as alerts or toasts

---

## Sidebar

**Purpose:** Persistent desktop navigation panel. Displays the app logo and nav links for all primary sections. Hidden on mobile — the NavBar handles mobile navigation.

### Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `activeTab` | `'home' \| 'search' \| 'lists' \| 'profile'` | Yes | Highlights the current section |
| `onNavigate` | function | Yes | Handler called with tab key on click |

### Visual Structure
```
aside.hidden.md:flex.flex-col
      .fixed.top-0.left-0.h-full.w-56
      .bg-white.border-r.border-neutral-200.shadow-shadow-sm
      .px-space-md.py-space-xl.gap-space-xl

  // Logo lockup
  div.flex.items-center.gap-space-sm.px-space-sm.text-primary
    LogoIcon                                      // shield + checkmark SVG
    span.text-h4.font-semibold.text-neutral-900   // "Clean Shopper"

  // Nav links
  nav.flex.flex-col.gap-space-xs
    // Each nav item
    button.flex.items-center.gap-space-md
           .px-space-md.py-space-sm
           .rounded-radius-md.text-body.font-medium
           .transition-colors.duration-150
      Icon                                        // 20×20 SVG
      span                                        // label
```

**Nav item color states:**
- Active: `bg-primary/10 text-primary`
- Inactive: `text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900`

### States
- **Active tab:** `bg-primary/10 text-primary`
- **Inactive tab:** `text-neutral-600`
- **Mobile:** Hidden (`hidden md:flex`) — NavBar handles mobile navigation

### Usage Rules
- Render on every primary app screen alongside NavBar
- Always keep all four nav items visible — do not conditionally hide items
- Do not show Sidebar inside modals or overlays
- Sidebar and NavBar always receive the same `activeTab` and `onNavigate` props

---

## EmptyState

**Purpose:** Placeholder shown when a list, search result, or view has no content to display. Used in search results, saved products library, and the shopping list.

### Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Short heading explaining the empty state |
| `message` | string | No | Supporting text with context or a prompt to act |
| `action` | `{ label: string, onClick: function }` | No | Optional CTA button |
| `icon` | ReactNode | No | Optional illustration or icon |

### Visual Structure
```
div.flex.flex-col.items-center.justify-center.gap-space-md
   .py-space-4xl.px-space-2xl.text-center

  div.text-neutral-400                             // icon (optional)
  h3.text-h4.text-neutral-900.font-medium         // title
  p.text-body.text-neutral-400.max-w-sm           // message (optional)
  Button(variant="primary")                        // action (optional)
```

### States
- **Default:** Static display with title and optional message
- **With action:** Renders a `primary` Button below the message

### Usage Rules
- Always show EmptyState when a list renders zero items — never show a blank screen
- Keep `title` brief (5 words or fewer)
- Only include an `action` if there is a clear next step the user can take from this state
- Do not use EmptyState for loading states — use a skeleton loader pattern instead

---

## ChatDrawer

**Purpose:** A floating AI chat assistant that lets signed-in users ask ingredient safety questions, get product recommendations from the catalog, and learn about harmful chemicals — all powered by Claude AI. Rendered as a fixed floating button that expands into a chat panel.

### Props
None — ChatDrawer is self-contained. Mount it once inside the signed-in app layout.

### Visual Structure
```
// Floating button (panel closed)
button.fixed.bottom-20.right-4.md:bottom-6.md:right-6.z-40
       .w-14.h-14.rounded-full
       .bg-primary.text-white.shadow-shadow-lg
  ChatIcon

// Panel (open) — full-width slide-up on mobile, fixed card on desktop
div.fixed.z-50
   .bottom-0.left-0.right-0.h-[82vh]                // mobile
   .md:bottom-6.md:right-6.md:w-96.md:h-[600px]     // desktop
   .bg-white.rounded-t-radius-lg.md:rounded-radius-lg
   .border.border-neutral-200.shadow-shadow-lg.flex.flex-col

  // Header
  div.flex.items-center.gap-space-sm.px-space-lg.py-space-md.border-b.border-neutral-200
    div.w-8.h-8.rounded-full.bg-primary/10.text-primary  // icon avatar
    div                                                    // title + subtitle
      div.text-small.font-semibold.text-neutral-900        // "Ask Clean Shopper"
      div.text-micro.text-neutral-400                      // subtitle
    button.text-neutral-400                                // close button

  // Messages list (scrollable)
  div.flex-1.overflow-y-auto.p-space-md.flex.flex-col.gap-space-sm
    // Empty state: centered icon + suggestion buttons
    // User bubble: justify-end, bg-primary text-white, rounded-br-none
    // Assistant bubble: justify-start, bg-neutral-100 text-neutral-900, rounded-bl-none
    // Loading: three animated dots in assistant bubble style
    // Error: text-micro text-error centered

  // Input area
  div.flex.gap-space-sm.items-center.px-space-md.py-space-md.border-t.border-neutral-200
    input.flex-1.bg-neutral-50.border.border-neutral-200.rounded-radius-full
    button.w-9.h-9.rounded-full.bg-primary.text-white    // send button
```

### States
- **Closed:** Only the floating button is visible
- **Open (empty):** Panel shows welcome message and 4 suggestion buttons
- **Loading:** Three bouncing dots shown in an assistant bubble while waiting for Claude
- **Error:** Error message shown in `text-micro text-error` below the last message
- **Mobile:** Full-width bottom sheet with a dark backdrop overlay (`bg-black/30`)
- **Desktop:** Fixed 384px-wide card, bottom-right corner, no backdrop

### Usage Rules
- Mount exactly once in the signed-in app layout (inside `App.jsx`)
- Do not show when the user is not signed in
- Do not add external props — all state is internal
- Suggestion buttons send their text as the first user message directly (no intermediate state)
- Messages sent with Enter key (without Shift) or the send button
- Panel auto-scrolls to the latest message on each new turn

---

## IngredientDeepDivePage

**Purpose:** Top-level view that opens when a user taps a product's safety score. Fetches a per-ingredient safety breakdown and orchestrates header, list, empty, loading, and error states. See `/docs/feature-spec-ingredient-deep-dive.md`.

### Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `product` | object | Yes | Product record — `{ id, name, category, description, image_url, safety_score, score }`. |
| `onClose` | function | Yes | Handler invoked when the user taps Back/close. |
| `onSaveToggle` | function | No | Handler for the Save/Saved button. When omitted, the button is hidden (read-only contexts). |
| `isSaved` | boolean | No | Controls Save button label state. |
| `onAskAI` | function | No | Optional handler forwarded to each ingredient row for the "Ask about this ingredient" action. Receives a prefilled seed string. |

### Visual Structure
```
section.flex.flex-col.gap-space-xl.pb-space-4xl.max-w-3xl.mx-auto
  Button(variant="ghost", size="sm")                 // Back
  header.flex.flex-col.gap-space-md
    div.relative.w-full.h-img-card.rounded-radius-lg.overflow-hidden.bg-neutral-100.shadow-shadow-sm
      img | placeholder
    div.flex.flex-col.gap-space-sm
      CategoryTag
      h1.text-h1.text-neutral-900
      div.flex.items-center.gap-space-md
        SafetyBadge(size="md", variant="light")
        span.text-body.text-neutral-600                // "Overall score: 87"
    Button(variant="primary", size="md")               // Save / Saved
  body: IngredientList | skeleton | error | EmptyState
```

### States
- **Loading:** Five skeleton rows using `bg-neutral-100 animate-pulse`.
- **Error:** Inline `text-small text-error` with a ghost `Try again` button that re-invokes the fetch.
- **Empty:** `EmptyState` with title "No ingredient data yet" and an action that opens `ChatDrawer`.
- **Loaded:** `IngredientList`.

### Usage Rules
- Fetches via `lib/api/ingredients.js` → `fetchIngredientAnalysis(product)`; no other data source.
- Uses the shared Claude model `claude-sonnet-4-20250514`. Do not introduce a different model.
- Does not cache ingredient data in V1 — re-fetches on every open.

---

## IngredientList

**Purpose:** Wraps the list of `IngredientRow`s inside a bordered card.

### Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `ingredients` | `Ingredient[]` | Yes | Array of `{ name, safetyScore, purpose, concerns, source }`. |
| `onAskAI` | `(ingredient) => void` | Yes | Forwarded to each row for the "Ask about this ingredient" action. |

### Visual Structure
```
div.flex.flex-col.gap-space-sm
  h2.text-h3.text-neutral-900                          // "Ingredients"
  ul.flex.flex-col.rounded-radius-lg.border.border-neutral-200.bg-white.divide-y.divide-neutral-200
    IngredientRow × n
```

### Usage Rules
- Do not render without the wrapping heading.
- Multiple rows may be expanded simultaneously — no accordion coupling.

---

## IngredientRow

**Purpose:** Collapsible list item for a single ingredient. Collapsed shows safety badge + name + chevron. Expanded reveals purpose, concerns, source attribution, and an Ask-AI action.

### Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Ingredient name. |
| `safetyScore` | `'clean' \| 'caution' \| 'avoid'` | Yes | Per-ingredient rating. |
| `purpose` | string | No | One-sentence description of what the ingredient does. |
| `concerns` | string | No | 1–3 sentences explaining the rating. |
| `source` | string | No | Source attribution label. Defaults to `"AI-generated (Claude) · grounded in EWG Skin Deep"`. |
| `onAskAI` | function | Yes | Handler called with `{ name, safetyScore }` when the user taps "Ask about this ingredient". |

### Visual Structure
```
li.flex.flex-col
  button.flex.items-center.justify-between.gap-space-md.p-space-md.w-full.text-left.min-h-touch
         .hover:bg-neutral-50.transition-colors.duration-150
    div.flex.items-center.gap-space-sm
      SafetyBadge(size="sm", variant="light")
      span.text-body.font-medium.text-neutral-900
    ChevronIcon (rotates 180° when expanded)

  // Expanded panel
  div.flex.flex-col.gap-space-sm.px-space-md.pb-space-md
    p.text-body.text-neutral-900                       // purpose
    p.text-small.text-neutral-600                      // concerns
    p.text-micro.text-neutral-400                      // source
    Button(variant="secondary", size="sm")             // Ask about this ingredient
```

### States
- **Collapsed (default):** chevron pointing down.
- **Expanded:** chevron rotated 180°; panel visible; associated via `aria-expanded` and `aria-controls`.
- **Keyboard focus:** browser-default focus ring preserved — no custom outline suppression.

### Usage Rules
- The row trigger must be a real `<button>`; do not substitute a `div` with `onClick`.
- Do not use this outside `IngredientList`.
