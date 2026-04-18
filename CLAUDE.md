# Clean Shopper — Claude Code Instructions

## Project
Clean Shopper is a personal product research assistant for ingredient-aware consumers. Users search for home and personal care products, get AI-generated clean/not-clean assessments based on ingredient safety data, save products to a personal library organized by category, and build shopping lists.

Email/password authentication via Supabase Auth. Local state plus Supabase for data persistence.

## Tech Stack
- React (Vite) -- frontend UI
- Supabase -- database and data layer (PostgreSQL)
- Claude API (claude-sonnet-4-20250514) -- AI product research and ingredient analysis
- EWG Skin Deep API -- ingredient safety data
- Vercel -- deployment
- Tailwind CSS -- styling

## Conventions
- Components: PascalCase filenames, one component per file, lives in /src/components/
- Components: Always check /docs/component-spec.md before building any UI element. If an existing component covers the use case, use it. Only create a new component if no spec covers the pattern, and add the new component to component-spec.md before moving on.
- Utility functions: camelCase, lives in /src/lib/
- API calls: all external API calls through /src/lib/api/, never inline in components
- Styling: Use Tailwind theme classes for all design token values. Never hardcode hex colors, pixel font sizes, or spacing values in components. If a needed token does not exist in the Tailwind config, add it there rather than hardcoding the value. This means bg-primary not #2D7B5E, text-h3 not text-lg, p-lg not p-4.
- State: React useState and useContext only. No Redux, no Zustand.
- File naming: kebab-case for all non-component files

## Do Not
- Do not add multi-user or social account features (OAuth, teams, etc.) without asking first
- Do not use CSS other than Tailwind
- Do not add features outside the current build phase without asking first
- Do not create new components when an existing component in the component library covers the use case
- Do not use any AI model other than claude-sonnet-4-20250514

## References
- Component spec: See /docs/component-spec.md — use existing components before creating new ones. Follow the spec for props, states, and visual structure.
- Build plan: See /docs/build-plan.md -- build phase by phase, do not jump ahead
- Project context: See /docs/project-context.md -- full project intake and design decisions
- Design system: See /docs/design-system.md — follow these visual specifications for all UI work. Do not hardcode colors, font sizes, spacing, or shadows.
- Prompt optimization: Use /prompt-optimizer to evaluate and refine instructions before sending them
- Tailwind config: See tailwind.config.js for design tokens as Tailwind theme extensions. Always use theme classes, never hardcode values.
- Figma design system: Connected via Figma MCP. The canonical design token values live in the Figma file. When checking or updating design tokens, read the current values from Figma using get_variable_defs and compare against the token files in the codebase.
- Feature specs: See /docs/feature-spec-ingredient-deep-dive.md — spec for the Ingredient Deep-Dive feature. Each new feature gets its own /docs/feature-spec-[feature-name].md; read the relevant spec before implementing.
