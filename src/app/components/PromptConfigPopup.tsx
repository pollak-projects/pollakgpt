"use client";

import React, { useState } from "react";

const PROGRAMMING_LANGUAGES = [
  { value: "", label: "Általános (nincs specifikus nyelv)" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "swift", label: "Swift" },
  { value: "rust", label: "Rust" },
  { value: "kotlin", label: "Kotlin" },
];

const GRADES = [
  { value: "", label: "Általános (alap nehézség)" },
  { value: "9", label: "9. osztály" },
  { value: "10", label: "10. osztály" },
  { value: "11", label: "11. osztály" },
  { value: "12", label: "12. osztály" },
  { value: "13", label: "13. osztály (emelt szint)" },
];

export interface PromptConfig {
  language: string;
  context: string;
  grade: string;
}

interface PromptConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: PromptConfig) => void;
  initialConfig?: PromptConfig;
  isEditing?: boolean;
}

export default function PromptConfigPopup({
  isOpen,
  onClose,
  onSave,
  initialConfig = { language: "", context: "", grade: "" },
  isEditing = false,
}: PromptConfigPopupProps) {
  const [language, setLanguage] = useState(initialConfig.language);
  const [context, setContext] = useState(initialConfig.context);
  const [grade, setGrade] = useState(initialConfig.grade);
  const [error, setError] = useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that context is provided as it's now mandatory
    if (!context.trim()) {
      setError("Kontextus megadása kötelező!");
      return;
    }

    onSave({ language, context, grade });
    onClose();
  };

  // Auto-resize textarea function
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 300); // Max height of 300px
      textarea.style.height = `${newHeight}px`;
    }
  };

  // Adjust height on context changes
  React.useEffect(() => {
    adjustTextareaHeight();
  }, [context]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">
            {isEditing
              ? "Beállítások szerkesztése"
              : "Új beszélgetés beállításai"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full"
            aria-label="Bezárás"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
        <form onSubmit={handleSubmit}>
          {" "}
          <div className="mb-4">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Programozási nyelv:
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm h-10 sm:h-auto"
            >
              {PROGRAMMING_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>{" "}
          <div className="mb-4">
            <label
              htmlFor="grade"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Évfolyam (nehézségi szint):
            </label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm h-10 sm:h-auto"
            >
              {GRADES.map((gradeOption) => (
                <option key={gradeOption.value} value={gradeOption.value}>
                  {gradeOption.label}
                </option>
              ))}
            </select>
          </div>{" "}
          <div className="mb-4">
            <label
              htmlFor="context"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Első üzenet: <span className="text-red-400">*</span>
            </label>{" "}
            <textarea
              id="context"
              ref={textareaRef}
              value={context}
              onChange={(e) => {
                setContext(e.target.value);
                if (error && e.target.value.trim()) {
                  setError("");
                }
              }}
              placeholder="Írj egy kérdést vagy feladatot, amivel kezdeni szeretnéd a beszélgetést..."
              className={`w-full px-3 py-2 bg-gray-700 border ${
                error ? "border-red-500" : "border-gray-600"
              } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] max-h-[300px] overflow-y-auto custom-textarea text-base sm:text-sm`}
              required
            ></textarea>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>{" "}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 sm:py-2 text-base sm:text-sm font-medium text-gray-300 hover:text-white bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Mégsem
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 sm:py-2 text-base sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {isEditing ? "Mentés" : "Beszélgetés indítása"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
