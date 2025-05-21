"use client";

import React, { useState, useEffect, useRef } from "react";
import Prism from "prismjs";

// Import Prism CSS
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

// Import additional languages
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-go";

// Import plugins
import "prismjs/plugins/line-numbers/prism-line-numbers";

interface DirectPrismCodeProps {
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
}

const DirectPrismCode: React.FC<DirectPrismCodeProps> = ({
  className,
  children,
  inline,
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  // Extract language from className if available
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  // Clean up code string
  const code = String(children || "").replace(/\n$/, "");

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Map common language aliases to their proper names for Prism
  const languageMap: { [key: string]: string } = {
    js: "javascript",
    py: "python",
    ts: "typescript",
    sh: "bash",
    yml: "yaml",
    cs: "csharp",
    "c++": "cpp",
    html: "markup",
    xml: "markup",
  };

  // Use the mapped language or original if no mapping exists
  const prismLanguage = languageMap[language] || language || "javascript";

  // Add line numbers class if code has multiple lines
  const hasMultipleLines = code.split("\n").length > 3;
  const codeClasses = [
    prismLanguage ? `language-${prismLanguage}` : "",
    hasMultipleLines ? "line-numbers" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Highlight code when component mounts or code/language changes
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, prismLanguage]);
  // If it's inline code or the code is shorter than 30 characters, render a simpler version
  if (inline || code.length < 30) {
    return (
      <code
        className={`bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono`}
      >
        {children}
      </code>
    );
  }
  return (
    <div className="relative group mt-1 mb-4">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Másolás a vágólapra"
      >
        {copied ? "Másolva!" : "Másolás"}
      </button>
      <div className="rounded-md overflow-hidden">
        {language && (
          <div className="bg-gray-800 text-xs text-gray-400 px-4 py-1 border-b border-gray-700">
            {language}
          </div>
        )}
        <pre
          className={hasMultipleLines ? "line-numbers" : ""}
          style={{
            margin: 0,
            padding: "1rem",
            background: "#282c34",
            fontSize: "0.875rem",
            borderRadius: language ? "0 0 0.375rem 0.375rem" : "0.375rem",
          }}
        >
          <code ref={codeRef} className={codeClasses}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default DirectPrismCode;
