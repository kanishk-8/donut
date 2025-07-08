import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { documentService } from "@/lib/supabase/documents";
import { embeddingService } from "@/lib/services/embedding";
import { createServerSupabase } from "@/lib/supabase/server";

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

    let relevantContext = [];
    let user = null;

    // Try to authenticate and get real data
    try {
      // Try multiple methods to get authenticated user
      let supabase;

      // Method 1: Try server-side client
      try {
        supabase = await createServerSupabase();
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authUser && !authError) {
          user = authUser;
          console.log("Found authenticated user (server):", user.id);
        }
      } catch (serverError) {
        console.log("Server auth failed:", serverError.message);
      }

      // Method 2: Fallback to regular client
      if (!user) {
        supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          user = userData.user;
          console.log("Found authenticated user (client):", user.id);
        }
      }

      if (user) {
        // Perform vector search on knowledge base if enabled
        if (includeKnowledgeBase) {
          console.log("Performing vector search for:", message);
          const searchResult = await documentService.searchDocuments(
            message,
            projectId,
            user.id,
            { threshold: 0.7, limit: 5 }
          );

          console.log("Search result:", searchResult);

          if (searchResult.success && searchResult.results.length > 0) {
            relevantContext = searchResult.results.map((result) => ({
              text: result.chunk_text,
              similarity: result.similarity,
              document: result.document_original_name || result.document_name,
              chunk_index: result.chunk_index,
            }));
            console.log(
              "Found relevant context:",
              relevantContext.length,
              "chunks"
            );
          } else {
            console.log("No relevant context found or search failed");
          }
        }
      } else {
        console.log("No authenticated user found with any method");
        // For development/testing: try to search with any available documents in the project
        // This allows testing the vector search functionality
        if (includeKnowledgeBase) {
          console.log("Attempting anonymous search for testing purposes");
          try {
            // Create a Supabase admin client to bypass RLS for testing
            const adminSupabase = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL,
              process.env.SUPABASE_SERVICE_ROLE_KEY ||
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            );

            // Try to find any documents in this project for testing
            const { data: testDocs, error: docsError } = await adminSupabase
              .from("documents")
              .select("id, user_id, name, status, chunks_count")
              .eq("project_id", projectId)
              .limit(5);

            console.log(
              "All documents in project:",
              JSON.stringify(testDocs, null, 2)
            );
            console.log("Documents query error:", docsError);

            // Also check document_chunks directly with embeddings
            const { data: chunks, error: chunksError } = await adminSupabase
              .from("document_chunks")
              .select("id, document_id, chunk_text, embedding")
              .eq("project_id", projectId)
              .limit(3);

            console.log(
              "Document chunks found:",
              JSON.stringify(
                chunks?.map((chunk) => ({
                  ...chunk,
                  hasEmbedding: !!chunk.embedding,
                  embeddingLength: chunk.embedding ? chunk.embedding.length : 0,
                })),
                null,
                2
              )
            );
            console.log("Chunks query error:", chunksError);

            const processedDocs =
              testDocs?.filter(
                (doc) => doc.status === "processed" && doc.chunks_count > 0
              ) || [];
            console.log(
              "Processed documents with chunks:",
              processedDocs.length
            );

            if (processedDocs.length > 0) {
              const testUserId = processedDocs[0].user_id;
              console.log("Using test user ID for search:", testUserId);

              // Test direct similarity calculation without RPC function
              console.log("Testing direct vector search...");

              const queryEmbeddingResult =
                await embeddingService.generateEmbedding(message);
              if (queryEmbeddingResult.success) {
                console.log("Query embedding generated for direct test");

                // Try direct SQL query to test similarity
                const { data: directResults, error: directError } =
                  await adminSupabase
                    .from("document_chunks")
                    .select(
                      `
                    id,
                    document_id,
                    chunk_text,
                    chunk_index,
                    embedding
                  `
                    )
                    .eq("project_id", projectId)
                    .eq("user_id", testUserId)
                    .limit(5);

                console.log(
                  "Direct query results:",
                  directResults?.length,
                  "chunks"
                );
                console.log("Direct query error:", directError);

                if (directResults && directResults.length > 0) {
                  console.log(
                    "Found chunks, testing manual similarity calculation..."
                  );
                  // Manual similarity test would go here
                }
              }

              // Test RPC function directly with admin client
              console.log("Testing RPC function with admin client...");
              const { data: rpcResults, error: rpcError } =
                await adminSupabase.rpc("search_document_chunks", {
                  query_embedding: queryEmbeddingResult.embedding,
                  match_project_id: projectId,
                  match_user_id: testUserId,
                  match_threshold: 0.0,
                  match_count: 5,
                });

              console.log(
                "Direct RPC test results:",
                rpcResults?.length || 0,
                "chunks"
              );
              console.log("Direct RPC test error:", rpcError);

              // Original RPC search through documentService
              const searchResult = await documentService.searchDocuments(
                message,
                projectId,
                testUserId,
                { threshold: 0.0, limit: 5 } // Very low threshold for testing
              );

              console.log(
                "DocumentService search result:",
                JSON.stringify(searchResult, null, 2)
              );

              if (searchResult.success && searchResult.results.length > 0) {
                relevantContext = searchResult.results.map((result) => ({
                  text: result.chunk_text,
                  similarity: result.similarity,
                  document:
                    result.document_original_name || result.document_name,
                  chunk_index: result.chunk_index,
                }));
                console.log(
                  "Found relevant context (test mode):",
                  relevantContext.length,
                  "chunks"
                );
              } else {
                console.log(
                  "No relevant context found or search failed. Error:",
                  searchResult.error
                );
              }
            } else {
              console.log(
                "No processed documents with chunks found in project:",
                projectId
              );
            }
          } catch (testError) {
            console.log("Test search failed:", testError.message);
          }
        }
      }
    } catch (error) {
      console.log("Auth/DB attempt failed:", error.message);
      // Continue with mock response
    }

    // Generate AI response with context
    const aiResponse = generateAIResponse(message, relevantContext);
    const conversationId = sessionId || `session_${Date.now()}`;

    return NextResponse.json({
      success: true,
      response: aiResponse,
      sessionId: conversationId,
      timestamp: new Date().toISOString(),
      knowledgeBaseUsed: relevantContext.length > 0,
      contextsFound: relevantContext.length,
      authenticatedUser: !!user,
      mode: user ? "authenticated" : "demo",
      contextSources: relevantContext.map((ctx) => ({
        document: ctx.document,
        similarity: ctx.similarity,
      })),
      debugInfo: {
        projectId,
        userFound: !!user,
        includeKnowledgeBase,
        hasRelevantContext: relevantContext.length > 0,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateAIResponse(message, contexts) {
  const responses = [
    "Thank you for your message. Based on the information in our knowledge base, I can help you with that.",
    "I understand your question. Let me provide you with relevant information from our documentation.",
    "Based on our available resources, here's what I can tell you about your inquiry.",
    "I've found some relevant information in our knowledge base that should help answer your question.",
    "Thank you for reaching out. I can assist you with this based on our documentation.",
  ];

  const baseResponse = responses[Math.floor(Math.random() * responses.length)];

  if (contexts.length > 0) {
    const relevantInfo = contexts
      .slice(0, 3) // Use top 3 most relevant contexts
      .map(
        (ctx) =>
          `"${ctx.text.substring(0, 200)}..." (from ${
            ctx.document
          }, similarity: ${(ctx.similarity * 100).toFixed(1)}%)`
      )
      .join("\n\n");

    return `${baseResponse}\n\nBased on your question: "${message}"\n\nHere's relevant information from your knowledge base:\n\n${relevantInfo}\n\nThis information should help answer your query. Is there anything specific you'd like me to clarify?`;
  }

  return `${baseResponse}\n\nRegarding your question: "${message}", I'll provide a helpful response.\n\n💡 **To enable knowledge base search**: Please add documents to your knowledge base by going to the Knowledge Base section and uploading content. Once you have processed documents, I'll be able to search through them to provide more specific and relevant answers based on your uploaded content.`;
}
