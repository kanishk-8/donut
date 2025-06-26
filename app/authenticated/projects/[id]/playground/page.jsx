"use client";
import React, { useState } from "react";
import { useTheme } from "@/context/themecontext";
import {
  Play,
  Copy,
  Code,
  MessageSquare,
  Phone,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";

const PlaygroundPage = () => {
  const { theme } = useTheme();
  const [selectedEndpoint, setSelectedEndpoint] = useState("chat");
  const [requestBody, setRequestBody] = useState(`{
  "message": "Hello, I need help with my order",
  "userId": "user_123",
  "sessionId": "session_456"
}`);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const exampleBodies = {
    chat: `{
  "message": "Hello, I need help with my order",
  "userId": "user_123",
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
  };

  const executeRequest = async () => {
    setIsLoading(true);
    setResponse("");

    try {
      const projectId = window.location.pathname.split("/")[3];

      if (selectedEndpoint === "chat") {
        const requestData = JSON.parse(requestBody);

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
                },
              },
              null,
              2
            )
          );
        } else {
          setResponse(
            JSON.stringify(
              {
                success: false,
                error: data.error || "Request failed",
              },
              null,
              2
            )
          );
        }
      } else {
        // Mock responses for other endpoints
        const mockResponses = {
          voice: {
            success: true,
            data: {
              callId: "call_" + Date.now(),
              status: "initiated",
              phoneNumber: JSON.parse(requestBody).phone_number,
              estimatedDuration: "3-5 minutes",
            },
          },
          ticket: {
            success: true,
            data: {
              ticketId: "ticket_" + Date.now(),
              status: "created",
              priority: JSON.parse(requestBody).priority || "medium",
              assignedTo: "AI Agent",
            },
          },
          logs: {
            success: true,
            data: {
              conversations: [
                {
                  id: "conv_123",
                  sessionId: "session_456",
                  timestamp: new Date().toISOString(),
                  messages: 5,
                  resolved: true,
                },
              ],
              total: 1,
              hasMore: false,
            },
          },
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setResponse(JSON.stringify(mockResponses[selectedEndpoint], null, 2));
      }
    } catch (error) {
      setResponse(
        JSON.stringify(
          {
            success: false,
            error: error.message,
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
        theme === "dark" ? "bg-black" : "bg-gray-50/50"
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
            API Playground
          </h1>
          <p
            className={`text-sm sm:text-base ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Test your AI customer service APIs with real-time responses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Panel */}
          <div
            className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
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
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedEndpoint === endpoint.id
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        : "bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100"
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
                            ? "bg-gray-600 text-gray-300"
                            : "bg-gray-200 text-gray-600"
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
                className={`w-full h-64 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  theme === "dark"
                    ? "bg-gray-900 border-gray-600 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
                placeholder="Enter request body..."
              />
            </div>

            {/* Execute Button */}
            <button
              onClick={executeRequest}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-lg transition-colors flex items-center justify-center font-medium"
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
            className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
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
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    theme === "dark"
                      ? "hover:bg-white/10 text-gray-300"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
              )}
            </div>

            <div
              className={`w-full h-96 p-3 border rounded-lg font-mono text-sm overflow-auto ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-600 text-gray-100"
                  : "bg-gray-50 border-gray-300 text-gray-900"
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
            className={`mt-6 backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
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
                className={`px-2 py-1 rounded font-mono mr-3 ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-600"
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
