import { BASE_LEVEL_HEX, TONE_HEX } from "@/engine/constants";

type SimulatorResultsProps = {
  step: number;
  draftLevel: number;
  draftUndertone: string;
  targetLevel: number;
  targetTone: string;
};

export function SimulatorResults({
  step,
  draftLevel,
  draftUndertone,
  targetLevel,
  targetTone,
}: SimulatorResultsProps) {
  const base = BASE_LEVEL_HEX[draftLevel] || "#121212";
  const previewHex =
    TONE_HEX[draftUndertone] != null
      ? TONE_HEX[draftUndertone]
      : base;

  const expectedHex = TONE_HEX[targetTone] || BASE_LEVEL_HEX[targetLevel];

  return (
    <div className="w-full md:w-3/5 flex flex-col items-center justify-center p-8 lg:p-12 bg-zinc-100 dark:bg-zinc-900/10 relative">
      <div className="relative w-full max-w-sm aspect-square flex flex-col items-center justify-center pointer-events-none">
        {step === 1 ? (
          <span className="absolute top-0 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 animate-in fade-in">
            Starting Canvas
          </span>
        ) : (
          <span className="absolute top-0 text-[10px] font-bold uppercase tracking-widest text-[#f49d25] mb-4 animate-in fade-in">
            Prediction Active
          </span>
        )}

        <div className="relative w-72 h-72 sm:w-80 sm:h-80 group mt-[-30px]">
          {step === 1 ? (
            <div
              className="absolute inset-0 rounded-[4rem] shadow-2xl overflow-hidden transition-colors duration-700 ease-in-out border-8 border-white dark:border-zinc-800"
              style={{ backgroundColor: previewHex }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/30" />
            </div>
          ) : (
            <>
              <div
                className="absolute inset-0 rounded-[4rem] overflow-hidden opacity-40 blur-sm transition-colors duration-700"
                style={{ backgroundColor: previewHex }}
              />
              <div
                className="absolute inset-0 rounded-[4rem] shadow-2xl overflow-hidden transition-colors duration-700"
                style={{ backgroundColor: expectedHex }}
              >
                <div className="absolute inset-0 mix-blend-soft-light opacity-30 bg-white shadow-[inset_0_0_50px_rgba(255,255,255,0.5)]" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/40" />
              </div>
            </>
          )}
        </div>

        {step === 1 ? (
          <div className="mt-8 z-10 inline-flex flex-col items-center gap-1 px-5 py-3 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-lg capitalize animate-in fade-in zoom-in-95">
            <span className="text-[10px] font-bold tracking-widest text-[#f49d25] uppercase">
              Current Base
            </span>
            <span className="text-zinc-900 dark:text-zinc-100 text-base font-semibold tracking-wide flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: previewHex }}
              />
              Level {draftLevel} · {draftUndertone.replace("-", " ")}
            </span>
          </div>
        ) : (
          <div className="mt-12 flex gap-3 z-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm capitalize">
              <span
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: previewHex }}
              />
              <span className="text-zinc-500 dark:text-zinc-300 text-[11px] font-medium">
                Now · Lvl {draftLevel} · {draftUndertone.replace("-", " ")}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 dark:bg-zinc-200 rounded-2xl shadow-lg capitalize">
              <span
                className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white/20"
                style={{ backgroundColor: expectedHex }}
              />
              <span className="text-white dark:text-zinc-950 text-[11px] font-bold tracking-wide">
                Expected · Lvl {targetLevel} · {targetTone.replace("-", " ")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

