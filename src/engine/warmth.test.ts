import { describe, it, expect } from "vitest";
import { calculateWarmth } from "./warmth";

describe("Warmth Engine", () => {
    it("returns no warmth for ash or completely cool colors", () => {
        // Ashy / blue-grey hue
        const result = calculateWarmth("#8c9096");
        expect(result.level).toBe("none");
        expect(result.score).toBeLessThan(15);
    });

    it("triggers strong or critical for bright oranges", () => {
        // Bright copper/orange
        const result = calculateWarmth("#d16b15");
        expect(["critical", "strong"]).toContain(result.level);
        expect(result.score).toBeGreaterThanOrEqual(40);
    });

    it("handles mild warmth correctly", () => {
        // Neutral brown with slight warmth
        const result = calculateWarmth("#8c6b5d");
        expect(result.score).toBeGreaterThan(0);
    });
});
