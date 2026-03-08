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

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Create realistic hair gradient (darker roots, lighter ends)
        const rootHex = chroma(hex).darken(0.8).hex();
        const midHex = hex;
        const endsHex = chroma(hex).brighten(0.4).saturate(0.3).hex();

        // Draw individual hair strands
        const strandCount = 40;
        const strandWidth = width / strandCount;

        for (let i = 0; i < strandCount; i++) {
            const x = i * strandWidth;
            
            // Create gradient for each strand
            const gradient = ctx.createLinearGradient(x, 0, x, height);
            gradient.addColorStop(0, rootHex);
            gradient.addColorStop(0.3, chroma(rootHex).brighten(0.3).hex());
            gradient.addColorStop(0.6, midHex);
            gradient.addColorStop(0.85, endsHex);
            gradient.addColorStop(1, chroma(endsHex).brighten(0.2).hex());

            // Draw strand with slight wave
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = strandWidth * 1.2;
            ctx.lineCap = "round";
            
            const waveOffset = Math.sin(i * 0.5) * 2;
            ctx.moveTo(x + waveOffset, 0);
            
            // Create natural wave in strand
            for (let y = 0; y < height; y += 10) {
                const wave = Math.sin((i + y) * 0.1) * 1.5;
                ctx.lineTo(x + wave + waveOffset, y);
            }
            ctx.lineTo(x + waveOffset, height);
            ctx.stroke();
        }

        // Add shine/highlights
        const shineGradient = ctx.createLinearGradient(0, 0, 0, height);
        shineGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        shineGradient.addColorStop(0.2, "rgba(255, 255, 255, 0.15)");
        shineGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.08)");
        shineGradient.addColorStop(0.6, "rgba(255, 255, 255, 0.12)");
        shineGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = shineGradient;
        ctx.fillRect(width * 0.3, 0, width * 0.4, height);

        // Add subtle shadow for depth
        const shadowGradient = ctx.createLinearGradient(0, 0, width, 0);
        shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0.15)");
        shadowGradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0.15)");

        ctx.fillStyle = shadowGradient;
        ctx.fillRect(0, 0, width, height);

    }, [hex]);

    return (
        <div className="flex flex-col gap-2 items-center">
            <div className="rounded-[12px] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <canvas
                    ref={canvasRef}
                    width={80}
                    height={240}
                    className="w-[80px] h-[240px] block"
                />
            </div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 text-center">Strand View</span>
        </div>
    );
}
