import { describe, it, expect } from "vitest";
import { simulateLift, blendTones, simulateResult } from "./pigment";
import { HairState, DyeInput } from "../types";

describe("Pigment Engine", () => {
    describe("simulateLift", () => {
        it("caps lift on previously dyed hair without bleach", () => {
            const result = simulateLift(4, 7, "dyed-darker");
            expect(result.achievableLevel).toBe(4);
            expect(result.warning).toBe("Dye cannot lift previously dyed hair without bleach.");
        });

        it("allows lift on virgin hair", () => {
            const result = simulateLift(5, 7, "virgin");
            expect(result.achievableLevel).toBe(7);
            expect(result.warning).toBeUndefined();
        });

        it("caps virgin lift beyond 3 levels", () => {
            const result = simulateLift(3, 8, "virgin");
            expect(result.achievableLevel).toBe(6);
            expect(result.warning).toBeDefined();
        });

        it("applies bleach lifts correctly", () => {
            const result = simulateLift(3, 8, "dyed-darker", true, 3);
            expect(result.achievableLevel).toBe(6); // 3 + 3
        });

        it("goes darker without restrictions", () => {
            const result = simulateLift(8, 4, "dyed-lighter");
            expect(result.achievableLevel).toBe(4);
            expect(result.warning).toBeUndefined();
        });
    });

    describe("simulateResult", () => {
        it("runs end-to-end properly", () => {
            const state: HairState = {
                currentLevel: 6,
                currentUndertone: "orange",
                hairHistory: "virgin",
                porosity: "normal",
                damageLevel: 0,
                chemicalHistory: [],
                hairLength: "medium",
                hairThickness: "medium",
            };
            const input: DyeInput = {
                targetLevel: 8,
                targetTone: "ash",
                bleachEnabled: false,
            };

            const result = simulateResult(state, input);
            expect(result.achievableLevel).toBe(8);
            expect(result.beforeHex).toBeDefined();
            expect(result.afterHex).toBeDefined();
            expect(result.warnings).toHaveLength(0);
        });

        it("returns warning if lifting dyed", () => {
            const state: HairState = {
                currentLevel: 5,
                currentUndertone: "red-orange",
                hairHistory: "dyed-darker",
                porosity: "normal",
                damageLevel: 0,
                chemicalHistory: [],
                hairLength: "medium",
                hairThickness: "medium",
            };
            const input: DyeInput = {
                targetLevel: 7,
                targetTone: "ash",
                bleachEnabled: false,
            };

            const result = simulateResult(state, input);
            expect(result.achievableLevel).toBe(5);
            expect(result.warnings).toHaveLength(1);
        });
    });
});
