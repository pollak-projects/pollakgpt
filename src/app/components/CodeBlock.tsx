"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  className?: string;
  children?: any;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ className, children }) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";

  const code = String(children || "").replace(/\n$/, "");

  return (
    <div className="relative group my-4">
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Másolás a vágólapra"
      >
        Másolás
      </button>
      <SyntaxHighlighter
        style={tomorrow}
        language={language}
        className="rounded-md overflow-hidden"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
