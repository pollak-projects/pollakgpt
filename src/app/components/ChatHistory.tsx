"use client";

import React, { useState } from "react";
import { ChatSession } from "../utils/types";
import ConfirmationDialog from "./ConfirmationDialog";

interface ChatHistoryProps {
  isHistoryOpen: boolean;
  chatSessions: ChatSession[];
  currentChatId: string;
  loadChatSession: (sessionId: string) => boolean;
  deleteChatSession: (sessionId: string, e: React.MouseEvent) => void;
  startNewChat: () => boolean;
}

export default function ChatHistory({
  isHistoryOpen,
  chatSessions,
  currentChatId,
  loadChatSession,
  deleteChatSession,
  startNewChat,
}: ChatHistoryProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingDeleteId(sessionId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      // Create a dummy event since the original is not available anymore
      const dummyEvent = { stopPropagation: () => {} } as React.MouseEvent;
      deleteChatSession(pendingDeleteId, dummyEvent);
      setIsConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setPendingDeleteId(null);
  };

  return (
    <div
      className={`${
        isHistoryOpen ? "w-64" : "w-0"
      } bg-gray-800 transition-all duration-300 overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Előzmények</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {chatSessions.length === 0 ? (
            <p className="text-gray-400 text-sm p-2">Nincsenek előzmények</p>
          ) : (
            <div className="space-y-1">
              {chatSessions
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((session) => (
                  <div
                    key={session.id}
                    onClick={() => loadChatSession(session.id)}
                    className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                      session.id === currentChatId
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <span className="truncate text-sm flex-1">
                      {session.title}
                    </span>{" "}
                    <button
                      onClick={(e) => handleDeleteClick(session.id, e)}
                      className="text-gray-400 hover:text-gray-200 p-1"
                      aria-label="Beszélgetés törlése"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={startNewChat}
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Új beszélgetés
          </button>
        </div>{" "}
      </div>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        title="Beszélgetés törlése"
        message="Biztosan törölni szeretnéd ezt a beszélgetést? Ez a művelet nem vonható vissza."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
