import { useBundleStore } from "../../store/bundleStore";
import { AccordionStep } from "./AccordionStep";

export function BuilderPanel() {
  const steps = useBundleStore((s) => s.data.steps);

  return (
    <div className="rounded-2xl bg-white">
      {steps.map((step) => (
        <AccordionStep key={step.id} step={step} />
      ))}
    </div>
  );
}
