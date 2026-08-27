import { GoogleGenAI } from "@google/genai";

export const generateAIWelcome = async (ssid: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a single short, warm, and creative welcome sentence for guests connecting to my WiFi network named ${ssid}. 
      Examples: "Welcome! Feel right at home on our high-speed network." or "Relax, unwind, and stay connected."
      Requirements:
      - Max 12 words.
      - No quotation marks.
      - No hashtags.
      - No mentions of the password.
      - Warm and hospitable tone.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    // Rigorous cleaning of the generated text
    const text = response.text || "Welcome! We're glad you're here. Scan to connect.";
    const cleanedText = text
      .replace(/['"]/g, '')
      .replace(/Welcome to [^ ]+!/gi, 'Welcome!') // Avoid repetitive naming
      .trim();

    return cleanedText;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Welcome! We're glad you're here. Scan to connect.";
  }
};