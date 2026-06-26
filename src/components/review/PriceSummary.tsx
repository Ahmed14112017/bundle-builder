import type { BundleTotals } from "../../lib/Pricing";
import { formatPrice } from "../../lib/Pricing";

export function PriceSummary({
  totals,
  financingPerMonth,
  onCheckout,
  onSave,
}: {
  totals: BundleTotals;
  financingPerMonth: number;
  onCheckout: () => void;
  onSave: () => void;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-3">
        <div className="flex items-center gap-2">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-center text-[9px] font-bold leading-tight text-white"
            aria-hidden="true"
          >
            100%
          </div>
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-gray-900">
              30-day hassle-free returns.{" "}
            </span>
            If you're not totally in love with the product, we will refund you
            100%.
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700">
          as low as {formatPrice(financingPerMonth)}/mo
        </span>
        <div className="text-right">
          {totals.grandCompareAtTotal > totals.grandTotal && (
            <span className="mr-1.5 text-gray-400 line-through">
              {formatPrice(totals.grandCompareAtTotal)}
            </span>
          )}
          <span className="text-2xl font-bold text-brand-700">
            {formatPrice(totals.grandTotal)}
          </span>
        </div>
      </div>

      {totals.savings > 0 && (
        <p className="mt-1.5 text-right text-sm font-medium text-success-600">
          Congrats! You're saving {formatPrice(totals.savings)} on your security
          bundle!
        </p>
      )}

      <button
        type="button"
        onClick={onCheckout}
        className="mt-4 w-full rounded-xl bg-brand-600 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Checkout
      </button>

      <button
        type="button"
        onClick={onSave}
        className="mt-3 block w-full text-center text-sm font-medium text-gray-700 underline hover:text-brand-600"
      >
        Save my system for later
      </button>
    </div>
  );
}
