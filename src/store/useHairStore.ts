import { create } from "zustand";
import { simulateResult } from "../engine/pigment";
import type { HairState, DyeInput, SimulationResult } from "../types";

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

        const engineResult = simulateResult(hairState, dyeInput);

        const result: SimulationResult = {
            status: "success",
            ...engineResult,
        };

        set({ result, colorHistory: [result] });
    },
    addLayer: (dyeInput) => {
        // Sprint 4: Color History placeholder
        // To be fleshed out, but adding signature to match RULES.md
        console.warn("addLayer not fully implemented yet");
    },
    reset: () => set({
        hairState: null,
        dyeInput: null,
        result: { status: "idle" },
        colorHistory: []
    }),
}));
