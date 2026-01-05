
import { GoogleGenAI, Type } from "@google/genai";

export const generateAIWelcome = async (ssid: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a short, warm, and friendly welcome message for a guest using my WiFi network named "${ssid}". Keep it under 15 words. Example: "Welcome home! Relax and stay connected with our high-speed guest network."`,
      config: {
        temperature: 0.7,
        topP: 0.8,
      }
    });

    return response.text?.trim() || "Welcome! We're glad you're here. Scan to connect.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Welcome to our home! Scan the QR code below to connect to our guest WiFi.";
  }
};
