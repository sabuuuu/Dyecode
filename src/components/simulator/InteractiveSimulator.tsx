"use client";

import { useHairStore } from "@/store/useHairStore";
import { HelpCircle, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SimulatorStepZero } from "./SimulatorStepZero";
import { SimulatorResults } from "./SimulatorResults";
import { SimulatorStepOne } from "./SimulatorStepOne";
import { SimulatorStepTwo } from "./SimulatorStepTwo";
import { DyecodeLogo } from "../shared/DyecodeLogo";
import { SafetyCheckModal } from "../shared/SafetyCheckModal";
import type {
  PorosityLevel,
  DamageLevel,
  HairLength,
  HairThickness,
  HairHistory
} from "@/types";

export function InteractiveSimulator() {
  const { setHairState, setDyeInput, runSimulation } = useHairStore();

  const [step, setStep] = useState<number>(0);

  // Step 0 - Porosity
  const [porosity, setPorosity] = useState<PorosityLevel>("normal");

  // Step 1 - Current State
  const [draftLevel, setDraftLevel] = useState<number>(5);
  const [draftUndertone, setDraftUndertone] = useState<string>("red-orange");
  const [draftHistory, setDraftHistory] = useState<HairHistory>("virgin");
  const [draftDamage, setDraftDamage] = useState<DamageLevel>(0);
  const [draftChemicalHistory, setDraftChemicalHistory] = useState<string[]>([]);
  const [draftLength, setDraftLength] = useState<HairLength>("medium");
  const [draftThickness, setDraftThickness] = useState<HairThickness>("medium");
  const [draftSkinDepth, setDraftSkinDepth] = useState<string | undefined>();
  const [draftSkinUndertone, setDraftSkinUndertone] = useState<string | undefined>();

  // Step 2 - Target Goal
  const [targetLevel, setTargetLevel] = useState<number>(6);
  const [targetTone, setTargetTone] = useState<string>("ash");
  const [bleachEnabled, setBleachEnabled] = useState<boolean>(false);
  const [bleachLifts, setBleachLifts] = useState<number>(1);

  const [hasAcknowledgedSafety, setHasAcknowledgedSafety] = useState<boolean>(false);
  const [showSafetyModal, setShowSafetyModal] = useState<boolean>(false);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handlePorosityComplete = (p: PorosityLevel) => {
    setPorosity(p);
    handleNext();
  };

  const handleSimulate = () => {
    if (!hasAcknowledgedSafety) {
      setShowSafetyModal(true);
      return;
    }

    performSimulation();
  };

  const handleSafetyConfirm = () => {
    setHasAcknowledgedSafety(true);
    setShowSafetyModal(false);
    performSimulation();
  };

  const performSimulation = () => {
    setHairState({
      currentLevel: draftLevel,
      currentUndertone: draftUndertone as any,
      hairHistory: draftHistory,
      porosity,
      damageLevel: draftDamage,
      chemicalHistory: draftChemicalHistory,
      hairLength: draftLength,
      hairThickness: draftThickness,
      skinDepth: draftSkinDepth as any,
      skinUndertone: draftSkinUndertone as any,
    });
    setDyeInput({
      targetLevel,
      targetTone: targetTone as any,
      bleachEnabled,
      bleachLifts: bleachEnabled ? (bleachLifts as any) : undefined,
    });
    runSimulation();
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      <header className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 px-8 py-4 bg-white/50 dark:bg-black/50 backdrop-blur-md z-10 w-full shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-zinc-900 dark:text-[#f49d25]">
            <DyecodeLogo className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Dyecode
          </h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold tracking-[0.18em] uppercase text-zinc-500">
                What is Dyecode?
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-700 dark:text-zinc-200 mt-2">
                Dyecode is a hair color planning tool. It simulates how your current level, undertone,
                history, and bleach lifts will likely influence the final shade when you apply a dye.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
              <p>
                Adjust the <span className="font-semibold">Current State</span> on the right to match your hair now,
                then move to <span className="font-semibold">Your Goal</span> to pick a target level, tone, and any bleach.
              </p>
              <p>
                The preview shows an approximate result based on color theory and lift rules. Real outcomes still
                depend on hair condition, products, and processing time.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <main className="flex flex-col md:flex-row flex-1 w-full overflow-hidden">
        <SimulatorResults
          step={step}
          draftLevel={draftLevel}
          draftUndertone={draftUndertone}
          targetLevel={targetLevel}
          targetTone={targetTone}
        />

        {step === 0 && (
          <SimulatorStepZero onComplete={handlePorosityComplete} />
        )}

        {step === 1 && (
          <SimulatorStepOne
            draftLevel={draftLevel}
            draftUndertone={draftUndertone}
            draftHistory={draftHistory}
            draftDamage={draftDamage}
            draftChemicalHistory={draftChemicalHistory}
            draftLength={draftLength}
            draftThickness={draftThickness}
            onChangeLevel={setDraftLevel}
            onChangeUndertone={setDraftUndertone}
            onChangeHistory={setDraftHistory}
            onChangeDamage={setDraftDamage}
            onChangeChemicalHistory={setDraftChemicalHistory}
            onChangeLength={setDraftLength}
            onChangeThickness={setDraftThickness}
            draftSkinDepth={draftSkinDepth}
            draftSkinUndertone={draftSkinUndertone}
            onChangeSkinDepth={setDraftSkinDepth}
            onChangeSkinUndertone={setDraftSkinUndertone}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 2 && (
          <SimulatorStepTwo
            targetLevel={targetLevel}
            targetTone={targetTone}
            bleachEnabled={bleachEnabled}
            bleachLifts={bleachLifts}
            onChangeTargetLevel={setTargetLevel}
            onChangeTargetTone={setTargetTone}
            onToggleBleach={() => setBleachEnabled((prev) => !prev)}
            onChangeBleachLifts={setBleachLifts}
            onBack={handleBack}
            onSimulate={handleSimulate}
          />
        )}
      </main>

      <div className="absolute bottom-6 left-6 flex gap-2 z-10">
        <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", step === 0 ? "bg-zinc-900 dark:bg-[#f49d25]" : "bg-zinc-300 dark:bg-zinc-800")} />
        <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", step === 1 ? "bg-zinc-900 dark:bg-[#f49d25]" : "bg-zinc-300 dark:bg-zinc-800")} />
        <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", step === 2 ? "bg-zinc-900 dark:bg-[#f49d25]" : "bg-zinc-300 dark:bg-zinc-800")} />
      </div>

      <SafetyCheckModal
        isOpen={showSafetyModal}
        onConfirm={handleSafetyConfirm}
      />
    </div>
  );
}
