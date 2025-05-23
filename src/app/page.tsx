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

  // Handle start new chat with configuration
  const handleStartConfiguredChat = () => {
    // Open the config popup
    setIsConfigPopupOpen(true);
    return true;
  };

  // Handle start empty chat without configuration
  const handleStartEmptyChat = () => {
    // Start a new chat without showing the config popup
    const result = startNewChat();
    if (result) {
      setIsHistoryOpen(false);
    }
    return result;
  };

  // Legacy function for backward compatibility
  const handleStartNewChat = () => {
    // This will just show the options in the dropdown now
    return true;
  };
  const handleSaveConfig = async (config: PromptConfig) => {
    const result = startNewChat(config);

    // If context is provided, generate an AI response immediately
    if (result && config.context && config.context.trim()) {
      // Get current messages (which should include the newly created message with context)
      const currentMessages = [
        {
          role: "user",
          content: config.context,
        },
      ];

      // Generate AI response to the context message
      await generateAIResponse(config.context, currentMessages, setMessages, {
        language: config.language,
        context: "", // Context is already used as the user message
        grade: config.grade,
      });
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
    // Setting input to empty will trigger the useEffect in ChatInput to focus the textarea
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
    <div className="flex h-screen bg-gray-900 relative overflow-hidden mx-auto w-full">
      {/* Overlay for mobile - closes history when clicked */}
      {isHistoryOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 sm:hidden"
          onClick={() => setIsHistoryOpen(false)}
        ></div>
      )}{" "}
      <ChatHistory
        isHistoryOpen={isHistoryOpen}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        loadChatSession={handleLoadChatSession}
        deleteChatSession={deleteChatSession}
      />{" "}
      <div className="flex flex-col flex-1 w-full transition-all sm:border-l-2 sm:border-gray-700">
        {" "}
        <ChatHeader
          isHistoryOpen={isHistoryOpen}
          setIsHistoryOpen={setIsHistoryOpen}
          startNewChat={handleStartNewChat}
          startEmptyChat={handleStartEmptyChat}
          startConfiguredChat={handleStartConfiguredChat}
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
        <div className="py-2">
          <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto text-center text-xs text-gray-500">
            Készítette a 12. SZF1 csoport a Szentesi Pollák Antal Technikum
            számára.
          </div>
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
