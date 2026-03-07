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

export const porosityLevelSchema = z.enum(["low", "normal", "high"]);
export const hairLengthSchema = z.enum(["short", "medium", "long", "very-long"]);
export const hairThicknessSchema = z.enum(["fine", "medium", "thick"]);
export const damageLevelSchema = z.union([
    z.literal(0),
    z.literal(3),
    z.literal(6),
    z.literal(9),
]);
export const skinDepthSchema = z.enum(["fair", "light", "medium", "tan", "deep", "dark"]);
export const skinUndertoneSchema = z.enum(["cool", "neutral", "warm"]);

export const hairStateSchema = z.object({
    currentLevel: z.number().int().min(1).max(10),
    currentUndertone: undertoneSchema,
    hairHistory: hairHistorySchema,
    porosity: porosityLevelSchema,
    damageLevel: damageLevelSchema,
    chemicalHistory: z.array(z.string()),
    hairLength: hairLengthSchema,
    hairThickness: hairThicknessSchema,
    skinDepth: skinDepthSchema.optional(),
    skinUndertone: skinUndertoneSchema.optional(),
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
    porosity: hairStateSchema.shape.porosity,
    damageLevel: hairStateSchema.shape.damageLevel,
    chemicalHistory: hairStateSchema.shape.chemicalHistory,
    hairLength: hairStateSchema.shape.hairLength,
    hairThickness: hairStateSchema.shape.hairThickness,
    skinDepth: hairStateSchema.shape.skinDepth,
    skinUndertone: hairStateSchema.shape.skinUndertone,
    targetLevel: dyeInputSchema.shape.targetLevel,
    targetTone: dyeInputSchema.shape.targetTone,
    bleachEnabled: dyeInputSchema.shape.bleachEnabled,
    bleachLifts: dyeInputSchema.shape.bleachLifts,
});

export type Undertone = z.infer<typeof undertoneSchema>;
export type DyeTone = z.infer<typeof dyeToneSchema>;
export type HairHistory = z.infer<typeof hairHistorySchema>;
export type PorosityLevel = z.infer<typeof porosityLevelSchema>;
export type HairLength = z.infer<typeof hairLengthSchema>;
export type HairThickness = z.infer<typeof hairThicknessSchema>;
export type DamageLevel = z.infer<typeof damageLevelSchema>;
export type HairState = z.infer<typeof hairStateSchema>;
export type DyeInput = z.infer<typeof dyeInputSchema>;
export type HairFormInput = z.infer<typeof hairFormSchema>;
