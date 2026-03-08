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

// Base hex color approximation of virgin/neutral hair levels - REALISTIC HAIR COLORS
export const BASE_LEVEL_HEX: Record<number, string> = {
    1: "#0a0a0a",      // Black - true black hair
    2: "#1c1410",      // Darkest Brown - almost black
    3: "#2d1f1a",      // Dark Brown - deep chocolate
    4: "#3d2817",      // Medium Brown - rich brown
    5: "#5c3a1e",      // Light Brown - chestnut
    6: "#6f4e37",      // Dark Blonde - caramel brown
    7: "#8b6f47",      // Medium Blonde - honey
    8: "#b8935c",      // Light Blonde - golden wheat
    9: "#d4af6a",      // Very Light Blonde - champagne
    10: "#e8d4a8",     // Lightest Blonde - platinum base
};

// Primary hue/tone modifiers - REALISTIC TONES
export const TONE_HEX: Record<string, string> = {
    // Cool tones
    ash: "#7a7568",           // Cool gray-brown (ash)
    pearl: "#9d9189",         // Pearly beige-gray
    silver: "#c5c1ba",        // Silver blonde
    
    // Neutral brown tones (black to light brown range)
    neutral: "#8b7355",       // Natural medium brown
    beige: "#a89176",         // Warm beige brown
    matte: "#7d6e5d",         // Matte brown
    
    // Warm tones
    gold: "#c9a961",          // Golden blonde
    copper: "#b5633a",        // Copper red
    caramel: "#9d6b3f",       // Caramel brown
    
    // Red family (grouped together)
    red: "#6b2020",           // True red
    burgundy: "#4a1a2c",      // Deep burgundy (darker red)
    mahogany: "#5c2626",      // Mahogany red-brown (between red and burgundy)
    auburn: "#6d3026",        // Auburn red-brown (warmer red)
    
    // Fashion colors
    blue: "#2c3e5a",          // Deep blue
    pink: "#c97b8e",          // Rose pink
    purple: "#4a2f4d",        // Deep purple
    violet: "#6b4c6d",        // Violet
    green: "#3d4f3d",         // Forest green
    teal: "#2d5a54",          // Teal
    magenta: "#8b3a62",       // Magenta
    
    // Warm undertones (natural pigments exposed during lightening)
    "red-orange": "#8b3a1e",  // Red-orange undertone
    orange: "#b5633a",        // Orange brass
    "orange-yellow": "#c9a961", // Yellow-orange
    yellow: "#d4af6a",        // Yellow undertone
};
