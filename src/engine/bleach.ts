import { HairState, DyeInput, SimulationResult } from "../types";
import { simulateResult } from "./pigment";
import { calculateWarmth } from "./warmth";

export function bleachLiftProgression(hairState: HairState, dyeInput: DyeInput): SimulationResult[] {
    if (!dyeInput.bleachEnabled || !dyeInput.bleachLifts) {
        return [];
    }

    const progression: SimulationResult[] = [];
    let currentHairState: HairState = { ...hairState };
    let previousAfterHex = "";

    // Use the actual number of bleach lifts specified by the user
    const numberOfSessions = dyeInput.bleachLifts || 1;
    
    console.log(`Creating ${numberOfSessions} bleach session(s)`);

    for (let i = 0; i < numberOfSessions; i++) {
        const result = simulateResult(currentHairState, dyeInput);
        const { score: warmthScore, level: warmthLevel } = calculateWarmth(result.afterHex);

        const sessionResult: SimulationResult = {
            status: "success",
            ...result,
            beforeHex: i === 0 ? result.beforeHex : previousAfterHex,
            warmthScore,
            warmthLevel,
            appliedInput: dyeInput
        };

        progression.push(sessionResult);
        console.log(`Bleach session ${i + 1}: ${result.afterHex} (Level ${result.achievableLevel})`);

        // Prepare base for next session
        const mappedUndertones = ["red", "red-orange", "orange", "orange-yellow", "yellow", "neutral"];
        const nextUndertone = mappedUndertones.includes(result.exposedPigment)
            ? (result.exposedPigment as import("../types").Undertone)
            : "neutral";

        currentHairState = {
            ...currentHairState,
            currentLevel: result.achievableLevel,
            currentUndertone: nextUndertone,
            hairHistory: "dyed-lighter",
        };
        previousAfterHex = result.afterHex;
    }

    return progression;
}
