"use client";

import React, { useState, FormEvent } from "react";
import { useChatSessions } from "./hooks/useChatSessions";
import { useAI } from "./hooks/useAI";
import ChatHeader from "./components/ChatHeader";
import ChatHistory from "./components/ChatHistory";
import MessageDisplay from "./components/MessageDisplay";
import ChatInput from "./components/ChatInput";
import { Message } from "./utils/types";

export default function Home() {
  const [input, setInput] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const {
    messages,
    setMessages,
    chatSessions,
    currentChatId,
    startNewChat,
    loadChatSession,
    deleteChatSession,
  } = useChatSessions();
  const { isLoading, generateAIResponse } = useAI();

  const handleStartNewChat = () => {
    const result = startNewChat();
    if (result) {
      setIsHistoryOpen(false);
    }
    return result;
  };

  const handleLoadChatSession = (sessionId: string) => {
    const result = loadChatSession(sessionId);
    if (result) {
      setIsHistoryOpen(false);
    }
    return result;
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    await generateAIResponse(input, [...messages, userMessage], setMessages);
  };

  const handleRetry = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);

    await generateAIResponse(prompt, [...messages, userMessage], setMessages);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <ChatHistory
        isHistoryOpen={isHistoryOpen}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        loadChatSession={handleLoadChatSession}
        deleteChatSession={deleteChatSession}
        startNewChat={handleStartNewChat}
      />

      <div className="flex flex-col flex-1">
        <ChatHeader
          isHistoryOpen={isHistoryOpen}
          setIsHistoryOpen={setIsHistoryOpen}
          startNewChat={handleStartNewChat}
        />
        <MessageDisplay
          messages={messages}
          isLoading={isLoading}
          onRetry={handleRetry}
        />
        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
        />{" "}
        <div className="text-center text-xs text-gray-500 py-2">
          Készítette a 12. SZF1 csoport a Szentesi Pollák Antal Technikum
          számára.
        </div>
      </div>
    </div>
  );
}
