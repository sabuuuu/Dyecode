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
    // More realistic underlying pigment colors
    const exposedHexMap: Record<string, string> = {
        black: "#0a0a0a",
        "near-black": "#1c1410",
        "dark-brown": "#2d1f1a",
        red: "#6b2020",           // Deep red pigment
        "red-orange": "#8b3a1e",  // Red-orange undertone
        orange: "#b5633a",        // Orange brass
        "orange-yellow": "#c9a961", // Yellow-orange
        yellow: "#d4af6a",        // Yellow undertone
        "pale-yellow": "#e8d4a8", // Pale yellow
        "white-yellow": "#f5e6c8", // Very pale
        neutral: "#8b7355",
    };

    const safeBase = chroma.valid(baseHex) ? baseHex : "#2d1f1a";
    const safeTarget = chroma.valid(targetToneHex) ? targetToneHex : "#8b7355";
    const exposedHex = chroma.valid(exposedHexMap[exposedPigmentStr])
        ? exposedHexMap[exposedPigmentStr]
        : exposedHexMap.neutral;

    // More realistic blending that preserves hair color characteristics
    const baseLab = chroma(safeBase).lab();
    const targetLab = chroma(safeTarget).lab();
    const exposedLab = chroma(exposedHex).lab();

    // Preserve the depth (lightness) from the base level
    const depthL = baseLab[0] * 0.6 + targetLab[0] * 0.4;

    // Mix underlying pigment more strongly (what bleach reveals)
    const baseWithPigment = chroma.mix(safeBase, exposedHex, 0.4, "lab");

    // Apply target tone while keeping realistic undertones
    let withTone = chroma.mix(baseWithPigment, safeTarget, 0.55, "lab");

    // Anchor to realistic lightness and adjust saturation for natural look
    withTone = withTone.set("lab.l", depthL).saturate(0.3);

    return withTone.hex();
}

export function simulateResult(hairState: HairState, dyeInput: DyeInput) {
    const { currentLevel, currentUndertone, hairHistory } = hairState;
    const { targetLevel, targetTone, bleachEnabled, bleachLifts } = dyeInput;

    console.log(`\n--- Simulating: ${currentUndertone} L${currentLevel} → ${targetTone} L${targetLevel} (Bleach: ${bleachEnabled}, Lifts: ${bleachLifts}) ---`);

    const liftResult = simulateLift(
        currentLevel,
        targetLevel,
        hairHistory,
        bleachEnabled || false,
        bleachLifts || 0
    );

    console.log(`Lift result: Achievable level ${liftResult.achievableLevel}, Exposed pigment: ${liftResult.exposedPigment}`);

    // BEFORE: Show the actual starting color (what user selected)
    const currentToneHex = TONE_HEX[currentUndertone] || BASE_LEVEL_HEX[currentLevel] || "#2d1f1a";
    const beforeHex = adjustColorForLevel(currentToneHex, currentLevel);
    console.log(`Before color: ${beforeHex}`);

    // AFTER: Simulate what ACTUALLY happens when you apply target dye
    const targetToneHex = TONE_HEX[targetTone] || BASE_LEVEL_HEX[liftResult.achievableLevel] || "#2d1f1a";
    
    // Get underlying pigment that will show through
    const exposedPigment = UNDERLYING_PIGMENTS[liftResult.achievableLevel] || "neutral";
    
    // If bleaching, the base becomes the lifted color
    // Then apply the target dye on top of that lifted base
    let baseForDye = beforeHex;
    if (bleachEnabled && bleachLifts && bleachLifts > 0) {
        // After bleaching, hair is lighter - use the achievable level as new base
        const liftedBaseHex = BASE_LEVEL_HEX[liftResult.achievableLevel] || "#8b7355";
        baseForDye = adjustColorForLevel(liftedBaseHex, liftResult.achievableLevel);
        console.log(`After bleaching base: ${baseForDye} at level ${liftResult.achievableLevel}`);
    }
    
    // Blend the target dye with the current/lifted base and exposed pigments for realistic result
    const afterHex = blendTones(baseForDye, exposedPigment, targetToneHex);
    console.log(`After applying ${targetTone} dye: ${afterHex}`);

    const warnings: string[] = [];
    if (liftResult.warning) {
        warnings.push(liftResult.warning);
    }

    // Add warning if going from dark to light without bleach
    if (targetLevel > currentLevel && !bleachEnabled) {
        warnings.push("Going lighter without bleach will result in warm, brassy tones. The dye will deposit color but won't lift much.");
    }

    const { score: warmthScore, level: warmthLevel, message: warmthMessage } = calculateWarmth(afterHex);

    return {
        beforeHex,
        afterHex,
        achievableLevel: liftResult.achievableLevel,
        exposedPigment: exposedPigment,
        warmthScore,
        warmthLevel,
        warnings,
    };
}

// Adjust a color's lightness to match a hair level (1-10)
// Keeps the hue/tone but adjusts how dark or light it is
function adjustColorForLevel(colorHex: string, level: number): string {
    // Map hair levels to LAB lightness values
    // Level 1 (black) = very dark, Level 10 (platinum) = very light
    const lightnessMap: Record<number, number> = {
        1: 15,   // Black
        2: 20,   // Darkest brown
        3: 28,   // Dark brown
        4: 35,   // Medium brown
        5: 42,   // Light brown
        6: 50,   // Dark blonde
        7: 58,   // Medium blonde
        8: 68,   // Light blonde
        9: 78,   // Very light blonde
        10: 88,  // Lightest blonde
    };

    const targetLightness = lightnessMap[level] || 50;
    
    // Take the chosen color and adjust only its lightness
    const adjusted = chroma(colorHex).set('lab.l', targetLightness);
    
    return adjusted.hex();
}
