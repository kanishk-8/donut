import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, projectId, sessionId, includeKnowledgeBase = true } = body;

    if (!message || !projectId) {
      return NextResponse.json(
        { error: "Message and projectId are required" },
        { status: 400 }
      );
    }

    // For development, let's provide working responses without strict auth
    // This allows testing the playground functionality

    let relevantDocs = [];
    let user = null;

    // Try to authenticate and get real data, but don't fail if it doesn't work
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      // Attempt to get user (this might fail, and that's okay for now)
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {
        user = userData.user;

        // Try to get documents if we have a user
        if (includeKnowledgeBase) {
          const { data: documents } = await supabase
            .from("documents")
            .select("id, name, original_name, content_preview")
            .eq("project_id", projectId)
            .eq("user_id", user.id)
            .eq("status", "processed")
            .limit(5);

          relevantDocs = documents || [];
        }
      }
    } catch (error) {
      console.log("Auth/DB attempt failed, using mock data:", error.message);
      // Continue with mock response
    }

    // Generate AI response
    const aiResponse = generateAIResponse(message, relevantDocs);
    const conversationId = sessionId || `session_${Date.now()}`;

    return NextResponse.json({
      success: true,
      response: aiResponse,
      sessionId: conversationId,
      timestamp: new Date().toISOString(),
      knowledgeBaseUsed: relevantDocs.length > 0,
      documentsReferenced: relevantDocs.length,
      authenticatedUser: !!user,
      mode: user ? "authenticated" : "demo",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateAIResponse(message, documents) {
  const responses = [
    "Thank you for your message. Based on the information in our knowledge base, I can help you with that.",
    "I understand your question. Let me provide you with relevant information from our documentation.",
    "Based on our available resources, here's what I can tell you about your inquiry.",
    "I've found some relevant information in our knowledge base that should help answer your question.",
    "Thank you for reaching out. I can assist you with this based on our documentation.",
  ];

  const baseResponse = responses[Math.floor(Math.random() * responses.length)];

  if (documents.length > 0) {
    const docNames = documents
      .map((doc) => doc.original_name || doc.name)
      .join(", ");
    return `${baseResponse}\n\nI've referenced the following documents: ${docNames}.\n\nFor your specific question about "${message}", here's the relevant information based on your uploaded knowledge base...`;
  }

  return `${baseResponse}\n\nRegarding your question: "${message}", I'll provide a helpful response. (Note: This is a demo response since no knowledge base documents are available yet.)`;
}
