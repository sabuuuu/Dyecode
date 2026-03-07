import type { HairLength, HairThickness } from "../types";

export function canHandleProcess(
    damageLevel: number,
    bleachLifts: number,
    targetLevelJump: number
): { safe: boolean; warning?: string; recommendation?: string } {

    if (damageLevel >= 6 && bleachLifts >= 2) {
        return {
            safe: false,
            warning: "Your hair is too damaged for this process.",
            recommendation: "Wait 8-12 weeks. Use protein treatments. Consider salon consultation."
        };
    }

    if (damageLevel >= 3 && targetLevelJump > 4) {
        return {
            safe: false,
            warning: "This is too drastic for your current hair condition.",
            recommendation: "Break this into 2-3 sessions over 3 months."
        };
    }

    if (damageLevel === 0 && bleachLifts >= 3) {
        return {
            safe: true,
            warning: "Your hair will be significantly damaged after this.",
            recommendation: "Budget for Olaplex or bond-building treatments."
        };
    }

    return { safe: true };
}

export function calculateProductQuantity(
    length: HairLength,
    thickness: HairThickness
): { boxes: number; developer: string } {

    const quantityMap = {
        short: { fine: 1, medium: 1, thick: 2 },
        medium: { fine: 1, medium: 2, thick: 2 },
        long: { fine: 2, medium: 2, thick: 3 },
        "very-long": { fine: 2, medium: 3, thick: 4 }
    };

    const boxes = quantityMap[length][thickness];
    const developer = boxes === 1 ? "8 oz" : boxes === 2 ? "16 oz" : "24 oz";

    return { boxes, developer };
}
