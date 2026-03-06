import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TONE_HEX } from "@/engine/constants";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SimulatorStepTwoProps = {
  targetLevel: number;
  targetTone: string;
  bleachEnabled: boolean;
  bleachLifts: number;
  onChangeTargetLevel: (level: number) => void;
  onChangeTargetTone: (tone: string) => void;
  onToggleBleach: () => void;
  onChangeBleachLifts: (lifts: number) => void;
  onBack: () => void;
  onSimulate: () => void;
};

const targetTones = [
  "ash", "pearl", "matte", "neutral", "beige",
  "gold", "copper", "red", "mahogany", "burgundy",
] as const;

const vividTones = [
  "blue", "pink", "purple", "green", "teal", "magenta", "silver",
] as const;

export function SimulatorStepTwo({
  targetLevel,
  targetTone,
  bleachEnabled,
  bleachLifts,
  onChangeTargetLevel,
  onChangeTargetTone,
  onToggleBleach,
  onChangeBleachLifts,
  onBack,
  onSimulate,
}: SimulatorStepTwoProps) {
  
  // Grab the hex for the currently selected tone to display on the trigger button
  const selectedToneHex = TONE_HEX[targetTone] || "#ccc";

  return (
    <aside className="w-full md:w-2/5 flex flex-col p-8 lg:p-10 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-white/5 overflow-y-auto">
      <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* Header */}
        <div>
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase">
            Your Goal
          </h2>
        </div>

        {/* Level Slider */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              Lightness
            </label>
            <span className="text-xs font-black text-zinc-600 dark:text-[#f49d25] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
              Level {targetLevel}
            </span>
          </div>

          <div className="relative h-2 w-full rounded-[12px] bg-gradient-to-r from-black via-zinc-400 dark:via-zinc-600 to-yellow-100 mt-6 mb-2">
            <div className="absolute left-[40%] top-[-8px] bottom-[-8px] w-0.5 bg-black/40 dark:bg-white/60 z-10" />
            <div className="absolute left-[40%] bottom-[-24px] -translate-x-1/2 text-[8px] font-bold text-zinc-500 uppercase whitespace-nowrap">
              You are here
            </div>
            <Slider
              value={[targetLevel]}
              max={10}
              min={1}
              step={1}
              onValueChange={(v) => onChangeTargetLevel(v[0])}
              className="absolute -inset-x-2 -inset-y-3 !h-8 z-20 cursor-pointer opacity-0"
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-[12px] shadow-xl border-2 border-zinc-950 z-20 pointer-events-none transition-all duration-150"
              style={{ left: `calc(${((targetLevel - 1) / 9) * 100}% - 8px)` }}
            />
          </div>
        </div>

        {/* Tone Selector (Optimized with Popover) */}
        <div className="space-y-4 pt-4">
          <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
            Shade & Tone
          </label>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex w-full items-center justify-between rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 p-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/20">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full shadow-sm border border-black/10 dark:border-white/10" 
                    style={{ backgroundColor: selectedToneHex }} 
                  />
                  <span className="text-sm font-semibold capitalize text-zinc-900 dark:text-zinc-200">
                    {targetTone ? targetTone.replace("-", " ") : "Select a shade"}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              </button>
            </PopoverTrigger>
            
            <PopoverContent className="w-[320px] p-4 bg-white dark:bg-zinc-950 rounded-xl shadow-2xl border-zinc-200 dark:border-zinc-800">
              <div className="space-y-6">
                {/* Naturals Section */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Naturals & Warm</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {targetTones.map((tone) => (
                      <button
                        key={tone}
                        onClick={() => onChangeTargetTone(tone)}
                        title={tone}
                        className={cn(
                          "w-10 h-10 rounded-full shadow-sm transition-transform hover:scale-110 focus:outline-none",
                          targetTone === tone 
                            ? "ring-2 ring-offset-2 ring-zinc-900 dark:ring-white dark:ring-offset-zinc-950" 
                            : "border border-black/10 dark:border-white/10"
                        )}
                        style={{ backgroundColor: TONE_HEX[tone] || "#ccc" }}
                      />
                    ))}
                  </div>
                </div>

                {/* Vivids Section */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">Vivids & Direct Dyes</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {vividTones.map((tone) => (
                      <button
                        key={tone}
                        onClick={() => onChangeTargetTone(tone)}
                        title={tone}
                        className={cn(
                          "w-10 h-10 rounded-full shadow-sm transition-transform hover:scale-110 focus:outline-none",
                          targetTone === tone 
                            ? "ring-2 ring-offset-2 ring-zinc-900 dark:ring-white dark:ring-offset-zinc-950" 
                            : "border border-black/10 dark:border-white/10"
                        )}
                        style={{ backgroundColor: TONE_HEX[tone] || "#ccc" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Bleach Section */}
        <div className="space-y-6 mt-4 pt-8 border-t border-zinc-200 dark:border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
              Pre-lighten (Bleach)?
            </span>
            <button
              onClick={onToggleBleach}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                bleachEnabled ? "bg-[#f49d25]" : "bg-zinc-200 dark:bg-zinc-800",
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  bleachEnabled ? "translate-x-6 shadow-sm" : "translate-x-1",
                )}
              />
            </button>
          </div>

          <div
            className="grid grid-cols-3 gap-3 transition-opacity duration-300"
            style={{
              opacity: bleachEnabled ? 1 : 0.3,
              pointerEvents: bleachEnabled ? "auto" : "none",
            }}
          >
            {[1, 2, 3].map((lifts) => (
              <button
                key={`bleach-${lifts}`}
                onClick={() => { if (bleachEnabled) onChangeBleachLifts(lifts); }}
                className={cn(
                  "flex flex-col p-3 rounded-xl border items-center gap-2 transition-all",
                  bleachLifts === lifts && bleachEnabled
                    ? "bg-zinc-100 dark:bg-zinc-900/80 border-zinc-900 dark:border-zinc-700 shadow-sm"
                    : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 hover:border-zinc-300",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg",
                    lifts === 1 ? "bg-[#c2410c]" : lifts === 2 ? "bg-[#ea580c]" : "bg-[#f59e0b]",
                    bleachLifts === lifts && bleachEnabled ? "shadow-inner border border-black/20" : "",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase",
                    bleachLifts === lifts && bleachEnabled ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500",
                  )}
                >
                  {lifts} {lifts === 1 ? "Level" : "Levels"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex justify-between pt-8 pb-4">
          <button
            onClick={onBack}
            className="px-6 py-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm font-bold cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={onSimulate}
            className="flex items-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-white border border-transparent text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm group"
          >
            <span className="font-bold text-sm">Simulate</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
}