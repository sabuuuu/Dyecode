"use client";

import { HairInputForm } from "@/components/forms/HairInputForm";
import { AddLayerForm } from "@/components/forms/AddLayerForm";
import { ColorSwatch } from "@/components/canvas/ColorSwatch";
import { StrandPreview } from "@/components/canvas/StrandPreview";
import { BleachPanels } from "@/components/canvas/BleachPanels";
import { ColorTimeline } from "@/components/timeline/ColorTimeline";
import { WarmthAlert } from "@/components/shared/WarmthAlert";
import { ExportActions } from "@/components/shared/ExportActions";
import { useHairStore } from "@/store/useHairStore";
import { InteractiveSimulator } from "@/components/simulator/InteractiveSimulator";
import { decodeSimulationState } from "@/lib/exportUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, TriangleAlert } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const result = useHairStore((s) => s.result);
  const { setHairState, setDyeInput, runSimulation, reset } = useHairStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const stateParam = urlParams.get("state");

      if (stateParam) {
        const decoded = decodeSimulationState(stateParam);
        if (decoded) {
          setHairState(decoded.hairState);
          setDyeInput(decoded.dyeInput);
          runSimulation();

          // Clean up URL so it doesn't get sticky on refresh
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, [setHairState, setDyeInput, runSimulation]);

  return (
    <>
      {result.status !== "success" ? (
        <InteractiveSimulator />
      ) : (
        <main className="min-h-screen p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-1">Simulation Result</h1>
              <p className="text-zinc-500 text-sm">Review your target formula and outcomes.</p>
            </div>
            <button
              onClick={() => reset()}
              className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded-[12px] text-sm font-medium hover:bg-zinc-50 transition w-auto bg-white shadow-sm"
            >
              Start Over
            </button>
          </div>

          <div id="simulation-result-container" className="space-y-6">
            <ColorTimeline />

            <div className="flex flex-col md:flex-row gap-8 items-start justify-between bg-white border border-zinc-200 p-6 rounded-[12px]">
              <div className="flex-1 w-full flex justify-center md:justify-start">
                <ColorSwatch beforeHex={result.beforeHex} afterHex={result.afterHex} />
              </div>
              <div className="shrink-0 mx-auto md:mx-0">
                <StrandPreview hex={result.afterHex} />
              </div>
            </div>

            <BleachPanels />

            <AddLayerForm />

            {result.warmthLevel && result.warmthScore !== undefined && result.warmthLevel !== "none" && (
              <WarmthAlert level={result.warmthLevel} score={result.warmthScore} />
            )}

            {result.warnings.length > 0 && (
              <div className="space-y-3">
                {result.warnings.map((warning, idx) => (
                  <Alert key={idx} variant="destructive" className="bg-red-50 border border-red-200 text-red-900 rounded-[12px] shadow-none py-3 px-4">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle className="text-sm font-semibold mb-1">Warning</AlertTitle>
                    <AlertDescription className="text-xs">
                      {warning}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            <Alert className="rounded-[12px] border border-zinc-200 bg-zinc-50 shadow-none text-zinc-600 py-3 px-4">
              <Info className="h-4 w-4" />
              <AlertTitle className="text-sm font-medium mb-1">Disclaimer</AlertTitle>
              <AlertDescription className="text-xs">
                Simulation based on color theory. Real results vary by hair condition, product brand, and processing time.
              </AlertDescription>
            </Alert>

            <ExportActions />
          </div>
        </main>
      )}
    </>
  );
}

