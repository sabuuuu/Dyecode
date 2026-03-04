export const UNDERLYING_PIGMENTS: Record<number, string> = {
    1: "black",
    2: "near-black",
    3: "dark-brown",
    4: "red",
    5: "red-orange",
    6: "orange",
    7: "orange-yellow",
    8: "yellow",
    9: "pale-yellow",
    10: "white-yellow",
};

// Base hex color approximation of virgin/neutral hair levels
export const BASE_LEVEL_HEX: Record<number, string> = {
    1: "#121212",
    2: "#211c19",
    3: "#3b281f",
    4: "#5e3b2e",
    5: "#754432",
    6: "#995c37",
    7: "#b37b42",
    8: "#cca05a",
    9: "#e3c47f",
    10: "#f5dfa8",
};

// Primary hue/tone modifiers (these could map to blending modifiers)
export const TONE_HEX: Record<string, string> = {
    ash: "#8c9096",
    neutral: "#b3a496",
    gold: "#d9b566",
    copper: "#c2692e",
    red: "#9c2727",
    mahogany: "#c74f55",
};
