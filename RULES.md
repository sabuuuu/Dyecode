# Dyecode — Code Standards & Best Practices

> Rules of the codebase. Follow them from Sprint 0. Retrofitting discipline is expensive.

---

## 1. Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx
│   └── result/
│       └── page.tsx
├── components/
│   ├── ui/                     # shadcn/ui primitives only (never edited manually)
│   ├── forms/                  # Form-specific components
│   │   └── HairInputForm.tsx
│   ├── canvas/                 # Canvas rendering components
│   │   ├── ColorSwatch.tsx
│   │   └── StrandPreview.tsx
│   ├── timeline/               # Color history components
│   │   └── ColorTimeline.tsx
│   └── shared/                 # Reusable UI pieces (alerts, badges, disclaimers)
│       └── WarmthAlert.tsx
├── engine/                     # Pure logic. Zero UI. Zero React.
│   ├── pigment.ts              # simulateLift, blendTones, simulateResult
│   ├── warmth.ts               # warmthScore, warmthLabel
│   ├── bleach.ts               # bleachLiftProgression
│   └── constants.ts            # underlyingPigments, baseLevelHex, toneHex
├── store/
│   └── useHairStore.ts         # Zustand store
├── schemas/
│   └── hair.schema.ts          # Zod schemas + inferred types
├── lib/
│   ├── colorUtils.ts           # chroma-js wrappers
│   └── exportUtils.ts          # html2canvas, base64 encode/decode
├── hooks/
│   └── useSimulation.ts        # Custom hook wrapping store + engine
└── types/
    └── index.ts                # Re-exports all inferred Zod types
```

**Rules:**
- `engine/` has zero React imports. Ever.
- `components/ui/` is shadcn territory. Do not manually edit generated files.
- One component per file. No exceptions.
- Co-locate test files: `pigment.ts` → `pigment.test.ts` in same directory.

---

## 2. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `ColorSwatch.tsx` |
| Functions | camelCase | `simulateLift()` |
| Constants | SCREAMING_SNAKE | `UNDERLYING_PIGMENTS` |
| Zod schemas | camelCase + `Schema` suffix | `hairStateSchema` |
| Inferred types | PascalCase | `HairState`, `DyeInput` |
| Zustand stores | camelCase + `use` prefix | `useHairStore` |
| Custom hooks | camelCase + `use` prefix | `useSimulation` |
| Enums | PascalCase | `DyeTone.Ash` |

- No abbreviations unless universally understood (`hex`, `hsl`, `lab`).
- No `data`, `info`, `stuff`, `temp` as variable names.
- Boolean variables: prefix with `is`, `has`, `can`. Example: `isVirginHair`, `hasWarning`.

---

## 3. TypeScript

- `strict: true` in `tsconfig.json`. Non-negotiable.
- No `any`. Use `unknown` and narrow it.
- No type assertions (`as SomeType`) unless you can justify it in a comment.
- Derive types from Zod schemas. Do not write duplicate interface + schema.

```ts
// ✅ Correct — single source of truth
import { z } from "zod";

export const hairStateSchema = z.object({
  currentLevel: z.number().int().min(1).max(10),
  currentUndertone: z.enum(["red", "red-orange", "orange", "orange-yellow", "yellow", "neutral"]),
  hairHistory: z.enum(["virgin", "dyed-darker", "dyed-lighter"]),
});

export type HairState = z.infer<typeof hairStateSchema>;

// ❌ Wrong — duplicated, diverges over time
interface HairState {
  currentLevel: number;
  currentUndertone: string;
  hairHistory: string;
}
```

- Export types from `types/index.ts` as re-exports. Import from there, not from schema files directly.
- Use discriminated unions for result states:

```ts
type SimulationResult =
  | { status: "idle" }
  | { status: "success"; afterHex: string; achievableLevel: number; warnings: string[] }
  | { status: "error"; message: string };
```

---

## 4. Zod — Validation Rules

- Every form input must pass through a Zod schema before touching the engine.
- Every URL param (share feature) must be parsed and validated with Zod on load.
- Wrap Zod `.parse()` in try/catch or use `.safeParse()` and handle the error branch.

```ts
// ✅ Preferred
const result = hairStateSchema.safeParse(rawInput);
if (!result.success) {
  console.error(result.error.flatten());
  return;
}
const hairState = result.data; // fully typed
```

- Never trust external input (URL params, localStorage) without parsing it through Zod first.

---

## 5. Zustand — Store Rules

- One store file per domain. `useHairStore.ts` handles hair state only.
- Actions live inside the store definition, not in components.
- No business logic inside the store. Store calls engine functions; it does not contain them.
- Slice pattern for larger stores if scope grows:

```ts
// store/useHairStore.ts
import { create } from "zustand";
import { simulateResult } from "@/engine/pigment";
import type { HairState, DyeInput, SimulationResult } from "@/types";

