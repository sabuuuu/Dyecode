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
            appliedInput: dyeInput,
        };

        set({ result, colorHistory: [result] });
    },
    addLayer: (nextDyeInput: DyeInput) => {
        const { result, colorHistory } = get();
        if (result.status !== "success") return;

        const mappedUndertones = ["red", "red-orange", "orange", "orange-yellow", "yellow", "neutral"];
        const nextUndertone = mappedUndertones.includes(result.exposedPigment)
            ? (result.exposedPigment as import("../types").Undertone)
            : "neutral";

        let newHistory: import("../types").HairHistory = "dyed-darker";
        if (nextDyeInput.bleachEnabled || nextDyeInput.targetLevel > result.achievableLevel) {
            newHistory = "dyed-lighter";
        }

        const newHairState: import("../types").HairState = {
            currentLevel: result.achievableLevel,
            currentUndertone: nextUndertone,
            hairHistory: newHistory,
        };

        const engineResult = simulateResult(newHairState, nextDyeInput);

        const currentResult: SimulationResult = {
            status: "success",
            ...engineResult,
            beforeHex: result.afterHex, // Chain visual hexes
            appliedInput: nextDyeInput,
        };

        set({
            result: currentResult,
            colorHistory: [...colorHistory, currentResult]
        });
    },
    reset: () => set({
        hairState: null,
        dyeInput: null,
        result: { status: "idle" },
        colorHistory: []
    }),
}));
