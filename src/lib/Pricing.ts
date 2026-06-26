import type { BundleData, Product, VariantQuantities } from "../types";

export interface SelectedLine {
  product: Product;
  variantId: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  unitCompareAt?: number;
  lineTotal: number;
  lineCompareAtTotal: number;
}

/** Total quantity across all variants of a product (used for the card stepper sum is per-variant, but "N selected" needs distinct-product counts). */
export function totalQuantityForProduct(
  quantities: VariantQuantities | undefined,
): number {
  if (!quantities) return 0;
  return Object.values(quantities).reduce((sum, q) => sum + q, 0);
}

/** Flatten every product+variant with qty > 0 into review-panel line items, grouped by category order. */
export function buildSelectedLines(
  products: Product[],
  quantitiesByProduct: Record<string, VariantQuantities>,
): SelectedLine[] {
  const lines: SelectedLine[] = [];

  for (const product of products) {
    const qtys = quantitiesByProduct[product.id] ?? {};
    const variantEntries = Object.entries(qtys).filter(([, qty]) => qty > 0);

    for (const [variantId, quantity] of variantEntries) {
      const variant = product.variants?.find((v) => v.id === variantId);
      lines.push({
        product,
        variantId,
        variantLabel: variant?.label,
        quantity,
        unitPrice: product.price,
        unitCompareAt: product.oldprice,
        lineTotal: round2(product.price * quantity),
        lineCompareAtTotal: round2(
          (product.oldprice ?? product.price) * quantity,
        ),
      });
    }
  }

  return lines;
}

/** Count of distinct products with at least one variant selected, for a given step's "N selected" badge. */
export function countSelectedInStep(
  products: Product[],
  stepId: string,
  quantitiesByProduct: Record<string, VariantQuantities>,
): number {
  return products.filter(
    (p) =>
      p.stepId === stepId &&
      totalQuantityForProduct(quantitiesByProduct[p.id]) > 0,
  ).length;
}

export interface BundleTotals {
  lines: SelectedLine[];
  subtotal: number;
  compareAtSubtotal: number;
  shippingPrice: number;
  shippingIsFree: boolean;
  monthlyTotal: number;
  grandTotal: number;
  grandCompareAtTotal: number;
  savings: number;
}

export function computeTotals(
  data: BundleData,
  quantitiesByProduct: Record<string, VariantQuantities>,
): BundleTotals {
  const lines = buildSelectedLines(data.products, quantitiesByProduct);

  // One-time products (cameras, sensors, accessories) vs monthly plan lines.
  const oneTimeLines = lines.filter((l) => l.product.priceUnit !== "month");
  const monthlyLines = lines.filter((l) => l.product.priceUnit === "month");

  const subtotal = round2(
    oneTimeLines.reduce((sum, l) => sum + l.lineTotal, 0),
  );
  const compareAtSubtotal = round2(
    oneTimeLines.reduce((sum, l) => sum + l.lineCompareAtTotal, 0),
  );
  const monthlyTotal = round2(
    monthlyLines.reduce((sum, l) => sum + l.lineTotal, 0),
  );

  const shippingIsFree = data.shipping.freeOverride !== undefined;
  const shippingPrice = shippingIsFree
    ? (data.shipping.freeOverride ?? 0)
    : data.shipping.price;

  const grandTotal = round2(subtotal + shippingPrice);
  const grandCompareAtTotal = round2(compareAtSubtotal + data.shipping.price);
  const savings = round2(grandCompareAtTotal - grandTotal);

  return {
    lines,
    subtotal,
    compareAtSubtotal,
    shippingPrice,
    shippingIsFree,
    monthlyTotal,
    grandTotal,
    grandCompareAtTotal,
    savings,
  };
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}
