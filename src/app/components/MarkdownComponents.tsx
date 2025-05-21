"use client";

import React, { useState, useEffect } from "react";
import { Components } from "react-markdown";
import "highlight.js/styles/atom-one-dark.css";
import { registerHighlightLanguages } from "../utils/registerHighlightLanguages";

// Initialize highlight.js with our registered languages
// We'll reinitialize it in the component to ensure freshness
const hljsInstance = registerHighlightLanguages();

// Define proper type for code component props
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface MarkdownCodeProps {
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
}

// Pre component for code blocks with highlighting
export const MarkdownPre: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Check if children is a valid code element
  if (
    React.isValidElement(children) &&
    typeof children.type === "string" &&
    children.type === "code"
  ) {
    const codeElement = children;
    const className = (codeElement.props as any)?.className || "";
    const codeContent = String(
      (codeElement.props as any)?.children || ""
    ).replace(/\\n$/, "");

    // Extract language from className if available
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";

    console.log(
      "Processing code block with language:",
      language || "auto-detect"
    );

    // State for highlighted code
    const [highlightedCode, setHighlightedCode] = useState("");
    const [copied, setCopied] = useState(false);
    const codeRef = React.useRef<HTMLElement>(null);

    // Copy to clipboard function
    const handleCopy = () => {
      navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    // Generate highlighted HTML
    useEffect(() => {
      // Skip empty code blocks
      if (!codeContent.trim()) {
        setHighlightedCode("");
        return;
      }

      // Register the languages again to ensure they're available
      // This is a safety measure
      const hljs = registerHighlightLanguages();

      if (language) {
        try {
          console.log(`Highlighting with language: ${language}`);
          const highlighted = hljs.highlight(codeContent, {
            language,
          }).value;
          setHighlightedCode(highlighted);
        } catch (error) {
          console.warn(`Failed to highlight with language: ${language}`, error);
          // Fallback to auto-detection
          try {
            const autoResult = hljs.highlightAuto(codeContent);
            console.log("Auto-detected language:", autoResult.language);
            setHighlightedCode(autoResult.value);
          } catch (autoError) {
            // If all else fails, just use the plain code
            console.error("Auto-highlight failed:", autoError);
            setHighlightedCode(codeContent);
          }
        }
      } else {
        // Try auto-detection
        try {
          const autoResult = hljs.highlightAuto(codeContent);
          console.log("Auto-detected language:", autoResult.language);
          setHighlightedCode(autoResult.value);
        } catch (error) {
          console.error("Auto-highlight failed:", error);
          setHighlightedCode(codeContent);
        }
      }
    }, [codeContent, language]);
    return (
      <div className="relative group my-4">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label="Másolás a vágólapra"
        >
          {copied ? "Másolva!" : "Másolás"}
        </button>
        <div className="code-block-wrapper">
          <pre className="rounded-md overflow-x-auto bg-gray-900 p-4">
            {language && (
              <div className="text-xs text-gray-400 mb-2 pb-1 border-b border-gray-700">
                {language}
              </div>
            )}
            <code
              ref={codeRef}
              className={language ? `hljs language-${language}` : "hljs"}
              dangerouslySetInnerHTML={{
                __html: highlightedCode || codeContent,
              }}
            />
          </pre>
        </div>
      </div>
    );
  }

  // Default pre rendering if not a code block
  return <pre>{children}</pre>;
};

// Code component for inline code
export const MarkdownCode: React.FC<MarkdownCodeProps> = ({
  className,
  children,
  inline,
}) => {
  // If this is a code block (not inline), we'll let pre handle it
  if (!inline && className && className.startsWith("language-")) {
    return <code className={className}>{children}</code>;
  }

  // Handle inline code
  const content = String(children || "");
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

// Export a configured components object for use with markdown-to-jsx
export const markdownComponents = {
  pre: {
    component: MarkdownPre,
  },
  code: {
    component: MarkdownCode,
    props: {
      className: "mb-2",
    },
  },
};
