import { describe, it, expect } from "vitest";
import { bleachLiftProgression } from "./bleach";
import { HairState, DyeInput } from "../types";

describe("Bleach Simulator", () => {
    it("returns empty array if bleach is disabled", () => {
        const hairState: HairState = { currentLevel: 4, currentUndertone: "red", hairHistory: "virgin" };
        const dyeInput: DyeInput = { targetLevel: 8, targetTone: "ash", bleachEnabled: false };
        const progression = bleachLiftProgression(hairState, dyeInput);
        expect(progression).toHaveLength(0);
    });

    it("returns 3 steps with increasing achievable levels", () => {
        const hairState: HairState = { currentLevel: 3, currentUndertone: "red", hairHistory: "virgin" };
        // 2 lifts per session
        const dyeInput: DyeInput = { targetLevel: 10, targetTone: "ash", bleachEnabled: true, bleachLifts: 2 };

        const progression = bleachLiftProgression(hairState, dyeInput);

        expect(progression).toHaveLength(3);

        // Session 1: 3 + 2 = Level 5
        expect(progression[0].status).toBe("success");
        if (progression[0].status === "success") {
            expect(progression[0].achievableLevel).toBe(5);
        }

        // Session 2: 5 + 2 = Level 7
        if (progression[1].status === "success") {
            expect(progression[1].achievableLevel).toBe(7);
        }

        // Session 3: 7 + 2 = Level 9
        if (progression[2].status === "success") {
            expect(progression[2].achievableLevel).toBe(9);
        }
    });

    it("caps at level 10", () => {
        const hairState: HairState = { currentLevel: 8, currentUndertone: "yellow", hairHistory: "virgin" };
        const dyeInput: DyeInput = { targetLevel: 10, targetTone: "neutral", bleachEnabled: true, bleachLifts: 3 };
        const progression = bleachLiftProgression(hairState, dyeInput);

        if (progression[0].status === "success") {
            expect(progression[0].achievableLevel).toBe(10);
        }
        if (progression[1].status === "success") {
            expect(progression[1].achievableLevel).toBe(10); // Remains 10
        }
    });
});
