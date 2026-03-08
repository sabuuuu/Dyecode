import { Slider } from "@/components/ui/slider";
import { TONE_HEX } from "@/engine/constants";
import { Layers, ArrowDownUp, SplitSquareVertical, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import type {
  HairHistory,
  DamageLevel,
  HairLength,
  HairThickness
} from "@/types";

type SimulatorStepOneProps = {
  draftLevel: number;
  draftUndertone: string;
  draftHistory: HairHistory;
  draftDamage: DamageLevel;
  draftChemicalHistory: string[];
  draftLength: HairLength;
  draftThickness: HairThickness;
  onChangeLevel: (level: number) => void;
  onChangeUndertone: (undertone: string) => void;
  onChangeHistory: (history: HairHistory) => void;
  onChangeDamage: (damage: DamageLevel) => void;
  onChangeChemicalHistory: (history: string[]) => void;
  onChangeLength: (length: HairLength) => void;
  onChangeThickness: (thickness: HairThickness) => void;
  draftSkinDepth?: string;
  draftSkinUndertone?: string;
  onChangeSkinDepth: (depth: string) => void;
  onChangeSkinUndertone: (undertone: string) => void;
  onNext: () => void;
  onBack: () => void;
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
  draftDamage,
  draftChemicalHistory,
  draftLength,
  draftThickness,
  onChangeLevel,
  onChangeUndertone,
  onChangeHistory,
  onChangeDamage,
  onChangeChemicalHistory,
  onChangeLength,
  onChangeThickness,
  draftSkinDepth,
  draftSkinUndertone,
  onChangeSkinDepth,
  onChangeSkinUndertone,
  onNext,
  onBack,
}: SimulatorStepOneProps) {
  const toggleChemical = (item: string) => {
    if (draftChemicalHistory.includes(item)) {
      onChangeChemicalHistory(draftChemicalHistory.filter((i) => i !== item));
    } else {
      onChangeChemicalHistory([...draftChemicalHistory, item]);
    }
  };

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
            value={[draftLevel]}
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

        <div className="space-y-4">
          <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
            Damage Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Healthy/Virgin", val: 0 },
              { label: "Slightly Damaged", val: 3 },
              { label: "Very Damaged", val: 6 },
              { label: "Crispy/Breaking", val: 9 },
            ].map((d) => (
              <button
                key={d.val}
                onClick={() => onChangeDamage(d.val as DamageLevel)}
                className={cn(
                  "px-3 py-2 rounded-xl border text-[10px] font-bold uppercase transition-all",
                  draftDamage === d.val
                    ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                    : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
            Chemical History
          </label>
          <div className="flex flex-wrap gap-2">
            {["Heat Tools", "Bleach", "Relaxers", "Perms"].map((item) => (
              <button
                key={item}
                onClick={() => toggleChemical(item)}
                className={cn(
                  "px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase transition-all",
                  draftChemicalHistory.includes(item)
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900"
                    : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              Length
            </label>
            <select
              value={draftLength}
              onChange={(e) => onChangeLength(e.target.value as HairLength)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-zinc-400 outline-none"
            >
              <option value="short">Short (Chin)</option>
              <option value="medium">Medium (Shoulder)</option>
              <option value="long">Long (Bra Strap)</option>
              <option value="very-long">Very Long (Waist+)</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              Thickness
            </label>
            <div className="flex gap-2">
              {["fine", "medium", "thick"].map((t) => (
                <button
                  key={t}
                  onClick={() => onChangeThickness(t as HairThickness)}
                  className={cn(
                    "flex-1 py-2 rounded-xl border text-[10px] font-bold uppercase transition-all",
                    draftThickness === t
                      ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                      : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-4 border-t border-zinc-100 dark:border-white/5">
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase mb-4">
              Visual Harmony (Optional)
            </h3>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              Skin Depth
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "fair", label: "Fair", color: "#fde4d0" },
                { value: "light", label: "Light", color: "#f5d5b8" },
                { value: "medium", label: "Medium", color: "#d9b89a" },
                { value: "tan", label: "Tan", color: "#c19a6b" },
                { value: "deep", label: "Deep", color: "#8d5524" },
                { value: "dark", label: "Dark", color: "#5c3317" }
              ].map((d) => (
                <button
                  key={d.value}
                  onClick={() => onChangeSkinDepth(d.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    draftSkinDepth === d.value
                      ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 shadow-sm"
                      : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                  )}
                >
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className={cn(
                    "text-[10px] font-bold uppercase",
                    draftSkinDepth === d.value
                      ? "text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-500"
                  )}>
                    {d.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              Complexion Undertone
            </label>
            <p className="text-[10px] text-zinc-500 leading-relaxed mb-3">
              Not sure? Check your wrist veins: Blue/purple = cool, Green = warm, Both = neutral
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "cool", label: "Cool", color: "#e8b4d4", description: "Pink/Blue tones" },
                { value: "neutral", label: "Neutral", color: "#e8d4b4", description: "Balanced" },
                { value: "warm", label: "Warm", color: "#e8c4a4", description: "Yellow/Golden" }
              ].map((u) => (
                <button
                  key={u.value}
                  onClick={() => onChangeSkinUndertone(u.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    draftSkinUndertone === u.value
                      ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 shadow-sm"
                      : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                  )}
                >
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm"
                    style={{ backgroundColor: u.color }}
                  />
                  <div className="text-center">
                    <span className={cn(
                      "text-[10px] font-bold uppercase block",
                      draftSkinUndertone === u.value
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-500"
                    )}>
                      {u.label}
                    </span>
                    <span className="text-[9px] text-zinc-400">{u.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex justify-between items-center pb-4">
          <button
            onClick={onBack}
            className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[14px] hover:bg-zinc-800 dark:hover:bg-white transition-all group shadow-md"
          >
            <span className="font-bold text-sm">Set Target Goal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
}

