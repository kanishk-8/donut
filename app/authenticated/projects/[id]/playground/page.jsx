"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "@/context/themecontext";
import { useAuth } from "@/context/authcontext";
import { useProject } from "@/context/projectcontext";
import {
  Play,
  Copy,
  Code,
  MessageSquare,
  Phone,
  FileText,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

const PlaygroundPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { currentProject, fetchProject } = useProject();
  const params = useParams();
  const projectId = params.id;
  const [selectedEndpoint, setSelectedEndpoint] = useState("chat");
  const [requestBody, setRequestBody] = useState(`{
  "message": "Hello, I need help with my order",
  "includeKnowledgeBase": true
}`);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const endpoints = [
    {
      id: "chat",
      name: "Send Chat Message",
      method: "POST",
      path: "/v1/chat/send",
      description: "Send a message to the AI customer service agent",
    },
    {
      id: "voice",
      name: "Start Voice Call",
      method: "POST",
      path: "/v1/voice/call",
      description: "Initiate a voice call with the AI agent",
    },
    {
      id: "ticket",
      name: "Create Ticket",
      method: "POST",
      path: "/v1/tickets",
      description: "Create a new support ticket",
    },
    {
      id: "logs",
      name: "Get Conversation Logs",
      method: "GET",
      path: "/v1/logs/conversations",
      description: "Retrieve conversation history",
    },
  ];

  // Load project data when component mounts
  useEffect(() => {
    if (projectId && user?.id) {
      fetchProject(projectId);
    }
  }, [projectId, user?.id, fetchProject]);

  const exampleBodies = {
    chat: `{
  "message": "Hello, I need help with my order",
  "sessionId": "session_456",
  "includeKnowledgeBase": true
}`,
    voice: `{
  "phone_number": "+1234567890",
  "language": "en-US",
  "voice_type": "neural",
  "context": {
    "customer_id": "cust_789"
  }
}`,
    ticket: `{
  "title": "Unable to complete checkout",
  "description": "Customer experiencing issues with payment processing",
  "priority": "medium",
  "customer_id": "cust_789",
  "tags": ["payment", "checkout"]
}`,
    logs: `{
  "sessionId": "session_456",
  "limit": 50,
  "offset": 0,
  "date_from": "2024-01-01",
  "date_to": "2024-01-31"
}`,
  };

  const handleEndpointChange = (endpointId) => {
    setSelectedEndpoint(endpointId);
    setRequestBody(exampleBodies[endpointId]);
    setResponse("");
    setError("");
  };

  const executeRequest = async () => {
    setIsLoading(true);
    setResponse("");
    setError("");

    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      if (selectedEndpoint === "chat") {
        let requestData;

        try {
          requestData = JSON.parse(requestBody);
        } catch (parseError) {
          throw new Error("Invalid JSON in request body");
        }

        console.log(
          "Making request with user:",
          user?.id,
          "projectId:",
          projectId
        );

        const response = await fetch("/api/v1/chat/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...requestData,
            projectId,
          }),
        });

        const data = await response.json();

        console.log("Response status:", response.status, "Data:", data);

        if (response.ok) {
          setResponse(
            JSON.stringify(
              {
                success: true,
                data: {
                  response: data.response,
                  sessionId: data.sessionId,
                  timestamp: data.timestamp,
                  knowledgeBaseUsed: data.knowledgeBaseUsed,
                  documentsReferenced: data.documentsReferenced,
                  authenticatedUser: data.authenticatedUser,
                  mode: data.mode,
                },
              },
              null,
              2
            )
          );
        } else {
          throw new Error(data.error || "Request failed");
        }
      } else {
        // Mock responses for other endpoints
        let requestData;

        try {
          requestData = JSON.parse(requestBody);
        } catch (parseError) {
          throw new Error("Invalid JSON in request body");
        }

        const mockResponses = {
          voice: {
            success: true,
            data: {
              callId: "call_" + Date.now(),
              status: "initiated",
              phoneNumber: requestData.phone_number,
              estimatedDuration: "3-5 minutes",
              language: requestData.language || "en-US",
            },
          },
          ticket: {
            success: true,
            data: {
              ticketId: "ticket_" + Date.now(),
              status: "created",
              priority: requestData.priority || "medium",
              assignedTo: "AI Agent",
              title: requestData.title,
            },
          },
          logs: {
            success: true,
            data: {
              conversations: [
                {
                  id: "conv_123",
                  sessionId: requestData.sessionId || "session_456",
                  timestamp: new Date().toISOString(),
                  messages: Math.floor(Math.random() * 20) + 1,
                  resolved: Math.random() > 0.3,
                },
                {
                  id: "conv_124",
                  sessionId: "session_789",
                  timestamp: new Date(Date.now() - 86400000).toISOString(),
                  messages: Math.floor(Math.random() * 15) + 1,
                  resolved: true,
                },
              ],
              total: 2,
              hasMore: false,
              limit: requestData.limit || 50,
            },
          },
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setResponse(JSON.stringify(mockResponses[selectedEndpoint], null, 2));
      }
    } catch (error) {
      console.error("Request error:", error);
      setError(error.message);
      setResponse(
        JSON.stringify(
          {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(response);
  };

  const selectedEndpointData = endpoints.find((e) => e.id === selectedEndpoint);

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
            API Playground - {currentProject?.name || "Loading..."}
          </h1>
          <p
            className={`text-sm sm:text-base ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Test your AI customer service APIs with real-time responses
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Panel */}
          <div
            className={`backdrop-blur-3xl rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 flex items-center ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              <Code className="w-5 h-5 mr-2 text-indigo-600" />
              Request
            </h2>

            {/* Endpoint Selection */}
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Endpoint
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => handleEndpointChange(endpoint.id)}
                    className={`p-3 rounded-lg border text-left transition-all duration-200 hover:scale-105 backdrop-blur-sm ${
                      selectedEndpoint === endpoint.id
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : theme === "dark"
                        ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        : "bg-gray-100/70 border-gray-200 text-gray-900 hover:bg-gray-200/70"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {endpoint.id === "chat" && (
                        <MessageSquare className="w-4 h-4 mr-2" />
                      )}
                      {endpoint.id === "voice" && (
                        <Phone className="w-4 h-4 mr-2" />
                      )}
                      {endpoint.id === "ticket" && (
                        <FileText className="w-4 h-4 mr-2" />
                      )}
                      {endpoint.id === "logs" && (
                        <FileText className="w-4 h-4 mr-2" />
                      )}
                      <span className="font-medium text-sm">
                        {endpoint.name}
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono ${
                          selectedEndpoint === endpoint.id
                            ? "bg-white/20 text-white"
                            : theme === "dark"
                            ? "bg-white/20 text-gray-300 border border-white/30"
                            : "bg-gray-200/70 text-gray-600 border border-gray-300"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <span className="ml-2 opacity-75">{endpoint.path}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Request Body */}
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Request Body
              </label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className={`w-full h-64 p-3 border rounded-lg backdrop-blur-sm font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                  theme === "dark"
                    ? "bg-black/20 border-white/10 text-gray-100"
                    : "bg-white/70 border-gray-200 text-gray-900"
                }`}
                placeholder="Enter request body..."
              />
            </div>

            {/* Execute Button */}
            <button
              onClick={executeRequest}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center font-medium shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Execute Request
                </>
              )}
            </button>
          </div>

          {/* Response Panel */}
          <div
            className={`backdrop-blur-3xl rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-lg font-semibold flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Response
              </h2>
              {response && (
                <button
                  onClick={copyResponse}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:scale-105 backdrop-blur-sm ${
                    theme === "dark"
                      ? "hover:bg-white/20 text-gray-300 border border-white/20"
                      : "hover:bg-gray-100/80 text-gray-600 border border-gray-200"
                  }`}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
              )}
            </div>

            <div
              className={`w-full h-96 p-3 border rounded-lg font-mono text-sm overflow-auto backdrop-blur-sm ${
                theme === "dark"
                  ? "bg-black/30 border-white/20 text-gray-100"
                  : "bg-white/70 border-gray-200 text-gray-900"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
              ) : response ? (
                <pre className="whitespace-pre-wrap">{response}</pre>
              ) : (
                <div
                  className={`text-center h-full flex items-center justify-center ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Execute a request to see the response here
                </div>
              )}
            </div>
          </div>
        </div>

        {/* API Documentation */}
        {selectedEndpointData && (
          <div
            className={`mt-6 backdrop-blur-3xl rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-3 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {selectedEndpointData.name}
            </h3>
            <p
              className={`mb-3 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {selectedEndpointData.description}
            </p>
            <div className="flex items-center text-sm">
              <span
                className={`px-2 py-1 rounded font-mono mr-3 backdrop-blur-sm border ${
                  theme === "dark"
                    ? "bg-white/10 text-gray-300 border-white/20"
                    : "bg-gray-100/70 text-gray-600 border-gray-200"
                }`}
              >
                {selectedEndpointData.method}
              </span>
              <span
                className={`font-mono ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {selectedEndpointData.path}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaygroundPage;
