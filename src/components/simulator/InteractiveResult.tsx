"use client";

import { useHairStore } from "@/store/useHairStore";
import { getColorName } from "@/lib/colorNaming";
import { ArrowLeft, RefreshCw, Share, Download, Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExportActions } from "../shared/ExportActions";
import { AddLayerForm } from "../forms/AddLayerForm";

export function InteractiveResult() {
    const { result, colorHistory, reset, bleachProgression } = useHairStore();

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
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                            <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
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
            </main>

            {/* Sticky Bottom Actions */}
            <div className="sticky bottom-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 sm:px-12 py-6 border-t border-zinc-200 dark:border-zinc-900 z-20">
                <div className="max-w-5xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <AddLayerForm />
                    </div>

                    <div className="flex gap-3 shrink-0">
                        <ExportActions />
                    </div>
                </div>
            </div>

            <footer className="py-4 bg-zinc-100 dark:bg-zinc-950">
                <p className="text-center text-zinc-500 text-[9px] uppercase tracking-widest max-w-xl mx-auto px-4">
                    Results may vary based on hair health, product brand, and application method. Always perform a strand test. Includes color theory representations.
                </p>
            </footer>
        </div>
    );
}
