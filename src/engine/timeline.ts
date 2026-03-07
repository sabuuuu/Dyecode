import type { HairHistory, DamageLevel } from "../types";

export interface TimelineStep {
    session: number;
    weekFromStart: number;
    action: string;
    duration: string;
    cost: number;
    description: string;
}

export function generateTimeline(
    currentLevel: number,
    targetLevel: number,
    damageLevel: number,
    bleachLifts: number,
    hairHistory: HairHistory
): TimelineStep[] {

    const timeline: TimelineStep[] = [];
    const levelJump = targetLevel - currentLevel;

    // Determine if multi-session needed
    const needsMultipleSessions =
        (levelJump > 4) ||
        (damageLevel >= 3 && levelJump > 2) ||
        (hairHistory !== "virgin" && levelJump > 3);

    if (needsMultipleSessions) {
        // Break into 2-3 sessions
        const sessions = levelJump > 6 ? 3 : 2;
        const liftsPerSession = Math.ceil(bleachLifts / sessions);

        for (let i = 0; i < sessions; i++) {
            const isBleach = liftsPerSession > 0;
            timeline.push({
                session: i + 1,
                weekFromStart: i * 6, // 6 weeks between sessions
                action: isBleach ? `Bleach Session ${i + 1}` : `Lift Session ${i + 1}`,
                duration: "2-3 hours",
                cost: isBleach ? 45.99 : 25.99,
                description: isBleach
                    ? `Lighten hair by ${liftsPerSession} level(s). Use bond-building treatments.`
                    : `Gradually lifting tone to reach target level safely.`
            });

            // Recovery phase if not the final session
            if (i < sessions - 1) {
                timeline.push({
                    session: i + 1,
                    weekFromStart: i * 6 + 1,
                    action: "Recovery Phase",
                    duration: "4-6 weeks",
                    cost: 0,
                    description: "Deep condition 2x weekly. Avoid heat styling. Focus on protein/moisture balance."
                });
            }
        }

        // Final color application
        timeline.push({
            session: sessions + 1,
            weekFromStart: sessions * 6,
            action: "Final Color Application",
            duration: "45-60 minutes",
            cost: 25.99,
            description: "Apply target shade and tone. Process as instructed for even coverage."
        });

    } else {
        // Single session
        if (bleachLifts > 0) {
            timeline.push({
                session: 1,
                weekFromStart: 0,
                action: "Bleach + Tone",
                duration: "3-4 hours",
                cost: 55.99,
                description: "Apply bleach to lift base, rinse, then apply target toner. Use bond builder."
            });
        } else {
            const isDarker = targetLevel < currentLevel;
            timeline.push({
                session: 1,
                weekFromStart: 0,
                action: isDarker ? "Color Deposit" : "Single Process Color",
                duration: "45-60 minutes",
                cost: 25.99,
                description: isDarker
                    ? "Depositing darker pigment for rich, even results."
                    : "Applying color to lift and tone in one step."
            });
        }
    }

    // Maintenance schedule
    timeline.push({
        session: timeline.length + 1,
        weekFromStart: timeline[timeline.length - 1].weekFromStart + 4,
        action: "Maintenance & Roots",
        duration: "1 hour",
        cost: 15.99,
        description: "Touch up new growth. Refresh mid-lengths and ends if color has faded."
    });

    return timeline;
}

export function getTotalTimeEstimate(timeline: TimelineStep[]): string {
    const lastStep = timeline[timeline.length - 2];
    const weeks = lastStep ? lastStep.weekFromStart : 0;

    if (weeks === 0) return "Same day journey";
    if (weeks < 4) return `${weeks} week journey`;
    const months = Math.ceil(weeks / 4);
    return `~${months} month journey`;
}

export function getTotalCostEstimate(timeline: TimelineStep[]): number {
    return timeline.reduce((sum, step) => sum + step.cost, 0);
}
