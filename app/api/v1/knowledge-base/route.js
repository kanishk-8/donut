import { databases } from "../../../../lib/appwrite";
import { generateKnowledgeBaseSummary } from "../../../../lib/gemini";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return Response.json({ error: "ProjectId is required" }, { status: 400 });
    }

    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "default",
        "knowledge_base",
        [
          // Add query to filter by projectId when you set up the database
        ]
      );

      return Response.json({
        documents: response.documents || [],
        total: response.total || 0,
      });
    } catch (error) {
      // Return empty array if database is not set up
      return Response.json({
        documents: [],
        total: 0,
        note: "Knowledge base not configured yet",
      });
    }
  } catch (error) {
    console.error("Knowledge Base GET Error:", error);
    return Response.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const {
      title,
      content,
      projectId,
      category = "general",
    } = await request.json();

    if (!title || !content || !projectId) {
      return Response.json(
        { error: "Title, content, and projectId are required" },
        { status: 400 }
      );
    }

    // Generate summary using Gemini
    let summary = "";
    try {
      summary = await generateKnowledgeBaseSummary(content);
    } catch (error) {
      console.log("Summary generation failed:", error.message);
      summary = content.substring(0, 200) + "...";
    }

    try {
      const document = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "default",
        "knowledge_base",
        "unique()",
        {
          title,
          content,
          summary,
          projectId,
          category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );

      return Response.json({
        success: true,
        document,
      });
    } catch (dbError) {
      // Return mock response if database is not set up
      return Response.json({
        success: true,
        document: {
          $id: `mock_${Date.now()}`,
          title,
          content,
          summary,
          projectId,
          category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        note: "Mock response - database not configured",
      });
    }
  } catch (error) {
    console.error("Knowledge Base POST Error:", error);
    return Response.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
