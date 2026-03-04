import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Flame } from "lucide-react";
import type { WarmthLevel } from "@/engine/warmth";

interface WarmthAlertProps {
    level: WarmthLevel;
    score: number;
}

export function WarmthAlert({ level, score }: WarmthAlertProps) {
    if (level === "none") return null;

    const config = {
        mild: {
            title: "Warm Undertones",
            message: "Result may have warm undertones.",
            className: "bg-yellow-50 border-yellow-200 text-yellow-900",
            iconColor: "text-yellow-600",
        },
        strong: {
            title: "Strong Warmth",
            message: "Result will likely appear copper or brassy.",
            className: "bg-orange-50 border-orange-200 text-orange-900",
            iconColor: "text-orange-600",
        },
        critical: {
            title: "Critical Warmth",
            message: "High red/orange pigment exposure. Toner or purple shampoo recommended.",
            className: "bg-red-50 border-red-200 text-red-900",
            iconColor: "text-red-600",
        },
    }[level];

    return (
        <Alert className={`rounded-[12px] shadow-none py-3 px-4 flex flex-col items-start ${config.className}`}>
            <div className="flex items-center gap-2 mb-1 w-full relative">
                <Flame className={`h-4 w-4 ${config.iconColor}`} />
                <AlertTitle className="text-sm font-semibold flex-1 mb-0 leading-none">
                    {config.title}
                </AlertTitle>
                <span className="text-xs font-mono opacity-80 font-medium">Warmth: {score}/100</span>
            </div>
            <AlertDescription className="text-xs w-full pl-6">
                {config.message}
            </AlertDescription>
        </Alert>
    );
}
