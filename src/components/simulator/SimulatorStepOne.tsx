import { Slider } from "@/components/ui/slider";
import { TONE_HEX } from "@/engine/constants";
import { Layers, ArrowDownUp, SplitSquareVertical, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type HairHistory = "virgin" | "dyed-darker" | "dyed-lighter";

type SimulatorStepOneProps = {
  draftLevel: number;
  draftUndertone: string;
  draftHistory: HairHistory;
  onChangeLevel: (level: number) => void;
  onChangeUndertone: (undertone: string) => void;
  onChangeHistory: (history: HairHistory) => void;
  onNext: () => void;
};

const primaryUndertones = [
  "red",
  "red-orange",
  "orange",
  "orange-yellow",
  "yellow",
  "neutral",
  "ash",
  "gold",
  "copper",
  "burgundy",
] as const;

export function SimulatorStepOne({
  draftLevel,
  draftUndertone,
  draftHistory,
  onChangeLevel,
  onChangeUndertone,
  onChangeHistory,
  onNext,
}: SimulatorStepOneProps) {
  return (
    <aside className="w-full md:w-2/5 flex flex-col p-8 lg:p-10 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-white/5 overflow-y-auto">
      <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
        <div>
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase mb-8">
            Current State
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              Level Selector
            </label>
            <span className="text-xs font-black text-zinc-600 dark:text-[#f49d25] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
              Lvl {draftLevel}
            </span>
          </div>

          <Slider
            defaultValue={[draftLevel]}
            max={10}
            min={1}
            step={1}
            onValueChange={(v) => onChangeLevel(v[0])}
            className="py-4"
          />

          <div className="flex justify-between text-[10px] font-medium text-zinc-400">
            <span>Black (1)</span>
            <span>Light Blonde (10)</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              Starting Tone
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            {primaryUndertones.map((tone) => {
              const isSelected = draftUndertone === tone;
              const swatchHex = TONE_HEX[tone] || "#ccc";

              return (
                <button
                  key={tone}
                  onClick={() => onChangeUndertone(tone)}
                  style={{ backgroundColor: swatchHex }}
                  title={tone.replace("-", " ")}
                  className={cn(
                    "w-10 h-10 rounded-[12px] shadow-sm transition-all duration-200",
                    isSelected
                      ? "scale-110 border-[3px] border-zinc-900 dark:border-white shadow-md z-10"
                      : "hover:scale-105 border border-black/10 dark:border-white/10 opacity-90",
                  )}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
            Hair History
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onChangeHistory("virgin")}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-[16px] border-2 transition-all duration-200",
                draftHistory === "virgin"
                  ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 shadow-sm"
                  : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
              )}
            >
              <Layers
                className={cn(
                  "w-6 h-6 mb-2",
                  draftHistory === "virgin"
                    ? "text-zinc-900 dark:text-zinc-300"
                    : "text-zinc-400",
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-tight text-center",
                  draftHistory === "virgin"
                    ? "text-zinc-900 dark:text-zinc-400"
                    : "text-zinc-500",
                )}
              >
                Natural
              </span>
            </button>

            <button
              onClick={() => onChangeHistory("dyed-darker")}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-[16px] border-2 transition-all duration-200",
                draftHistory === "dyed-darker"
                  ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 shadow-sm"
                  : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
              )}
            >
              <ArrowDownUp
                className={cn(
                  "w-6 h-6 mb-2",
                  draftHistory === "dyed-darker"
                    ? "text-zinc-900 dark:text-zinc-300"
                    : "text-zinc-400",
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-tight text-center",
                  draftHistory === "dyed-darker"
                    ? "text-zinc-900 dark:text-zinc-400"
                    : "text-zinc-500",
                )}
              >
                Dyed Dark
              </span>
            </button>

            <button
              onClick={() => onChangeHistory("dyed-lighter")}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-[16px] border-2 transition-all duration-200",
                draftHistory === "dyed-lighter"
                  ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 shadow-sm"
                  : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
              )}
            >
              <SplitSquareVertical
                className={cn(
                  "w-6 h-6 mb-2",
                  draftHistory === "dyed-lighter"
                    ? "text-zinc-900 dark:text-zinc-300"
                    : "text-zinc-400",
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-tight text-center",
                  draftHistory === "dyed-lighter"
                    ? "text-zinc-900 dark:text-zinc-400"
                    : "text-zinc-500",
                )}
              >
                Bleached
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex justify-end pt-12 pb-4">
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[14px] hover:bg-zinc-800 dark:hover:bg-white transition-all group shadow-md"
          >
            <span className="font-bold text-sm">Target Goal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
}

