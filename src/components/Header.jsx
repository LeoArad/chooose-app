import React from "react";

export default function Header({ onCreate }) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-bold">Partnership Manager</h1>
        <p className="text-sm text-gray-500">Create, view, and edit partnerships (MVP demo)</p>
      </div>
      <button
        onClick={onCreate}
        className="px-4 py-2 rounded-2xl shadow bg-black text-white hover:opacity-90"
      >
        + New Partnership
      </button>
    </header>
  );
}