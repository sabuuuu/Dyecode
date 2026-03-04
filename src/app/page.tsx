"use client";

import { useEffect } from "react";
import { useHairStore } from "@/store/useHairStore";
import { InteractiveSimulator } from "@/components/simulator/InteractiveSimulator";
import { InteractiveResult } from "@/components/simulator/InteractiveResult";
import { decodeSimulationState } from "@/lib/exportUtils";

export default function Home() {
  const result = useHairStore((s) => s.result);
  const { setHairState, setDyeInput, runSimulation } = useHairStore();

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
        <InteractiveResult />
      )}
    </>
  );
}
