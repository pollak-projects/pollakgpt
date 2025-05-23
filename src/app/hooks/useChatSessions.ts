"use client";

import { useState, useEffect } from "react";
import { Message, ChatSession } from "../utils/types";

export function useChatSessions() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [currentPromptConfig, setCurrentPromptConfig] = useState<
    { language: string; context: string; grade: string } | undefined
  >();

  useEffect(() => {
    const loadChatSessions = () => {
      try {
        const savedSessions = localStorage.getItem("chatSessions");
        if (savedSessions) {
          setChatSessions(JSON.parse(savedSessions));
        }
      } catch (error) {
        console.error("Beszélgetési előzmények betöltése sikertelen:", error);
      }
    };

    loadChatSessions();
  }, []);
  useEffect(() => {
    if (messages.length === 0) return;

    const saveChatSession = () => {
      try {
        const now = Date.now();

        const firstUserMessage = messages.find((msg) => msg.role === "user");
        const title = firstUserMessage
          ? firstUserMessage.content.substring(0, 30) +
            (firstUserMessage.content.length > 30 ? "..." : "")
          : "Új beszélgetés";
        if (!currentChatId) {
          const newSession: ChatSession = {
            id: `chat-${now}`,
            title,
            messages,
            createdAt: now,
            updatedAt: now,
            promptConfig: currentPromptConfig,
          };

          const updatedSessions = [...chatSessions, newSession];
          setChatSessions(updatedSessions);
          setCurrentChatId(newSession.id);
          localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
        } else {
          const updatedSessions = chatSessions.map((session) =>
            session.id === currentChatId
              ? { ...session, messages, title, updatedAt: now }
              : session
          );
          setChatSessions(updatedSessions);
          localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
        }
      } catch (error) {
        console.error("Beszélgetés mentése sikertelen:", error);
      }
    };
    saveChatSession();
  }, [messages, currentChatId, chatSessions, currentPromptConfig]);
  const startNewChat = (promptConfig?: {
    language: string;
    context: string;
    grade: string;
  }) => {
    // Create an initial user message using the context field
    if (promptConfig && promptConfig.context) {
      const initialMessage: Message = {
        role: "user",
        content: promptConfig.context,
      };

      setMessages([initialMessage]);

      // Copy the promptConfig but without the context as it's now a message
      const configWithoutContext = {
        language: promptConfig.language,
        context: "", // Clear context as it's now a message
        grade: promptConfig.grade,
      };

      setCurrentPromptConfig(configWithoutContext);
    } else {
      setMessages([]);
      setCurrentPromptConfig(promptConfig);
    }

    setCurrentChatId("");
    return true;
  };

  const updatePromptConfig = (promptConfig?: {
    language: string;
    context: string;
    grade: string;
  }) => {
    setCurrentPromptConfig(promptConfig);

    // If we have an active chat session, update it in storage
    if (currentChatId) {
      const updatedSessions = chatSessions.map((session) =>
        session.id === currentChatId ? { ...session, promptConfig } : session
      );
      setChatSessions(updatedSessions);
      localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
    }

    return true;
  };
  const loadChatSession = (sessionId: string) => {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentChatId(session.id);
      setCurrentPromptConfig(session.promptConfig);
      return true;
    }
    return false;
  };

  const deleteChatSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSessions = chatSessions.filter(
      (session) => session.id !== sessionId
    );
    setChatSessions(updatedSessions);
    localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));

    if (sessionId === currentChatId) {
      setMessages([]);
      setCurrentChatId("");
    }
  };
  return {
    messages,
    setMessages,
    chatSessions,
    currentChatId,
    currentPromptConfig,
    startNewChat,
    loadChatSession,
    deleteChatSession,
    updatePromptConfig,
  };
}
