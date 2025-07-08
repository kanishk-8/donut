"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "@/context/themecontext";
import {
  Upload,
  File,
  FileText,
  Image,
  Download,
  Trash2,
  Search,
  Filter,
  Plus,
  Check,
  X,
  Eye,
  AlertCircle,
  Loader2,
  BookOpen,
  Database,
} from "lucide-react";
import { documentService } from "@/lib/supabase/documents";
import { embeddingService } from "@/lib/services/embedding";
import { useAuth } from "@/context/authcontext";
import { useProject } from "@/context/projectcontext";

const KnowledgeBasePage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { currentProject, fetchProject } = useProject();
  const params = useParams();
  const projectId = params.id;

  // State
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showPreview, setShowPreview] = useState(null);
  const [error, setError] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [documentName, setDocumentName] = useState("");

  // File types configuration
  const supportedTypes = {
    pdf: { icon: FileText, color: "text-red-500", label: "PDF" },
    doc: { icon: FileText, color: "text-blue-500", label: "Word" },
    docx: { icon: FileText, color: "text-blue-500", label: "Word" },
    txt: { icon: File, color: "text-gray-500", label: "Text" },
    md: { icon: File, color: "text-purple-500", label: "Markdown" },
    csv: { icon: Database, color: "text-green-500", label: "CSV" },
    json: { icon: Database, color: "text-yellow-500", label: "JSON" },
  };

  // Load documents on component mount
  useEffect(() => {
    if (projectId && user?.id) {
      fetchProject(projectId);
      loadDocuments();
    }
  }, [projectId, user?.id]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await documentService.getDocuments(projectId, user.id);

      if (result.success) {
        setDocuments(result.documents);
      } else {
        setError(result.error || "Failed to load documents");
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error loading documents:", error);
      setError("Failed to load documents");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return supportedTypes[extension];
    });

    setSelectedFiles(validFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 && !textContent.trim()) return;

    setUploading(true);
    setError("");

    try {
      // Handle text input
      if (textContent.trim()) {
        const documentData = {
          project_id: projectId,
          user_id: user.id,
          name: documentName || "Text Document",
          original_name: documentName || "Text Document",
          file_type: "txt",
          status: "processing",
        };

        const result = await documentService.createDocumentFromText(
          documentData,
          textContent
        );

        if (result.success) {
          setDocuments((prev) => [result.document, ...prev]);
          setTextContent("");
          setDocumentName("");
          setShowTextInput(false);
        } else {
          throw new Error(result.error);
        }
      }

      // Handle file uploads
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileId = `${Date.now()}-${i}`;

        try {
          setUploadProgress((prev) => ({ ...prev, [fileId]: 25 }));

          // Extract text from file
          const extractedText = await embeddingService.extractTextFromFile(
            file
          );

          setUploadProgress((prev) => ({ ...prev, [fileId]: 50 }));

          // Create document with text content
          const documentData = {
            project_id: projectId,
            user_id: user.id,
            name: file.name,
            original_name: file.name,
            file_type: file.name.split(".").pop().toLowerCase(),
            status: "processing",
          };

          const result = await documentService.createDocumentFromText(
            documentData,
            extractedText
          );

          if (!result.success) {
            throw new Error(result.error);
          }

          setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));
          setDocuments((prev) => [result.document, ...prev]);
        } catch (fileError) {
          console.error(`Upload error for ${file.name}:`, fileError);
          setError(`Failed to upload ${file.name}: ${fileError.message}`);
        }
      }

      // Clear selected files and progress after a delay
      setTimeout(() => {
        setSelectedFiles([]);
        setUploadProgress({});
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (docId) => {
    try {
      const result = await documentService.deleteDocument(docId, user.id);

      if (result.success) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      } else {
        setError(result.error || "Failed to delete document");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError("Failed to delete document");
    }
  };

  const handleDownload = async (doc) => {
    setError(
      "Downloads not available - documents are stored as vector embeddings only"
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processed":
        return theme === "dark"
          ? "bg-green-900/30 text-green-400 border border-green-500/30"
          : "bg-green-100 text-green-800";
      case "processing":
        return theme === "dark"
          ? "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
          : "bg-yellow-100 text-yellow-800";
      case "error":
        return theme === "dark"
          ? "bg-red-900/30 text-red-400 border border-red-500/30"
          : "bg-red-100 text-red-800";
      default:
        return theme === "dark"
          ? "bg-gray-700/50 text-gray-300 border border-gray-600"
          : "bg-gray-100 text-gray-800";
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = (doc.name || doc.original_name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || doc.file_type === selectedType;
    return matchesSearch && matchesType;
  });

  const processedCount = documents.filter(
    (doc) => doc.status === "processed"
  ).length;

  return (
    <div
      className={`p-4 md:p-8 overflow-y-auto min-h-screen ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-2xl sm:text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Knowledge Base - {currentProject?.name || "Loading..."}
          </h1>
          <p
            className={`text-sm sm:text-base ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Upload and manage documents to train your AI agent
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              theme === "dark"
                ? "bg-red-900/20 border-red-500/30 text-red-400"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="mt-1 text-sm">{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div
            className={`backdrop-blur-3xl rounded-xl p-4 border ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {documents.length}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Documents
                </p>
              </div>
            </div>
          </div>

          <div
            className={`backdrop-blur-3xl rounded-xl p-4 border ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <Check className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {processedCount}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Processed
                </p>
              </div>
            </div>
          </div>

          <div
            className={`backdrop-blur-3xl rounded-xl p-4 border ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <Database className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {documents
                    .reduce((acc, doc) => acc + (doc.words || 0), 0)
                    .toLocaleString()}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Words
                </p>
              </div>
            </div>
          </div>

          <div
            className={`backdrop-blur-3xl rounded-xl p-4 border ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-indigo-500 mr-3" />
              <div>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {documents
                    .filter((doc) => doc.chunks_count)
                    .reduce((acc, doc) => acc + (doc.chunks_count || 0), 0)
                    .toLocaleString()}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Vector Chunks
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div
          className={`backdrop-blur-3xl rounded-2xl p-6 border mb-8 ${
            theme === "dark"
              ? "bg-black/20 border-white/10"
              : "bg-white/90 border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Add Knowledge Base Content
          </h2>

          {/* Toggle between file upload and text input */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowTextInput(false)}
              className={`px-4 py-2 rounded-lg transition-all ${
                !showTextInput
                  ? "bg-indigo-600 text-white"
                  : theme === "dark"
                  ? "bg-white/10 text-gray-300 hover:bg-white/20"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Upload Files
            </button>
            <button
              onClick={() => setShowTextInput(true)}
              className={`px-4 py-2 rounded-lg transition-all ${
                showTextInput
                  ? "bg-indigo-600 text-white"
                  : theme === "dark"
                  ? "bg-white/10 text-gray-300 hover:bg-white/20"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Add Text Directly
            </button>
          </div>

          {showTextInput ? (
            /* Text Input Section */
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Document Name
                </label>
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name..."
                  className={`w-full p-3 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                    theme === "dark"
                      ? "bg-black/20 border-white/10 text-gray-100"
                      : "bg-white/70 border-gray-200 text-gray-900"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Content
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Paste or type your content here..."
                  rows={10}
                  className={`w-full p-3 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                    theme === "dark"
                      ? "bg-black/20 border-white/10 text-gray-100"
                      : "bg-white/70 border-gray-200 text-gray-900"
                  }`}
                />
              </div>
              <button
                onClick={handleUpload}
                disabled={uploading || !textContent.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add to Knowledge Base
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50/50"
                    : theme === "dark"
                    ? "border-white/20 hover:border-white/30"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Upload
                  className={`w-12 h-12 mx-auto mb-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <h3
                  className={`text-lg font-medium mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Drop files here or click to browse
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Supported formats: PDF, DOC, DOCX, TXT, MD, CSV, JSON
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.md,.csv,.json"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Browse Files
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h3
                    className={`text-lg font-medium mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <div className="space-y-2 mb-4">
                    {selectedFiles.map((file, index) => {
                      const extension = file.name
                        .split(".")
                        .pop()
                        .toLowerCase();
                      const FileIcon = supportedTypes[extension]?.icon || File;
                      const fileId = Date.now() + index;
                      const progress = uploadProgress[fileId] || 0;

                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            theme === "dark"
                              ? "bg-white/5 border-white/10"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FileIcon
                              className={`w-5 h-5 ${
                                supportedTypes[extension]?.color ||
                                "text-gray-500"
                              }`}
                            />
                            <div>
                              <p
                                className={`font-medium ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {file.name}
                              </p>
                              <p
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          {uploading && progress > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {progress}%
                              </span>
                            </div>
                          )}
                          {!uploading && (
                            <button
                              onClick={() =>
                                setSelectedFiles((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                              className={`p-1 rounded hover:bg-red-500/20 transition-colors ${
                                theme === "dark"
                                  ? "text-red-400"
                                  : "text-red-600"
                              }`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Files
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div
          className={`backdrop-blur-3xl rounded-2xl p-6 border mb-8 ${
            theme === "dark"
              ? "bg-black/20 border-white/10"
              : "bg-white/90 border-gray-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  theme === "dark"
                    ? "bg-black/20 border-white/10 text-white placeholder-gray-400"
                    : "bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`px-4 py-2 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                theme === "dark"
                  ? "bg-black/20 border-white/10 text-white"
                  : "bg-white/70 border-gray-200 text-gray-900"
              }`}
            >
              <option value="all">All Types</option>
              {Object.entries(supportedTypes).map(([type, config]) => (
                <option key={type} value={type}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Documents List */}
        {loading ? (
          <div
            className={`text-center py-12 backdrop-blur-3xl rounded-2xl border ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              Loading documents...
            </p>
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div
            className={`backdrop-blur-3xl rounded-2xl border overflow-hidden ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={`border-b ${
                    theme === "dark" ? "border-white/10" : "border-gray-200"
                  }`}
                >
                  <tr>
                    <th
                      className={`text-left p-4 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Document
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Type
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Chunks
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Status
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Uploaded
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => {
                    const FileIcon =
                      supportedTypes[doc.file_type]?.icon || File;

                    return (
                      <tr
                        key={doc.id}
                        className={`border-b hover:bg-black/5 transition-colors ${
                          theme === "dark"
                            ? "border-white/10"
                            : "border-gray-200"
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <FileIcon
                              className={`w-5 h-5 ${
                                supportedTypes[doc.file_type]?.color ||
                                "text-gray-500"
                              }`}
                            />
                            <div>
                              <p
                                className={`font-medium ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {doc.original_name || doc.name}
                              </p>
                              <p
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {doc.pages || 0} pages •{" "}
                                {(doc.words || 0).toLocaleString()} words
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs rounded font-medium ${
                              theme === "dark"
                                ? "bg-white/10 text-gray-300 border border-white/20"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            {supportedTypes[doc.file_type]?.label ||
                              doc.file_type?.toUpperCase()}
                          </span>
                        </td>
                        <td
                          className={`p-4 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {doc.chunks_count || 0} chunks
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs rounded font-medium ${getStatusColor(
                              doc.status
                            )}`}
                          >
                            {doc.status === "processing" && (
                              <Loader2 className="w-3 h-3 inline mr-1 animate-spin" />
                            )}
                            {doc.status?.charAt(0).toUpperCase() +
                              doc.status?.slice(1)}
                          </span>
                        </td>
                        <td
                          className={`p-4 text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {new Date(doc.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowPreview(doc)}
                              className={`p-1 rounded hover:bg-blue-500/20 transition-colors ${
                                theme === "dark"
                                  ? "text-blue-400"
                                  : "text-blue-600"
                              }`}
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(doc)}
                              className={`p-1 rounded hover:bg-green-500/20 transition-colors ${
                                theme === "dark"
                                  ? "text-green-400"
                                  : "text-green-600"
                              }`}
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteDocument(doc.id)}
                              className={`p-1 rounded hover:bg-red-500/20 transition-colors ${
                                theme === "dark"
                                  ? "text-red-400"
                                  : "text-red-600"
                              }`}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div
            className={`text-center py-12 backdrop-blur-3xl rounded-2xl border ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3
              className={`text-xl font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {searchTerm || selectedType !== "all"
                ? "No documents found"
                : "No documents yet"}
            </h3>
            <p
              className={`mb-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {searchTerm || selectedType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Upload your first document to get started"}
            </p>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-xl backdrop-blur-3xl p-6 w-full max-w-2xl mx-4 border shadow-2xl max-h-[80vh] overflow-y-auto ${
                theme === "dark"
                  ? "bg-black/20 border-white/10"
                  : "bg-white/90 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-xl font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Document Preview
                </h2>
                <button
                  onClick={() => setShowPreview(null)}
                  className={`p-2 rounded-full hover:bg-gray-500/20 transition-colors ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {showPreview.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {formatFileSize(showPreview.size)} • {showPreview.pages}{" "}
                      pages • {showPreview.words?.toLocaleString()} words
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg ${
                    theme === "dark"
                      ? "bg-black/20 border-white/10"
                      : "bg-white/70 border-gray-200"
                  }`}
                >
                  <h4
                    className={`font-medium mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Document Status
                  </h4>
                  <span
                    className={`px-3 py-1 text-sm rounded font-medium ${getStatusColor(
                      showPreview.status
                    )}`}
                  >
                    {showPreview.status === "processing" && (
                      <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                    )}
                    {showPreview.status.charAt(0).toUpperCase() +
                      showPreview.status.slice(1)}
                  </span>
                </div>

                {showPreview.status === "processed" && (
                  <div
                    className={`p-4 border rounded-lg ${
                      theme === "dark"
                        ? "bg-black/20 border-white/10"
                        : "bg-white/70 border-gray-200"
                    }`}
                  >
                    <h4
                      className={`font-medium mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Content Preview
                    </h4>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      This document has been successfully processed and is
                      available for your AI agent to reference. The content has
                      been indexed and can be used to answer customer questions
                      related to the topics covered in this document.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
