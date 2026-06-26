import { useMemo } from "react";
import type { Product } from "../../types";
import { useBundleStore } from "../../store/bundleStore";
import { Badge } from "../ui/Badge";
import { QuantityStepper } from "../ui/QuantityStepper";
import { VariantSelector } from "./VariantSelector";
import { formatPrice } from "../../lib/Pricing";

export function ProductCard({ product }: { product: Product }) {
  const quantities = useBundleStore((s) => s.quantities[product.id]);
  const activeVariantId = useBundleStore(
    (s) => s.activeVariant[product.id] ?? product.defaultVariantId ?? "default",
  );
  const setActiveVariant = useBundleStore((s) => s.setActiveVariant);
  const setQuantity = useBundleStore((s) => s.setQuantity);

  const variantKey = product.variants ? activeVariantId : "default";
  const currentQty = quantities?.[variantKey] ?? 0;
  const isSelected = currentQty > 0;

  // "Selected" border applies if ANY variant of this product has qty > 0.
  const anySelected = useMemo(
    () => Object.values(quantities ?? {}).some((q) => q > 0),
    [quantities],
  );

  return (
    <div
      className={`flex flex-col rounded-xl border-2 bg-white p-4 transition-colors ${
        anySelected || isSelected ? "border-brand-500" : "border-gray-200"
      }`}
    >
      <div className="relative mb-3">
        {product.badge && (
          <div className="absolute -top-1 -left-1 z-10">
            <Badge variant="brand">{product.badge}</Badge>
          </div>
        )}
        <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="h-28 w-28 object-contain"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
        </div>
      </div>

      <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
      {product.description && (
        <p className="mt-1 text-sm text-gray-500">
          {product.description}{" "}
          {product.learnMoreUrl && (
            <a
              href={product.learnMoreUrl}
              className="font-medium text-brand-600 underline hover:text-brand-700"
            >
              Learn More
            </a>
          )}
        </p>
      )}

      {product.variants && product.variants.length > 0 && (
        <div className="mt-3">
          <VariantSelector
            variants={product.variants}
            activeVariantId={activeVariantId}
            onSelect={(variantId: string) =>
              setActiveVariant(product.id, variantId)
            }
          />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <QuantityStepper
          quantity={currentQty}
          onChange={(next) => setQuantity(product.id, variantKey, next)}
          ariaLabel={`${product.name}${
            product.variants ? ` ${activeVariantId}` : ""
          } quantity`}
        />
        <div className="text-right">
          {product.oldprice && (
            <span className="mr-1.5 text-sm text-gray-400 line-through">
              {formatPrice(product.oldprice)}
            </span>
          )}
          <span className="font-semibold text-brand-700">
            {formatPrice(product.price)}
            {product.priceUnit === "month" && (
              <span className="text-sm font-normal text-gray-500">/mo</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
