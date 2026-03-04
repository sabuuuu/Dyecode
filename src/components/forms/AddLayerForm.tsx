"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHairStore } from "@/store/useHairStore";
import { dyeInputSchema, type DyeInput } from "@/schemas/hair.schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
        <div className="pt-6 mt-6 border-t border-zinc-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-sm font-medium text-zinc-900 mb-4">Add Next Color Layer</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="targetLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Next Target Level</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(parseInt(val, 10))}
                                        value={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-[12px] bg-white w-full border-zinc-200">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                <SelectItem key={num} value={num.toString()}>Level {num}</SelectItem>
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
                                    <FormLabel>Next Target Tone</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-[12px] bg-white w-full border-zinc-200">
                                                <SelectValue placeholder="Select tone" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ash">Ash</SelectItem>
                                            <SelectItem value="neutral">Neutral</SelectItem>
                                            <SelectItem value="gold">Gold</SelectItem>
                                            <SelectItem value="copper">Copper</SelectItem>
                                            <SelectItem value="red">Red</SelectItem>
                                            <SelectItem value="mahogany">Mahogany</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex-1 rounded-[12px] bg-zinc-50 p-3 border border-zinc-100 flex flex-row items-center justify-between w-full min-h-12">
                            <FormField
                                control={form.control}
                                name="bleachEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 text-sm">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className="cursor-pointer">Enable Bleach Lift</FormLabel>
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
                                                    <SelectTrigger className="rounded-[8px] bg-white h-8 text-xs border-zinc-200">
                                                        <SelectValue placeholder="Lifts" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">1 Lift</SelectItem>
                                                    <SelectItem value="2">2 Lifts</SelectItem>
                                                    <SelectItem value="3">3 Lifts</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <Button type="submit" size="sm" className="rounded-[12px] px-6 bg-zinc-900 border border-zinc-900 text-white hover:bg-zinc-800 text-sm h-12 w-full md:w-auto shadow-none shrink-0">
                            Apply Layer
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
