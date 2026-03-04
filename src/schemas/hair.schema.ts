import { z } from "zod";

export const undertoneSchema = z.enum(["red", "red-orange", "orange", "orange-yellow", "yellow", "neutral"]);

export const dyeToneSchema = z.enum(["ash", "neutral", "gold", "copper", "red", "mahogany"]);

export const hairHistorySchema = z.enum(["virgin", "dyed-darker", "dyed-lighter"]);

export const hairStateSchema = z.object({
    currentLevel: z.number().int().min(1).max(10),
    currentUndertone: undertoneSchema,
    hairHistory: hairHistorySchema,
});

export const dyeInputSchema = z.object({
    targetLevel: z.number().int().min(1).max(10),
    targetTone: dyeToneSchema,
    bleachEnabled: z.boolean(),
    bleachLifts: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
});

export type Undertone = z.infer<typeof undertoneSchema>;
export type DyeTone = z.infer<typeof dyeToneSchema>;
export type HairHistory = z.infer<typeof hairHistorySchema>;
export type HairState = z.infer<typeof hairStateSchema>;
export type DyeInput = z.infer<typeof dyeInputSchema>;
