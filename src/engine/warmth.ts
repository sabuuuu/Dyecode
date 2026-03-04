import chroma from "chroma-js";

export type WarmthLevel = "none" | "mild" | "strong" | "critical";

export interface WarmthResult {
    score: number;
    level: WarmthLevel;
    message?: string;
}

export function calculateWarmth(hex: string): WarmthResult {
    const hsl = chroma(hex).hsl();
    const hue = isNaN(hsl[0]) ? 0 : hsl[0];
    const saturation = isNaN(hsl[1]) ? 0 : hsl[1];

    let score = 0;

    // Hue 0-40° is the red/orange/yellow family
    if (hue >= 0 && hue <= 45 && saturation > 0.1) {
        // Closer to pure orange (approx 20-30 hue) and higher saturation means higher warmth score
        // Simplistic calculation out of 100
        const hueIntensity = 1 - (Math.abs(hue - 25) / 25);
        const clampedHueInt = Math.max(0, hueIntensity);

        score = Math.round((clampedHueInt * 40) + (saturation * 60));
        score = Math.min(100, Math.max(0, score));
    }

    if (score >= 70) {
        return { score, level: "critical", message: "High red/orange pigment exposure. Toner or purple shampoo recommended." };
    } else if (score >= 40) {
        return { score, level: "strong", message: "Result will likely appear copper or brassy." };
    } else if (score >= 15) {
        return { score, level: "mild", message: "Result may have warm undertones." };
    }

    return { score, level: "none" };
}
