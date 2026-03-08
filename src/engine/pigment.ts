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
    const exposedHexMap: Record<string, string> = {
        black: "#121212",
        "near-black": "#211c19",
        "dark-brown": "#3b281f",
        red: "#7f1515",
        "red-orange": "#a3340f",
        orange: "#c5520c",
        "orange-yellow": "#d78a1a",
        yellow: "#d8b51a",
        "pale-yellow": "#e3d47a",
        "white-yellow": "#f0e9b5",
        neutral: "#b3a496",
    };

    const safeBase = chroma.valid(baseHex) ? baseHex : "#121212";
    const safeTarget = chroma.valid(targetToneHex) ? targetToneHex : "#b3a496";
    const exposedHex = chroma.valid(exposedHexMap[exposedPigmentStr])
        ? exposedHexMap[exposedPigmentStr]
        : exposedHexMap.neutral;

    // Step 1: lock depth to the natural level, not the dye
    const baseLab = chroma(safeBase).lab();
    const targetLab = chroma(safeTarget).lab();
    const depthL = baseLab[0] * 0.7 + targetLab[0] * 0.3;

    // Step 2: mix underlying warmth into the base (what bleach / lift reveals)
    const baseWithPigment = chroma.mix(safeBase, exposedHex, 0.5, "lab");

    // Step 3: lay the dye tone on top, keeping some of that warmth
    let withTone = chroma.mix(baseWithPigment, safeTarget, 0.65, "lab");

    // Step 4: re-anchor lightness to the level and nudge saturation for depth
    withTone = withTone.set("lab.l", depthL).saturate(0.5);

    return withTone.hex();
}

export function simulateResult(hairState: HairState, dyeInput: DyeInput) {
    const { currentLevel, currentUndertone, hairHistory } = hairState;
    const { targetLevel, targetTone, bleachEnabled, bleachLifts } = dyeInput;

    const liftResult = simulateLift(
        currentLevel,
        targetLevel,
        hairHistory,
        bleachEnabled || false,
        bleachLifts || 0
    );

    // Use the user's chosen starting color directly - don't blend it
    const beforeHex = TONE_HEX[currentUndertone] || BASE_LEVEL_HEX[currentLevel] || "#121212";

    // Use the user's chosen target color directly - don't blend it
    const afterHex = TONE_HEX[targetTone] || BASE_LEVEL_HEX[liftResult.achievableLevel] || "#121212";

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
