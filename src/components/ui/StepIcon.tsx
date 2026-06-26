import { Camera, Shield, Radio, Grid3x3, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  camera: Camera,
  shield: Shield,
  sensor: Radio,
  grid: Grid3x3,
};

export function StepIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Camera;
  return <Icon className={className} aria-hidden="true" />;
}
