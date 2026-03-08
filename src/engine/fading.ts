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
    
    // Determine if this is a light color (level 6+) - these fade faster and lighter
    const isLightColor = initialLevel >= 6;

    const predictions: FadingPrediction[] = [];

    // Week 0 (initial)
    predictions.push({
        weeks: 0,
        hex: initialHex,
        level: initialLevel,
        description: "Freshly colored"
    });

    // Week 2 - slight fading
    const week2Fade = fadeRate * 0.2;
    predictions.push({
        weeks: 2,
        hex: adjustFading(initialHex, week2Fade, tone, isLightColor),
        level: isLightColor ? Math.min(10, initialLevel + 0.2) : initialLevel,
        description: "Minor vibrancy loss"
    });

    // Week 4 - noticeable fading
    const week4Fade = fadeRate * 0.5;
    predictions.push({
        weeks: 4,
        hex: adjustFading(initialHex, week4Fade, tone, isLightColor),
        level: isLightColor ? Math.min(10, initialLevel + 0.5) : Math.min(10, initialLevel + 0.2),
        description: "Visible fading. Toner refresh recommended."
    });

    // Week 8 - significant fading
    const week8Fade = fadeRate * 0.85;
    predictions.push({
        weeks: 8,
        hex: adjustFading(initialHex, week8Fade, tone, isLightColor),
        level: isLightColor ? Math.min(10, initialLevel + 1) : Math.min(10, initialLevel + 0.4),
        description: "Significant fade. Roots visible. Full refresh needed."
    });

    return predictions;
}

function adjustFading(hex: string, amount: number, tone: string, isLightColor: boolean): string {
    let color = chroma(hex);

    // Light colors (honey brown, blonde, etc.) fade MORE dramatically
    // Dark colors (burgundy, black, etc.) fade less but still lose vibrancy
    
    if (isLightColor) {
        // Light colors: lose saturation faster, get much lighter, turn brassy
        color = color.desaturate(amount * 3);
        color = color.brighten(amount * 1.5);
        
        // Light colors become very brassy/yellow as they fade
        if (tone === "ash" || tone === "neutral" || tone === "pearl" || tone === "silver") {
            // Cool light tones → brassy yellow
            color = chroma.mix(color, "#e8c48a", amount * 0.6, "lab");
        } else if (tone === "gold" || tone === "beige") {
            // Warm light tones → pale yellow/beige
            color = chroma.mix(color, "#f0ddb0", amount * 0.5, "lab");
        } else {
            // Other light tones → washed out beige
            color = chroma.mix(color, "#e8d4c0", amount * 0.5, "lab");
        }
    } else {
        // Dark colors: lose saturation but don't get as light, can turn muddy
        color = color.desaturate(amount * 2);
        color = color.brighten(amount * 0.8);
        
        // Dark colors fade differently based on tone
        if (tone === "burgundy" || tone === "mahogany" || tone === "red") {
            // Deep reds → muddy reddish-brown
            color = chroma.mix(color, "#a67c6d", amount * 0.4, "lab");
        } else if (tone === "ash" || tone === "neutral") {
            // Dark cool tones → slightly warm brown
            color = chroma.mix(color, "#8b7355", amount * 0.35, "lab");
        } else {
            // Other dark tones → neutral brown
            color = chroma.mix(color, "#9a8570", amount * 0.4, "lab");
        }
    }

    return color.hex();
}
