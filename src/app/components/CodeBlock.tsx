"use client";

import React, { useEffect, useRef, useState } from "react";
import hljs from "highlight.js/lib/core";
import { registerHighlightLanguages } from "../utils/registerHighlightLanguages";
import "highlight.js/styles/atom-one-dark.css";

// Initialize highlight.js with our registered languages
const hljsInstance = registerHighlightLanguages();

interface CodeBlockProps {
  className?: string;
  children?: any;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ className, children }) => {
  const preRef = useRef<HTMLPreElement>(null);
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
  }; // Use state to store highlighted code
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  // Generate highlighted HTML when component mounts or code/language changes
  useEffect(() => {
    // Make sure we have something to highlight
    if (!code) {
      setHighlightedCode("");
      return;
    }

    if (language) {
      try {
        // Try to highlight with specified language
        const highlighted = hljsInstance.highlight(code, { language }).value;
        setHighlightedCode(highlighted);
      } catch (error) {
        console.warn(`Failed to highlight with language: ${language}`, error);
        // Fallback if language not supported
        setHighlightedCode(hljsInstance.highlightAuto(code).value);
      }
    } else {
      // Auto-detect language if not specified
      setHighlightedCode(hljsInstance.highlightAuto(code).value);
    }

    // Debug to help troubleshoot
    console.log(`Highlighting code with language: ${language || "auto"}`);
  }, [code, language]);

  return (
    <div className="relative group my-4">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Másolás a vágólapra"
      >
        {copied ? "Másolva!" : "Másolás"}
      </button>
      <pre ref={preRef} className="rounded-md overflow-x-auto bg-gray-900 p-4">
        <code
          className={language ? `hljs language-${language}` : "hljs"}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
};

export default CodeBlock;
