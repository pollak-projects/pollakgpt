"use client";

import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import registerHighlightLanguages from "../utils/registerHighlightLanguages";
import "highlight.js/styles/atom-one-dark.css";

// Register languages
registerHighlightLanguages();

interface CodeBlockProps {
  className?: string;
  children?: any;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ className, children }) => {
  const codeRef = useRef<HTMLElement>(null);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const code = String(children || "").replace(/\n$/, "");

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className="relative group my-4">
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Másolás a vágólapra"
      >
        Másolás
      </button>
      <pre className="rounded-md overflow-x-auto bg-gray-900 p-4">
        <code ref={codeRef} className={language ? `language-${language}` : ""}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
