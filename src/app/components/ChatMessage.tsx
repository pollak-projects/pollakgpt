"use client";

import React, { useState } from "react";
import Markdown from "markdown-to-jsx";
import { Message } from "../utils/types";
import CodeBlock from "./CodeBlock";
import InlineCode from "./InlineCode";
import Toast from "./Toast";

interface ChatMessageProps {
  message: Message;
  onRetry?: (prompt: string) => void;
}

export default function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const [showToast, setShowToast] = useState(false);

  const copyContentAsMarkdown = () => {
    if (message.role === "bot") {
      navigator.clipboard
        .writeText(message.content)
        .then(() => {
          setShowToast(true);
        })
        .catch((error) => console.error("Másolási hiba:", error));
    }
  };

  const handleRetry = () => {
    if (message.originalPrompt && onRetry) {
      onRetry(message.originalPrompt);
    }
  };
  return (
    <div
      className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
        message.role === "user"
          ? "bg-blue-600 text-white ml-auto"
          : "bg-gray-700 text-white"
      } max-w-[90%] sm:max-w-[85%] md:max-w-[80%] w-fit ${
        message.role === "user" ? "ml-auto" : "mr-auto"
      } relative group`}
    >
      {message.role === "user" ? (
        message.content
      ) : (
        <>
          {" "}
          <div className="prose prose-invert w-full max-w-none prose-sm sm:prose-base">
            <Markdown
              options={{
                overrides: {
                  code: {
                    component: ({ className, children, ...props }) => {
                      // If this is a code block with language specification, use CodeBlock
                      if (className && className.startsWith("language-")) {
                        return (
                          <CodeBlock className={className} {...props}>
                            {children}
                          </CodeBlock>
                        );
                      }
                      // Otherwise, it's inline code - use our custom component
                      return <InlineCode>{children}</InlineCode>;
                    },
                    props: {
                      className: "mb-3 sm:mb-4",
                    },
                  },
                },
              }}
            >
              {message.content}
            </Markdown>
          </div>{" "}
          {message.isTyping && <span className="ml-1 typing-cursor"></span>}{" "}
          {!message.isTyping && (
            <div className="absolute bottom-2 right-2 flex space-x-2">
              {message.isError && onRetry && message.originalPrompt && (
                <button
                  onClick={handleRetry}
                  className="bg-red-600 hover:bg-red-500 text-white p-1.5 sm:p-1.5 rounded-full sm:opacity-0 opacity-80 group-hover:opacity-80 transition-opacity"
                  aria-label="Újrapróbálás"
                  title="Újrapróbálás"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-3.5 sm:w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              )}{" "}
              <button
                onClick={copyContentAsMarkdown}
                className="bg-gray-600 hover:bg-gray-500 text-white p-1.5 sm:p-1.5 rounded-full sm:opacity-0 opacity-80 group-hover:opacity-80 transition-opacity"
                aria-label="Másolás Markdownként"
                title="Másolás Markdownként"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-3.5 sm:w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          )}
          <Toast
            message="Tartalom másolva!"
            isVisible={showToast}
            onClose={() => setShowToast(false)}
          />
        </>
      )}
    </div>
  );
}
