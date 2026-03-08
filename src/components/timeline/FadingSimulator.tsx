import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { predictFading, type WashFrequency } from "@/engine/fading";
import type { PorosityLevel } from "@/types";
import { cn } from "@/lib/utils";
import { Droplet, Info, TrendingDown, Sparkles } from "lucide-react";

interface Props {
    initialHex: string;
    initialLevel: number;
    tone: string;
    porosity: PorosityLevel;
}

export function FadingSimulator({ initialHex, initialLevel, tone, porosity }: Props) {
    const [washFrequency, setWashFrequency] = useState<WashFrequency>("every-other");

    const predictions = predictFading(initialHex, initialLevel, tone, porosity, washFrequency);
    
    console.log("=== COLOR LONGEVITY DEBUG ===");
    console.log("Initial color:", initialHex, "Level:", initialLevel, "Tone:", tone);
    console.log("Porosity:", porosity, "Wash frequency:", washFrequency);
    console.log("Predictions:");
    predictions.forEach((p, i) => {
        console.log(`  Week ${p.weeks}: ${p.hex} - ${p.description}`);
    });
    console.log("=== END COLOR LONGEVITY ===\n");
    
    // Calculate fade percentage
    const getFadePercentage = (weekIndex: number) => {
        return Math.min(100, (weekIndex / (predictions.length - 1)) * 100);
    };

    return (
        <Card className="border-zinc-200 dark:border-white/5 shadow-sm rounded-[24px]">
            <CardHeader className="px-8 pt-8 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#f49d25] to-amber-500 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Color Longevity</CardTitle>
                            <CardDescription className="text-xs">See how your color evolves over 8 weeks</CardDescription>
                        </div>
                    </div>
                    <div className="flex bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200 dark:border-white/5">
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
                                {freq === "daily" ? "Daily" : freq === "every-other" ? "Every Other" : "2x/Week"}
                            </button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
                {/* Fade intensity indicator */}
                <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Fade Rate</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                            {washFrequency === "daily" ? "Fast" : washFrequency === "every-other" ? "Moderate" : "Slow"}
                        </span>
                    </div>
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                            className={cn(
                                "h-full rounded-full transition-all duration-500",
                                washFrequency === "daily" ? "bg-red-500 w-[85%]" :
                                washFrequency === "every-other" ? "bg-amber-500 w-[60%]" :
                                "bg-green-500 w-[35%]"
                            )}
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {predictions.map((p, i) => (
                        <div key={i} className="flex flex-col gap-3 group relative">
                            <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-md border-2 border-zinc-200 dark:border-white/10 transition-all group-hover:scale-[1.03] group-hover:shadow-xl">
                                <div
                                    className="absolute inset-0 transition-colors duration-1000"
                                    style={{ backgroundColor: p.hex }}
                                >
                                    <div className="absolute inset-0 bg-linear-to-b from-white/10 to-black/20" />
                                    {i === 0 && (
                                        <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent animate-pulse" />
                                    )}
                                </div>
                                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/30 backdrop-blur-md rounded-lg text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                                    {i === 0 && <Sparkles className="w-3 h-3" />}
                                    {p.weeks === 0 ? "Fresh" : `Week ${p.weeks}`}
                                </div>
                                
                                {/* Fade indicator */}
                                {i > 0 && (
                                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
                                        <span className="text-[9px] font-black text-white">-{Math.round(getFadePercentage(i) / 10)}%</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-tighter leading-tight">{p.description}</p>
                                {p.weeks >= 4 && (
                                    <div className="mt-2 flex items-center gap-1.5 text-[9px] font-medium text-amber-600 dark:text-amber-500">
                                        <Droplet className="w-3 h-3 fill-current" />
                                        Refresh recommended
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-white/5 flex gap-3 text-left">
                        <Info className="w-4 h-4 text-[#f49d25] mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1">Pro Tip</p>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                High porosity hair and frequent washing accelerate fading. Use cool water and sulfate-free products to extend vibrancy.
                            </p>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/30 flex gap-3 text-left">
                        <Droplet className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-amber-900 dark:text-amber-400 mb-1">Maintenance</p>
                            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                                Plan for a toner refresh at week 4-6 and a full color touch-up at week 8-10 for consistent results.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
