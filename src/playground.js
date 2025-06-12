// import { db } from "./server/db";

// await db.user.create({
//   data: {
//     emailAddress: "test@gmail.com",
//     firstName: "Test",
//     lastName: "User",
//   },
// });

// console.log("done");

// import { GoogleGenAI } from "@google/genai";

// export const getEmbeddings = async (text) => {
//   try {
//     console.log(process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY);
//     const ai = new GoogleGenAI({
//       apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
//     });

//     const response = await ai.models.embedContent({
//       model: "gemini-embedding-exp-03-07",
//       contents: text.replace(/\n/g, " "),
//       config: {
//         taskType: "SEMANTIC_SIMILARITY",
//       },
//     });

//     console.log(response.embeddings[0]?.values.length);
//   } catch (error) {
//     console.error("error generating the embeddings", error);
//     throw error;
//   }
// };

// getEmbeddings("hello world");
