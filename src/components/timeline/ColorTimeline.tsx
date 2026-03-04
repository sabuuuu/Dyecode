"use client";

import { useHairStore } from "@/store/useHairStore";
import { ArrowRight } from "lucide-react";

export function ColorTimeline() {
    const history = useHairStore((s) => s.colorHistory);

    if (history.length < 2) return null;

    return (
        <div className="space-y-4 pt-6 border-t border-zinc-100">
            <h3 className="text-sm font-medium text-zinc-900">Color History</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-4">
                {history.map((step, idx) => {
                    if (step.status !== "success") return null;

                    return (
                        <div key={idx} className="flex items-center gap-2 shrink-0">
                            <div className="flex flex-col gap-1 items-center">
                                <div
                                    className="w-12 h-12 rounded-[12px] border border-zinc-200 shadow-sm"
                                    style={{ backgroundColor: step.afterHex }}
                                />
                                <div className="text-[10px] text-zinc-500 font-medium">Step {idx + 1}</div>
                                <div className="text-[10px] text-zinc-400 capitalize">
                                    {step.appliedInput.bleachEnabled ? "Bleach" : "Dye"} • Lvl {step.appliedInput.targetLevel} {step.appliedInput.targetTone}
                                </div>
                            </div>
                            {idx < history.length - 1 && (
                                <ArrowRight className="w-4 h-4 text-zinc-300 mx-1" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
