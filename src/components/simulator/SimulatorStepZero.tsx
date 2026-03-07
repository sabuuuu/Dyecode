import { ArrowRight, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { PorosityLevel } from "@/types";

type SimulatorStepZeroProps = {
    onComplete: (porosity: PorosityLevel) => void;
};

export function SimulatorStepZero({ onComplete }: SimulatorStepZeroProps) {
    const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);

    const questions = [
        {
            id: 0,
            text: "The Water Test: Drop a clean hair strand in water. Does it...",
            options: [
                { label: "Float longer than 2 minutes", score: 0 },
                { label: "Slowly sink after a minute", score: 1 },
                { label: "Sink immediately", score: 2 },
            ],
        },
        {
            id: 1,
            text: "The Texture Test: When you run fingers through hair, it feels...",
            options: [
                { label: "Smooth and slippery", score: 0 },
                { label: "Slightly rough or 'catchy'", score: 1 },
                { label: "Very rough, dry, or tangly", score: 2 },
            ],
        },
        {
            id: 2,
            text: "The Drying Test: After washing, your hair usually dries...",
            options: [
                { label: "Takes forever (Low Porosity)", score: 0 },
                { label: "In about 2–4 hours", score: 1 },
                { label: "Very quickly, under 1 hour", score: 2 },
            ],
        },
    ];

    const handleSelect = (qIndex: number, score: number) => {
        const newAnswers = [...answers];
        newAnswers[qIndex] = score;
        setAnswers(newAnswers);
    };

    const isComplete = answers.every((a) => a !== null);

    const calculatePorosity = (): PorosityLevel => {
        const totalScore = answers.reduce((sum, current) => (sum || 0) + (current || 0), 0) || 0;
        if (totalScore >= 5) return "high";
        if (totalScore >= 3) return "normal";
        return "low";
    };

    return (
        <aside className="w-full md:w-2/5 flex flex-col p-8 lg:p-10 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-white/5 overflow-y-auto">
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                    <h2 className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-400 uppercase mb-8">
                        Basics — Step 0: Porosity Quiz
                    </h2>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 mb-6 flex gap-3">
                        <HelpCircle className="w-5 h-5 text-zinc-400 shrink-0" />
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            Porosity determines how your hair absorbs chemicals. Knowing this prevents patchy color and over-processing.
                        </p>
                    </div>
                </div>

                <div className="space-y-10">
                    {questions.map((q) => (
                        <div key={q.id} className="space-y-4">
                            <label className="text-sm font-bold text-zinc-900 dark:text-zinc-200 block">
                                {q.text}
                            </label>
                            <div className="flex flex-col gap-2">
                                {q.options.map((opt) => (
                                    <button
                                        key={opt.label}
                                        onClick={() => handleSelect(q.id, opt.score)}
                                        className={cn(
                                            "text-left px-4 py-3 rounded-xl border transition-all text-xs",
                                            answers[q.id] === opt.score
                                                ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 font-semibold"
                                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-8 pb-4">
                    <button
                        onClick={() => isComplete && onComplete(calculatePorosity())}
                        disabled={!isComplete}
                        className={cn(
                            "flex items-center gap-2 px-6 py-4 rounded-[14px] transition-all group shadow-md",
                            isComplete
                                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                        )}
                    >
                        <span className="font-bold text-sm">Next: Current State</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
