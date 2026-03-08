"use client";

import { useState } from "react";
import { useHairStore } from "@/store/useHairStore";
import { getColorName } from "@/lib/colorNaming";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExportActions } from "../shared/ExportActions";
import { AddLayerForm } from "../forms/AddLayerForm";
import { DyecodeLogo } from "../shared/DyecodeLogo";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { ShoppingList } from "../shared/ShoppingList";
import { ProcessTimeline } from "../timeline/ProcessTimeline";
import { getSafetyWarnings, calculateDifficulty } from "@/engine/safety";
import { SafetyWarnings } from "../shared/SafetyWarnings";
import { FadingSimulator } from "../timeline/FadingSimulator";
import { checkSkinToneCompatibility } from "@/engine/skinToneMatch";
import { Sparkles } from "lucide-react";
import { TONE_HEX } from "@/engine/constants";
import chroma from "chroma-js";

// Helper function to adjust color lightness for a specific level
function adjustColorForLevel(colorHex: string, level: number): string {
    const lightnessMap: Record<number, number> = {
        1: 15, 2: 20, 3: 28, 4: 35, 5: 42, 6: 50, 7: 58, 8: 68, 9: 78, 10: 88
    };
    const targetLightness = lightnessMap[level] || 50;
    return chroma(colorHex).set('lab.l', targetLightness).hex();
}

