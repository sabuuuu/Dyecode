import type { HairLength, PorosityLevel } from "../types";

export interface Instruction {
    step: number;
    title: string;
    duration: string;
    details: string[];
    warning?: string;
    tip?: string;
}

export function getApplicationInstructions(
    bleachEnabled: boolean,
    hairLength: HairLength,
    porosity: PorosityLevel
): Instruction[] {

    const instructions: Instruction[] = [];

    // Prep
    instructions.push({
        step: 1,
        title: "Prep Your Space",
        duration: "10 minutes",
        details: [
            "Wear old clothes and have an old towel ready",
            "Cover surfaces with plastic or newspaper",
            "Gather all tools: bowl, brush, clips, timer",
            "Apply petroleum jelly to hairline to prevent staining",
            "Put on gloves BEFORE opening any product"
        ],
        tip: "Do a patch test 48 hours before! Better safe than sorry."
    });

    // Section hair
    instructions.push({
        step: 2,
        title: "Section Your Hair",
        duration: "5-10 minutes",
        details: [
            "Divide hair into 4 quadrants (top to bottom, ear to ear)",
            "Use clips to secure each section",
            "Ensure hair is dry for bleach/permanent dye, damp for semi-permanent",
            hairLength === "long" || hairLength === "very-long"
                ? "Work in smaller 1-inch sub-sections for thorough coverage"
                : "4 sections are usually enough for shorter hair"
        ]
    });

    if (bleachEnabled) {
        instructions.push({
            step: 3,
            title: "Mix Bleach",
            duration: "2 minutes",
            details: [
                "Mix powder and developer in a plastic bowl (NO METAL)",
                "Standard ratio is 1:2 (1 part powder to 2 parts developer)",
                "Mix until smooth to a yogurt-like consistency",
                "Use immediately while the chemical reaction is peak"
            ],
            warning: "Never mix bleach in advance as it loses potency quickly."
        });

        instructions.push({
            step: 4,
            title: "Apply Bleach",
            duration: "20-40 minutes",
            details: [
                "Start at the ends (they take longer to process)",
                "Work upwards but leave 1/2 inch of roots untouched for now",
                "Once ends are done, apply to roots (scalp heat makes them lift faster)",
                "Set timer for 20-30 minutes once application is complete"
            ],
            warning: "Check progress every 5-10 minutes. Do not exceed 45 minutes total.",
            tip: porosity === "high"
                ? "High porosity hair lifts fast! Start checking at 10 minutes."
                : "Low porosity might need the full 30 minutes. Keep it covered with a cap."
        });

        instructions.push({
            step: 5,
            title: "Rinse & Prep for Color",
            duration: "15 minutes",
            details: [
                "Rinse with lukewarm water until clear",
                "Shampoo gently (sulfate-free)",
                "Do NOT use heavy conditioner yet if you're layering toner/color next",
                "Towel dry until 'just damp' or blow dry on cool"
            ],
            warning: "If hair feels stretchy or 'mushy' when wet, STOP. Do not apply more color today."
        });
    }

    const dyeStep = bleachEnabled ? 6 : 3;
    instructions.push({
        step: dyeStep,
        title: "Apply Target Color",
        duration: "15 minutes",
        details: [
            "Mix dye and developer exactly as specified on the box",
            "Start application at the roots for best gray coverage or 'hot root' prevention",
            "Pull color through to the mid-lengths and ends",
            "Massage hair sections to ensure no dry spots",
            "Comb through with a wide-tooth comb for even distribution"
        ],
        tip: "Use more product than you think. Saturated hair results in even color."
    });

    instructions.push({
        step: dyeStep + 1,
        title: "Processing & Final Rinse",
        duration: "30-45 minutes",
        details: [
            "Set timer according to instructions (usually 30-35 mins)",
            "Rinse with cool to lukewarm water (helps seal the cuticle)",
            "Apply the specific conditioner provided in the kit",
            "Leave conditioner for 5 full minutes"
        ],
        warning: "Don't wash with shampoo for 48 hours to let the color molecules set."
    });

    return instructions;
}

export function getMaintenanceSchedule(
    targetTone: string,
    bleachEnabled: boolean
): { task: string; frequency: string; why: string }[] {

    const isCool = targetTone === "ash" || targetTone === "blue" || targetTone === "purple" || targetTone === "teal";

    const schedule = [
        {
            task: "Sulfate-Free Shampoo",
            frequency: "Every 2-3 days",
            why: "Prevents premature color fading and keeps hair hydrated."
        }
    ];

    if (isCool) {
        schedule.push({
            task: "Toning Shampoo (Purple/Blue)",
            frequency: "1x per week",
            why: "Neutralizes brassy regrowth and maintains the cool reflect."
        });
    }

    if (bleachEnabled) {
        schedule.push({
            task: "Bond Building Treatment",
            frequency: "Bi-weekly",
            why: "Repairs internal structure damaged during the lift process."
        });
    }

    schedule.push({
        task: "Gloss/Toner Refresh",
        frequency: "Every 6 weeks",
        why: "Revives the shine and vibrancy as demi-permanents naturally fade."
    });

    return schedule;
}
