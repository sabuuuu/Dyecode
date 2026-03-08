import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck } from "lucide-react";

interface Props {
    isOpen: boolean;
    onConfirm: () => void;
}

export function SafetyCheckModal({ isOpen, onConfirm }: Props) {
    const [checks, setChecks] = useState({
        patchTest: false,
        healthyScalp: false,
        pregnant: false,
        simulationOnly: false
    });

    const canProceed = checks.patchTest && checks.healthyScalp && checks.pregnant && checks.simulationOnly;

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="max-w-md rounded-[24px] p-8 border-amber-100 dark:border-amber-900/30">
                <DialogHeader className="items-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                    <DialogTitle className="text-xl">Safety Affirmation</DialogTitle>
                    <DialogDescription className="text-xs">
                        Hair chemistry is serious. Please confirm the following before you proceed to the simulation.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <CheckItem
                        id="patch"
                        label="I will perform a patch test 48 hours before applying any product."
                        checked={checks.patchTest}
                        onChange={(v) => setChecks(c => ({ ...c, patchTest: v }))}
                    />
                    <CheckItem
                        id="scalp"
                        label="My scalp is healthy, with no visible cuts, sores, or irritation."
                        checked={checks.healthyScalp}
                        onChange={(v) => setChecks(c => ({ ...c, healthyScalp: v }))}
                    />
                    <CheckItem
                        id="pregnant"
                        label="I am not pregnant or nursing, or I have consulted a doctor."
                        checked={checks.pregnant}
                        onChange={(v) => setChecks(c => ({ ...c, pregnant: v }))}
                    />
                    <CheckItem
                        id="simulation"
                        label="I understand this is a simulation for planning only, NOT a guarantee."
                        checked={checks.simulationOnly}
                        onChange={(v) => setChecks(c => ({ ...c, simulationOnly: v }))}
                    />
                </div>

                <DialogFooter className="mt-6">
                    <Button
                        onClick={onConfirm}
                        disabled={!canProceed}
                        className="w-full bg-[#f49d25] hover:bg-[#d88920] text-white font-bold rounded-xl h-12"
                    >
                        I'm Ready to Simulate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function CheckItem({ id, label, checked, onChange }: { id: string, label: string, checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
            <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(!!v)} />
            <label htmlFor={id} className="text-[12px] leading-snug font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
                {label}
            </label>
        </div>
    );
}
