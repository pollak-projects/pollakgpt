"use client";

import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Message } from "../utils/types";

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const generateAIResponse = async (
    input: string,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    setIsLoading(true);
    try {
      const GEMINI_API_KEY =
        process.env.NEXT_PUBLIC_APIKEY || process.env.APIKEY || "";
      const AI_MODEL =
        process.env.NEXT_PUBLIC_AI_MODEL || "gemini-2.0-flash-lite";

      if (!GEMINI_API_KEY) {
        throw new Error(
          "API kulcs hiányzik. Ellenőrizze a környezeti változókat."
        );
      }
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const historyMessages = [];

      for (const msg of messages) {
        if (msg.role === "user") {
          historyMessages.push({
            role: "user",
            parts: [{ text: msg.content }],
          });
        } else if (msg.role === "bot") {
          historyMessages.push({
            role: "model",
            parts: [{ text: msg.content }],
          });
        }
      }

      historyMessages.push({ role: "user", parts: [{ text: input }] });

      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: historyMessages,
        config: {
          systemInstruction:
            "Válaszolj magyarul. Használhatsz markdown formázást a válaszaidban.",
        },
      });

      const responseText =
        response.text || "Sajnálom, nem tudtam választ generálni.";
      const botTypingMessage: Message = {
        role: "bot",
        content: "",
        isTyping: true,
      };
      setMessages((prev) => [...prev, botTypingMessage]);
      let displayedText = "";
      const fullText = responseText;

      const baseSpeed = 15;
      const textRevealSpeed =
        fullText.length > 500 ? 5 : fullText.length > 200 ? 10 : baseSpeed;
      const chunkSize = fullText.length > 1000 ? 3 : 1;

      let isMounted = true;
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        for (let i = 0; i <= fullText.length && isMounted; i += chunkSize) {
          if (signal.aborted) {
            break;
          }

          displayedText = fullText.slice(0, i);
          setMessages((prev) =>
            prev.map((msg, idx) =>
              idx === prev.length - 1
                ? {
                    ...msg,
                    content: displayedText,
                    isTyping: i < fullText.length,
                  }
                : msg
            )
          );

          await new Promise((resolve) => setTimeout(resolve, textRevealSpeed));

          if (!document.hasFocus()) {
            i += 10;
          }
        }

        if (isMounted) {
          setMessages((prev) =>
            prev.map((msg, idx) =>
              idx === prev.length - 1
                ? {
                    ...msg,
                    content: fullText,
                    isTyping: false,
                  }
                : msg
            )
          );
        }
      } catch (animationError) {
        console.error("Animációs hiba:", animationError);
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1
              ? {
                  ...msg,
                  content: fullText,
                  isTyping: false,
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Hibaüzenet:", error);

      let errorContent = "Sajnálom, hiba történt. Kérlek próbáld újra.";

      if (error instanceof Error) {
        errorContent = `Hiba: ${error.message}`;

        if (
          error.message.includes("API key") ||
          error.message.includes("API kulcs")
        ) {
          errorContent =
            "API kulcs hiba: Ellenőrizze a környezeti változókat és győződjön meg róla, hogy az API kulcs megfelelően be van állítva.";
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch") ||
          error.message.includes("hálózat")
        ) {
          errorContent =
            "Hálózati hiba: Nem sikerült csatlakozni az AI szolgáltatáshoz. Kérjük, ellenőrizze az internetkapcsolatot.";
        }
      }
      const errorMessage: Message = {
        role: "bot",
        content: errorContent,
        isError: true,
        originalPrompt: input,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateAIResponse,
  };
}
