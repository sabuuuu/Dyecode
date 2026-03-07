import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { predictFading, type WashFrequency } from "@/engine/fading";
import type { PorosityLevel } from "@/types";
import { cn } from "@/lib/utils";
import { Droplet, Info } from "lucide-react";

interface Props {
    initialHex: string;
    initialLevel: number;
    tone: string;
    porosity: PorosityLevel;
}

export function FadingSimulator({ initialHex, initialLevel, tone, porosity }: Props) {
    const [washFrequency, setWashFrequency] = useState<WashFrequency>("every-other");

    const predictions = predictFading(initialHex, initialLevel, tone, porosity, washFrequency);

    return (
        <Card className="border-zinc-200 dark:border-white/5 shadow-sm rounded-[24px]">
            <CardHeader className="px-8 pt-8 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-lg">Longevity Prediction</CardTitle>
                        <CardDescription className="text-xs">See how your color evolves over 8 weeks</CardDescription>
                    </div>
                    <div className="flex bg-zinc-100 dark:bg-white/5 p-1 rounded-xl">
                        {(["daily", "every-other", "twice-week"] as WashFrequency[]).map((freq) => (
                            <button
                                key={freq}
                                onClick={() => setWashFrequency(freq)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all",
                                    washFrequency === freq
                                        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                )}
                            >
                                {freq.replace("-", " ")}
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {predictions.map((p, i) => (
                        <div key={i} className="flex flex-col gap-3 group">
                            <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-sm border border-black/5 dark:border-white/10 transition-transform group-hover:scale-[1.02]">
                                <div
                                    className="absolute inset-0 transition-colors duration-1000"
                                    style={{ backgroundColor: p.hex }}
                                >
                                    <div className="absolute inset-0 bg-linear-to-b from-white/10 to-black/20" />
                                </div>
                                <div className="absolute top-3 left-3 px-2 py-1 bg-black/20 backdrop-blur-md rounded-lg text-[9px] font-black text-white uppercase tracking-widest">
                                    {p.weeks === 0 ? "Initial" : `Week ${p.weeks}`}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-tighter">{p.description}</p>
                                {p.weeks >= 4 && (
                                    <div className="mt-2 flex items-center gap-1.5 text-[9px] font-medium text-amber-600 dark:text-amber-500">
                                        <Droplet className="w-3 h-3 fill-current" />
                                        Tone refresh needed
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 flex gap-3 text-left">
                    <Info className="w-4 h-4 text-[#f49d25] mt-0.5 shrink-0" />
                    <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                        "High porosity hair and frequent washing are the biggest enemies of color longevity. Use cool water and sulfate-free products to extend the 'Initial' phase."
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
