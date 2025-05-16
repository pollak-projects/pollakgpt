"use client";

import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Message } from "../utils/types";

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const generateAIResponse = async (
    input: string,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    promptConfig?: { language: string; context: string; grade: string }
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

      // Build system instruction based on prompt config
      let systemInstruction =
        'Válaszolj magyarul. Használhatsz markdown formázást a válaszaidban, kivéve ha máshogy kérik. Fogalmazz meg objektumorientált programozási gyakorlófeladatokat részletes követelményekkel, ahol minden feladat tartalmaz egy rövid leírást, osztályok és attribútumaik felsorolását (alapértelmezett értékekkel), default és paraméterezett konstruktorokat érvényességi ellenőrzésekkel, legalább egy metódust az adatok megjelenítésére, kapcsolódó osztályokat (pl. tulajdonos–autó), valamint kiegészítő funkciókat (pl. listázás, keresés, szűrés), és a formázás a következő legyen: "Feladat cím", "Leírás", "Követelmények" pontokkal, végül opcionális "Példa használat" résszel.';

      if (promptConfig) {
        if (promptConfig.language) {
          systemInstruction += ` Programozási példákban használj ${promptConfig.language} nyelvet, ha releváns.`;
        }

        if (promptConfig.context) {
          systemInstruction += ` Figyelj a következő kontextusra: ${promptConfig.context}`;
        }

        if (promptConfig.grade) {
          const gradeLevel = parseInt(promptConfig.grade);
          if (!isNaN(gradeLevel)) {
            // Adjust difficulty based on grade
            if (gradeLevel === 9) {
              systemInstruction += ` Használj egyszerű magyarázatokat, alapfogalmakat, és kerüld a komplex témaköröket. A válaszaid legyenek rövidek és könnyen érthetőek. Az algoritmikus gondolkodás alapjait mutasd be.`;
            } else if (gradeLevel === 10) {
              systemInstruction += ` Használj egyszerű szaknyelvet, de magyarázd el részletesen a fogalmakat. A válaszaid legyenek közepesen részletesek. Mutass be alapvető algoritmusokat és adatszerkezeteket, ha releváns.`;
            } else if (gradeLevel === 11) {
              systemInstruction += ` Használj szaknyelvet, de továbbra is adj magyarázatokat a bonyolultabb fogalmakhoz. A válaszaid legyenek részletesebbek, de érthetőek. Mutass be összetettebb algoritmusokat és programozási mintákat, ha releváns.`;
            } else if (gradeLevel === 12) {
              systemInstruction += ` Használj szaknyelvet, feltételezve hogy az alapfogalmakat már ismerik. A válaszaid legyenek részletesek és átfogóak. Mutass be haladó algoritmusokat és programozási koncepciókat, ha releváns.`;
            } else if (gradeLevel === 13) {
              systemInstruction += ` Használj komplex szaknyelvet, emelt szintű magyarázatokat, feltételezve hogy a tanuló felkészült az érettségire vagy egyetemi tanulmányokra. Válaszaid legyenek mélyrehatóak, részletesek, és tartalmazzanak professzionális szintű magyarázatokat és példákat.`;
            }
          }
        }
      }

      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: historyMessages,
        config: {
          systemInstruction,
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
