"use client";

import { Button } from "@/components/ui/button";
import { Download, Link2 } from "lucide-react";
import { toast } from "sonner";
import { exportImage, encodeSimulationState } from "@/lib/exportUtils";
import { useHairStore } from "@/store/useHairStore";

export function ExportActions() {
    const { hairState, result } = useHairStore();

    if (result.status !== "success" || !hairState) return null;

    const handleExport = async () => {
        toast.promise(
            exportImage("simulation-result-container", "dyecode-simulation.png"),
            {
                loading: "Generating image...",
                success: "Image downloaded!",
                error: "Failed to export image.",
            }
        );
    };

    const handleCopyLink = () => {
        try {
            const encoded = encodeSimulationState(hairState, result.appliedInput);

            const url = new URL(window.location.href);
            url.searchParams.set("state", encoded);

            navigator.clipboard.writeText(url.toString());
            toast.success("Link copied to clipboard!");
        } catch (e) {
            toast.error("Failed to copy link");
        }
    };

    return (
        <div className="inline-flex items-center gap-2 rounded-[16px] border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/80 px-2 py-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="rounded-[10px] px-3 h-8 text-[11px] text-zinc-600 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
                <Link2 className="w-3 h-3 mr-1.5" />
                Copy link
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="rounded-[10px] px-3 h-8 text-[11px] text-white hover:text-white dark:text-zinc-50 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 border border-zinc-900/80 dark:border-zinc-100"
            >
                <Download className="w-3 h-3 mr-1.5" />
                Export image
            </Button>
        </div>
    );
}
