import { useMemo, useState } from "react";
import { useBundleStore } from "../../store/bundleStore";
import {
  buildSelectedLines,
  computeTotals,
  formatPrice,
} from "../../lib/Pricing";
import type { ReviewCategory } from "../../types";
import { ReviewLine } from "./ReviewLine";
import { PriceSummary } from "./PriceSummary";

const CATEGORY_ORDER: ReviewCategory[] = [
  "cameras",
  "sensors",
  "accessories",
  "plan",
];

const CATEGORY_LABELS: Record<ReviewCategory, string> = {
  cameras: "Cameras",
  sensors: "Sensors",
  accessories: "Accessories",
  plan: "Home Monitoring Plan",
};

export function ReviewPanel() {
  const data = useBundleStore((s) => s.data);
  const quantities = useBundleStore((s) => s.quantities);
  const saveSystem = useBundleStore((s) => s.saveSystem);
  const [justSaved, setJustSaved] = useState(false);

  const lines = useMemo(
    () => buildSelectedLines(data.products, quantities),
    [data.products, quantities],
  );
  const totals = useMemo(
    () => computeTotals(data, quantities),
    [data, quantities],
  );

  const groupedLines = useMemo(() => {
    const groups: Record<ReviewCategory, typeof lines> = {
      cameras: [],
      sensors: [],
      accessories: [],
      plan: [],
    };
    for (const line of lines) {
      groups[line.product.reviewCategory].push(line);
    }
    return groups;
  }, [lines]);

  function handleSave() {
    saveSystem();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  function handleCheckout() {
    window.alert("This is a prototype — checkout isn't implemented yet.");
  }

  return (
    <div className="rounded-2xl bg-surface-panel p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        Review
      </p>
      <h2 className="mt-1 text-xl font-bold text-gray-900">
        Your security system
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Review your personalized protection system designed to keep what matters
        most safe.
      </p>

      <div className="mt-4 divide-y divide-gray-200/70">
        {CATEGORY_ORDER.map((category) => {
          const categoryLines = groupedLines[category];
          if (categoryLines.length === 0) return null;
          return (
            <div key={category} className="py-2">
              <p className="pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {CATEGORY_LABELS[category]}
              </p>
              <div className="divide-y divide-gray-200/70">
                {categoryLines.map((line) => (
                  <ReviewLine
                    key={`${line.product.id}:${line.variantId}`}
                    line={line}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between py-2.5">
          <span className="text-sm text-gray-800">{data.shipping.label}</span>
          <div className="text-right text-sm">
            {totals.shippingIsFree && (
              <span className="mr-1.5 text-gray-400 line-through">
                {formatPrice(data.shipping.price)}
              </span>
            )}
            <span className="font-semibold text-success-600">
              {totals.shippingIsFree
                ? "FREE"
                : formatPrice(totals.shippingPrice)}
            </span>
          </div>
        </div>
      </div>

      <PriceSummary
        totals={totals}
        financingPerMonth={data.plan.financingPerMonth}
        onCheckout={handleCheckout}
        onSave={handleSave}
      />

      {justSaved && (
        <p
          className="mt-2 text-center text-sm font-medium text-success-600"
          role="status"
        >
          Saved! Your system will be here when you come back.
        </p>
      )}
    </div>
  );
}
