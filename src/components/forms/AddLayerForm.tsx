"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHairStore } from "@/store/useHairStore";
import { dyeInputSchema, type DyeInput } from "@/schemas/hair.schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BASE_LEVEL_HEX, TONE_HEX } from "@/engine/constants";

export function AddLayerForm() {
    const { addLayer, result } = useHairStore();

    const form = useForm<DyeInput>({
        resolver: zodResolver(dyeInputSchema),
        defaultValues: {
            targetLevel: result.status === "success" ? result.achievableLevel : 6,
            targetTone: "ash",
            bleachEnabled: false,
        },
    });

    const watchBleach = form.watch("bleachEnabled");

    useEffect(() => {
        if (result.status === "success") {
            form.setValue("targetLevel", result.achievableLevel);
        }
    }, [result, form]);

    if (result.status !== "success") return null;

    function onSubmit(data: DyeInput) {
        addLayer(data);
    }

    return (
        <div className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">
                                Add another layer
                            </h3>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                Adjust the next lightness, tone and bleach before applying.
                            </p>
                        </div>
                        <Button
                            type="submit"
                            size="sm"
                            className="rounded-[12px] px-5 bg-zinc-900 border border-zinc-900 text-white hover:bg-zinc-800 text-xs h-9 shadow-none shrink-0 w-full sm:w-auto"
                        >
                            Apply layer
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="targetLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                                        Lightness level
                                    </FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(parseInt(val, 10))}
                                        value={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-[12px] bg-white dark:bg-zinc-900 w-full border-zinc-200 dark:border-zinc-700 h-9 text-xs">
                                                <SelectValue placeholder="Level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
                                                            style={{ backgroundColor: BASE_LEVEL_HEX[num] || "#000000" }}
                                                        />
                                                        <span>Level {num}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="targetTone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                                        Shade & tone
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-[12px] bg-white dark:bg-zinc-900 w-full border-zinc-200 dark:border-zinc-700 h-9 text-xs capitalize">
                                                <SelectValue placeholder="Tone" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Primary / oxidative</SelectLabel>
                                                {["ash", "pearl", "matte", "neutral", "beige", "gold", "copper", "red", "mahogany", "burgundy"].map((tone) => (
                                                    <SelectItem key={tone} value={tone}>
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
                                                                style={{ backgroundColor: TONE_HEX[tone] || "#cccccc" }}
                                                            />
                                                            <span className="capitalize">{tone}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Vivids / direct dyes</SelectLabel>
                                                {["blue", "pink", "purple", "green", "teal", "magenta", "silver"].map((tone) => (
                                                    <SelectItem key={tone} value={tone}>
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
                                                                style={{ backgroundColor: TONE_HEX[tone] || "#cccccc" }}
                                                            />
                                                            <span className="capitalize">{tone}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                        <div className="flex-1 rounded-[12px] bg-zinc-50 dark:bg-zinc-900/60 p-3 border border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between w-full min-h-12">
                            <FormField
                                control={form.control}
                                name="bleachEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 text-xs">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className="cursor-pointer text-xs">
                                            Pre-lighten with bleach
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />

                            {watchBleach && (
                                <FormField
                                    control={form.control}
                                    name="bleachLifts"
                                    render={({ field }) => (
                                        <FormItem className="w-32">
                                            <Select
                                                onValueChange={(val) => field.onChange(parseInt(val, 10))}
                                                defaultValue={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="rounded-[10px] bg-white dark:bg-zinc-950 h-8 text-[11px] border-zinc-200 dark:border-zinc-700">
                                                        <SelectValue placeholder="Lifts" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">1 lift</SelectItem>
                                                    <SelectItem value="2">2 lifts</SelectItem>
                                                    <SelectItem value="3">3 lifts</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
