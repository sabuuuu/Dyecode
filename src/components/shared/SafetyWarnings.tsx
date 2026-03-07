import { AlertCircle, ShieldAlert, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SafetyWarning } from "@/engine/safety";

interface Props {
    warnings: SafetyWarning[];
}

export function SafetyWarnings({ warnings }: Props) {
    if (warnings.length === 0) return null;

    const critical = warnings.filter(w => w.severity === "critical");
    const danger = warnings.filter(w => w.severity === "danger");
    const warnings_list = warnings.filter(w => w.severity === "warning");
    const info = warnings.filter(w => w.severity === "info");

    return (
        <div className="w-full max-w-5xl space-y-4">
            {/* Critical & Danger (High Priority) */}
            {[...critical, ...danger].map((w, i) => (
                <div
                    key={`crit-${i}`}
                    className="p-6 rounded-[24px] bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/50 flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left animate-in fade-in slide-in-from-top-4"
                >
                    <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-1">{w.title}</h3>
                        <p className="text-sm text-red-800 dark:text-red-300 mb-3 leading-relaxed">{w.message}</p>
                        {w.action && (
                            <div className="inline-block px-4 py-2 bg-white/50 dark:bg-black/20 rounded-xl border border-red-100 dark:border-red-900/30">
                                <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-tight">Recommendation:</span>
                                <span className="ml-2 text-xs text-red-800 dark:text-red-300">{w.action}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Warnings (Medium Priority) */}
            {warnings_list.map((w, i) => (
                <div
                    key={`warn-${i}`}
                    className="p-5 rounded-[24px] bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-100 dark:border-amber-900/30 flex gap-4 items-start animate-in fade-in"
                >
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-1 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-amber-900 dark:text-amber-300">{w.title}</p>
                        <p className="text-xs text-amber-800 dark:text-amber-300/80 leading-relaxed mt-1">
                            {w.message} {w.action && <span className="font-bold border-b border-amber-200">{w.action}</span>}
                        </p>
                    </div>
                </div>
            ))}

            {/* Info (Low Priority) */}
            {info.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                    {info.map((w, i) => (
                        <div
                            key={`info-${i}`}
                            className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 flex gap-3 items-start animate-in fade-in"
                        >
                            <Info className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">{w.title}</p>
                                <p className="text-[10px] text-zinc-500 leading-normal">{w.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
