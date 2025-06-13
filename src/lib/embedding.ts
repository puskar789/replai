"use server";

import { GoogleGenAI } from "@google/genai";

const config = {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
};

export const getEmbeddings = async (text: string) => {
  try {
    const ai = new GoogleGenAI(config);

    const response = await ai.models.embedContent({
      model: "gemini-embedding-exp-03-07",
      contents: text.replace(/\n/g, " "),
      config: {
        taskType: "SEMANTIC_SIMILARITY",
      },
    });

    if (!response || !response.embeddings) {
      throw new Error("Failed to generate embeddings");
    }

    return response.embeddings[0]?.values;
  } catch (error) {
    console.error("error generating the embeddings", error);
    throw error;
  }
};
