export type Productcategory = "cameras" | "plan" | "sensors" | "accessories";
export interface ProductVariant {
  id: string;
  label: string;
  swatch: string;
}
export interface Product {
  id: string;
  Productcategory: Productcategory;
  name: string;
  description?: string;
  learnMoreUrl?: string;
  image: string;
  badge?: string;
  price: number;
  category: Productcategory;
  oldprice?: number;
  priceUnit?: "each" | "month";
  variants?: ProductVariant[];
  defaultVariantId?: string;
  initialQuantities?: Record<string, number>;
  locked?: boolean;
}
