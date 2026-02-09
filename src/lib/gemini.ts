import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY is not set in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

export const getGeminiModel = (modelName: string = "gemini-1.5-flash") => {
  if (!API_KEY) {
    throw new Error("API_KEY");
  }
  return genAI.getGenerativeModel({ model: modelName });
};
