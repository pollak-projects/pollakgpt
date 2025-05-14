import React from "react";
import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.APIKEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function Home() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: "Why is the sky blue?",
    config: {
      systemInstruction: "do not use markdown",
    },
  });

  return <div className="">{response.text}</div>;
}

export default Home;
