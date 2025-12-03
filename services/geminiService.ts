import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFace = async (base64Image: string): Promise<any> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Analyze this facial image for a security visitor log system. Provide a structured analysis of the person's demographics and appearance. Also, strictly for simulation purposes, estimate a 'confidence score' between 0.85 and 0.99 pretending you matched this against a database."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            age_range: { type: Type.STRING, description: "Estimated age range (e.g., 25-30)" },
            gender: { type: Type.STRING, description: "Estimated gender" },
            emotion: { type: Type.STRING, description: "Current facial expression/mood" },
            wearing_glasses: { type: Type.BOOLEAN, description: "True if wearing glasses" },
            distinguishing_features: { type: Type.STRING, description: "Short description of features (hair color, beard, etc)" },
            simulated_match_confidence: { type: Type.NUMBER, description: "A simulated float between 0.85 and 0.99" }
          },
          required: ["age_range", "gender", "emotion", "wearing_glasses", "distinguishing_features", "simulated_match_confidence"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Error analyzing face:", error);
    throw error;
  }
};