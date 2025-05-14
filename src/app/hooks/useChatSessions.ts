"use client";

import { useState, useEffect } from "react";
import { Message, ChatSession } from "../utils/types";

export function useChatSessions() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");

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
  }, [messages, currentChatId]); // Eltávolítottam chatSessions a függőségi listából

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId("");
    return true;
  };

  const loadChatSession = (sessionId: string) => {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentChatId(session.id);
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
    startNewChat,
    loadChatSession,
    deleteChatSession,
  };
}
