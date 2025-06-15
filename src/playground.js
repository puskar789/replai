// import { db } from "./server/db";

// await db.user.create({
//   data: {
//     emailAddress: "test@gmail.com",
//     firstName: "Test",
//     lastName: "User",
//   },
// });

// console.log("done");

import { GoogleGenAI } from "@google/genai";

export const getEmbeddings = async (text) => {
  try {
    // console.log(process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY);
    console.log("text: ", text);
    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
    });

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

    console.log(response);
    // console.log(response.embeddings[0]?.values?.length);
  } catch (error) {
    console.error("error generating the embeddings", error);
    throw error;
  }
};

const text = [
  "hello world 1",
  "hello world 2",
  "hello world 3",
  "hello world 4",
  "hello world 5",
  "hello world 6",
  "hello world 7",
  "hello world 8",
  "hello world 9",
  "hello world 10",
];

let count = 0;

for (const t of text) {
  if (count == 5) {
    count = 0;
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
  await getEmbeddings(t);
  count++;
}

console.log("done");
