import nearestColor from "nearest-color";

const hairColorShades: Record<string, string> = {
    // Blondes
    "Platinum Blonde": "#f4eade",
    "Light Ash Blonde": "#e3d6c1",
    "Golden Blonde": "#e5c07b",
    "Strawberry Blonde": "#e29e6c",
    "Honey Blonde": "#d8a45e",
    "Dirty Blonde": "#b89772",

    // Browns
    "Light Ash Brown": "#99816d",
    "Mushroom Brown": "#88786d",
    "Chestnut Brown": "#874b36",
    "Mahogany Brown": "#6b332b",
    "Chocolate Brown": "#5b3c33",
    "Espresso Brown": "#31231f",
    "Dark Brown": "#2e201b",

    // Reds/Coppers
    "Light Copper": "#c45c2f",
    "Auburn": "#8b3a2b",
    "Burgundy": "#571622",
    "Cherry Red": "#7b1320",
    "Vibrant Red": "#aa1818",

    // Vivids
    "Midnight Blue": "#171d3a",
    "Denim Blue": "#334c7a",
    "Vibrant Blue": "#1d4ed8",
    "Teal": "#115e59",
    "Emerald": "#065f46",
    "Neon Pink": "#ec4899",
    "Pastel Pink": "#fbcfe8",
    "Magenta": "#9d174d",
    "Lavender": "#a78bfa",
    "Deep Purple": "#4c1d95",
    "Silver": "#d4d4d8",

    // Blacks
    "Soft Black": "#1c1b1b",
    "Jet Black": "#0a0a0a",
    "Blue Black": "#0b1120",
};

export const getColorName = (hex: string) => {
    try {
        const getNearest = nearestColor.from(hairColorShades);
        const match = getNearest(hex);
        return match ? match : { name: "Custom Shade", value: hex };
    } catch {
        return { name: "Custom Mix", value: hex };
    }
};
