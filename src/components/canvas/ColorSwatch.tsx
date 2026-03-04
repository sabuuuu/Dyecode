"use client";

import { useEffect, useRef } from "react";

interface ColorSwatchProps {
    beforeHex: string;
    afterHex: string;
}

export function ColorSwatch({ beforeHex, afterHex }: ColorSwatchProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const halfWidth = width / 2;

        // Draw Before Color
        ctx.fillStyle = beforeHex;
        ctx.fillRect(0, 0, halfWidth, height);

        // Draw After Color
        ctx.fillStyle = afterHex;
        ctx.fillRect(halfWidth, 0, halfWidth, height);
    }, [beforeHex, afterHex]);

    return (
        <div className="flex flex-col gap-2 w-full max-w-[400px]">
            <div className="rounded-[12px] overflow-hidden border border-zinc-200 shadow-none">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="w-full h-auto block"
                />
            </div>
            <div className="flex w-full justify-between text-[11px] uppercase tracking-wider font-semibold text-zinc-500 px-1">
                <span>Current</span>
                <span>Predicted Result</span>
            </div>
        </div>
    );
}
