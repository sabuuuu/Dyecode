"use client";

import { useHairStore } from "@/store/useHairStore";
import { ColorSwatch } from "./ColorSwatch";

export function BleachPanels() {
    const progression = useHairStore((s) => s.bleachProgression);

    if (!progression || progression.length === 0) return null;

    return (
        <div className="space-y-4 pt-6 mt-6 border-t border-zinc-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h3 className="text-sm font-medium text-zinc-900 mb-1">
                    Bleach Lift Progression
                </h3>
                <p className="text-xs text-zinc-500 mb-4">
                    Shows how the hair will respond after consecutive bleach sessions.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {progression.map((step, idx) => {
                    if (step.status !== "success") return null;
                    return (
                        <div key={idx} className="p-4 bg-zinc-50 border border-zinc-200 rounded-[12px] space-y-4 shadow-sm">
                            <div>
                                <div className="text-sm font-bold text-zinc-900 mb-1">Session {idx + 1}</div>
                                <div className="text-[11px] text-zinc-500 capitalize tracking-wider font-semibold">Achieved Lvl {step.achievableLevel} • {step.exposedPigment.replace("-", " ")}</div>
                            </div>
                            <ColorSwatch beforeHex={step.beforeHex} afterHex={step.afterHex} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
