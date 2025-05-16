"use client";

import React, { useRef } from "react";
import { Message } from "../utils/types";
import ChatMessage from "./ChatMessage";

interface MessageDisplayProps {
  messages: Message[];
  isLoading: boolean;
  onRetry?: (prompt: string) => void;
  promptConfig?: { language: string; context: string; grade: string };
  onEditConfig?: () => void;
}

export default function MessageDisplay({
  messages,
  isLoading,
  onRetry,
  promptConfig,
  onEditConfig,
}: MessageDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-auto p-3 sm:p-4">
      <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-4 sm:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Üdvözöl a PollakGPT
            </h2>
            <p>Kérdezz bármit...</p>
            {promptConfig && (
              <div className="mt-4 p-3 bg-gray-700 rounded-lg relative mx-auto max-w-sm sm:max-w-md">
                {promptConfig.language && (
                  <p className="text-gray-300 text-sm sm:text-base">
                    <span className="font-medium">Programozási nyelv:</span>{" "}
                    {promptConfig.language}
                  </p>
                )}
                {promptConfig.grade && (
                  <p className="text-gray-300 mt-1 text-sm sm:text-base">
                    <span className="font-medium">Évfolyam:</span>{" "}
                    {promptConfig.grade === "9" && "9. osztály"}
                    {promptConfig.grade === "10" && "10. osztály"}
                    {promptConfig.grade === "11" && "11. osztály"}
                    {promptConfig.grade === "12" && "12. osztály"}
                    {promptConfig.grade === "13" && "13. osztály (emelt szint)"}
                    {!["9", "10", "11", "12", "13"].includes(
                      promptConfig.grade
                    ) && "Általános"}
                  </p>
                )}
                {promptConfig.context && (
                  <p className="text-gray-300 mt-1 text-sm sm:text-base">
                    <span className="font-medium">Kontextus:</span>{" "}
                    <span className="whitespace-pre-wrap">
                      {promptConfig.context}
                    </span>
                  </p>
                )}
                {messages.length === 0 && onEditConfig && (
                  <button
                    onClick={onEditConfig}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-600"
                    title="Beállítások szerkesztése"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
            <p className="text-xs mt-8 text-gray-500">
              Készítette a 12. SZF1 csoport a Szentesi Pollák Antal Technikum
              számára.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message} onRetry={onRetry} />
          ))
        )}
        {isLoading && (
          <div className="bg-gray-700 text-white p-4 rounded-lg max-w-[80%]">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
