import html2canvas from "html2canvas";
import { toast } from "sonner";
import { HairState, DyeInput } from "../types";

export async function exportImage(elementId: string, filename: string = "dyecode-result.png") {
    try {
        const element = document.getElementById(elementId);
        if (!element) throw new Error("Result container not found");

        // Pre-flight styles to ensure good canvas capture
        const originalBackground = element.style.background;
        element.style.background = "#ffffff";

        // Slight delay to ensure any animations finished
        await new Promise(r => setTimeout(r, 100));

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
        });

        // Restore original
        element.style.background = originalBackground;

        const dataUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Image exported successfully");
    } catch (error) {
        console.error("Export failed", error);
        toast.error("Failed to export image");
    }
}

// Encode the base setup
export function encodeSimulationState(hairState: HairState, dyeInput: DyeInput): string {
    const payload = JSON.stringify({ h: hairState, d: dyeInput });
    return btoa(payload);
}

// Decode on load
export function decodeSimulationState(base64: string): { hairState: HairState, dyeInput: DyeInput } | null {
    try {
        const decoded = atob(base64);
        const parsed = JSON.parse(decoded);

        if (parsed.h && parsed.d) {
            return {
                hairState: parsed.h as HairState,
                dyeInput: parsed.d as DyeInput
            }
        }
        return null;
    } catch (e) {
        console.error("Failed to decode URL state", e);
        return null;
    }
}
