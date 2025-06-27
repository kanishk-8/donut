import { generateChatResponse } from "../../../../../lib/gemini";
import { databases } from "../../../../../lib/appwrite";
import { Query } from "appwrite";

export async function POST(request) {
  try {
    const {
      message,
      projectId,
      sessionId,
      userId,
      includeKnowledgeBase = true,
    } = await request.json();

    if (!message || !projectId) {
      return Response.json(
        { error: "Message and projectId are required" },
        { status: 400 }
      );
    }

    let knowledgeBase = "";

    // Fetch knowledge base if requested
    if (includeKnowledgeBase) {
      try {
        const kbResponse = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          "knowledge_base",
          [Query.equal("projectId", projectId)]
        );

        if (kbResponse.documents.length > 0) {
          knowledgeBase = kbResponse.documents
            .map((doc) => `${doc.title}: ${doc.content}`)
            .join("\n\n");
        }
      } catch (error) {
        console.log("Knowledge base not available:", error.message);
      }
    }

    // Generate AI response
    const aiResponse = await generateChatResponse(
      message,
      {
        projectId,
        userId,
        sessionId,
      },
      knowledgeBase
    );

    // Store conversation (optional - requires database setup)
    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        "conversations",
        "unique()",
        {
          projectId,
          userId: userId || "anonymous",
          sessionId: sessionId || `session_${Date.now()}`,
          userMessage: message,
          aiResponse,
          timestamp: new Date().toISOString(),
          includeKnowledgeBase,
        }
      );
    } catch (dbError) {
      console.log("Database storage failed:", dbError.message);
      // Continue without storing if database is not set up
    }

    return Response.json({
      response: aiResponse,
      sessionId: sessionId || `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      knowledgeBaseUsed: !!knowledgeBase,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
