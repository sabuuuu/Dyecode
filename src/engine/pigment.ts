import chroma from "chroma-js";
import { HairState, DyeInput } from "../types";
import { UNDERLYING_PIGMENTS, BASE_LEVEL_HEX, TONE_HEX } from "./constants";
import { calculateWarmth, type WarmthLevel } from "./warmth";

export type LiftResult = {
    achievableLevel: number;
    exposedPigment: string;
    warning?: string;
};

export function simulateLift(
    currentLevel: number,
    targetLevel: number,
    hairHistory: string,
    bleachEnabled: boolean = false,
    bleachLifts: number = 0
): LiftResult {
    let achievable = currentLevel;
    let warning: string | undefined = undefined;

    if (targetLevel > currentLevel) {
        if (hairHistory !== "virgin" && !bleachEnabled) {
            warning = "Dye cannot lift previously dyed hair without bleach.";
        } else if (bleachEnabled) {
            achievable = Math.min(10, currentLevel + bleachLifts);
        } else {
            // Virgin hair dye max lift is usually 2-3 levels max
            // But for simplicity, we just cap at target level for virgin, maybe warning if > 3
            if (targetLevel - currentLevel > 3) {
                warning = "Standard dye usually maxes out at 3 levels of lift on virgin hair.";
                achievable = Math.min(10, currentLevel + 3);
            } else {
                achievable = Math.min(10, targetLevel);
            }
        }
    } else {
        // Going darker
        achievable = targetLevel;
    }

    const exposed = UNDERLYING_PIGMENTS[achievable] || "neutral";

    return {
        achievableLevel: achievable,
        exposedPigment: exposed,
        warning,
    };
}

export function blendTones(baseHex: string, exposedPigmentStr: string, targetToneHex: string): string {
    // Map exposed pigments to approximate actual colors they'd represent
    const exposedHexMap: Record<string, string> = {
        "black": "#121212",
        "near-black": "#211c19",
        "dark-brown": "#3b281f",
        "red": "#801212",
        "red-orange": "#9e340b",
        "orange": "#bd4d04",
        "orange-yellow": "#d18c15",
        "yellow": "#d1ba15",
        "pale-yellow": "#ded573",
        "white-yellow": "#e8e5af",
        "neutral": "#b3a496",
    };

    const exposedHex = exposedHexMap[exposedPigmentStr] || "#b3a496";

    // First mix the base depth with the exposed pigment
    const baseWithPigment = chroma.mix(baseHex, exposedHex, 0.4, "lab");
    // Then mix the dye tone on top
    const finalHex = chroma.mix(baseWithPigment, targetToneHex, 0.6, "lab").hex();

    return finalHex;
}

export function simulateResult(hairState: HairState, dyeInput: DyeInput) {
    const { currentLevel, hairHistory } = hairState;
    const { targetLevel, targetTone, bleachEnabled, bleachLifts } = dyeInput;

    const liftResult = simulateLift(
        currentLevel,
        targetLevel,
        hairHistory,
        bleachEnabled || false,
        bleachLifts || 0
    );

    const beforeHex = BASE_LEVEL_HEX[currentLevel] || "#121212";
    const targetBaseHex = BASE_LEVEL_HEX[liftResult.achievableLevel] || "#121212";

    const toneHex = TONE_HEX[targetTone] || TONE_HEX.neutral;
    const afterHex = blendTones(targetBaseHex, liftResult.exposedPigment, toneHex);

    const warnings: string[] = [];
    if (liftResult.warning) {
        warnings.push(liftResult.warning);
    }

    const { score: warmthScore, level: warmthLevel, message: warmthMessage } = calculateWarmth(afterHex);

    if (warmthLevel !== "none" && warmthMessage) {
        // According to Sprint 5, can display as color-coded alert: yellow / orange / red
        // but we'll include it in standard warnings array (or we could just return it as warmthScore for a dedicated component). 
        // We'll return warmthScore and warmthLevel directly to construct custom UI.
    }

    return {
        beforeHex,
        afterHex,
        achievableLevel: liftResult.achievableLevel,
        exposedPigment: liftResult.exposedPigment,
        warmthScore,
        warmthLevel,
        warnings,
    };
}