export function InteractiveResult() {
    const { result, colorHistory, reset, bleachProgression, hairState, dyeInput } = useHairStore();
    const [showLayerControls, setShowLayerControls] = useState(false);

    if (result.status !== "success") return null;

    const successResult = result as Extract<typeof result, { status: "success" }>;

    const beforeHex = successResult.beforeHex || "#3f2010"; // Default fallback
    const afterHex = successResult.afterHex || "#7c8b9a";
    const level = successResult.achievableLevel;
    const toneName = getColorName(afterHex).name;

    // Warmth calculation mapping
    const warmthPercentage = successResult.warmthScore ? Math.min(Math.round((successResult.warmthScore / 10) * 100), 100) : 0;

    // Safety assessment
    const safetyWarnings = (hairState && dyeInput)
        ? getSafetyWarnings(hairState, dyeInput, result)
        : [];

    const difficulty = (hairState && dyeInput)
        ? calculateDifficulty(
            dyeInput.targetLevel - hairState.currentLevel,
            dyeInput.bleachLifts || 0,
            hairState.damageLevel,
            hairState.chemicalHistory.length > 0
        )
        : null;

    const skinMatch = (hairState && hairState.skinDepth && hairState.skinUndertone)
        ? checkSkinToneCompatibility(
            hairState.skinDepth,
            hairState.skinUndertone,
            successResult.achievableLevel,
            dyeInput?.targetTone || "neutral"
        )
        : null;

    // Setup journey steps - show realistic path from start to goal
    const journeyBlocks = [];

    if (hairState && dyeInput) {
        const startingHex = successResult.beforeHex || "#3f2010";
        const targetToneHex = TONE_HEX[dyeInput.targetTone] || "#8b7355";
        
        console.log("=== COLOR JOURNEY DEBUG ===");
        console.log("Starting color:", startingHex, "Level:", hairState.currentLevel, "Tone:", hairState.currentUndertone);
        console.log("Target:", dyeInput.targetTone, "Level:", dyeInput.targetLevel);
        console.log("Bleach enabled:", dyeInput.bleachEnabled, "Lifts:", dyeInput.bleachLifts);
        console.log("Result after hex:", afterHex);
        
        // Always show starting point
        journeyBlocks.push({
            hex: startingHex,
            label: "Your Hair Now"
        });
        console.log("Step 1 - Your Hair Now:", startingHex);

        // Show bleach progression if enabled
        if (dyeInput.bleachEnabled && bleachProgression && bleachProgression.length > 0) {
            bleachProgression.forEach((b, i) => {
                const bleachResult = b as Extract<typeof b, { status: "success" }>;
                journeyBlocks.push({
                    hex: bleachResult.afterHex,
                    label: `Bleach Session ${i + 1}`
                });
                console.log(`Step ${i + 2} - Bleach Session ${i + 1}:`, bleachResult.afterHex);
            });
        }
        
        // Show what the target color SHOULD look like (the goal)
        const idealTargetHex = adjustColorForLevel(targetToneHex, dyeInput.targetLevel);
        journeyBlocks.push({
            hex: idealTargetHex,
            label: "Your Goal"
        });
        console.log("Step N-1 - Your Goal:", idealTargetHex);
        
        // Show actual result (what you'll really get after applying dye)
        journeyBlocks.push({
            hex: afterHex,
            label: "Actual Result"
        });
        console.log("Step N - Actual Result:", afterHex);
        console.log("=== END COLOR JOURNEY ===\n");
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950 font-display text-zinc-900 dark:text-zinc-100">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-black/5 dark:border-white/5 px-8 py-4 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md z-20 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="text-[#f49d25]">
                        <DyecodeLogo className="w-8 h-8" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Dyecode</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={reset}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center max-w-5xl mx-auto w-full px-4 sm:px-8 pb-12 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">

                {/* Safety Alerts */}
                <div className="w-full mb-8">
                    <SafetyWarnings warnings={safetyWarnings} />
                </div>

                {/* Result Split View */}
                <section className="w-full relative bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-zinc-200 dark:border-white/5 overflow-hidden mb-6">
                    {/* Explanation Header */}
                    <div className="px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">Simulation:</span> This shows what happens when you apply <span className="font-semibold text-[#f49d25]">{dyeInput?.targetTone}</span> dye to your current <span className="font-semibold">{hairState?.currentUndertone}</span> hair
                        </p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row min-h-[400px]">
                        <div className="flex-1 relative flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
                            <span className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Before</span>
                            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mt-6 md:mt-0">
                                <div className="absolute inset-0 rounded-[24px] overflow-hidden" style={{ backgroundColor: beforeHex }}>
                                    <div className="absolute inset-0 bg-linear-to-br from-white/10 dark:from-white/5 to-black/20 dark:to-black/40"></div>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Your Current Hair</p>
                                <p className="text-[10px] text-zinc-500 mt-1">Level {hairState?.currentLevel} {hairState?.currentUndertone}</p>
                            </div>
                        </div>
                        <div className="flex-1 relative flex flex-col items-center justify-center p-8 bg-zinc-50/50 dark:bg-black/20">
                            <span className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-widest text-[#f49d25] z-20">After One Application</span>
                            <div className="relative w-56 h-56 sm:w-72 sm:h-72 mt-6 md:mt-2 z-10">
                                <div className="absolute inset-0 rounded-[24px] overflow-hidden shadow-xl border-4 border-white dark:border-zinc-800 transition-colors duration-1000" style={{ backgroundColor: afterHex }}>
                                    <div className="absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-black/30 mix-blend-overlay"></div>
                                    <div className="absolute inset-0 opacity-40 mix-blend-soft-light shadow-[inset_0_0_50px_rgba(255,255,255,1)]"></div>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Realistic Result</p>
                                <p className="text-[10px] text-zinc-500 mt-1">What you&apos;ll actually get</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Info Badges */}
                <div className="flex flex-wrap gap-4 mb-16 w-full justify-center">
                    <div className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-zinc-900 rounded-[12px] border border-zinc-200 dark:border-zinc-800/50 shadow-sm">
                        <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: afterHex }}></div>
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Level {level} {toneName}</span>
                    </div>

                    <div className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-zinc-900 rounded-[12px] border border-zinc-200 dark:border-zinc-800/50 shadow-sm">
                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 uppercase tracking-tight">{successResult.exposedPigment?.replace("-", " ")} Found</span>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: successResult.exposedPigment === 'red' ? '#dc2626' : successResult.exposedPigment === 'orange' ? '#ea580c' : successResult.exposedPigment === 'yellow' ? '#eab308' : '#737373' }}></div>
                    </div>

                    {difficulty && (
                        <div
                            className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-zinc-900 rounded-[12px] border border-zinc-200 dark:border-zinc-800/50 shadow-sm group relative cursor-help"
                            title={difficulty.description}
                        >
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Difficulty</span>
                            <div className={cn("px-2 py-0.5 rounded-md text-[10px] font-black text-white uppercase", difficulty.color)}>
                                {difficulty.level}
                            </div>
                        </div>
                    )}

                    {skinMatch && (
                        <div
                            className={cn(
                                "flex items-center gap-3 px-5 py-3 rounded-[12px] border shadow-sm group relative cursor-help",
                                skinMatch.compatible
                                    ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/50"
                                    : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50"
                            )}
                            title={skinMatch.message}
                        >
                            <Sparkles className={cn("w-4 h-4", skinMatch.compatible ? "text-[#f49d25]" : "text-amber-600")} />
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.15em]">Visual Fit</span>
                            <span className={cn("text-[10px] font-black uppercase", skinMatch.compatible ? "text-zinc-900 dark:text-zinc-100" : "text-amber-700 dark:text-amber-400")}>
                                {skinMatch.compatible ? "Great Match" : "Clash Warning"}
                            </span>
                        </div>
                    )}

                    {successResult.warmthLevel && successResult.warmthLevel !== "none" && (
                        <div className="flex items-center gap-4 px-5 py-3 bg-red-50 dark:bg-red-950/20 rounded-[12px] border border-red-200 dark:border-red-900/50">
                            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-widest">{successResult.warmthLevel} Warmth</span>
                            <div className="w-20 h-1.5 bg-red-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-linear-to-r from-red-400 to-amber-500" style={{ width: `${warmthPercentage}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Warnings Section if any */}
                {successResult.warnings.length > 0 && (
                    <div className="w-full max-w-2xl mb-8 space-y-3">
                        {successResult.warnings.map((warning, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-[16px] bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30">
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400 mb-1">Colorist Note</h4>
                                    <p className="text-xs text-amber-800 dark:text-amber-200/80 leading-relaxed">{warning}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {/* Shopping List Section */}
                <div className="w-full max-w-5xl mb-16 flex justify-center">
                    {hairState && <ShoppingList result={successResult} hairState={hairState} />}
                </div>

                {/* Process Timeline & Instructions */}
                <div className="w-full max-w-5xl mb-16 flex justify-center">
                    {hairState && dyeInput && <ProcessTimeline result={successResult} hairState={hairState} dyeInput={dyeInput} />}
                </div>

                {/* Fading Prediction */}
                <div className="w-full max-w-5xl mb-16 flex justify-center">
                    {hairState && (
                        <FadingSimulator
                            initialHex={afterHex}
                            initialLevel={level}
                            tone={dyeInput?.targetTone || "neutral"}
                            porosity={hairState.porosity}
                        />
                    )}
                </div>

                {/* Color Journey Timeline */}
                <div className="w-full mb-16 px-4">
                    <h2 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mb-10 text-center">Your Color Journey</h2>

                    <div className="flex items-center justify-center gap-4 sm:gap-8 relative max-w-4xl mx-auto">
                        {/* Connecting line */}
                        <div className="absolute top-[30px] sm:top-[40px] left-[5%] right-[5%] h-px border-t-2 border-dashed border-zinc-300 dark:border-zinc-700 -z-10"></div>

                        {journeyBlocks.map((block, idx) => {
                            const isGoal = block.label === "Your Goal";
                            const isActual = block.label === "Actual Result";
                            const isStart = block.label === "Your Hair Now";
                            
                            return (
                                <div key={idx} className="flex flex-col items-center gap-2 sm:gap-3 relative group">
                                    <div
                                        className={cn(
                                            "rounded-2xl border-2 shadow-md transition-all",
                                            isActual
                                                ? "w-20 h-20 sm:w-24 sm:h-24 border-[#f49d25] ring-4 ring-[#f49d25]/20 shadow-xl"
                                                : isGoal
                                                ? "w-16 h-16 sm:w-20 sm:h-20 border-zinc-400 dark:border-zinc-600 ring-2 ring-zinc-300 dark:ring-zinc-700"
                                                : isStart
                                                ? "w-14 h-14 sm:w-16 sm:h-16 border-zinc-300 dark:border-zinc-700"
                                                : "w-12 h-12 sm:w-14 sm:h-14 border-zinc-200 dark:border-zinc-800"
                                        )}
                                        style={{ backgroundColor: block.hex }}
                                    >
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                                    </div>

                                    <div className="flex flex-col items-center gap-1">
                                        <span className={cn(
                                            "text-[9px] sm:text-[10px] font-bold uppercase tracking-tight text-center whitespace-nowrap",
                                            isActual
                                                ? "text-[#f49d25]"
                                                : isGoal
                                                ? "text-zinc-600 dark:text-zinc-400"
                                                : "text-zinc-500"
                                        )}>
                                            {block.label}
                                        </span>
                                        {isGoal && (
                                            <span className="text-[8px] text-zinc-400 italic">(What you want)</span>
                                        )}
                                        {isActual && (
                                            <span className="text-[8px] text-[#f49d25] italic">(What you get)</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Explanation */}
                    <div className="mt-8 max-w-2xl mx-auto text-center">
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            The journey shows your starting point, any intermediate steps needed, your goal color, and the realistic result you&apos;ll actually achieve.
                        </p>
                    </div>
                </div>

                {/* Next layer & export actions */}
                <section className="w-full max-w-5xl mb-20 grid gap-6 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1.2fr)]">
                    <div className="rounded-[24px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 px-4 sm:px-6 py-5">
                        {!showLayerControls ? (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                                        Not satisfied yet?
                                    </p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                                        Try another layer on top of this result.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowLayerControls(true)}
                                    className="inline-flex items-center justify-center rounded-[14px] border border-zinc-200 dark:border-zinc-700 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white transition-colors"
                                >
                                    Add another layer
                                </button>
                            </div>
                        ) : (
                            <AddLayerForm />
                        )}
                    </div>

                    <div className="rounded-[24px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 px-4 sm:px-6 py-5 flex flex-col justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                                Save & share
                            </p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                                Export this view or copy a link to revisit it later.
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <ExportActions />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-4 bg-zinc-100 dark:bg-zinc-950">
                <p className="text-center text-zinc-500 text-[9px] uppercase tracking-widest max-w-xl mx-auto px-4">
                    Results may vary based on hair health, product brand, and application method. Always perform a strand test. Includes color theory representations.
                </p>
            </footer>
        </div>
    );
}
