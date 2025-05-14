"use client";

import React from "react";
import { Components } from "react-markdown";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";

// Define proper type for code component props
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Export a configured components object for use with ReactMarkdown
export const markdownComponents: Components = {
  code: ({ node, inline, className, children, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || "");

    React.useEffect(() => {
      if (!inline && match) {
        Prism.highlightAll();
      }
    }, [children, inline, match]);

    return !inline && match ? (
      <div className="relative group">
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                String(children).replace(/\n$/, "")
              );
            }}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-2 rounded"
            aria-label="Copy code to clipboard"
          >
            Copy
          </button>
        </div>
        <pre className={className}>
          <code className={className}>{children}</code>
        </pre>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};
