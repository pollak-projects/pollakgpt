"use client";

import React from "react";

interface PrismInlineCodeProps {
  children?: any;
}

const PrismInlineCode: React.FC<PrismInlineCodeProps> = ({ children }) => {
  // Clean up code string
  const content = String(children || "");

  // Determine if this is likely a code snippet or just a simple term reference
  const isSimpleReference = content.length < 30 && !content.includes("\n");

  return (
    <code
      className={`${
        isSimpleReference
          ? "bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono"
          : "block bg-gray-800 p-3 rounded text-sm font-mono overflow-x-auto my-2"
      }`}
    >
      {children}
    </code>
  );
};

export default PrismInlineCode;
