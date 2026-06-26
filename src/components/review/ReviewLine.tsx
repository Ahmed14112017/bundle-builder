import type { SelectedLine } from "../../lib/Pricing";
import { formatPrice } from "../../lib/Pricing";
import { QuantityStepper } from "../ui/QuantityStepper";
import { useBundleStore } from "../../store/bundleStore";

export function ReviewLine({ line }: { line: SelectedLine }) {
  const setQuantity = useBundleStore((s) => s.setQuantity);
  const {
    product,
    variantId,
    variantLabel,
    quantity,
    lineTotal,
    lineCompareAtTotal,
  } = line;

  const displayName = variantLabel
    ? `${product.name} (${variantLabel})`
    : product.name;

  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-8 w-8 object-contain"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
          }}
        />
      </div>
      <span className="flex-1 text-sm text-gray-800">{displayName}</span>
      <QuantityStepper
        size="sm"
        quantity={quantity}
        disabled={product.locked}
        onChange={(next) => setQuantity(product.id, variantId, next)}
        ariaLabel={`${displayName} quantity`}
      />
      <div className="w-20 text-right text-sm">
        {lineCompareAtTotal > lineTotal && (
          <div className="text-gray-400 line-through">
            {formatPrice(lineCompareAtTotal)}
          </div>
        )}
        <div
          className={
            lineTotal === 0
              ? "font-semibold text-success-600"
              : "font-medium text-gray-900"
          }
        >
          {lineTotal === 0 ? "FREE" : formatPrice(lineTotal)}
        </div>
      </div>
    </div>
  );
}
