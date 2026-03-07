import type { HairState, DyeInput, SimulationResult } from "../types";

export interface SafetyWarning {
    severity: "info" | "warning" | "danger" | "critical";
    title: string;
    message: string;
    action?: string;
}

export function getSafetyWarnings(
    hairState: HairState,
    dyeInput: DyeInput,
    result: SimulationResult
): SafetyWarning[] {

    const warnings: SafetyWarning[] = [];

    if (result.status !== "success") return warnings;

    // Damage warnings
    if (hairState.damageLevel >= 6 && dyeInput.bleachEnabled) {
        warnings.push({
            severity: "critical",
            title: "High Risk of Breakage",
            message: "Your hair is already compromised. Bleaching will likely cause severe chemical breakage or 'melting' of hair strands.",
            action: "See a professional colorist or wait 3+ months for hair to recover."
        });
    }

    // Porosity warnings
    if (hairState.porosity === "high" && dyeInput.bleachEnabled) {
        warnings.push({
            severity: "warning",
            title: "Porous Hair Alert",
            message: "High porosity hair processes extremely fast and can over-lighten or turn 'gummy' quickly.",
            action: "Check bleach every 5-10 minutes. Consider using 20 vol instead of 30 vol developer."
        });
    }

    // Warmth warnings
    if (result.warmthScore && result.warmthScore >= 70) {
        warnings.push({
            severity: "warning",
            title: "High Warmth Detected",
            message: "Your starting base and goal will expose intense orange/brassy tones that many find unflattering.",
            action: "Use a blue or purple toner after bleaching. Stick to a strict purple shampoo routine."
        });
    }

    // Level jump warnings
    const levelJump = dyeInput.targetLevel - hairState.currentLevel;
    if (levelJump > 5 && !dyeInput.bleachEnabled) {
        warnings.push({
            severity: "danger",
            title: "Impossible Without Bleach",
            message: "Regular box dye cannot lift hair more than 3-4 levels. A target level jump of 5+ requires professional lightener.",
            action: "Enable bleach in settings or choose a darker target color."
        });
    }

    // Dark to light warnings
    if (hairState.hairHistory !== "virgin" && levelJump > 3) {
        warnings.push({
            severity: "warning",
            title: "Color Correction Needed",
            message: "Lifting hair that has already been dyed darker is complex. Color does not lift color.",
            action: "Consider using a color remover first to strip old pigment before bleaching."
        });
    }

    // Perm/Relaxer history
    if (hairState.chemicalHistory.some(c => c.includes("Relaxer") || c.includes("Perm"))) {
        warnings.push({
            severity: "critical",
            title: "Incompatible Chemistry",
            message: "Applying bleach or high-lift color to relaxed or permed hair can cause instant catastrophic breakage.",
            action: "Do not attempt this at home. Seek professional advice."
        });
    }

    return warnings;
}

export function calculateDifficulty(
    levelJump: number,
    bleachLifts: number,
    damageLevel: number,
    hasChemicalHistory: boolean
): { level: "Easy" | "Moderate" | "Hard" | "Expert"; description: string; color: string } {

    let score = 0;

    score += Math.abs(levelJump) * 0.5;
    score += bleachLifts * 2;
    score += (damageLevel / 10) * 4;
    score += hasChemicalHistory ? 2 : 0;

    if (score <= 2) {
        return {
            level: "Easy",
            description: "Beginner-friendly. Low risk of mistakes.",
            color: "bg-green-500"
        };
    } else if (score <= 5) {
        return {
            level: "Moderate",
            description: "Doable with focus. Watch tutorials first.",
            color: "bg-blue-500"
        };
    } else if (score <= 8) {
        return {
            level: "Hard",
            description: "Challenging. Precision and timing are critical.",
            color: "bg-amber-500"
        };
    } else {
        return {
            level: "Expert",
            description: "High risk of damage or uneven results. Salon recommended.",
            color: "bg-red-500"
        };
    }
}
