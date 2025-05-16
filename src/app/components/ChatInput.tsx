"use client";

import React, { FormEvent, useRef, useEffect } from "react";

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({
  input,
  setInput,
  isLoading,
  handleSubmit,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(150, Math.max(50, textarea.scrollHeight));
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);
  return (
    <div className="border-t border-gray-700 p-3 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto"
      >
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) {
                  handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                }
              }
            }}
            rows={1}
            placeholder="Írj egy üzenetet... (Shift+Enter új sorhoz)"
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg py-3 px-4 pr-14 focus:outline-none focus:border-blue-500 resize-none overflow-auto text-base sm:text-sm"
            style={{
              minHeight: "50px",
              maxHeight: "150px",
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md p-2 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            aria-label="Küldés"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-4 sm:w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
