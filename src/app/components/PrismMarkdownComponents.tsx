"use client";

import React from "react";
import { Components } from "react-markdown";
import DirectPrismCode from "./DirectPrismCode";

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Simple pre component that passes content to our DirectPrismCode
export const MarkdownPre: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Pass through to code processing if this is a code block
  if (
    React.isValidElement(children) &&
    typeof children.type === "string" &&
    children.type === "code"
  ) {
    const codeElement = children;
    const className = (codeElement.props as any)?.className || "";
    const codeContent = String((codeElement.props as any)?.children || "");

    // We'll let DirectPrismCode handle the length check internally
    return (
      <DirectPrismCode className={className}>{codeContent}</DirectPrismCode>
    );
  }
  // Default pre rendering
  return <pre className="mt-1 mb-4 whitespace-pre-wrap">{children}</pre>;
};

// Code component for inline code or code blocks
export const MarkdownCode: React.FC<CodeProps> = ({
  inline = false,
  className,
  children,
}) => {
  // Pass to DirectPrismCode and let it handle both inline and block code
  return (
    <DirectPrismCode className={className} inline={inline}>
      {children}
    </DirectPrismCode>
  );
};

// Export configured components for markdown-to-jsx
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
