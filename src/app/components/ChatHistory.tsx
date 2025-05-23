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
}

export default function ChatHistory({
  isHistoryOpen,
  chatSessions,
  currentChatId,
  loadChatSession,
  deleteChatSession,
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
        isHistoryOpen
          ? "w-full sm:w-80 md:w-96 lg:w-[22rem] fixed sm:relative z-20"
          : "w-0"
      } bg-gray-800 transition-all duration-300 overflow-hidden h-full`}
    >
      {" "}
      <div className="flex flex-col h-full">
        <div className="py-4 px-3 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl sm:text-lg font-semibold text-white">
            Előzmények
          </h2>{" "}
          <button
            className="sm:hidden text-gray-300 p-1 rounded-full hover:bg-gray-700"
            onClick={() => document.dispatchEvent(new Event("closeHistory"))} // Custom event to close the panel
            aria-label="Bezárás"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
        </div>{" "}
        <div className="flex-1 overflow-y-auto p-2 px-1 sm:px-1">
          {chatSessions.length === 0 ? (
            <p className="text-gray-400 text-sm p-2">Nincsenek előzmények</p>
          ) : (
            <div className="space-y-2 sm:space-y-1">
              {chatSessions
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((session) => (
                  <div
                    key={session.id}
                    onClick={() => {
                      loadChatSession(session.id);
                      // Close history on mobile after selecting a chat
                      if (window.innerWidth < 640) {
                        document.dispatchEvent(new Event("closeHistory"));
                      }
                    }}
                    className={`py-2 px-2 rounded cursor-pointer flex justify-between items-center mb-1 ${
                      session.id === currentChatId
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {" "}
                    <div className="truncate text-base sm:text-sm flex-1">
                      <div className="font-medium">{session.title}</div>{" "}
                      {session.promptConfig?.language && (
                        <div className="text-xs text-gray-400">
                          {session.promptConfig.language}
                          {session.promptConfig.grade &&
                            ` • ${
                              session.promptConfig.grade === "9"
                                ? "9. oszt."
                                : session.promptConfig.grade === "10"
                                ? "10. oszt."
                                : session.promptConfig.grade === "11"
                                ? "11. oszt."
                                : session.promptConfig.grade === "12"
                                ? "12. oszt."
                                : session.promptConfig.grade === "13"
                                ? "13. oszt."
                                : ""
                            }`}
                        </div>
                      )}{" "}
                    </div>
                    <button
                      onClick={(e) => handleDeleteClick(session.id, e)}
                      className="text-gray-400 hover:text-gray-200 p-1 ml-1 rounded-full hover:bg-gray-600"
                      aria-label="Beszélgetés törlése"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-4 sm:w-4"
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
          )}{" "}
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
