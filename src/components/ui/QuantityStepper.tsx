interface QuantityStepperProps {
  quantity: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  ariaLabel: string;
}

export function QuantityStepper({
  quantity,
  onChange,
  min = 0,
  max = 99,
  disabled = false,
  size = "md",
  ariaLabel,
}: QuantityStepperProps) {
  const dim = size === "sm" ? "h-7 w-7 text-sm" : "h-8 w-8 text-base";
  const gap = size === "sm" ? "gap-2" : "gap-3";

  return (
    <div
      className={`inline-flex items-center ${gap}`}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        disabled={disabled || quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className={`${dim} flex items-center justify-center rounded-md border border-gray-300 text-gray-600 transition-colors hover:border-brand-400 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label={`Decrease ${ariaLabel}`}
      >
        −
      </button>
      <span className="min-w-[1.5ch] text-center font-medium tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        disabled={disabled || quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className={`${dim} flex items-center justify-center rounded-md border border-gray-300 text-gray-600 transition-colors hover:border-brand-400 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label={`Increase ${ariaLabel}`}
      >
        +
      </button>
    </div>
  );
}
