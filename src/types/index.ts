export type StepId = "cameras" | "plan" | "sensors" | "accessories";

export type ReviewCategory = "cameras" | "plan" | "sensors" | "accessories";

export interface ProductVariant {
  id: string;
  label: string;
  swatch: string;
}

export interface Product {
  id: string;
  stepId: StepId;
  reviewCategory: ReviewCategory;
  name: string;
  description?: string;
  learnMoreUrl?: string;
  image: string;
  badge?: string;
  price: number;
  oldprice?: number;
  priceUnit?: "each" | "month";
  variants?: ProductVariant[];
  defaultVariantId?: string;

  initialQuantities?: Record<string, number>;
  locked?: boolean;
}

export interface Step {
  id: StepId;
  index: number;
  title: string;
  icon: string;
  nextLabel?: string;
}

export interface BundleData {
  steps: Step[];
  products: Product[];
  shipping: {
    label: string;
    price: number;
    freeOverride?: number;
  };
  plan: {
    financingPerMonth: number;
  };
}

export type VariantQuantities = Record<string, number>;

export interface BundleState {
  quantities: Record<string, VariantQuantities>;
  activeVariant: Record<string, string>;
  expandedStep: StepId;
}
