export * from "../schemas/hair.schema";

export type SimulationResult =
    | { status: "idle" }
    | { status: "success"; beforeHex: string; afterHex: string; achievableLevel: number; exposedPigment: string; warnings: string[]; warmthScore?: number; warmthLevel?: import("../engine/warmth").WarmthLevel; appliedInput: import("../schemas/hair.schema").DyeInput }
    | { status: "error"; message: string };
