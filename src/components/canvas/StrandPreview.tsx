"use client";

import { useEffect, useRef } from "react";
import chroma from "chroma-js";

interface StrandPreviewProps {
    hex: string;
}

export function StrandPreview({ hex }: StrandPreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Visual variations for root and ends
        const rootHex = chroma(hex).darken(0.4).hex();
        const endsHex = chroma(hex).brighten(0.3).hex();

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, rootHex);    // Roots
        gradient.addColorStop(0.5, hex);      // Mid-length
        gradient.addColorStop(1, endsHex);    // Ends

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Subtle texture matching strand logic
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 4) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
        for (let i = 2; i < width; i += 6) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
    }, [hex]);

    return (
        <div className="flex flex-col gap-2 items-center">
            <div className="rounded-[12px] overflow-hidden border border-zinc-200 shadow-none">
                <canvas
                    ref={canvasRef}
                    width={60}
                    height={200}
                    className="w-[60px] h-full max-h-[200px] block"
                />
            </div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 text-center">Strand View</span>
        </div>
    );
}
