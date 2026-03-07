import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { matchProducts, getBleachProducts, getAftercareProducts, type ProductRecommendation } from "@/engine/productMatcher";
import type { HairState, SimulationResult } from "@/types";
import { ShoppingBag, ExternalLink, Scissors, CheckCircle2 } from "lucide-react";

interface Props {
    result: Extract<SimulationResult, { status: "success" }>;
    hairState: HairState;
}

export function ShoppingList({ result, hairState }: Props) {
    const dyeInput = result.appliedInput;
    const products = matchProducts(
        result.achievableLevel,
        dyeInput.targetTone,
        hairState.hairLength,
        hairState.hairThickness
    );

    const bleachProducts = dyeInput.bleachEnabled
        ? getBleachProducts(
            dyeInput.bleachLifts || 1,
            hairState.hairLength,
            hairState.hairThickness
        )
        : null;

    const aftercare = getAftercareProducts();

    if (!products && !bleachProducts) {
        return (
            <Card className="w-full max-w-2xl bg-zinc-50 dark:bg-zinc-900 shadow-none border-dashed">
                <CardContent className="pt-6 text-center">
                    <p className="text-sm text-zinc-500">No specific product matches found for this simulation. consult a professional for custom color mixing.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-4xl border-zinc-200 dark:border-white/5 shadow-sm rounded-[24px] overflow-hidden">
            <CardHeader className="bg-zinc-50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/5 px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f49d25] flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Shopping List</CardTitle>
                        <CardDescription className="text-xs">Everything you need to achieve this prediction</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-zinc-200 dark:divide-white/5">
                    {/* Section: Pre-Lightening */}
                    {bleachProducts && (
                        <div className="p-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f49d25] mb-6 flex items-center gap-2">
                                <span className="w-4 h-px bg-[#f49d25]"></span> Step 1: Pre-Lightening
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <ProductItem
                                    name={bleachProducts.dye.shade}
                                    brand={bleachProducts.dye.brand}
                                    quantity={`${bleachProducts.quantity.boxes}x unit(s)`}
                                    price={`$${bleachProducts.dye.price}`}
                                    links={bleachProducts.dye.links}
                                />
                                {bleachProducts.developer && (
                                    <ProductItem
                                        name={`${bleachProducts.developer.volume} Vol Developer`}
                                        brand={bleachProducts.developer.brand}
                                        quantity={`1x ${bleachProducts.developer.size}`}
                                        price={`$${bleachProducts.developer.price}`}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Section: Color Application */}
                    {products && (
                        <div className="p-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f49d25] mb-6 flex items-center gap-2">
                                <span className="w-4 h-px bg-[#f49d25]"></span> {bleachProducts ? "Step 2: Color Application" : "Color Application"}
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <ProductItem
                                    name={products.dye.shade}
                                    brand={products.dye.brand}
                                    quantity={`${products.quantity.boxes}x box(es)`}
                                    price={`$${products.dye.price}`}
                                    links={products.dye.links}
                                />
                                {products.developer && (
                                    <ProductItem
                                        name={`${products.developer.volume} Vol Developer`}
                                        brand={products.developer.brand}
                                        quantity={`1x ${products.developer.size}`}
                                        price={`$${products.developer.price}`}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Section: Aftercare */}
                    <div className="p-8 bg-zinc-50/50 dark:bg-black/20">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
                            <span className="w-4 h-px bg-zinc-500"></span> Essential Aftercare
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {aftercare.map(item => (
                                <div key={item.id} className="flex flex-col p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.name}</span>
                                        <span className="text-xs font-bold text-zinc-500">${item.price}</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 mb-3">{item.why}</p>
                                    <div className="mt-auto flex items-center gap-2 text-[9px] font-bold uppercase tracking-tight text-zinc-400">
                                        <CheckCircle2 className="w-3 h-3 text-[#f49d25]" />
                                        {item.when}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section: Tools */}
                    <div className="p-8">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
                            <span className="w-4 h-px bg-zinc-500"></span> Tools Needed
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {["Gloves", "Mixing bowl", "Brush", "Hair clips", "Timer", "Old towel"].map(tool => (
                                <div key={tool} className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5 flex items-center gap-2">
                                    <Scissors className="w-3 h-3" />
                                    {tool}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer: Summary */}
                <div className="p-8 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Estimated Total Cost</p>
                            <p className="text-2xl font-black">${((products?.totalCost || 0) + (bleachProducts?.totalCost || 0) + 45).toFixed(2)}</p>
                        </div>
                        <div className="text-right sm:text-left">
                            <p className="text-xs opacity-80 mb-1">Includes color, dev, aftercare, and essential tools.</p>
                            <p className="text-[10px] font-medium opacity-60 italic">*Prices vary by retailer and location.</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ProductItem({ name, brand, quantity, price, links }: { name: string, brand: string, quantity: string, price: string, links?: Record<string, string> }) {
    return (
        <div className="group flex flex-col p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/5 hover:border-[#f49d25]/30 transition-colors">
            <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-[#f49d25] uppercase tracking-wide">{brand}</span>
                <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">{price}</span>
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 leading-tight">{name}</h4>
            <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-medium text-zinc-500">{quantity}</span>
                {links && (
                    <div className="flex gap-2">
                        {Object.entries(links).map(([site, url]) => (
                            <a
                                key={site}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-[#f49d25] transition-colors"
                                title={`Buy on ${site}`}
                            >
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
