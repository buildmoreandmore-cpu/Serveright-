
import { GoogleGenAI, Type } from "@google/genai";
import { Job } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAIStatusExplanation(job: Job) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the current status of this process serving job to a stressed customer. 
      Job Data: ${JSON.stringify(job)}
      Keep it reassuring, professional, and clear. Explain what happened in the last attempt if any.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "We are actively processing your serve and our team is in the field. You will receive an update as soon as the next attempt is made.";
  }
}

export async function generateJobDescription(notes: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given these rough notes for a process server: "${notes}", 
      generate a clear, concise professional description of the defendant or service context 
      that would help a server identify them in the field.`,
    });
    return response.text;
  } catch (error) {
    return notes;
  }
}
