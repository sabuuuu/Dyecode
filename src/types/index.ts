export * from "../schemas/hair.schema";

export type SimulationResult =
    | { status: "idle" }
    | { status: "success"; beforeHex: string; afterHex: string; achievableLevel: number; warnings: string[]; warmthScore?: number }
    | { status: "error"; message: string };
