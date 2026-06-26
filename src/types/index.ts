export type Productcategory = "cameras" | "plan" | "sensors" | "accessories";
export interface ProductVariant {
  id: string;
  label: string;
  swatch: string;
}
export type StepId = "cameras" | "plan" | "sensors" | "accessories";

export interface Product {
  id: string;
  stepId: StepId;
  Productcategory: Productcategory;
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
