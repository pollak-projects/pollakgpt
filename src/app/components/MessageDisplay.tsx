"use client";

import React, { useRef } from "react";
import { Message } from "../utils/types";
import ChatMessage from "./ChatMessage";

interface MessageDisplayProps {
  messages: Message[];
  isLoading: boolean;
  onRetry?: (prompt: string) => void;
}

export default function MessageDisplay({
  messages,
  isLoading,
  onRetry,
}: MessageDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {" "}
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <h2 className="text-2xl font-bold mb-2">Üdvözöl a PollakGPT</h2>
            <p>Kérdezz bármit...</p>{" "}
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
