import { SEED_PARTNERSHIPS } from "../data/seeds.js";

const STORAGE_KEY = "chooose.partnerships.v1";

export function loadPartnerships() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_PARTNERSHIPS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((p, idx) => ({
        id: p.id || `local-${idx}`,
        name: p.name || "Untitled",
        currency: p.currency || "USD",
        portalUrl: p.portalUrl || "",
        features: Array.isArray(p.features) ? p.features : [],
        itemFeePercent:
          typeof p.itemFeePercent === "number" && !isNaN(p.itemFeePercent)
            ? p.itemFeePercent
            : 0,
        instantBilling: Boolean(p.instantBilling),
      }));
    }
    return SEED_PARTNERSHIPS;
  } catch (e) {
    console.warn("Failed to load partnerships, using seed.", e);
    return SEED_PARTNERSHIPS;
  }
}

export function savePartnerships(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
