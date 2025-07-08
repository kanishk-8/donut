// Document operations utility for Supabase
import { createClientSupabase } from "./client";

export class DocumentService {
  constructor() {
    this.supabase = createClientSupabase();
  }

  // Upload a file to Supabase storage
  async uploadFile(file, userId, projectId) {
    try {
      const fileExt = file.name.split(".").pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `${userId}/${projectId}/${fileName}`;

      const { data: uploadData, error: uploadError } =
        await this.supabase.storage.from("documents").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      return {
        success: true,
        filePath: uploadData.path,
        fileName,
      };
    } catch (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Create document record in database
  async createDocument(documentData) {
    try {
      const { data, error } = await this.supabase
        .from("documents")
        .insert([documentData])
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
      console.error("Create document error:", error);
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

  // Delete a document
  async deleteDocument(documentId, userId) {
    try {
      // First get the document to get the file path
      const { data: document, error: fetchError } = await this.supabase
        .from("documents")
        .select("file_path")
        .eq("id", documentId)
        .eq("user_id", userId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Delete from storage
      const { error: storageError } = await this.supabase.storage
        .from("documents")
        .remove([document.file_path]);

      if (storageError) {
        console.warn("Storage deletion error:", storageError);
        // Continue with database deletion even if storage fails
      }

      // Delete from database
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

  // Process document content (mock for now - would integrate with actual processing service)
  async processDocument(documentId) {
    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock processing results
      const mockResults = {
        pages: Math.floor(Math.random() * 50) + 1,
        words: Math.floor(Math.random() * 10000) + 1000,
        content_preview: "This document contains information about...",
      };

      return await this.updateDocumentStatus(
        documentId,
        "processed",
        mockResults
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
