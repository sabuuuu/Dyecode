"use client";

import { useState } from "react";
import { useHairStore } from "@/store/useHairStore";
import { getColorName } from "@/lib/colorNaming";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExportActions } from "../shared/ExportActions";
import { AddLayerForm } from "../forms/AddLayerForm";
import { DyecodeLogo } from "../shared/DyecodeLogo";

export function InteractiveResult() {
    const { result, colorHistory, reset, bleachProgression } = useHairStore();
    const [showLayerControls, setShowLayerControls] = useState(false);

    if (result.status !== "success") return null;

    const successResult = result as Extract<typeof result, { status: "success" }>;

    const beforeHex = successResult.beforeHex || "#3f2010"; // Default fallback
    const afterHex = successResult.afterHex || "#7c8b9a";
    const level = successResult.achievableLevel;
    const toneName = getColorName(afterHex).name;

    // Warmth calculation mapping
    const warmthPercentage = successResult.warmthScore ? Math.min(Math.round((successResult.warmthScore / 10) * 100), 100) : 0;

    // Setup journey steps
    const journeyBlocks = [];

    // First step is always the starting canvas
    if (colorHistory.length > 0) {
        journeyBlocks.push({
            hex: (colorHistory[0] as typeof successResult).beforeHex || "#000",
            icon: "face",
            label: "Start"
        });

        // Add bleach steps if any
        if (bleachProgression && bleachProgression.length > 0) {
            bleachProgression.forEach((b, i) => {
                journeyBlocks.push({
                    hex: (b as typeof successResult).afterHex,
                    icon: "science",
                    label: `Bleach ${i + 1}`
                });
            });
        }

        // Add dye layers
        colorHistory.forEach((item, i) => {
            journeyBlocks.push({
                hex: (item as typeof successResult).afterHex,
                icon: "colorize",
                label: `Color ${i + 1}`
            });
        });
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

                {/* Result Split View */}
                <section className="w-full relative bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-zinc-200 dark:border-white/5 overflow-hidden mb-6 min-h-[400px] flex flex-col md:flex-row">
                    <div className="flex-1 relative flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
                        <span className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Before</span>
                        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mt-6 md:mt-0">
                            <div className="absolute inset-0 rounded-[24px] overflow-hidden" style={{ backgroundColor: beforeHex }}>
                                <div className="absolute inset-0 bg-linear-to-br from-white/10 dark:from-white/5 to-black/20 dark:to-black/40"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative flex flex-col items-center justify-center p-8 bg-zinc-50/50 dark:bg-black/20">
                        <span className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-widest text-[#f49d25]">Result</span>
                        <div className="relative w-56 h-56 sm:w-80 sm:h-80 mt-6 md:mt-0 z-10">
                            <div className="absolute inset-0 rounded-[24px] overflow-hidden shadow-xl border-4 border-white dark:border-zinc-800 transition-colors duration-1000" style={{ backgroundColor: afterHex }}>
                                <div className="absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-black/30 mix-blend-overlay"></div>
                                <div className="absolute inset-0 opacity-40 mix-blend-soft-light shadow-[inset_0_0_50px_rgba(255,255,255,1)]"></div>
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
                    <div className="w-full max-w-2xl mb-16 space-y-3">
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


                {/* Color Journey Timeline */}
                <div className="w-full max-w-4xl mb-16 px-4">
                    <h2 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mb-10 text-center">Your Color Journey</h2>

                    <div className="flex items-center justify-between px-2 sm:px-12 relative">
                        {/* Dashed line connecting nodes */}
                        <div className="absolute top-[30px] sm:top-[40px] left-[10%] right-[10%] h-px border-t border-dashed border-zinc-300 dark:border-zinc-700 -z-10"></div>

                        {journeyBlocks.map((block, idx) => {
                            const isLast = idx === journeyBlocks.length - 1;
                            return (
                                <div key={idx} className="flex flex-col items-center gap-3 sm:gap-4 relative group">
                                    <div
                                        className={cn(
                                            "rounded-[16px] border sm:border-2 border-white dark:border-white/10 shadow-md",
                                            isLast
                                                ? "w-16 h-16 sm:w-20 sm:h-20 shadow-xl overflow-hidden shimmer ring-4 ring-[#f49d25]/20"
                                                : "w-12 h-12 sm:w-14 sm:h-14 hover:scale-110 transition-transform"
                                        )}
                                        style={{ backgroundColor: block.hex }}
                                    >
                                        <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent pointer-events-none"></div>
                                    </div>

                                    {isLast ? (
                                        <span className="text-[9px] sm:text-[10px] font-bold text-[#f49d25] dark:text-white uppercase tracking-wider bg-zinc-100 dark:bg-transparent px-2 py-1 rounded-md">Final</span>
                                    ) : (
                                        <span className="text-[9px] sm:text-[10px] font-medium text-zinc-500 uppercase tracking-tight">{block.label}</span>
                                    )}
                                </div>
                            );
                        })}
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
