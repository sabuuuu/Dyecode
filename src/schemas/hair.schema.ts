import { z } from "zod";

export const undertoneSchema = z.enum([
    "red", "red-orange", "orange", "orange-yellow", "yellow", "neutral",
    "ash", "pearl", "matte", "beige", "gold", "copper", "mahogany", "burgundy",
    "blue", "pink", "purple", "green", "teal", "magenta", "silver"
]);

export const dyeToneSchema = z.enum([
    "ash", "pearl", "matte", "neutral", "beige", "gold", "copper", "red", "mahogany", "burgundy",
    "blue", "pink", "purple", "green", "teal", "magenta", "silver"
]);

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

export const hairFormSchema = z.object({
    currentLevel: hairStateSchema.shape.currentLevel,
    currentUndertone: hairStateSchema.shape.currentUndertone,
    hairHistory: hairStateSchema.shape.hairHistory,
    targetLevel: dyeInputSchema.shape.targetLevel,
    targetTone: dyeInputSchema.shape.targetTone,
    bleachEnabled: dyeInputSchema.shape.bleachEnabled,
    bleachLifts: dyeInputSchema.shape.bleachLifts,
});

export type Undertone = z.infer<typeof undertoneSchema>;
export type DyeTone = z.infer<typeof dyeToneSchema>;
export type HairHistory = z.infer<typeof hairHistorySchema>;
export type HairState = z.infer<typeof hairStateSchema>;
export type DyeInput = z.infer<typeof dyeInputSchema>;
export type HairFormInput = z.infer<typeof hairFormSchema>;
