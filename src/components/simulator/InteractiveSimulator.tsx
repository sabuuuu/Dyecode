"use client";

import { useHairStore } from "@/store/useHairStore";
import { Slider } from "@/components/ui/slider";
import { BASE_LEVEL_HEX, TONE_HEX, UNDERLYING_PIGMENTS } from "@/engine/constants";
import { blendTones } from "@/engine/pigment";
import { HelpCircle, User, ArrowRight, Layers, ArrowDownUp, SplitSquareVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { HairState } from "@/types";

export function InteractiveSimulator() {
    const { setHairState, setDyeInput, runSimulation } = useHairStore();

    // Local state
    const [step, setStep] = useState<number>(1);

    // Step 1: Starting State
    const [draftLevel, setDraftLevel] = useState<number>(5);
    const [draftUndertone, setDraftUndertone] = useState<string>("red-orange");
    const [draftHistory, setDraftHistory] = useState<"virgin" | "dyed-darker" | "dyed-lighter">("virgin");

    // Step 2: Target Goal
    const [targetLevel, setTargetLevel] = useState<number>(6);
    const [targetTone, setTargetTone] = useState<string>("ash");
    const [bleachEnabled, setBleachEnabled] = useState<boolean>(false);
    const [bleachLifts, setBleachLifts] = useState<number>(1);

    // Compute expected starting hex for pure viz
    const base = BASE_LEVEL_HEX[draftLevel] || "#121212";
    let previewHex = base;
    if (TONE_HEX[draftUndertone]) {
        previewHex = blendTones(base, "neutral", TONE_HEX[draftUndertone]);
    }

    // Typical Natural Undertones mapped to their hex values for the swatch grid
    const primaryUndertones = ["red", "red-orange", "orange", "orange-yellow", "yellow", "neutral", "ash", "gold", "copper", "burgundy"];

    // All tones for target (expanded palette)
    const targetTones = ["ash", "pearl", "matte", "neutral", "beige", "gold", "copper", "red", "mahogany", "burgundy"];
    const vividTones = ["blue", "pink", "purple", "green", "teal", "magenta", "silver"];

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);

    const handleSimulate = () => {
        setHairState({
            currentLevel: draftLevel,
            currentUndertone: draftUndertone as any,
            hairHistory: draftHistory
        });
        setDyeInput({
            targetLevel,
            targetTone: targetTone as any,
            bleachEnabled,
            bleachLifts: bleachEnabled ? (bleachLifts as any) : undefined
        });
        runSimulation();
        // Since we emit to global store, the parent layout will catch `result.status === "success"` and show results.
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
            {/* Top Navigation */}
            <header className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 px-8 py-4 bg-white/50 dark:bg-black/50 backdrop-blur-md z-10 w-full shrink-0">
                <div className="flex items-center gap-3">
                    <div className="text-zinc-900 dark:text-[#f49d25]">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Dyecode</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors">
                        <User className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="flex flex-col md:flex-row flex-1 w-full overflow-hidden">
                {/* Left Side: Character Preview */}
                <div className="w-full md:w-3/5 flex flex-col items-center justify-center p-8 lg:p-12 bg-zinc-100 dark:bg-zinc-900/10 relative">
                    <div className="relative w-full max-w-sm aspect-square flex flex-col items-center justify-center pointer-events-none">

                        {step === 1 ? (
                            <span className="absolute top-0 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 animate-in fade-in">Starting Canvas</span>
                        ) : (
                            <span className="absolute top-0 text-[10px] font-bold uppercase tracking-widest text-[#f49d25] mb-4 animate-in fade-in">Prediction Active</span>
                        )}

                        {/* Hair Illustration Container */}
                        <div className="relative w-72 h-72 sm:w-80 sm:h-80 group mt-[-30px]">
                            {/* Abstract Hair Shape */}
                            {step === 1 ? (
                                <div
                                    className="absolute inset-0 rounded-[4rem] shadow-2xl overflow-hidden transition-colors duration-700 ease-in-out border-8 border-white dark:border-zinc-800"
                                    style={{ backgroundColor: previewHex }}
                                >
                                    {/* Subtle 3D Depth Shadow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/30"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Dual View for Step 2 */}
                                    <div className="absolute inset-0 rounded-[4rem] overflow-hidden opacity-40 blur-sm transition-colors duration-700" style={{ backgroundColor: previewHex }}></div>
                                    <div
                                        className="absolute inset-0 rounded-[4rem] shadow-2xl overflow-hidden transition-colors duration-700"
                                        style={{ backgroundColor: TONE_HEX[targetTone] || BASE_LEVEL_HEX[targetLevel] }}
                                    >
                                        <div className="absolute inset-0 mix-blend-soft-light opacity-30 bg-white shadow-[inset_0_0_50px_rgba(255,255,255,0.5)]"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/40"></div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Interactive Badge Below */}
                        {step === 1 ? (
                            <div className="mt-8 z-10 inline-flex flex-col items-center gap-1 px-5 py-3 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-lg capitalize animate-in fade-in zoom-in-95">
                                <span className="text-[10px] font-bold tracking-widest text-[#f49d25] uppercase">
                                    Current Base
                                </span>
                                <span className="text-zinc-900 dark:text-zinc-100 text-base font-semibold tracking-wide flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: previewHex }}></span>
                                    Level {draftLevel} · {draftUndertone.replace('-', ' ')}
                                </span>
                            </div>
                        ) : (
                            <div className="mt-12 flex gap-3 z-10 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm capitalize">
                                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: previewHex }}></span>
                                    <span className="text-zinc-500 dark:text-zinc-300 text-[11px] font-medium">Now · Lvl {draftLevel} · {draftUndertone.replace('-', ' ')}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 dark:bg-zinc-200 rounded-2xl shadow-lg capitalize">
                                    <span className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white/20" style={{ backgroundColor: TONE_HEX[targetTone] || BASE_LEVEL_HEX[targetLevel] }}></span>
                                    <span className="text-white dark:text-zinc-950 text-[11px] font-bold tracking-wide">Expected · Lvl {targetLevel} · {targetTone.replace('-', ' ')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Controls */}
                <aside className="w-full md:w-2/5 flex flex-col p-8 lg:p-10 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-white/5 overflow-y-auto">
                    {step === 1 ? (
                        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Section Title */}
                            <div>
                                <h2 className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase mb-8">
                                    Current State
                                </h2>
                            </div>

                            {/* Level Selector */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Level Selector</label>
                                    <span className="text-xs font-black text-zinc-600 dark:text-[#f49d25] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">Lvl {draftLevel}</span>
                                </div>

                                <Slider
                                    defaultValue={[draftLevel]}
                                    max={10} min={1} step={1}
                                    onValueChange={(v) => setDraftLevel(v[0])}
                                    className="py-4"
                                />

                                <div className="flex justify-between text-[10px] font-medium text-zinc-400">
                                    <span>Black (1)</span>
                                    <span>Light Blonde (10)</span>
                                </div>
                            </div>

                            {/* Undertone Picker */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Starting Tone</label>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {primaryUndertones.map((tone) => {
                                        const isSelected = draftUndertone === tone;
                                        const swatchHex = TONE_HEX[tone] || "#ccc";
                                        return (
                                            <button
                                                key={tone}
                                                onClick={() => setDraftUndertone(tone)}
                                                style={{ backgroundColor: swatchHex }}
                                                title={tone.replace("-", " ")}
                                                className={cn(
                                                    "w-10 h-10 rounded-[12px] shadow-sm transition-all duration-200",
                                                    isSelected
                                                        ? "scale-110 border-[3px] border-zinc-900 dark:border-white shadow-md z-10"
                                                        : "hover:scale-105 border border-black/10 dark:border-white/10 opacity-90"
                                                )}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Hair History */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Hair History</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {/* Virgin */}
                                    <button
                                        onClick={() => setDraftHistory("virgin")}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-[16px] border-2 transition-all duration-200",
                                            draftHistory === "virgin"
                                                ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 shadow-sm"
                                                : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                                        )}
                                    >
                                        <Layers className={cn("w-6 h-6 mb-2", draftHistory === "virgin" ? "text-zinc-900 dark:text-zinc-300" : "text-zinc-400")} />
                                        <span className={cn("text-[10px] font-bold uppercase tracking-tight text-center", draftHistory === "virgin" ? "text-zinc-900 dark:text-zinc-400" : "text-zinc-500")}>Natural</span>
                                    </button>

                                    {/* Dyed Darker */}
                                    <button
                                        onClick={() => setDraftHistory("dyed-darker")}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-[16px] border-2 transition-all duration-200",
                                            draftHistory === "dyed-darker"
                                                ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 shadow-sm"
                                                : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                                        )}
                                    >
                                        <ArrowDownUp className={cn("w-6 h-6 mb-2", draftHistory === "dyed-darker" ? "text-zinc-900 dark:text-zinc-300" : "text-zinc-400")} />
                                        <span className={cn("text-[10px] font-bold uppercase tracking-tight text-center", draftHistory === "dyed-darker" ? "text-zinc-900 dark:text-zinc-400" : "text-zinc-500")}>Dyed Dark</span>
                                    </button>

                                    {/* Lightened */}
                                    <button
                                        onClick={() => setDraftHistory("dyed-lighter")}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-[16px] border-2 transition-all duration-200",
                                            draftHistory === "dyed-lighter"
                                                ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 shadow-sm"
                                                : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                                        )}
                                    >
                                        <SplitSquareVertical className={cn("w-6 h-6 mb-2", draftHistory === "dyed-lighter" ? "text-zinc-900 dark:text-zinc-300" : "text-zinc-400")} />
                                        <span className={cn("text-[10px] font-bold uppercase tracking-tight text-center", draftHistory === "dyed-lighter" ? "text-zinc-900 dark:text-zinc-400" : "text-zinc-500")}>Bleached</span>
                                    </button>
                                </div>
                            </div>

                            {/* Spacer */}
                            <div className="flex-1"></div>

                            {/* Footer Navigation */}
                            <div className="flex justify-end pt-12 pb-4">
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[14px] hover:bg-zinc-800 dark:hover:bg-white transition-all group shadow-md"
                                >
                                    <span className="font-bold text-sm">Target Goal</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h2 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase">
                                    What you're going for
                                </h2>
                            </div>

                            {/* Target Level Slider */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Target Level</label>
                                    <span className="text-xs font-black text-zinc-600 dark:text-[#f49d25] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">Lvl {targetLevel}</span>
                                </div>

                                <div className="relative h-2 w-full rounded-[12px] bg-gradient-to-r from-black via-zinc-400 dark:via-zinc-600 to-yellow-100 mt-6 mb-2">
                                    <div className="absolute left-[40%] top-[-8px] bottom-[-8px] w-0.5 bg-black/40 dark:bg-white/60 z-10"></div>
                                    <div className="absolute left-[40%] bottom-[-24px] -translate-x-1/2 text-[8px] font-bold text-zinc-500 uppercase whitespace-nowrap">You are here</div>
                                    <Slider
                                        defaultValue={[targetLevel]}
                                        max={10} min={1} step={1}
                                        onValueChange={(v) => setTargetLevel(v[0])}
                                        className="absolute -inset-x-2 -inset-y-3 !h-8 z-20 cursor-pointer opacity-0"
                                    />
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-[12px] shadow-xl border-2 border-zinc-950 z-20 pointer-events-none transition-all duration-150"
                                        style={{ left: `calc(${((targetLevel - 1) / 9) * 100}% - 8px)` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Target Tone Picker */}
                            <div className="space-y-4 pt-4">
                                <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Target Tone</label>
                                <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                                    {targetTones.map((tone) => {
                                        const isSelected = targetTone === tone;
                                        const swatchHex = TONE_HEX[tone] || "#ccc";
                                        return (
                                            <div key={tone} className="flex flex-col items-center gap-2">
                                                <button
                                                    onClick={() => setTargetTone(tone)}
                                                    style={{ backgroundColor: swatchHex }}
                                                    className={cn(
                                                        "w-12 h-12 rounded-[12px] shadow-sm transition-all duration-200",
                                                        isSelected
                                                            ? "border-[3px] border-zinc-900 dark:border-white ring-4 ring-zinc-900/10 dark:ring-white/10 scale-110 z-10"
                                                            : "border border-black/10 dark:border-white/10 hover:ring-2 ring-zinc-900/5 dark:ring-white/20 opacity-90"
                                                    )}
                                                />
                                                <span className={cn(
                                                    "text-[10px] font-medium capitalize",
                                                    isSelected ? "text-zinc-900 dark:text-zinc-200 font-bold" : "text-zinc-500 dark:text-zinc-400"
                                                )}>
                                                    {tone.replace("-", " ")}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Vivids */}
                                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-6 block border-t border-zinc-200 dark:border-white/10 pt-6">Vivids & Direct Dyes</label>
                                <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                                    {vividTones.map((tone) => {
                                        const isSelected = targetTone === tone;
                                        const swatchHex = TONE_HEX[tone] || "#ccc";
                                        return (
                                            <div key={tone} className="flex flex-col items-center gap-2">
                                                <button
                                                    onClick={() => setTargetTone(tone)}
                                                    style={{ backgroundColor: swatchHex }}
                                                    className={cn(
                                                        "w-10 h-10 rounded-full shadow-sm transition-all duration-200",
                                                        isSelected
                                                            ? "border-[3px] border-zinc-900 dark:border-white ring-4 ring-zinc-900/10 dark:ring-white/10 scale-110 z-10"
                                                            : "border border-black/10 dark:border-white/10 hover:ring-2 ring-zinc-900/5 dark:ring-white/20 opacity-90"
                                                    )}
                                                />
                                                <span className={cn(
                                                    "text-[9px] font-medium capitalize",
                                                    isSelected ? "text-zinc-900 dark:text-zinc-200 font-bold" : "text-zinc-500 dark:text-zinc-400"
                                                )}>
                                                    {tone.replace("-", " ")}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Bleach Panel */}
                            <div className="space-y-6 mt-4 pt-8 border-t border-zinc-200 dark:border-white/5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-400">Lifting with bleach first</span>
                                    <button
                                        onClick={() => setBleachEnabled(!bleachEnabled)}
                                        className={cn(
                                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                                            bleachEnabled ? "bg-[#f49d25]" : "bg-zinc-200 dark:bg-zinc-800"
                                        )}
                                    >
                                        <span className={cn(
                                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                            bleachEnabled ? "translate-x-6 shadow-sm" : "translate-x-1"
                                        )}></span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-300 transition-opacity" style={{ opacity: bleachEnabled ? 1 : 0.3, pointerEvents: bleachEnabled ? 'auto' : 'none' }}>
                                    {[1, 2, 3].map((lifts) => (
                                        <button
                                            key={`bleach-${lifts}`}
                                            onClick={() => { if (bleachEnabled) setBleachLifts(lifts) }}
                                            className={cn(
                                                "flex flex-col p-3 rounded-[12px] border items-center gap-2 transition-all",
                                                bleachLifts === lifts && bleachEnabled
                                                    ? "bg-zinc-100 dark:bg-zinc-900/80 border-zinc-900 dark:border-zinc-700 shadow-sm ring-1 ring-zinc-900/10 dark:ring-white/10"
                                                    : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-zinc-700"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-[8px]",
                                                lifts === 1 ? "bg-[#c2410c]" : lifts === 2 ? "bg-[#ea580c]" : "bg-[#f59e0b]",
                                                bleachLifts === lifts && bleachEnabled ? "shadow-inner border border-black/20 dark:border-white/20" : ""
                                            )}></div>
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase",
                                                bleachLifts === lifts && bleachEnabled ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500"
                                            )}>
                                                {lifts} {lifts === 1 ? 'Lift' : 'Lifts'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1"></div>

                            <div className="flex justify-between pt-8 pb-4">
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm font-bold cursor-pointer"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSimulate}
                                    className="flex items-center gap-2 px-8 py-3 bg-zinc-800 dark:bg-white border border-zinc-700 dark:border-white text-zinc-100 dark:text-zinc-900 rounded-[12px] hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all group"
                                >
                                    <span className="font-bold text-sm">Simulate</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}
                </aside>
            </main>

            {/* Aesthetic floating elements */}
            <div className="absolute bottom-6 left-6 flex gap-2 z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-[#f49d25]"></div>
            </div>
        </div>
    );
}
