import { useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Step } from "../../types";
import { useBundleStore } from "../../store/bundleStore";
import { countSelectedInStep } from "../../lib/Pricing";
import { StepIcon } from "../ui/StepIcon";
import { ProductCard } from "./ProductCard";

export function AccordionStep({ step }: { step: Step }) {
  const isExpanded = useBundleStore((s) => s.expandedStep === step.id);
  const toggleStep = useBundleStore((s) => s.toggleStep);
  const goToNextStep = useBundleStore((s) => s.goToNextStep);
  const allProducts = useBundleStore((s) => s.data.products);
  const quantities = useBundleStore((s) => s.quantities);

  const products = useMemo(
    () => allProducts.filter((p) => p.stepId === step.id),
    [allProducts, step.id],
  );

  const selectedCount = countSelectedInStep(products, step.id, quantities);

  return (
    <div className="border-b border-gray-200">
      <div className="px-1 pt-4 text-xs font-semibold tracking-wide text-gray-400">
        STEP {step.index} OF 4
      </div>
      <button
        type="button"
        onClick={() => toggleStep(step.id)}
        className="flex w-full items-center justify-between px-1 py-3"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
          <StepIcon name={step.icon} className="h-5 w-5 text-gray-700" />
          {step.title}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-brand-600">
          {selectedCount} selected
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
      </button>

      {isExpanded && (
        <div className="px-1 pb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {step.nextLabel && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => goToNextStep(step.id)}
                className="rounded-lg border-2 border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
              >
                {step.nextLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
