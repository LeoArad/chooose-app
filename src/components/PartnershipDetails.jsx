import React, { useEffect, useState } from "react";
import FieldRow from "./FieldRow.jsx";
import Tag from "./Tag.jsx";
import { FEATURE_OPTIONS } from "../data/constants.js";
import { isValidUrl, validatePartnerDraft } from "../lib/validators.js";

export default function PartnershipDetails({ value, editing, onSave, onCancel }) {
  const [draft, setDraft] = useState(value);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setDraft(value);
    setErrors({});
  }, [value, editing]);

  if (!value) return <section className="flex-1 p-6 text-gray-500">Select a partnership to view details.</section>;

  const onSubmit = () => {
    const { valid, errors: e } = validatePartnerDraft(draft);
    setErrors(e);
    if (!valid) return;
    onSave({ ...draft, name: draft.name.trim(), itemFeePercent: Number(draft.itemFeePercent), lastUpdate: Date.now() });
  };

  const readonly = !editing;

  return (
    <section className="flex-1 p-6">
      <div className="space-y-6">
        {/* Summary */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{value.name}</h2>
              <a href={value.portalUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 break-all">
                {value.portalUrl}
              </a>
              <div className="mt-2 flex flex-wrap gap-2">
                <Tag>{value.currency}</Tag>
                {value.instantBilling && <Tag>Instant billing</Tag>}
                {Array.isArray(value.features) && value.features.length > 0 && (
                  <Tag>{value.features.length} feature(s)</Tag>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editable form */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Settings</h3>
            {readonly ? (
              <div className="text-sm text-gray-500">Read-only</div>
            ) : (
              <div className="text-sm text-gray-500">Editing</div>
            )}
          </div>

          <FieldRow label="Name" required>
            <input
              type="text"
              value={draft?.name || ""}
              disabled={readonly}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-400 focus:ring-red-400" : "focus:ring-black"
              }`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </FieldRow>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldRow label="Currency" required>
              <select
                value={draft?.currency || ""}
                disabled={readonly}
                onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))}
                className={`w-full px-3 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                  errors.currency ? "border-red-400 focus:ring-red-400" : "focus:ring-black"
                }`}
              >
                <option value="" disabled>
                  Select currency
                </option>
                {["USD", "EUR", "GBP"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.currency && <p className="text-xs text-red-600 mt-1">{errors.currency}</p>}
            </FieldRow>

            <FieldRow label="Item fee %" hint="0–100">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={draft?.itemFeePercent ?? 0}
                disabled={readonly}
                onChange={(e) => setDraft((d) => ({ ...d, itemFeePercent: e.target.value }))}
                className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${
                  errors.itemFeePercent ? "border-red-400 focus:ring-red-400" : "focus:ring-black"
                }`}
              />
              {errors.itemFeePercent && (
                <p className="text-xs text-red-600 mt-1">{errors.itemFeePercent}</p>
              )}
            </FieldRow>
          </div>

          <FieldRow label="Portal URL" required>
            <input
              type="url"
              value={draft?.portalUrl || ""}
              disabled={readonly}
              onChange={(e) => setDraft((d) => ({ ...d, portalUrl: e.target.value }))}
              placeholder="https://example.portal.chooose.today"
              className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 ${
                errors.portalUrl ? "border-red-400 focus:ring-red-400" : "focus:ring-black"
              }`}
            />
            {errors.portalUrl && <p className="text-xs text-red-600 mt-1">{errors.portalUrl}</p>}
          </FieldRow>

          <FieldRow label="Portal features">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {FEATURE_OPTIONS.map((f) => {
                const checked = draft?.features?.includes(f);
                return (
                  <label
                    key={f}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                      checked ? "border-black" : "border-gray-200"
                    } ${readonly ? "opacity-60" : ""}`}
                  >
                    <input
                      type="checkbox"
                      disabled={readonly}
                      checked={!!checked}
                      onChange={(e) => {
                        const isOn = e.target.checked;
                        setDraft((d) => {
                          const base = new Set(d.features || []);
                          if (isOn) base.add(f);
                          else base.delete(f);
                          return { ...d, features: Array.from(base) };
                        });
                      }}
                    />
                    <span className="text-sm">{f}</span>
                  </label>
                );
              })}
            </div>
          </FieldRow>

          <FieldRow label="Instant billing (SAF demo)">
            <label className={`inline-flex items-center gap-2 ${readonly ? "opacity-60" : ""}`}>
              <input
                type="checkbox"
                disabled={readonly}
                checked={!!draft?.instantBilling}
                onChange={(e) => setDraft((d) => ({ ...d, instantBilling: e.target.checked }))}
              />
              <span className="text-sm">Enable for this partnership</span>
            </label>
          </FieldRow>

          <div className="flex items-center justify-end gap-2 pt-2">
            {readonly ? null : (
              <>
                <button onClick={onCancel} className="px-4 py-2 rounded-2xl border bg-white hover:bg-gray-50">Cancel</button>
                <button onClick={onSubmit} className="px-4 py-2 rounded-2xl shadow bg-black text-white hover:opacity-90">Save changes</button>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-medium mb-2">Context</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Portfolios (e.g., Sustainable Aviation Fuel / SAF) link to partnerships behind the scenes. This MVP surfaces key settings only.</li>
            <li>All changes are saved locally in your browser (localStorage) for demo purposes.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}