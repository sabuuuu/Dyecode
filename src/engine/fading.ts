import chroma from "chroma-js";
import type { PorosityLevel } from "../types";

export interface FadingPrediction {
    weeks: number;
    hex: string;
    level: number;
    description: string;
}

export type WashFrequency = "daily" | "every-other" | "twice-week";

export function predictFading(
    initialHex: string,
    initialLevel: number,
    tone: string,
    porosity: PorosityLevel,
    washFrequency: WashFrequency
): FadingPrediction[] {

    const washMultiplier: Record<WashFrequency, number> = {
        daily: 1.5,
        "every-other": 1.0,
        "twice-week": 0.7
    };

    const porosityMultiplier: Record<PorosityLevel, number> = {
        low: 0.7,
        normal: 1.0,
        high: 1.3
    };

    const fadeRate = washMultiplier[washFrequency] * porosityMultiplier[porosity];

    const predictions: FadingPrediction[] = [];

    // Week 0 (initial)
    predictions.push({
        weeks: 0,
        hex: initialHex,
        level: initialLevel,
        description: "Freshly colored"
    });

    // Week 2
    const week2Fade = fadeRate * 0.15;
    predictions.push({
        weeks: 2,
        hex: adjustFading(initialHex, week2Fade, tone),
        level: initialLevel,
        description: "Minor vibrancy loss"
    });

    // Week 4
    const week4Fade = fadeRate * 0.35;
    predictions.push({
        weeks: 4,
        hex: adjustFading(initialHex, week4Fade, tone),
        level: Math.min(10, initialLevel + 0.2), // Fading usually looks slightly lighter
        description: "Visible fading. Toner refresh recommended."
    });

    // Week 8
    const week8Fade = fadeRate * 0.6;
    predictions.push({
        weeks: 8,
        hex: adjustFading(initialHex, week8Fade, tone),
        level: Math.min(10, initialLevel + 0.5),
        description: "Significant fade. Roots visible. Full refresh needed."
    });

    return predictions;
}

function adjustFading(hex: string, amount: number, tone: string): string {
    let color = chroma(hex);

    // Fading usually means:
    // 1. Loss of saturation
    // 2. Increasing brightness
    // 3. Shifting towards the underlying pigment (warmth)

    color = color.desaturate(amount * 1.5);
    color = color.brighten(amount * 0.5);

    // If the tone is cool, it becomes warmer as it fades
    if (tone === "ash" || tone === "neutral") {
        color = chroma.mix(color, "#eab308", amount * 0.3, "rgb"); // Fade towards yellow
    } else if (tone === "gold" || tone === "copper") {
        color = chroma.mix(color, "#ea580c", amount * 0.2, "rgb"); // Stay warm but more raw
    }

    return color.hex();
}
