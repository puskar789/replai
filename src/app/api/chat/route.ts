import { OramaClient } from "@/lib/orama";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import type { Message } from "ai";
import { streamText } from "ai";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { accountId, messages } = await req.json();
    const orama = new OramaClient(accountId);
    await orama.initialize();

    const lastMessage = messages[messages.length - 1];
    const context = await orama.vectorSearch({ term: lastMessage.content });
    console.log(context.hits.length + " hits found");

    const prompt = {
      role: "system",
      content: `You are an AI email assistant embedded in an email client app. Your purpose is to help the user compose emails by answering questions, providing suggestions, and offering relevant information based on the context of their previous emails. 
            THE TIME NOW IS ${new Date().toLocaleString()}
      
      START CONTEXT BLOCK
      ${context.hits.map((hit) => JSON.stringify(hit.document)).join("\n")}
      END OF CONTEXT BLOCK
      
      When responding, please keep in mind:
      - Be helpful, clever, and articulate.
      - Rely on the provided email context to inform your responses.
      - If the context does not contain enough information to answer a question, politely say you don't have enough information.
      - Avoid apologizing for previous responses. Instead, indicate that you have updated your knowledge based on new information.
      - Do not invent or speculate about anything that is not directly supported by the email context.
      - Keep your responses concise and relevant to the user's questions or the email being composed.`,
    };

    const result = await streamText({
      model: google("gemini-2.5-flash-preview-05-20"),
      system: prompt.content,
      messages: [...messages],
    });

    return result.toDataStreamResponse({
      status: 200,
    });
  } catch (error) {
    console.log("error", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
