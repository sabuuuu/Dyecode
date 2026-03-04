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
                loading: 'Generating image...',
                success: 'Image downloaded!',
                error: 'Failed to export image.',
            }
        );
    };

    const handleCopyLink = () => {
        try {
            // Encode ONLY the initial payload 
            // the full timeline would make the URL too massive for simple sharing
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
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100">
            <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="rounded-xl border-zinc-200 text-zinc-600 shadow-none hover:bg-zinc-100 h-9"
            >
                <Link2 className="w-4 h-4 mr-2" />
                Copy Link
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="rounded-xl border-zinc-200 text-zinc-600 shadow-none hover:bg-zinc-100 h-9"
            >
                <Download className="w-4 h-4 mr-2" />
                Export Image
            </Button>
        </div>
    );
}
