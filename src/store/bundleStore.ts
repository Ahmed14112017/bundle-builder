import { create } from "zustand";
import productsData from "../data/products.json";
import type { BundleData, Product, StepId, VariantQuantities } from "../types";

const data = productsData as BundleData;

const STORAGE_KEY = "bundle-builder:saved-system";

/** "default" is used as the variant key for products with no variants. */
function variantKeyFor(product: Product, explicitVariantId?: string): string {
  if (explicitVariantId) return explicitVariantId;
  return product.defaultVariantId ?? "default";
}

function buildInitialState() {
  const quantities: Record<string, VariantQuantities> = {};
  const activeVariant: Record<string, string> = {};

  for (const product of data.products) {
    quantities[product.id] = { ...(product.initialQuantities ?? {}) };
    activeVariant[product.id] = product.defaultVariantId ?? "default";
  }

  return { quantities, activeVariant };
}

interface SavedSnapshot {
  quantities: Record<string, VariantQuantities>;
  activeVariant: Record<string, string>;
  savedAt: string;
}

interface BundleStore {
  data: BundleData;
  quantities: Record<string, VariantQuantities>;
  activeVariant: Record<string, string>;
  expandedStep: StepId;
  hasSavedSystem: boolean;
  lastSavedAt: string | null;

  setActiveVariant: (productId: string, variantId: string) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  incrementQuantity: (
    productId: string,
    variantId: string,
    delta: number,
  ) => void;
  toggleStep: (stepId: StepId) => void;
  goToNextStep: (currentStepId: StepId) => void;
  saveSystem: () => void;
  loadSavedSystem: () => void;
  clearSavedSystem: () => void;
}

const STEP_ORDER: StepId[] = ["cameras", "plan", "sensors", "accessories"];

function readSnapshot(): SavedSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedSnapshot;
  } catch {
    return null;
  }
}

const initial = buildInitialState();

export const useBundleStore = create<BundleStore>((set, get) => ({
  data,
  quantities: initial.quantities,
  activeVariant: initial.activeVariant,
  expandedStep: "cameras",
  hasSavedSystem: readSnapshot() !== null,
  lastSavedAt: readSnapshot()?.savedAt ?? null,

  setActiveVariant: (productId, variantId) =>
    set((state) => ({
      activeVariant: { ...state.activeVariant, [productId]: variantId },
    })),

  setQuantity: (productId, variantId, quantity) =>
    set((state) => {
      const product = state.data.products.find((p) => p.id === productId);
      if (product?.locked) return state;

      const clamped = Math.max(0, quantity);
      const key = variantKeyFor(product!, variantId);
      const existing = state.quantities[productId] ?? {};
      return {
        quantities: {
          ...state.quantities,
          [productId]: { ...existing, [key]: clamped },
        },
      };
    }),

  incrementQuantity: (productId, variantId, delta) => {
    const state = get();
    const product = state.data.products.find((p) => p.id === productId);
    if (!product || product.locked) return;
    const key = variantKeyFor(product, variantId);
    const current = state.quantities[productId]?.[key] ?? 0;
    state.setQuantity(productId, key, current + delta);
  },

  toggleStep: (stepId) =>
    set((state) => ({
      expandedStep: state.expandedStep === stepId ? state.expandedStep : stepId,
    })),

  goToNextStep: (currentStepId) =>
    set(() => {
      const idx = STEP_ORDER.indexOf(currentStepId);
      const next = STEP_ORDER[idx + 1] ?? currentStepId;
      return { expandedStep: next };
    }),

  saveSystem: () => {
    const state = get();
    const snapshot: SavedSnapshot = {
      quantities: state.quantities,
      activeVariant: state.activeVariant,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      set({ hasSavedSystem: true, lastSavedAt: snapshot.savedAt });
    } catch {
      // localStorage unavailable (private mode, quota, etc.) - fail silently in UI,
      // the rest of the app still works without persistence.
    }
  },

  loadSavedSystem: () => {
    const snapshot = readSnapshot();
    if (!snapshot) return;
    set({
      quantities: snapshot.quantities,
      activeVariant: snapshot.activeVariant,
      lastSavedAt: snapshot.savedAt,
      hasSavedSystem: true,
    });
  },

  clearSavedSystem: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    set({ hasSavedSystem: false, lastSavedAt: null });
  },
}));

/** Call once at app startup to restore a previously saved system, if any. */
export function hydrateFromStorage() {
  const snapshot = readSnapshot();
  if (!snapshot) return;
  useBundleStore.setState({
    quantities: snapshot.quantities,
    activeVariant: snapshot.activeVariant,
    lastSavedAt: snapshot.savedAt,
    hasSavedSystem: true,
  });
}
