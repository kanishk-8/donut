import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateChatResponse(
  message,
  context = {},
  knowledgeBase = ""
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = `You are a helpful customer service AI assistant. ${
      knowledgeBase
        ? `Here is relevant knowledge base information:\n${knowledgeBase}\n\n`
        : ""
    }`;

    if (context.projectId) {
      prompt += `Project Context: ${JSON.stringify(context)}\n\n`;
    }

    prompt += `Customer message: ${message}\n\nProvide a helpful, professional response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function generateKnowledgeBaseSummary(content) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Please create a concise summary of this knowledge base content for customer service purposes:\n\n${content}\n\nSummary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate summary");
  }
}
