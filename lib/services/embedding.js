// Embedding service using Google Gemini API
import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from "mammoth";

// Dynamic import for PDF.js to avoid server-side issues
let pdfjsLib = null;

// Configure PDF.js worker
if (typeof window !== "undefined") {
  // Only import PDF.js on client side
  import("pdfjs-dist").then((module) => {
    pdfjsLib = module;
    // Disable worker for client-side to avoid worker loading issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  });
}

class EmbeddingService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
  }

  // Generate embedding for a single text
  async generateEmbedding(text) {
    try {
      const result = await this.model.embedContent(text);
      return {
        success: true,
        embedding: result.embedding.values,
        dimension: result.embedding.values.length,
      };
    } catch (error) {
      console.error("Embedding generation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Generate embeddings for multiple text chunks
  async generateBatchEmbeddings(texts) {
    try {
      const embeddings = [];
      for (const text of texts) {
        const result = await this.generateEmbedding(text);
        if (result.success) {
          embeddings.push(result.embedding);
        } else {
          throw new Error(`Failed to generate embedding: ${result.error}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100)); // Prevent rate limiting
      }

      return {
        success: true,
        embeddings,
      };
    } catch (error) {
      console.error("Batch embedding generation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Split large text into manageable chunks
  splitTextIntoChunks(text, maxChunkSize = 2000, overlap = 50) {
    const chunks = [];
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    let currentChunk = "";
    let currentSize = 0;

    for (const sentence of sentences) {
      const sentenceLength = sentence.trim().length;

      if (
        currentSize + sentenceLength > maxChunkSize &&
        currentChunk.length > 0
      ) {
        chunks.push(currentChunk.trim());

        // Add overlap
        const words = currentChunk.split(" ");
        const overlapWords = words.slice(-Math.min(overlap / 5, words.length));
        currentChunk = overlapWords.join(" ") + " " + sentence.trim();
        currentSize = currentChunk.length;
      } else {
        currentChunk += (currentChunk ? " " : "") + sentence.trim();
        currentSize = currentChunk.length;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks.filter((chunk) => chunk.length > 50);
  }

  // Master file extraction handler
  async extractTextFromFile(file) {
    try {
      const fileType = file.name.split(".").pop().toLowerCase();

      switch (fileType) {
        case "txt":
        case "md":
        case "csv":
          return await file.text();

        case "json":
          const jsonContent = JSON.parse(await file.text());
          return JSON.stringify(jsonContent, null, 2);

        case "pdf":
          return await this.extractTextFromPDF(file);

        case "docx":
          return await this.extractTextFromDOCX(file);

        case "doc":
          throw new Error(
            ".doc not supported. Please convert it to .docx first."
          );

        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error("Text extraction error:", error);
      throw error;
    }
  }

  // PDF text extraction using pdfjs-dist
  async extractTextFromPDF(file) {
    // Check if we're on the server side
    if (typeof window === "undefined") {
      throw new Error("PDF processing is only available on the client side");
    }

    // Wait for PDF.js to load if it hasn't already
    if (!pdfjsLib) {
      await new Promise((resolve) => {
        const checkPdfJs = () => {
          if (pdfjsLib) {
            resolve();
          } else {
            setTimeout(checkPdfJs, 100);
          }
        };
        checkPdfJs();
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return sanitizeUnicode(fullText);
  }

  // DOCX text extraction using mammoth
  async extractTextFromDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    const { value: text } = await mammoth.extractRawText({ arrayBuffer });
    return sanitizeUnicode(text);
  }
}

// Utility to sanitize Unicode and control characters
function sanitizeUnicode(text) {
  return text
    .replace(/\\u([0-9a-fA-F]{0,3})([^0-9a-fA-F]|$)/g, "") // Remove bad \u escapes
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove control chars
}

// Export a singleton instance
export const embeddingService = new EmbeddingService();
