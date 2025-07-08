// Document operations utility for Supabase
import { createClientSupabase } from "./client";
import { embeddingService } from "../services/embedding";
import { createClient } from "@supabase/supabase-js";

export class DocumentService {
  constructor() {
    this.supabase = createClientSupabase();
  }

  // Create document record directly from text content (no file upload)
  async createDocumentFromText(documentData, textContent) {
    try {
      // Create document record
      const { data: document, error: createError } = await this.supabase
        .from("documents")
        .insert([documentData])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Process the text content immediately
      const processResult = await this.processDocumentText(
        document.id,
        textContent,
        documentData
      );

      if (!processResult.success) {
        // Clean up the document if processing fails
        await this.supabase.from("documents").delete().eq("id", document.id);
        throw new Error(processResult.error);
      }

      return {
        success: true,
        document: processResult.document,
      };
    } catch (error) {
      console.error("Create document error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Process text content and create embeddings
  async processDocumentText(documentId, textContent, documentData) {
    try {
      // Split text into chunks
      const chunks = embeddingService.splitTextIntoChunks(textContent);

      if (chunks.length === 0) {
        throw new Error("No text content found in document");
      }

      // Generate embeddings for each chunk
      const embeddingsResult = await embeddingService.generateBatchEmbeddings(
        chunks
      );

      if (!embeddingsResult.success) {
        throw new Error(
          `Failed to generate embeddings: ${embeddingsResult.error}`
        );
      }

      // Store chunks and embeddings in database
      const chunkRecords = chunks.map((chunk, index) => ({
        document_id: documentId,
        project_id: documentData.project_id,
        user_id: documentData.user_id,
        chunk_text: chunk,
        chunk_index: index,
        chunk_size: chunk.length,
        embedding: embeddingsResult.embeddings[index],
        metadata: {
          file_type: documentData.file_type,
          original_name: documentData.original_name,
        },
      }));

      const { error: insertError } = await this.supabase
        .from("document_chunks")
        .insert(chunkRecords);

      if (insertError) {
        throw insertError;
      }

      // Update document with processing results
      const processingResults = {
        pages: Math.ceil(textContent.length / 2000), // Estimate pages
        words: textContent.split(/\s+/).length,
        content_preview: textContent.substring(0, 200) + "...",
        chunks_count: chunks.length,
        status: "processed",
        processed_at: new Date().toISOString(),
      };

      const { data: updatedDocument, error: updateError } = await this.supabase
        .from("documents")
        .update(processingResults)
        .eq("id", documentId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      return {
        success: true,
        document: updatedDocument,
      };
    } catch (error) {
      console.error("Process document text error:", error);
      await this.updateDocumentStatus(documentId, "error", {
        processing_error: error.message,
      });
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get all documents for a project
  async getDocuments(projectId, userId) {
    try {
      const { data, error } = await this.supabase
        .from("documents")
        .select("*")
        .eq("project_id", projectId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return {
        success: true,
        documents: data || [],
      };
    } catch (error) {
      console.error("Get documents error:", error);
      return {
        success: false,
        error: error.message,
        documents: [],
      };
    }
  }

  // Delete a document and its chunks
  async deleteDocument(documentId, userId) {
    try {
      // Delete document chunks first
      await this.deleteDocumentChunks(documentId);

      // Delete document record
      const { error: deleteError } = await this.supabase
        .from("documents")
        .delete()
        .eq("id", documentId)
        .eq("user_id", userId);

      if (deleteError) {
        throw deleteError;
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Delete document error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Update document status (e.g., after processing)
  async updateDocumentStatus(documentId, status, additionalData = {}) {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
        ...additionalData,
      };

      if (status === "processed") {
        updateData.processed_at = new Date().toISOString();
      }

      const { data, error } = await this.supabase
        .from("documents")
        .update(updateData)
        .eq("id", documentId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        document: data,
      };
    } catch (error) {
      console.error("Update document status error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get download URL for a document
  async getDownloadUrl(filePath) {
    try {
      const { data, error } = await this.supabase.storage
        .from("documents")
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) {
        throw error;
      }

      return {
        success: true,
        url: data.signedUrl,
      };
    } catch (error) {
      console.error("Get download URL error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Process document content (extract text and create embeddings)
  async processDocument(documentId) {
    try {
      // Get document details
      const { data: document, error: docError } = await this.supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (docError || !document) {
        throw new Error("Document not found");
      }

      // Update status to processing
      await this.updateDocumentStatus(documentId, "processing");

      // Get file from storage
      const { data: fileData, error: downloadError } =
        await this.supabase.storage
          .from("documents")
          .download(document.file_path);

      if (downloadError) {
        throw downloadError;
      }

      // Convert blob to file object for text extraction
      const file = new File([fileData], document.original_name, {
        type: document.mime_type,
      });

      // Extract text from file
      const extractedText = await embeddingService.extractTextFromFile(file);

      // Split text into chunks
      const chunks = embeddingService.splitTextIntoChunks(extractedText);

      if (chunks.length === 0) {
        throw new Error("No text content found in document");
      }

      // Generate embeddings for each chunk
      const embeddingsResult = await embeddingService.generateBatchEmbeddings(
        chunks
      );

      if (!embeddingsResult.success) {
        throw new Error(
          `Failed to generate embeddings: ${embeddingsResult.error}`
        );
      }

      // Store chunks and embeddings in database
      const chunkRecords = chunks.map((chunk, index) => ({
        document_id: documentId,
        project_id: document.project_id,
        user_id: document.user_id,
        chunk_text: chunk,
        chunk_index: index,
        chunk_size: chunk.length,
        embedding: embeddingsResult.embeddings[index],
        metadata: {
          file_type: document.file_type,
          original_name: document.original_name,
        },
      }));

      const { error: insertError } = await this.supabase
        .from("document_chunks")
        .insert(chunkRecords);

      if (insertError) {
        throw insertError;
      }

      // Update document with processing results
      const processingResults = {
        pages: Math.ceil(extractedText.length / 2000), // Estimate pages
        words: extractedText.split(/\s+/).length,
        content_preview: extractedText.substring(0, 200) + "...",
        chunks_count: chunks.length,
      };

      return await this.updateDocumentStatus(
        documentId,
        "processed",
        processingResults
      );
    } catch (error) {
      console.error("Process document error:", error);
      await this.updateDocumentStatus(documentId, "error", {
        processing_error: error.message,
      });
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Search documents using vector similarity
  async searchDocuments(query, projectId, userId, options = {}) {
    try {
      const { threshold = 0.7, limit = 10 } = options;

      console.log("DocumentService search parameters:", {
        query,
        projectId,
        userId,
        threshold,
        limit,
      });

      // Generate embedding for the query
      const queryEmbeddingResult = await embeddingService.generateEmbedding(
        query
      );

      if (!queryEmbeddingResult.success) {
        console.error(
          "Failed to generate query embedding:",
          queryEmbeddingResult.error
        );
        throw new Error(
          `Failed to generate query embedding: ${queryEmbeddingResult.error}`
        );
      }

      console.log(
        "DocumentService: Query embedding generated successfully, dimension:",
        queryEmbeddingResult.dimension
      );

      // Use service role client to bypass RLS for testing
      const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      // Search using the vector similarity function
      const { data, error } = await adminSupabase.rpc(
        "search_document_chunks",
        {
          query_embedding: queryEmbeddingResult.embedding,
          match_project_id: projectId,
          match_user_id: userId,
          match_threshold: threshold,
          match_count: limit,
        }
      );

      console.log("DocumentService RPC result:", {
        data,
        error,
        dataLength: data?.length,
      });

      if (error) {
        console.error("DocumentService RPC search error:", error);
        throw error;
      }

      return {
        success: true,
        results: data || [],
      };
    } catch (error) {
      console.error("DocumentService search error:", error);
      return {
        success: false,
        error: error.message,
        results: [],
      };
    }
  }

  // Get document chunks for a specific document
  async getDocumentChunks(documentId) {
    try {
      const { data, error } = await this.supabase
        .from("document_chunks")
        .select("*")
        .eq("document_id", documentId)
        .order("chunk_index", { ascending: true });

      if (error) {
        throw error;
      }

      return {
        success: true,
        chunks: data || [],
      };
    } catch (error) {
      console.error("Get document chunks error:", error);
      return {
        success: false,
        error: error.message,
        chunks: [],
      };
    }
  }

  // Delete document chunks when document is deleted
  async deleteDocumentChunks(documentId) {
    try {
      const { error } = await this.supabase
        .from("document_chunks")
        .delete()
        .eq("document_id", documentId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Delete document chunks error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get file type information
  getFileTypeInfo(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();
    const typeMap = {
      pdf: { label: "PDF", color: "text-red-500" },
      doc: { label: "Word", color: "text-blue-500" },
      docx: { label: "Word", color: "text-blue-500" },
      txt: { label: "Text", color: "text-gray-500" },
      md: { label: "Markdown", color: "text-purple-500" },
      csv: { label: "CSV", color: "text-green-500" },
      json: { label: "JSON", color: "text-yellow-500" },
    };

    return (
      typeMap[extension] || {
        label: extension.toUpperCase(),
        color: "text-gray-500",
      }
    );
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// Export a singleton instance
export const documentService = new DocumentService();
