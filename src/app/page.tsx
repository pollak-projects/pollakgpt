"use client";

import React, { useState, FormEvent } from "react";
import { useChatSessions } from "./hooks/useChatSessions";
import { useAI } from "./hooks/useAI";
import ChatHeader from "./components/ChatHeader";
import ChatHistory from "./components/ChatHistory";
import MessageDisplay from "./components/MessageDisplay";
import ChatInput from "./components/ChatInput";
import PromptConfigPopup, {
  PromptConfig,
} from "./components/PromptConfigPopup";
import { Message } from "./utils/types";

export default function Home() {
  const [input, setInput] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isConfigPopupOpen, setIsConfigPopupOpen] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);

  React.useEffect(() => {
    // Listen for custom closeHistory event from ChatHistory component
    const closeHistoryHandler = () => setIsHistoryOpen(false);
    document.addEventListener("closeHistory", closeHistoryHandler);

    return () => {
      document.removeEventListener("closeHistory", closeHistoryHandler);
    };
  }, []);
  const {
    messages,
    setMessages,
    chatSessions,
    currentChatId,
    currentPromptConfig,
    startNewChat,
    loadChatSession,
    deleteChatSession,
    updatePromptConfig,
  } = useChatSessions();
  const { isLoading, generateAIResponse } = useAI();
  const handleStartNewChat = () => {
    // Instead of starting a new chat immediately, open the config popup first
    setIsConfigPopupOpen(true);
    return true;
  };
  const handleSaveConfig = (config: PromptConfig) => {
    const result = startNewChat(config);
    if (result) {
      setIsHistoryOpen(false);
    }
    return result;
  };

  const handleEditConfig = () => {
    setIsEditingConfig(true);
    setIsConfigPopupOpen(true);
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
    await generateAIResponse(
      input,
      [...messages, userMessage],
      setMessages,
      currentPromptConfig
    );
  };

  const handleRetry = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    await generateAIResponse(
      prompt,
      [...messages, userMessage],
      setMessages,
      currentPromptConfig
    );
  };
  return (
    <div className="flex h-screen bg-gray-900 relative overflow-hidden max-w-screen-2xl mx-auto">
      {/* Overlay for mobile - closes history when clicked */}
      {isHistoryOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 sm:hidden"
          onClick={() => setIsHistoryOpen(false)}
        ></div>
      )}
      <ChatHistory
        isHistoryOpen={isHistoryOpen}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        loadChatSession={handleLoadChatSession}
        deleteChatSession={deleteChatSession}
        startNewChat={handleStartNewChat}
      />{" "}
      <div className="flex flex-col flex-1 w-full transition-all">
        <ChatHeader
          isHistoryOpen={isHistoryOpen}
          setIsHistoryOpen={setIsHistoryOpen}
          startNewChat={handleStartNewChat}
        />{" "}
        <MessageDisplay
          messages={messages}
          isLoading={isLoading}
          onRetry={handleRetry}
          promptConfig={currentPromptConfig}
          onEditConfig={handleEditConfig}
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
      </div>{" "}
      <PromptConfigPopup
        isOpen={isConfigPopupOpen}
        onClose={() => {
          setIsConfigPopupOpen(false);
          setIsEditingConfig(false);
        }}
        onSave={(config) => {
          if (isEditingConfig) {
            // Just update the config without starting a new chat
            updatePromptConfig(config);
            setIsEditingConfig(false);
          } else {
            // Start new chat with config
            handleSaveConfig(config);
          }
          setIsConfigPopupOpen(false);
        }}
        initialConfig={currentPromptConfig}
        isEditing={isEditingConfig}
      />
    </div>
  );
}
