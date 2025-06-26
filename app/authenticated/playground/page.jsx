"use client";
import React, { useState } from "react";
import { useTheme } from "@/context/themecontext";
import { Play, Copy, Download, Zap } from "lucide-react";

const PlaygroundPage = () => {
  const { theme } = useTheme();
  const [selectedEndpoint, setSelectedEndpoint] = useState("chat");
  const [requestBody, setRequestBody] = useState(`{
  "message": "Hello, I need help with my order",
  "user_id": "user_123",
  "session_id": "session_456"
}`);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const endpoints = [
    {
      id: "chat",
      name: "Send Chat Message",
      method: "POST",
      path: "/v1/chat",
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
  "user_id": "user_123",
  "session_id": "session_456",
  "context": {
    "page": "/checkout",
    "user_agent": "Mozilla/5.0..."
  }
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
  "session_id": "session_456",
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
    
    // Simulate API call
    setTimeout(() => {
      const mockResponses = {
        chat: `{
  "id": "msg_789",
  "response": "Hello! I'd be happy to help you with your order. Could you please provide your order number?",
  "confidence": 0.95,
  "session_id": "session_456",
  "timestamp": "2024-01-15T10:30:00Z",
  "metadata": {
    "response_time_ms": 234,
    "model_version": "v2.1"
  }
}`,
        voice: `{
  "call_id": "call_abc123",
  "status": "initiated",
  "phone_number": "+1234567890",
  "estimated_duration": "3-5 minutes",
  "webhook_url": "https://your-domain.com/webhooks/voice",
  "created_at": "2024-01-15T10:30:00Z"
}`,
        ticket: `{
  "ticket_id": "ticket_xyz789",
  "status": "open",
  "priority": "medium",
  "assigned_agent": "ai_agent_001",
  "estimated_resolution": "2-4 hours",
  "created_at": "2024-01-15T10:30:00Z",
  "tracking_url": "https://support.yoursite.com/tickets/xyz789"
}`,
        logs: `{
  "conversations": [
    {
      "id": "conv_123",
      "session_id": "session_456",
      "messages": [
        {
          "role": "user",
          "content": "Hello, I need help",
          "timestamp": "2024-01-15T10:25:00Z"
        },
        {
          "role": "assistant", 
          "content": "Hi! I'm here to help. What can I assist you with?",
          "timestamp": "2024-01-15T10:25:02Z"
        }
      ],
      "created_at": "2024-01-15T10:25:00Z",
      "duration_seconds": 180
    }
  ],
  "total_count": 1,
  "has_more": false
}`,
      };
      
      setResponse(mockResponses[selectedEndpoint]);
      setIsLoading(false);
    }, 1000);
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(response);
  };

  const selectedEndpointData = endpoints.find(e => e.id === selectedEndpoint);

  return (
    <div
      className={`p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto min-h-screen ${
        theme === "dark" ? "bg-black" : "bg-gray-50/50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            API Playground
          </h1>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Test and explore the Donut API endpoints in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Request Panel */}
          <div
            className={`backdrop-blur-sm rounded-2xl shadow-lg border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-6">
              <h2
                className={`text-xl font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
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
                <select
                  value={selectedEndpoint}
                  onChange={(e) => handleEndpointChange(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  {endpoints.map((endpoint) => (
                    <option key={endpoint.id} value={endpoint.id}>
                      {endpoint.method} {endpoint.path} - {endpoint.name}
                    </option>
                  ))}
                </select>
                <p
                  className={`text-sm mt-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedEndpointData?.description}
                </p>
              </div>

              {/* Method and URL */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`px-2 py-1 text-xs rounded font-mono ${
                      selectedEndpointData?.method === "POST"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedEndpointData?.method}
                  </span>
                  <span
                    className={`font-mono text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    https://api.donut.dev{selectedEndpointData?.path}
                  </span>
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
                  rows={12}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 font-mono text-sm ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-600 text-gray-300"
                      : "bg-gray-50 border-gray-300 text-gray-700"
                  }`}
                />
              </div>

              {/* Execute Button */}
              <button
                onClick={executeRequest}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Executing..." : "Execute Request"}
              </button>
            </div>
          </div>

          {/* Response Panel */}
          <div
            className={`backdrop-blur-sm rounded-2xl shadow-lg border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-xl font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Response
                </h2>
                {response && (
                  <button
                    onClick={copyResponse}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === "dark"
                        ? "hover:bg-gray-600 text-gray-400"
                        : "hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>

              {response ? (
                <div
                  className={`p-3 rounded-lg font-mono text-sm whitespace-pre-wrap ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-300"
                      : "bg-gray-50 text-gray-700"
                  }`}
                  style={{ minHeight: "400px" }}
                >
                  {response}
                </div>
              ) : (
                <div
                  className={`p-8 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-400"
                      : "border-gray-300 text-gray-500"
                  }`}
                  style={{ minHeight: "400px" }}
                >
                  <Zap className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No response yet</p>
                  <p className="text-sm">Execute a request to see the API response here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* API Documentation Links */}
        <div
          className={`mt-8 backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
            theme === "dark"
              ? "bg-zinc-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Quick Links
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/docs"
              className={`p-4 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "border-gray-600 hover:bg-gray-700/50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <h4
                className={`font-medium mb-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                API Documentation
              </h4>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Complete API reference and guides
              </p>
            </a>
            <a
              href="/examples"
              className={`p-4 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "border-gray-600 hover:bg-gray-700/50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <h4
                className={`font-medium mb-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Code Examples
              </h4>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Implementation examples in various languages
              </p>
            </a>
            <a
              href="/status"
              className={`p-4 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "border-gray-600 hover:bg-gray-700/50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <h4
                className={`font-medium mb-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                API Status
              </h4>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Check real-time API status and uptime
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;