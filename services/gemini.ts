
import { GoogleGenAI, Type } from "@google/genai";
import { DeviceSpecs } from "../types";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchDeviceSpecs = async (query: string): Promise<DeviceSpecs> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Retrieve detailed technical specifications for the mobile phone model: "${query}". Return the data strictly in JSON format. If specific fields are unknown, omit them or use a generic "Standard" value.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brand: { type: Type.STRING },
            model: { type: Type.STRING },
            image: { type: Type.STRING, description: "A URL of a high quality professional studio render image of the phone. Use a high-quality placeholder if unknown." },
            launch: { type: Type.STRING },
            display: { type: Type.STRING },
            platform: { type: Type.STRING },
            memory: { type: Type.STRING },
            battery: { type: Type.STRING },
            network: { type: Type.STRING },
            sensors: { type: Type.STRING },
          },
          required: ["model"]
        }
      }
    });

    // Directly access the extracted string output via the .text property
    const data = JSON.parse(response.text);
    // Ensure we have a fallback image if Gemini doesn't provide a good one
    if (!data.image || !data.image.startsWith('http')) {
      data.image = `https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800`;
    }
    return data;
  } catch (error) {
    console.error("Gemini Error:", error);
    // Return basic structure on error
    return {
      model: query,
      image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800",
      display: "Awaiting Analysis",
      platform: "Awaiting Analysis"
    };
  }
};
