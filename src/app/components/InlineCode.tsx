"use client";

import React from "react";

interface InlineCodeProps {
  children: React.ReactNode;
}

// Component for rendering inline code (text between backticks)
// This version doesn't apply full code block styling to simple backtick-wrapped text
const InlineCode: React.FC<InlineCodeProps> = ({ children }) => {
  // Simple check to determine if we should render as plain text or code
  const content = String(children || "");

  // If the content is very short or doesn't contain spaces,
  // assume it's a variable name or short reference and style it lightly
  const isSimpleReference = content.length < 20 && !content.includes("\n");

  return (
    <code
      className={`${
        isSimpleReference
          ? "bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono"
          : "block bg-gray-800 p-2 rounded text-sm font-mono overflow-x-auto"
      }`}
    >
      {children}
    </code>
  );
};

export default InlineCode;
