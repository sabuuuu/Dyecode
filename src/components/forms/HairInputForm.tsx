"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHairStore } from "@/store/useHairStore";
import { hairFormSchema, type HairFormInput } from "@/schemas/hair.schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HairInputForm() {
    const { setHairState, setDyeInput, runSimulation } = useHairStore();

    const form = useForm<HairFormInput>({
        resolver: zodResolver(hairFormSchema),
        defaultValues: {
            currentLevel: 5,
            currentUndertone: "red-orange",
            hairHistory: "virgin",
            targetLevel: 6,
            targetTone: "ash",
            bleachEnabled: false,
        },
    });

    const watchBleach = form.watch("bleachEnabled");

    function onSubmit(data: HairFormInput) {
        setHairState({
            currentLevel: data.currentLevel,
            currentUndertone: data.currentUndertone,
            hairHistory: data.hairHistory,
        });
        setDyeInput({
            targetLevel: data.targetLevel,
            targetTone: data.targetTone,
            bleachEnabled: data.bleachEnabled,
            bleachLifts: data.bleachLifts,
        });
        runSimulation();
    }

    return (
        <Card className="rounded-[12px] border-zinc-200 bg-white shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Simulation Parameters</CardTitle>
                <CardDescription>Enter the starting state and target colors.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-zinc-900 border-b pb-2 border-zinc-100">Current Hair State</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="currentLevel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Level (1-10)</FormLabel>
                                            <Select
                                                onValueChange={(val) => field.onChange(parseInt(val, 10))}
                                                defaultValue={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl bg-white">
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
                                    name="currentUndertone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tone / Undertone</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl bg-white">
                                                        <SelectValue placeholder="Select undertone" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Natural</SelectLabel>
                                                        <SelectItem value="red">Red</SelectItem>
                                                        <SelectItem value="red-orange">Red Orange</SelectItem>
                                                        <SelectItem value="orange">Orange</SelectItem>
                                                        <SelectItem value="orange-yellow">Orange Yellow</SelectItem>
                                                        <SelectItem value="yellow">Yellow</SelectItem>
                                                        <SelectItem value="neutral">Neutral</SelectItem>
                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel>Current Dye / Vivids</SelectLabel>
                                                        <SelectItem value="ash">Ash</SelectItem>
                                                        <SelectItem value="pearl">Pearl</SelectItem>
                                                        <SelectItem value="matte">Matte</SelectItem>
                                                        <SelectItem value="beige">Beige</SelectItem>
                                                        <SelectItem value="gold">Gold</SelectItem>
                                                        <SelectItem value="copper">Copper</SelectItem>
                                                        <SelectItem value="mahogany">Mahogany</SelectItem>
                                                        <SelectItem value="burgundy">Burgundy</SelectItem>
                                                        <SelectItem value="blue">Blue</SelectItem>
                                                        <SelectItem value="pink">Pink</SelectItem>
                                                        <SelectItem value="purple">Purple</SelectItem>
                                                        <SelectItem value="green">Green</SelectItem>
                                                        <SelectItem value="teal">Teal</SelectItem>
                                                        <SelectItem value="magenta">Magenta</SelectItem>
                                                        <SelectItem value="silver">Silver</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="hairHistory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hair History</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl bg-white">
                                                        <SelectValue placeholder="Select history" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="virgin">Virgin</SelectItem>
                                                    <SelectItem value="dyed-darker">Dyed Darker</SelectItem>
                                                    <SelectItem value="dyed-lighter">Dyed Lighter</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-zinc-900 border-b pb-2 border-zinc-100">Target Results</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="targetLevel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Level (1-10)</FormLabel>
                                            <Select
                                                onValueChange={(val) => field.onChange(parseInt(val, 10))}
                                                defaultValue={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl bg-white">
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
                                            <FormLabel>Target Tone</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl bg-white">
                                                        <SelectValue placeholder="Select target tone" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Primary / Oxidative</SelectLabel>
                                                        <SelectItem value="ash">Ash</SelectItem>
                                                        <SelectItem value="pearl">Pearl</SelectItem>
                                                        <SelectItem value="matte">Matte</SelectItem>
                                                        <SelectItem value="neutral">Neutral</SelectItem>
                                                        <SelectItem value="beige">Beige</SelectItem>
                                                        <SelectItem value="gold">Gold</SelectItem>
                                                        <SelectItem value="copper">Copper</SelectItem>
                                                        <SelectItem value="red">Red</SelectItem>
                                                        <SelectItem value="mahogany">Mahogany</SelectItem>
                                                        <SelectItem value="burgundy">Burgundy</SelectItem>
                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel>Vivids / Direct Dyes</SelectLabel>
                                                        <SelectItem value="blue">Blue</SelectItem>
                                                        <SelectItem value="pink">Pink</SelectItem>
                                                        <SelectItem value="purple">Purple</SelectItem>
                                                        <SelectItem value="green">Green</SelectItem>
                                                        <SelectItem value="teal">Teal</SelectItem>
                                                        <SelectItem value="magenta">Magenta</SelectItem>
                                                        <SelectItem value="silver">Silver</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 rounded-xl bg-zinc-50 p-4 border border-zinc-100">
                            <FormField
                                control={form.control}
                                name="bleachEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 text-sm">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Enable Bleach Lift</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {watchBleach && (
                                <FormField
                                    control={form.control}
                                    name="bleachLifts"
                                    render={({ field }) => (
                                        <FormItem className="w-48 mt-2">
                                            <FormLabel>Bleach Lifts Session</FormLabel>
                                            <Select
                                                onValueChange={(val) => field.onChange(parseInt(val, 10))}
                                                defaultValue={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="rounded-[8px] bg-white">
                                                        <SelectValue placeholder="Select lifts" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">1 Lift Level</SelectItem>
                                                    <SelectItem value="2">2 Lift Levels</SelectItem>
                                                    <SelectItem value="3">3 Lift Levels</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button type="submit" size="sm" className="rounded-xl px-6 bg-zinc-900 border border-zinc-900 text-white hover:bg-zinc-800 text-sm shadow-none">
                                Simulate
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card >
    );
}
