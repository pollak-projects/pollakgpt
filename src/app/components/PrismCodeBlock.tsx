"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

// Import core Prism CSS
import "prismjs/themes/prism-tomorrow.css";

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
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
}

const PrismCodeBlock: React.FC<CodeBlockProps> = ({
  className,
  children,
  inline,
}) => {
  const [copied, setCopied] = useState(false);

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
    rb: "ruby",
    cs: "csharp",
    "c++": "cpp",
    md: "markdown",
    jsx: "jsx",
    tsx: "tsx",
    // Additional mappings
    html: "markup",
    xml: "markup",
    svg: "markup",
    mathml: "markup",
    ssml: "markup",
    atom: "markup",
    rss: "markup",
    css: "css",
    c: "c",
    cpp: "cpp",
    java: "java",
    rust: "rust",
    go: "go",
    markup: "markup",
    json: "json",
    yaml: "yaml",
    sql: "sql",
    bash: "bash",
    shell: "bash",
    powershell: "powershell",
  };

  // Use the mapped language or original if no mapping exists
  // If language can't be determined, use 'javascript' as a sensible default
  const prismLanguage = languageMap[language] || language || "javascript";

  console.log(
    `Highlighting code with language: ${language} → ${prismLanguage}`
  );

  // If it's inline code, render a simpler version
  if (inline) {
    return (
      <code
        className={`bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono`}
      >
        {children}
      </code>
    );
  }
  return (
    <div className="relative group my-4">
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
        <SyntaxHighlighter
          language={prismLanguage || "plaintext"}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            borderRadius: language ? "0 0 0.375rem 0.375rem" : "0.375rem",
            backgroundColor: "#1a1e24",
            fontSize: "0.875rem",
          }}
          showLineNumbers={code.split("\n").length > 5}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default PrismCodeBlock;
