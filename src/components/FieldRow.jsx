import React from "react";
export default function FieldRow({ label, children, required, hint }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}