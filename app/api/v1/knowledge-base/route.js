import { databases, account } from "../../../../lib/appwrite";
import { generateKnowledgeBaseSummary } from "../../../../lib/gemini";
// import { Query } from "appwrite";

// Helper function to verify authentication
async function verifyAuth(request) {
  try {
    // For server-side API routes, we need to check cookies instead of Authorization header
    const cookies = request.headers.get("cookie");

    if (!cookies) {
      throw new Error("No session cookie found");
    }

    // Extract session cookie
    const sessionMatch = cookies.match(/a_session_[^=]+=([^;]+)/);
    if (!sessionMatch) {
      throw new Error("No valid session cookie found");
    }

    // Use account.get() to verify the session
    const user = await account.get();
    return user;
  } catch (error) {
    throw new Error("Invalid authentication: " + error.message);
  }
}

export async function GET(request) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    const userId = user.$id;

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return Response.json({ error: "ProjectId is required" }, { status: 400 });
    }

    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        "knowledge_base",
        [
          Query.equal("projectId", projectId),
          Query.equal("userId", userId), // Only get documents for authenticated user
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
        error: "Authentication required",
        message: error.message,
      },
      { status: 401 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    const userId = user.$id;

    const {
      title,
      content,
      projectId,
      category = "general",
    } = await request.json();

    console.log("POST Request Data:", { title, content, projectId, category }); // Debug log

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
      console.log("Generated summary:", summary); // Debug log
    } catch (error) {
      console.log("Summary generation failed:", error.message);
      summary = content.substring(0, 200) + "...";
    }

    try {
      console.log("Attempting to create document in database..."); // Debug log

      const document = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        "knowledge_base",
        "unique()",
        {
          title,
          content,
          summary,
          projectId,
          category,
          userId, // Add userId to associate document with authenticated user
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );

      console.log("Document created successfully:", document.$id); // Debug log

      return Response.json({
        success: true,
        document,
      });
    } catch (dbError) {
      console.error("Database Error Details:", dbError); // Detailed error log

      return Response.json(
        {
          success: false,
          error: "Failed to save to database",
          details: dbError.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Knowledge Base POST Error:", error);

    // Check if it's an authentication error
    if (error.message.includes("Invalid authentication")) {
      return Response.json(
        {
          error: "Authentication required",
          message: error.message,
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