type HairStore = {
  hairState: HairState | null;
  dyeInput: DyeInput | null;
  result: SimulationResult;
  colorHistory: SimulationResult[];
  setHairState: (s: HairState) => void;
  setDyeInput: (d: DyeInput) => void;
  runSimulation: () => void;
  addLayer: (d: DyeInput) => void;
  reset: () => void;
};

export const useHairStore = create<HairStore>((set, get) => ({
  hairState: null,
  dyeInput: null,
  result: { status: "idle" },
  colorHistory: [],
  setHairState: (hairState) => set({ hairState }),
  setDyeInput: (dyeInput) => set({ dyeInput }),
  runSimulation: () => {
    const { hairState, dyeInput } = get();
    if (!hairState || !dyeInput) return;
    const result = simulateResult(hairState, dyeInput);
    set({ result, colorHistory: [result] });
  },
  addLayer: (dyeInput) => { /* ... */ },
  reset: () => set({ hairState: null, dyeInput: null, result: { status: "idle" }, colorHistory: [] }),
}));
```

- Never call `useHairStore.getState()` inside a component. Use the hook and select slices.
- Select only what you need — avoid subscribing to the entire store:

```ts
// ✅
const result = useHairStore((s) => s.result);

// ❌
const store = useHairStore();
```

---

## 6. React Hook Form

- Define schema with Zod. Pass to `useForm` via `zodResolver`.
- Never manage form state manually with `useState` for fields.
- `register`, `handleSubmit`, `formState.errors` — use all three consistently.

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hairInputSchema, type HairInput } from "@/schemas/hair.schema";

const form = useForm<HairInput>({
  resolver: zodResolver(hairInputSchema),
  defaultValues: { currentLevel: 5, bleachEnabled: false },
});
```

- Display errors inline, adjacent to their field. Never in a toast.
- Submit handler receives validated, typed data. Passes directly to store action.

---

## 7. Components

- Every component is a pure function. No class components.
- Props must have explicit TypeScript types. No inline `{ prop: any }`.
- Destructure props at the function signature level.
- Default exports for page-level components. Named exports for everything else.
- Max ~150 lines per component file. If longer, decompose.
- No logic inside JSX beyond ternary for conditional rendering.

```tsx
// ✅
const label = isWarning ? "⚠️ Coppery result" : "Clean tone";
return <span>{label}</span>;

// ❌
return <span>{result.warnings.length > 0 && result.warmthScore > 50 ? "⚠️ Coppery" : "Clean"}</span>;
```

- Avoid prop drilling beyond 2 levels. Use Zustand or React Context instead.

---

## 8. Tailwind CSS

- Utility-first. No custom CSS files unless absolutely unavoidable.
- No inline `style={{}}` for anything Tailwind can handle.
- Use `cn()` utility (from `clsx` + `tailwind-merge`) for conditional classes:

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
// ✅
<div className={cn("rounded-md p-4", isError && "border border-red-500")} />
```

- No magic numbers in classes. Define consistent spacing and sizing via Tailwind config tokens.
- Mobile-first responsive: base styles for mobile, `md:` / `lg:` for larger screens.
- Group classes by concern (layout → spacing → color → typography → state):

```tsx
// ✅ Readable
className="flex items-center gap-3 px-4 py-2 bg-zinc-900 text-sm text-white hover:bg-zinc-700"
```

---

## 9. shadcn/ui

- Install components via CLI: `npx shadcn-ui@latest add button`
- Never edit files in `components/ui/` manually. Re-generate if needed.
- Wrap shadcn primitives in your own components if you need custom behavior:

```tsx
// components/shared/WarningBadge.tsx — wrapper, not a direct shadcn edit
import { Badge } from "@/components/ui/badge";

export function WarningBadge({ label }: { label: string }) {
  return <Badge variant="destructive">{label}</Badge>;
}
```

- Use shadcn `Form` components with React Hook Form for accessible, consistent form fields.
- Prefer shadcn `Alert` for all warning/disclaimer displays. Do not build custom alert divs.

---

## 10. Engine — Pure Function Rules

- All functions in `engine/` must be pure: same input → same output, no side effects.
- No `console.log` in engine functions in production. Use during dev, remove before commit.
- No DOM access. No window. No React.
- Every engine function must have a corresponding unit test.
- Functions should do one thing. If a function name contains "and", split it.

```ts
// ❌
function simulateLiftAndBlendTones() { ... }

