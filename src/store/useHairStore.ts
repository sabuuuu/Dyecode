import { create } from "zustand";
import { simulateResult } from "../engine/pigment";
import { bleachLiftProgression } from "../engine/bleach";
import type { HairState, DyeInput, SimulationResult } from "../types";

type HairStore = {
    hairState: HairState | null;
    dyeInput: DyeInput | null;
    result: SimulationResult;
    colorHistory: SimulationResult[];
    bleachProgression: SimulationResult[];
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
    bleachProgression: [],
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

        let bleachProgression: SimulationResult[] = [];
        if (dyeInput.bleachEnabled) {
            bleachProgression = bleachLiftProgression(hairState, dyeInput);
        }

        set({ result, colorHistory: [result], bleachProgression });
    },
    addLayer: (nextDyeInput: DyeInput) => {
        const { result, colorHistory, hairState: currentFullHairState } = get();
        if (result.status !== "success" || !currentFullHairState) return;

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
            porosity: currentFullHairState.porosity,
            damageLevel: currentFullHairState.damageLevel,
            chemicalHistory: currentFullHairState.chemicalHistory,
            hairLength: currentFullHairState.hairLength,
            hairThickness: currentFullHairState.hairThickness,
        };

        const engineResult = simulateResult(newHairState, nextDyeInput);

        const currentResult: SimulationResult = {
            status: "success",
            ...engineResult,
            beforeHex: result.afterHex, // Chain visual hexes
            appliedInput: nextDyeInput,
        };

        let bleachProgression: SimulationResult[] = [];
        if (nextDyeInput.bleachEnabled) {
            bleachProgression = bleachLiftProgression(newHairState, nextDyeInput);
        }

        set({
            result: currentResult,
            colorHistory: [...colorHistory, currentResult],
            bleachProgression
        });
    },
    reset: () => set({
        hairState: null,
        dyeInput: null,
        result: { status: "idle" },
        colorHistory: [],
        bleachProgression: [],
    }),
}));
