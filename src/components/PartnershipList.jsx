import React from "react";
import Tag from "./Tag.jsx";

function ListItem({ p, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(p.id)}
      className={`w-full text-left px-3 py-3 rounded-xl border mb-2 hover:bg-gray-50 transition ${
        selected ? "border-black bg-gray-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium truncate">{p.name}</div>
        <Tag>{p.currency}</Tag>
      </div>
      <div className="text-xs text-gray-500 truncate mt-1">{p.portalUrl}</div>
      {p.instantBilling && (
        <div className="mt-1 text-[10px] inline-flex px-2 py-0.5 rounded-full bg-green-100 text-green-800">
          Instant billing
        </div>
      )}
    </button>
  );
}

export default function PartnershipList({ items, selectedId, onSelect, onSearch }) {
  return (
    <aside className="w-full lg:w-1/3 xl:w-1/4 p-4 border-r bg-white">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search partnerships..."
          className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="max-h-[70vh] overflow-auto pr-1">
        {items.length === 0 ? (
          <div className="text-sm text-gray-500">No partnerships.</div>
        ) : (
          items.map((p) => (
            <ListItem key={p.id} p={p} selected={p.id === selectedId} onSelect={onSelect} />
          ))
        )}
      </div>
    </aside>
  );
}
