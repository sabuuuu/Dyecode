import productsData from "../data/products.json";
import { calculateProductQuantity } from "./damage";
import type { HairLength, HairThickness } from "../types";

export interface Product {
    id: string;
    brand: string;
    shade: string;
    level: number;
    tone: string;
    type: string;
    price: number;
    where: string[];
    links: Record<string, string>;
    requiresDeveloper?: boolean;
    recommendedDeveloper?: number;
    volume?: number;
    size?: string;
}

export interface AftercareProduct {
    id: string;
    name: string;
    why: string;
    when: string;
    price: number;
    recommended: string[];
}

export interface ProductRecommendation {
    dye: Product;
    developer?: Product;
    quantity: { boxes: number; developerSize: string };
    totalCost: number;
    alternatives: Product[];
}

export function matchProducts(
    targetLevel: number,
    targetTone: string,
    hairLength: HairLength,
    hairThickness: HairThickness,
): ProductRecommendation | null {
    // Find matching dye products
    let matches = (productsData.products as unknown as Product[]).filter(p =>
        p.level === targetLevel && p.tone === targetTone
    );

    // Fallback to neutral if no specific tone match (common for DIY)
    if (matches.length === 0 && targetTone !== "neutral") {
        matches = (productsData.products as unknown as Product[]).filter(p =>
            p.level === targetLevel && p.tone === "neutral"
        );
    }

    if (matches.length === 0) return null;

    // Pick the first match as primary
    const primary = matches[0];
    const alternatives = matches.slice(1, 6); // Show more alternatives (up to 5)

    // Calculate quantity needed
    const { boxes, developer: devSize } = calculateProductQuantity(hairLength, hairThickness);

    // Find matching developer
    const developer = primary.requiresDeveloper
        ? (productsData.developers as unknown as Product[]).find(d =>
            d.brand === primary.brand &&
            d.volume === primary.recommendedDeveloper &&
            d.size === devSize
        ) || (productsData.developers as unknown as Product[]).find(d =>
            d.volume === primary.recommendedDeveloper &&
            d.size === devSize
        )
        : undefined;

    // Calculate total cost
    const dyeCost = primary.price * boxes;
    const devCost = developer ? developer.price : 0;
    const totalCost = dyeCost + devCost;

    return {
        dye: primary,
        developer,
        quantity: { boxes, developerSize: devSize },
        totalCost,
        alternatives
    };
}

export function getBleachProducts(
    bleachLifts: number,
    hairLength: HairLength,
    hairThickness: HairThickness
): ProductRecommendation | null {
    const bleachPowder = (productsData.products as unknown as Product[]).find(p => p.type === "bleach");
    const developer = (productsData.developers as unknown as Product[]).find(d => d.volume === 30); // Standard for bleach

    if (!bleachPowder) return null;

    const { boxes } = calculateProductQuantity(hairLength, hairThickness);
    const quantity = boxes * bleachLifts; // More product for multiple sessions

    return {
        dye: bleachPowder!,
        developer,
        quantity: { boxes: quantity, developerSize: "16oz" },
        totalCost: (bleachPowder!.price + (developer?.price || 0)) * bleachLifts,
        alternatives: []
    };
}

export function getAftercareProducts(): AftercareProduct[] {
    return productsData.aftercare as AftercareProduct[];
}
