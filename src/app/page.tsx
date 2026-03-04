"use client";

import { HairInputForm } from "@/components/forms/HairInputForm";
import { useHairStore } from "@/store/useHairStore";

export default function Home() {
  const result = useHairStore((s) => s.result);

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-1">Dyecode</h1>
        <p className="text-zinc-500 text-sm">Hair pigment simulation engine based on color theory.</p>
      </div>

      <HairInputForm />

      <div className="p-4 bg-zinc-900 text-zinc-100 rounded-xl font-mono text-xs overflow-auto shadow-sm">
        <h2 className="text-zinc-500 mb-2">// Simulation Result Output</h2>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </main>
  );
}
