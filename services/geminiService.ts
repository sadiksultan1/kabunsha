import { GoogleGenAI } from "@google/genai";

// NOTE: In a real production app, never expose API keys on the client side.
// This is for demonstration purposes or internal tooling where environment variables are safe.
// Assuming process.env.API_KEY is available. If running locally without env, this will fail gracefully.

const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.error("Failed to initialize Gemini client", error);
}

export const getStylistAdvice = async (userMessage: string): Promise<string> => {
  if (!ai) {
    return "I'm sorry, my styling brain (API Key) isn't connected right now! Please try again later.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: `You are 'KebuuBot', a friendly, enthusiastic, and helpful AI fashion stylist for 'KEBUU KIDS FASHION STORY'. 
        Target audience: Parents of children (newborn to 10 years).
        Tone: Cheerful, safe, caring, and professional.
        Context: The store sells durable, colorful, and soft clothing in Ethiopia and Egypt.
        Currency: Ethiopian Birr (ETB).
        
        Your goals:
        1. Recommend outfits based on occasions (play, party, sleep).
        2. Give advice on fabric safety and durability.
        3. Be brief and engaging.
        
        If asked about specific stock, generalise based on standard kids fashion (florals, denim, cotton) as you don't have real-time database access.`,
        temperature: 0.7,
      }
    });

    return response.text || "I'm thinking about the perfect outfit, but I'm lost for words right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! I had a little trouble thinking of that. Can you ask me again?";
  }
};