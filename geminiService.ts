
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "./types";

// Always use process.env.API_KEY directly as per SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestionBatch = async (topicId: string, topicTitle: string, description: string, count: number = 15): Promise<Question[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate exactly ${count} high-quality, challenging multiple-choice questions for the AI technical topic: "${topicTitle}". Context: ${description}. 
      - Questions must be diverse and unique.
      - Ensure a mix of conceptual and practical application.
      - If technical, include relevant code snippets (Python/SQL/Prompt syntax).
      - Format as a JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              topic: { type: Type.STRING },
              text: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER, description: "0-indexed index of the correct option" },
              explanation: { type: Type.STRING },
              codeSnippet: { type: Type.STRING, description: "Optional code snippet to display" }
            },
            required: ["id", "topic", "text", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const text = response.text.trim();
    const questions = JSON.parse(text) as Question[];
    // Add topic ID explicitly to ensure consistency
    return questions.map(q => ({ ...q, id: `${topicId}-${Math.random().toString(36).substr(2, 9)}` }));
  } catch (error) {
    console.error("Error generating question batch:", error);
    return [];
  }
};
