import React, { useEffect, useMemo, useState } from "react";

// Single‑file React SPA for the Chooose exercise — **pure JavaScript** (no TypeScript).
// Styling: Tailwind utility classes (optional). Works without Tailwind, just less pretty.
// Persistence: localStorage. No backend/API.
// Scope: 5 key fields likely relevant to a Partnership config.
// Fields:
//  - name (string)
//  - customerType ("Airline" | "Corporate" | "Cargo")
//  - climatePortfolio (string)
//  - emissionsMethod ("ICAO_v1" | "DEFRA_2024" | "Proprietary_Sample")
//  - supportEmail (string)
//  - landingPage (URL) — optional demo field you can toggle off below

const SHOW_LANDING_PAGE = true;

export default function App() {
  const [partnerships, setPartnerships] = useLocalStorage(
    "chooose.partnerships",
    seedPartnerships
  );
  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState(
    partnerships.length ? partnerships[0].id : null
  );

  const selected = useMemo(
    () => partnerships.find((p) => p.id === selectedId) || null,
    [partnerships, selectedId]
  );

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return partnerships;
    return partnerships.filter(
      (p) =>
        p.name.toLowerCase().includes(f) ||
        p.customerType.toLowerCase().includes(f) ||
        p.climatePortfolio.toLowerCase().includes(f) ||
        p.emissionsMethod.toLowerCase().includes(f)
    );
  }, [filter, partnerships]);

  function createPartnership(input) {
    const id = cryptoId();
    const newP = { id, ...input };
    setPartnerships((prev) => [newP, ...prev]);
    setSelectedId(id);
  }

  function updatePartnership(id, patch) {
    setPartnerships((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function deletePartnership(id) {
    setPartnerships((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <h1 className="text-xl font-semibold tracking-tight">
            Chooose • Partnerships Mini‑Admin (JS)
          </h1>
          <div className="flex items-center gap-2">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search partnerships…"
              className="w-64 rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-4 md:grid-cols-3">
        {/* Create Panel */}
        <section className="md:col-span-1">
          <Card title="Create partnership">
            <CreateForm onCreate={createPartnership} />
          </Card>
          <Card title="Export JSON (all)">
            <JsonBlock data={partnerships} />
          </Card>
        </section>

        {/* List + Edit */}
        <section className="md:col-span-2">
          <Card title="Existing partnerships">
            {filtered.length === 0 ? (
              <EmptyState label="No partnerships match your search." />
            ) : (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={(selectedId === p.id ? "border-blue-500 ring-2 ring-blue-200 " : "") +
                      "rounded-2xl border p-4 text-left transition hover:shadow"}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-zinc-500">
                          {p.customerType} • {p.climatePortfolio} • {p.emissionsMethod}
                        </div>
                      </div>
                      <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs">
                        {p.supportEmail}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card title="Details & edit">
            {!selected ? (
              <EmptyState label="Select a partnership to view and edit settings." />
            ) : (
              <EditForm
                key={selected.id}
                value={selected}
                onChange={(patch) => updatePartnership(selected.id, patch)}
                onDelete={() => deletePartnership(selected.id)}
              />
            )}
          </Card>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-2 text-xs text-zinc-500">
        <p>
          Demo scope (~2–3h): localStorage, basic validation, JSON export, and a
          lightweight UI mirroring likely AM workflows (create → list → edit).
        </p>
      </footer>
    </div>
  );
}

// ————— Components —————
function Card({ title, children }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed p-8 text-sm text-zinc-500">
      {label}
    </div>
  );
}

function Labeled({ label, hint, children }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-zinc-700">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-zinc-500">{hint}</span>}
    </label>
  );
}

function InlineError({ msg }) {
  if (!msg) return null;
  return <p className="text-[11px] text-red-600">{msg}</p>;
}

function JsonBlock({ data }) {
  return (
    <pre className="max-h-72 overflow-auto rounded-xl bg-zinc-50 p-3 text-xs leading-relaxed">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

// ————— Forms —————
function CreateForm({ onCreate }) {
  const [form, setForm] = useState({
    name: "",
    customerType: "Airline",
    climatePortfolio: "Aviation – Balanced",
    emissionsMethod: "ICAO_v1",
    supportEmail: "",
    landingPage: SHOW_LANDING_PAGE ? "" : undefined,
  });

  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const result = validate(form);
    setErrors(result.errors);
    if (!result.valid) return;
    onCreate(form);
    setForm({
      name: "",
      customerType: "Airline",
      climatePortfolio: "Aviation – Balanced",
      emissionsMethod: "ICAO_v1",
      supportEmail: "",
      landingPage: SHOW_LANDING_PAGE ? "" : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <Labeled label="Name" hint="Human‑friendly label shown in admin UIs">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
          placeholder="e.g., Oceanic Air (Corporate)"
          required
        />
        <InlineError msg={errors.name || null} />
      </Labeled>

      <div className="grid grid-cols-2 gap-3">
        <Labeled label="Customer type">
          <select
            value={form.customerType}
            onChange={(e) => setForm({ ...form, customerType: e.target.value })}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
          >
            <option>Airline</option>
            <option>Corporate</option>
            <option>Cargo</option>
          </select>
        </Labeled>

        <Labeled label="Emissions method" hint="Example methodologies">
          <select
            value={form.emissionsMethod}
            onChange={(e) => setForm({ ...form, emissionsMethod: e.target.value })}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
          >
            <option value="ICAO_v1">ICAO_v1</option>
            <option value="DEFRA_2024">DEFRA_2024</option>
            <option value="Proprietary_Sample">Proprietary_Sample</option>
          </select>
        </Labeled>
      </div>

      <Labeled label="Climate portfolio" hint="Which set of climate solutions to expose">
        <select
          value={form.climatePortfolio}
          onChange={(e) => setForm({ ...form, climatePortfolio: e.target.value })}
          className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
        >
          <option>Aviation – Balanced</option>
          <option>Aviation – SAF‑Forward</option>
          <option>Aviation – Carbon Credits Only</option>
        </select>
      </Labeled>

      {SHOW_LANDING_PAGE && (
        <Labeled label="Landing page URL" hint="Public portal entry for customers">
          <input
            value={form.landingPage || ""}
            onChange={(e) => setForm({ ...form, landingPage: e.target.value })}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
            placeholder="https://partner.oceanicair.com/sustainability"
          />
          <InlineError msg={errors.landingPage || null} />
        </Labeled>
      )}

      <Labeled label="Support email" hint="Customer support contact shown in UI">
        <input
          value={form.supportEmail}
          onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
          className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
          placeholder="support@oceanicair.com"
          required
        />
        <InlineError msg={errors.supportEmail || null} />
      </Labeled>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700">
          Create partnership
        </button>
      </div>
    </form>
  );
}

function EditForm({ value, onChange, onDelete }) {
  const [form, setForm] = useState({ ...value });
  const [errors, setErrors] = useState({});

  useEffect(() => setForm({ ...value }), [value.id]);

  function handleSave(e) {
    e.preventDefault();
    const result = validate(form);
    setErrors(result.errors);
    if (!result.valid) return;
    onChange(form);
  }

  return (
    <form onSubmit={handleSave} className="grid gap-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Labeled label="Name">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
          />
          <InlineError msg={errors.name || null} />
        </Labeled>

        <Labeled label="Customer type">
          <select
            value={form.customerType}
            onChange={(e) => setForm({ ...form, customerType: e.target.value })}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
          >
            <option>Airline</option>
            <option>Corporate</option>
            <option>Cargo</option>
          </select>
        </Labeled>

        <Labeled label="Emissions method">
          <select
            value={form.emissionsMethod}
            onChange={(e) => setForm({ ...form, emissionsMethod: e.target.value })}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
          >
            <option value="ICAO_v1">ICAO_v1</option>
            <option value="DEFRA_2024">DEFRA_2024</option>
            <option value="Proprietary_Sample">Proprietary_Sample</option>
          </select>
        </Labeled>

        <Labeled label="Climate portfolio">
          <select
            value={form.climatePortfolio}
            onChange={(e) => setForm({ ...form, climatePortfolio: e.target.value })}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
          >
            <option>Aviation – Balanced</option>
            <option>Aviation – SAF‑Forward</option>
            <option>Aviation – Carbon Credits Only</option>
          </select>
        </Labeled>

        {SHOW_LANDING_PAGE && (
          <Labeled label="Landing page URL">
            <input
              value={form.landingPage || ""}
              onChange={(e) => setForm({ ...form, landingPage: e.target.value })}
              className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
            />
            <InlineError msg={errors.landingPage || null} />
          </Labeled>
        )}

        <Labeled label="Support email">
          <input
            value={form.supportEmail}
            onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
            className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring"
          />
          <InlineError msg={errors.supportEmail || null} />
        </Labeled>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
        >
          Delete
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...value })}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
          >
            Save changes
          </button>
        </div>
      </div>

      <details className="rounded-xl border bg-zinc-50 p-3 text-sm open:shadow-inner">
        <summary className="cursor-pointer select-none text-xs font-semibold text-zinc-700">Raw JSON (this partnership)</summary>
        <JsonBlock data={form} />
      </details>
    </form>
  );
}

// ————— Validation & Utils —————
function validate(p) {
  const errs = {};
  if (!p.name || !p.name.trim()) errs.name = "Name is required.";
  if (!isValidEmail(p.supportEmail)) errs.supportEmail = "Enter a valid email.";
  if (SHOW_LANDING_PAGE && p.landingPage && !isValidUrl(p.landingPage)) {
    errs.landingPage = "Enter a valid URL (https://…) or leave blank.";
  }
  return { valid: Object.keys(errs).length === 0, errors: errs };
}

function cryptoId() {
  return Math.random().toString(36).slice(2, 10);
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidUrl(v) {
  try {
    const u = new URL(v);
    return ["http:", "https:"].includes(u.protocol);
  } catch (_) {
    return false;
  }
}

function seedPartnerships() {
  return [
    {
      id: cryptoId(),
      name: "SkyWay Airlines (Corporate)",
      customerType: "Airline",
      climatePortfolio: "Aviation – SAF‑Forward",
      emissionsMethod: "ICAO_v1",
      supportEmail: "support@skywayair.com",
      landingPage: "https://portal.skywayair.com/sustainability",
    },
    {
      id: cryptoId(),
      name: "CargoBridge – EMEA",
      customerType: "Cargo",
      climatePortfolio: "Aviation – Carbon Credits Only",
      emissionsMethod: "DEFRA_2024",
      supportEmail: "help@cargobridge.io",
      landingPage: "https://cargobridge.io/green",
    },
  ];
}

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return typeof initial === "function" ? initial() : initial;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState];
}
