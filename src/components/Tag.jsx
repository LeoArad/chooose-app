import React from "react";
export default function Tag({ children }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border">{children}</span>
  );
}