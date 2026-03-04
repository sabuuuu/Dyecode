# Dyecode — Technical Specification

> Hair pigment simulation engine based on color theory, lift mechanics, and undertone rules.  
> No face detection. No AI gimmicks. Pure chemistry-driven logic visualized on canvas.

---

## App Name: Dyecode

**Rationale:** "Dye" = pigment. "Code" = logic.  
Clean. Technical. Memorable.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn UI |
| Color math | `chroma-js` or `colorjs.io` |
| Canvas | HTML Canvas API or `react-konva` |
| State | Zustand |
| Forms | React Hook Form |
| Testing | Vitest + pure unit tests |
| Backend | None (MVP) |

---

## Sprint 0 — Data Architecture

- Define `HairLevel` type: integer 1–10
- Define `Undertone` enum: `red | red-orange | orange | orange-yellow | yellow | neutral`
- Define `DyeTone` enum: `ash | neutral | gold | copper | red | mahogany`
- Define `HairState` type:
  - `currentLevel: HairLevel`
  - `currentUndertone: Undertone`
  - `hairHistory: 'virgin' | 'dyed-darker' | 'dyed-lighter'`
- Define `DyeInput` type:
  - `targetLevel: HairLevel`
  - `targetTone: DyeTone`
  - `bleachEnabled: boolean`
  - `bleachLifts: 1 | 2 | 3`
- Hardcode `underlyingPigments` map:
```ts
const underlyingPigments: Record<number, string> = {
  1: "black",
  2: "near-black",
  3: "dark-brown",
  4: "red",
  5: "red-orange",
  6: "orange",
  7: "orange-yellow",
  8: "yellow",
  9: "pale-yellow",
  10: "white-yellow",
};
```

- Hardcode base hex values per level + undertone combination

---

## Sprint 1 — Pigment Engine (Core Logic, Zero UI)

- Write `simulateLift(currentLevel, targetLevel, hairHistory): LiftResult`
  - If `targetLevel > currentLevel` and `hairHistory !== 'virgin'` → cap lift, flag warning
  - If `bleachEnabled` → apply `bleachLifts` as level increments
  - Return `{ achievableLevel: number, exposedPigment: Undertone, warning?: string }`
- Write `blendTones(baseTone: string, exposedPigment: string, targetTone: DyeTone): string`
  - Use LAB color space via `chroma-js`
  - Blend: base → exposed pigment → target tone
  - Return final hex string
- Write `simulateResult(hairState: HairState, dyeInput: DyeInput): SimulationResult`
  - Calls `simulateLift` + `blendTones`
  - Returns `{ beforeHex, afterHex, achievableLevel, warnings: string[] }`
- **No UI. No imports from React. Pure functions only.**
- Unit test every rule with Vitest:
  - Level 4 red + target level 7 ash → expect warm orange-ash, not clean ash
  - Virgin level 6 + target level 8 → expect yellow-gold exposure
  - Dyed-darker + upward target → expect lift cap warning

---

## Sprint 2 — Minimal UI (Inputs Only)

- Build `HairInputForm` component using React Hook Form
  - Fields: `currentLevel`, `currentUndertone`, `hairHistory`
  - Fields: `targetLevel`, `targetTone`
  - Checkbox: `bleachEnabled` → reveals `bleachLifts` selector (1 / 2 / 3)
- Wire form output to Zustand store: `useHairStore`
  - Store shape: `{ hairState, dyeInput, result, setHairState, setDyeInput, runSimulation }`
- `runSimulation` action calls engine and writes to `result`
- No canvas yet. Log result to console to verify.

---

## Sprint 3 — Canvas Color Output

- Build `ColorSwatch` component
  - Uses HTML Canvas API (or `react-konva`)
  - Renders two rectangles: before hex / after hex
  - Label each: "Current" / "Predicted Result"
- Build `StrandPreview` component (optional upgrade)
  - Render vertical gradient strip
  - Roots → mid-length → ends with slight variation per zone
- Display `warnings` array from `SimulationResult` as inline alert blocks
  - ⚠️ "Result will likely appear coppery due to underlying pigment."
  - ⚠️ "Dye cannot lift previously dyed hair without bleach."
- Add disclaimer banner:
  > "Simulation based on color theory. Real results vary by hair condition, product brand, and processing time."

---

## Sprint 4 — Layered Color History (Stacking Feature)

> Core concept: apply dye on top of result. Simulate cumulative transformations.

- Extend store: `colorHistory: SimulationResult[]`
- Add `addLayer(dyeInput: DyeInput): void` action
  - Takes previous `result.afterHex` and `achievableLevel` as new base
  - Runs full simulation again from that state
  - Pushes to `colorHistory`
- Build `ColorTimeline` component
  - Horizontal row of color swatches: Step 1 → Step 2 → Step 3...
  - Each step labeled: dye tone applied + level
  - Arrows between swatches
- Use case: "I dyed red. Then bleached x2. Then applied honey brown. What do I get?"
- This is the key differentiator feature.

---

## Sprint 5 — Warmth Warning System

- Define warmth thresholds:
  - Parse `afterHex` with `chroma-js` → extract hue angle
  - Hue 0–40° → red/orange family → trigger warmth warning
- Warn levels:
  - Mild: "Result may have warm undertones."
  - Strong: "Result will likely appear copper or brassy."
  - Critical: "High red/orange pigment exposure. Toner or purple shampoo recommended."
- Display as color-coded alert: yellow / orange / red
- Add `warmthScore: number` (0–100) to `SimulationResult`

---

## Sprint 6 — Bleach Lift Simulator

- When `bleachEnabled = true`:
  - Render 3 panels: after 1 lift / after 2 lifts / after 3 lifts
  - Each panel runs full simulation from that lifted base
  - Show color progression across all three
- This answers: "How many bleach sessions until I can achieve X?"
- Label each panel clearly with level achieved and exposed pigment

---

## Sprint 7 — Export & Share

- Add `exportImage()` utility
  - Capture canvas swatches + timeline via `html2canvas`
  - Trigger download as `.png`
- Add "Copy link" — encode simulation state as base64 URL param
  - `/result?state=eyJjdXJyZW50TGV2ZWwiOjR9...`
  - On load, decode and rehydrate store
- No backend. No auth. No database.

---

## Constraints & Rules

- Do NOT start with UI. Engine first.
- Do NOT use RGB for blending. Use LAB or HSL only.
- Do NOT use face detection, selfie upload, or AI inference.
- Do NOT add Supabase, auth, or a backend in MVP.
- Do NOT animate before logic is unit-tested.
- ALWAYS display disclaimer on any result screen.

---

## Delivery Order Summary

| Sprint | Deliverable |
|---|---|
| 0 | Data types, enums, pigment map |
| 1 | Pigment engine + unit tests |
| 2 | Input form + Zustand store |
| 3 | Canvas color output + warnings |
| 4 | Color history / layer stacking |
| 5 | Warmth warning system |
| 6 | Bleach lift progression panels |
| 7 | Export + shareable URL |