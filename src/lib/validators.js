export function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (_) {
    return false;
  }
}

export function validatePartnerDraft(draft) {
  const errors = {};
  if (!draft?.name || draft.name.trim().length < 2) errors.name = "Name is required";
  if (!draft?.currency) errors.currency = "Currency is required";
  if (!draft?.portalUrl || !isValidUrl(draft.portalUrl)) errors.portalUrl = "Valid URL is required";
  const p = Number(draft?.itemFeePercent);
  if (isNaN(p) || p < 0 || p > 100) errors.itemFeePercent = "Enter a percentage between 0 and 100";
  return { valid: Object.keys(errors).length === 0, errors };
}