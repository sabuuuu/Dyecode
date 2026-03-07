export interface SkinToneAdvice {
    compatible: boolean;
    confidence: "high" | "medium" | "low";
    message: string;
    alternative?: string;
}

export function checkSkinToneCompatibility(
    skinDepth: string,
    skinUndertone: string,
    hairLevel: number,
    hairTone: string
): SkinToneAdvice {

    // Cool skin + warm hair = clash
    if (skinUndertone === "cool" && ["gold", "copper", "red", "mahogany"].includes(hairTone)) {
        return {
            compatible: false,
            confidence: "high",
            message: "Warm hair tones may clash with your cool skin undertone.",
            alternative: "Consider ash, pearl, or cool brown tones instead."
        };
    }

    // Warm skin + ash hair = washed out
    if (skinUndertone === "warm" && hairTone === "ash") {
        return {
            compatible: false,
            confidence: "medium",
            message: "Ash tones can look slightly flat or gray against warm complexions.",
            alternative: "Try golden blonde, beige, or chocolate brown for better harmony."
        };
    }

    // Very light hair + very fair skin = washed out
    if (skinDepth === "fair" && hairLevel >= 9 && hairTone === "neutral") {
        return {
            compatible: true,
            confidence: "medium",
            message: "Very pale blonde on fair skin can wash out your features.",
            alternative: "Consider adding a bit of 'warmth' or 'depth' (Level 8) for contrast."
        };
    }

    // Deep skin + very dark hair = striking
    if (skinDepth === "deep" && hairLevel <= 3) {
        return {
            compatible: true,
            confidence: "high",
            message: "Deep, rich tones create a beautiful, striking look on deeper skin."
        };
    }

    // Default: compatible
    return {
        compatible: true,
        confidence: "high",
        message: "This shade should complement your skin tone nicely."
    };
}
