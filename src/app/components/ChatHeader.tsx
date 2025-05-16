"use client";

import React from "react";

interface ChatHeaderProps {
  isHistoryOpen: boolean;
  setIsHistoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  startNewChat: () => boolean;
}

export default function ChatHeader({
  isHistoryOpen,
  setIsHistoryOpen,
  startNewChat,
}: ChatHeaderProps) {
  return (
    <header className="bg-gray-800 py-3 px-2 sm:p-3 text-white flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center">
        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="mr-3 text-gray-300 hover:text-white p-2 -ml-1 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
          aria-label="Előzmények mutatása/elrejtése"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold">PollakGPT</h1>
      </div>

      <button
        onClick={startNewChat}
        className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-2 sm:py-1 rounded-md flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
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
    </header>
  );
}
