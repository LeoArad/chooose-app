import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import PartnershipList from "./components/PartnershipList.jsx";
import PartnershipDetails from "./components/PartnershipDetails.jsx";
import { loadPartnerships, savePartnerships } from "./lib/storage.js";

export default function App() {
  const [all, setAll] = useState(() => loadPartnerships());
  const [selection, setSelection] = useState(all[0]?.id || null);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    savePartnerships(all);
  }, [all]);

  const selected = useMemo(
    () => all.find((p) => p.id === selection) || null,
    [all, selection]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((p) =>
      [p.name, p.currency, p.portalUrl].some((x) =>
        String(x || "").toLowerCase().includes(q)
      )
    );
  }, [all, query]);

  const startCreate = () => {
    const tmp = {
      id: `local-${Date.now()}`,
      name: "",
      currency: "USD",
      portalUrl: "",
      features: [],
      itemFeePercent: 0,
      instantBilling: false,
      createdAt: Date.now(),
    };
    setAll((prev) => [tmp, ...prev]);
    setSelection(tmp.id);
    setEditingId(tmp.id);
  };

  const startEdit = (id) => setEditingId(id);

  const cancelEdit = () => {
    // If new and empty, remove; otherwise just exit edit mode
    setAll((prev) => {
      const cur = prev.find((p) => p.id === editingId);
      const isNewAndEmpty = cur && !cur.name && !cur.portalUrl;
      if (isNewAndEmpty) {
        return prev.filter((p) => p.id !== editingId);
      }
      return prev;
    });
    setEditingId(null);
  };

  const save = (draft) => {
    setAll((prev) => prev.map((p) => (p.id === draft.id ? draft : p)));
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header onCreate={startCreate} />

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
        <PartnershipList
          items={filtered}
          selectedId={selection}
          onSelect={(id) => setSelection(id)}
          onSearch={setQuery}
        />

        <div className="lg:col-span-2 xl:col-span-3">
          <div className="flex items-center justify-between px-6 pt-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Details</h2>
              {selected && (
                <>
                  {editingId === selected.id ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                      Editing
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200">
                      Read-only
                    </span>
                  )}
                </>
              )}
            </div>
            <div>
              {selected && (
                <>
                  {editingId === selected.id ? (
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-2 rounded-2xl border bg-white hover:bg-gray-50"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="px-3 py-2 rounded-2xl shadow bg-black text-white hover:opacity-90"
                      onClick={() => startEdit(selected.id)}
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <PartnershipDetails
            value={selected}
            editing={editingId === selected?.id}
            onSave={save}
            onCancel={cancelEdit}
          />
        </div>
      </div>

      <footer className="p-6 text-center text-xs text-gray-500">
        Demo only — no backend. Data persists in your browser.
      </footer>
    </div>
  );
}