// ✅
function simulateLift() { ... }
function blendTones() { ... }
```

---

## 11. Color Math Rules

- Never use RGB for blending. RGB blending produces muddy, inaccurate results.
- Use LAB color space via `chroma-js` for all blending operations.
- Use HSL only for hue-angle-based warmth detection.
- All hex values stored as lowercase 6-digit strings: `#a0522d`, not `#A0522D` or `#a05`.
- Validate hex strings with Zod before passing to engine:

```ts
const hexSchema = z.string().regex(/^#[0-9a-f]{6}$/);
```

---

## 12. Testing

- Engine functions: unit tested with Vitest. No exceptions.
- Test file lives next to the source file: `pigment.ts` → `pigment.test.ts`
- Test naming: `describe('simulateLift')` → `it('caps lift on previously dyed hair')`
- Aim for edge cases: min/max levels, all undertone combinations, bleach + virgin + dyed paths.
- No snapshot tests. Test behavior and output values.
- Run tests before every commit: add to pre-commit hook via `husky`.

---

## 13. Git & Commits

- Conventional commits:
  - `feat:` new feature
  - `fix:` bug fix
  - `chore:` tooling, config
  - `test:` adding or updating tests
  - `refactor:` no behavior change
  - `docs:` markdown, comments

```
feat: add warmth score to simulation result
fix: correct orange-yellow blend at level 7
test: add unit tests for bleach lift progression
```

- One concern per commit. Do not mix feature + refactor + style fix.
- Branch naming: `feat/bleach-panel`, `fix/lift-cap-logic`, `chore/zustand-setup`

---

## 14. What Not To Do

| ❌ Don't                   | ✅ Do instead |
|----------------------------|---------------|
| Use `any`                  | Use `unknown`, then narrow |
| Write logic in JSX         | Extract to variable or function |
| Use RGB for color blending | Use LAB via chroma-js |
| Put business logic in components | Put it in `engine/` or `store/` |
| Edit `components/ui/` files      | Wrap them in your own component |
| Use inline `style={{}}`          | Use Tailwind utilities |
| Start with styling               | Build and test logic first |
| Skip Zod on external input       | Parse every external value with Zod |
| Prop drill more than 2 levels    | Use Zustand |
| Commit without running tests     | Run `vitest` before every push |


## 15. Visual Style & UI Philosophy

> Simple. Quiet. Precise. The interface should feel like a tool, not a landing page.

**General Rules**
- Use Font 'Poppins' 
- No gradients. Ever. Flat background colors only.
- No box shadows on interactive elements. Use borders instead.
- No scale transforms on button click (`active:scale-95` is banned).
- No hover color explosions. Subtle background shift only.
- Prefer small, compact buttons. Default to `size="sm"` from shadcn.
- No decorative animations. Transitions only when they carry meaning (e.g. a result appearing).
- If an animation can be removed without losing information, remove it.

**Border Radius — Squircle First**
- Use `rounded-[12px]` or Tailwind's `rounded-xl` as the default radius token.
- For true squircle shape, apply the `squircle` utility class (via `figma-squircle` or a custom CSS mask):
```ts
// tailwind.config.ts — add squircle as a custom utility if not using a plugin
"squircle": {
  "border-radius": "30% 30% 30% 30% / 30% 30% 30% 30%",
  "-webkit-mask-image": "url(\"data:image/svg+xml;...\")",
},
```

- Buttons, cards, input fields, swatches — all use squircle or `rounded-xl`. No `rounded-full` except for avatars or icon-only circular actions.

**Buttons**
- Small by default. Use `size="sm"` from shadcn `Button`.
- No shadows. Border `border border-zinc-200` for secondary buttons.
- Hover: background shifts one step. Nothing else moves.
- No ripple effects. No pulse. No glow.
```tsx
// ✅ Correct button style
<Button size="sm" className="rounded-xl border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100">
  Simulate
</Button>
```

**Color Palette**
- Base: white or `zinc-50` background.
- Text: `zinc-900` primary, `zinc-500` muted.
- Accents: single accent color per context (e.g. result swatch color drives the accent).
- No rainbow UIs. Color is data here — it belongs in the swatches, not the chrome.

**Motion**
- Allowed: `transition-colors duration-150` on hover states.
- Allowed: `transition-opacity duration-200` for result appearing.
- Banned: `animate-bounce`, `animate-pulse`, `animate-ping` in production UI.
- Banned: `hover:scale-*`, `active:scale-*` on any element.