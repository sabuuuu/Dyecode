import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateTimeline, getTotalTimeEstimate, getTotalCostEstimate } from "@/engine/timeline";
import { getApplicationInstructions, getMaintenanceSchedule } from "@/data/instructions";
import type { HairState, DyeInput, SimulationResult } from "@/types";
import { Calendar, Clock, Info, ShieldCheck, AlertCircle, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to calculate actual calendar date
function getCalendarDate(weeksFromNow: number): string {
    const date = new Date();
    date.setDate(date.getDate() + (weeksFromNow * 7));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface Props {
    hairState: HairState;
    dyeInput: DyeInput;
    result: Extract<SimulationResult, { status: "success" }>;
}

export function ProcessTimeline({ hairState, dyeInput, result }: Props) {
    const timeline = generateTimeline(
        hairState.currentLevel,
        dyeInput.targetLevel,
        hairState.damageLevel,
        dyeInput.bleachLifts || 0,
        hairState.hairHistory
    );

    const instructions = getApplicationInstructions(
        dyeInput.bleachEnabled,
        hairState.hairLength,
        hairState.porosity
    );

    const maintenance = getMaintenanceSchedule(
        dyeInput.targetTone,
        dyeInput.bleachEnabled
    );

    const totalTime = getTotalTimeEstimate(timeline);
    const totalCost = getTotalCostEstimate(timeline);
    
    // Calculate progress percentage for visual bar
    const totalWeeks = timeline[timeline.length - 1]?.weekFromStart || 0;

    return (
        <div className="w-full   space-y-12">
            {/* 1. Journey Roadmap */}
            <Card className="border-zinc-200 dark:border-white/5 shadow-sm rounded-[24px]">
                <CardHeader className="bg-zinc-50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/5 px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white dark:text-zinc-900" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Process Roadmap</CardTitle>
                                <CardDescription className="text-xs">{totalTime} · Estimated ${totalCost.toFixed(2)}</CardDescription>
                            </div>
                        </div>
                        {timeline.length > 2 && (
                            <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 flex items-center gap-2">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-tight">Multi-Session Plan Required</span>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="relative">
                        {/* Center vertical line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-100 dark:bg-white/5 -translate-x-1/2" />
                        
                        <div className="space-y-16">
                            {timeline.map((step, i) => {
                                const isEven = i % 2 === 0;
                                return (
                                    <div key={i} className={cn(
                                        "relative flex items-center",
                                        isEven ? "justify-start" : "justify-end"
                                    )}>
                                        {/* Step Marker - centered */}
                                        <div className="absolute left-1/2 -translate-x-1/2 z-10">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 border-white dark:border-zinc-900 transition-colors",
                                                step.action.includes("Recovery")
                                                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                                    : "bg-[#f49d25] text-white"
                                            )}>
                                                {step.session}
                                            </div>
                                        </div>

                                        {/* Content card */}
                                        <div className={cn(
                                            "w-[calc(50%-40px)] p-6 rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 shadow-sm hover:shadow-md transition-shadow",
                                            isEven ? "mr-auto" : "ml-auto"
                                        )}>
                                            <div className="flex flex-col gap-1 mb-2">
                                                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{step.action}</h4>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#f49d25] bg-[#f49d25]/10 px-2 py-0.5 rounded">
                                                        {step.weekFromStart === 0 ? "Now" : `Week ${step.weekFromStart}`}
                                                    </span>
                                                    <span className="text-[9px] text-zinc-400 flex items-center gap-1">
                                                        <CalendarDays className="w-3 h-3" />
                                                        {getCalendarDate(step.weekFromStart)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {step.duration}
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-zinc-300" />
                                                <div>${step.cost.toFixed(2)}</div>
                                            </div>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Application Instructions */}
            <Card className="border-zinc-200 dark:border-white/5 shadow-sm rounded-[24px] overflow-hidden">
                <CardHeader className="bg-zinc-50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/5 px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f49d25] flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Step-by-Step Instructions</CardTitle>
                            <CardDescription className="text-xs">Follow these exactly for a consistent result</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-zinc-200 dark:divide-white/5">
                        {instructions.map((item) => (
                            <div key={item.step} className="p-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center shrink-0 text-xs font-black text-zinc-400">
                                        {item.step}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                                            <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1.5 italic">
                                                <Clock className="w-3 h-3" /> {item.duration}
                                            </span>
                                        </div>
                                        <ul className="space-y-3 mb-5">
                                            {item.details.map((detail, idx) => (
                                                <li key={idx} className="flex items-start gap-3 group">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#f49d25] shrink-0" />
                                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{detail}</p>
                                                </li>
                                            ))}
                                        </ul>
                                        {item.warning && (
                                            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl mb-3 flex gap-3">
                                                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                                                <p className="text-xs text-red-800 dark:text-red-300 font-medium">{item.warning}</p>
                                            </div>
                                        )}
                                        {item.tip && (
                                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/5 rounded-xl flex gap-3">
                                                <Info className="w-4 h-4 text-[#f49d25] mt-0.5 shrink-0" />
                                                <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">Pro Tip: {item.tip}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* 3. Maintenance Guide */}
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-zinc-200 dark:border-white/5 shadow-sm rounded-[24px]">
                    <CardHeader className="px-8 pt-8 pb-4">
                        <CardTitle className="text-lg">Maintenance Schedule</CardTitle>
                        <CardDescription className="text-xs">How to keep your color fresh</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="space-y-6">
                            {maintenance.map((m, idx) => (
                                <div key={idx} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{m.task}</span>
                                        <span className="text-[10px] font-black text-[#f49d25] uppercase tracking-tighter">{m.frequency}</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 leading-normal">{m.why}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 dark:border-white/5 shadow-sm rounded-[24px] bg-zinc-900 text-white">
                    <CardHeader className="px-8 pt-8 pb-4">
                        <CardTitle className="text-lg text-white">Post-Process Promise</CardTitle>
                        <CardDescription className="text-xs text-zinc-400 italic">A reminder from Dyecode</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-4">
                        <p className="text-sm text-zinc-300 leading-relaxed italic">
                            "Hair color is an art backed by chemistry. This simulation gives you the map, but your hair's unique story dictates the journey."
                        </p>
                        <div className="space-y-3 pt-2">
                            {["Always do a strand test first", "Watch for heat damage signs", "Moisture is your best friend after lightener"].map(rule => (
                                <div key={rule} className="flex items-center gap-3">
                                    <div className="w-1 h-1 rounded-full bg-[#f49d25]" />
                                    <span className="text-[11px] font-bold uppercase tracking-tight text-zinc-400">{rule}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
