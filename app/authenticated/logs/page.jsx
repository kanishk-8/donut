"use client";
import React, { useState } from "react";
import { useTheme } from "@/context/themecontext";
import {
  Search,
  Filter,
  Download,
  Eye,
  MessageSquare,
  Phone,
  Activity,
} from "lucide-react";

const LogsPage = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("api");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("7d");

  const apiLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 14:30:25",
      method: "POST",
      endpoint: "/v1/chat",
      status: 200,
      responseTime: "234ms",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      ip: "192.168.1.100",
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:28:15",
      method: "GET",
      endpoint: "/v1/logs/conversations",
      status: 200,
      responseTime: "156ms",
      userAgent: "curl/7.68.0",
      ip: "10.0.0.1",
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:25:10",
      method: "POST",
      endpoint: "/v1/voice/call",
      status: 201,
      responseTime: "445ms",
      userAgent: "DonutWidget/1.0",
      ip: "203.0.113.1",
    },
    {
      id: 4,
      timestamp: "2024-01-15 14:20:05",
      method: "POST",
      endpoint: "/v1/chat",
      status: 500,
      responseTime: "1234ms",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      ip: "198.51.100.1",
    },
  ];

  const chatLogs = [
    {
      id: 1,
      sessionId: "session_abc123",
      timestamp: "2024-01-15 14:30:00",
      customer: "Anonymous User",
      messages: 8,
      duration: "3m 45s",
      resolved: true,
      tags: ["order-inquiry", "billing"],
    },
    {
      id: 2,
      sessionId: "session_def456",
      timestamp: "2024-01-15 14:15:00",
      customer: "john@example.com",
      messages: 12,
      duration: "7m 20s",
      resolved: true,
      tags: ["technical-support"],
    },
    {
      id: 3,
      sessionId: "session_ghi789",
      timestamp: "2024-01-15 13:45:00",
      customer: "Anonymous User",
      messages: 4,
      duration: "1m 15s",
      resolved: false,
      tags: ["general-inquiry"],
    },
  ];

  const voiceLogs = [
    {
      id: 1,
      callId: "call_abc123",
      timestamp: "2024-01-15 14:00:00",
      phoneNumber: "+1 (555) 123-4567",
      duration: "4m 32s",
      status: "completed",
      resolution: "Order status inquiry - Resolved",
      transcript: "Available",
    },
    {
      id: 2,
      callId: "call_def456",
      timestamp: "2024-01-15 13:30:00",
      phoneNumber: "+1 (555) 987-6543",
      duration: "2m 15s",
      status: "completed",
      resolution: "Technical support - Escalated",
      transcript: "Available",
    },
    {
      id: 3,
      callId: "call_ghi789",
      timestamp: "2024-01-15 13:00:00",
      phoneNumber: "+1 (555) 456-7890",
      duration: "6m 48s",
      status: "completed",
      resolution: "Billing inquiry - Resolved",
      transcript: "Available",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 200:
      case 201:
        return "bg-green-100 text-green-800";
      case 500:
        return "bg-red-100 text-red-800";
      case 404:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "POST":
        return "bg-green-100 text-green-800";
      case "GET":
        return "bg-blue-100 text-blue-800";
      case "PUT":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "api", label: "API Logs", icon: Activity, count: apiLogs.length },
    {
      id: "chat",
      label: "Chat Transcripts",
      icon: MessageSquare,
      count: chatLogs.length,
    },
    { id: "voice", label: "Voice Calls", icon: Phone, count: voiceLogs.length },
  ];

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
            Logs & History
          </h1>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Monitor API requests, chat conversations, and voice call activity
          </p>
        </div>

        {/* Filters */}
        <div
          className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border mb-8 ${
            theme === "dark"
              ? "bg-zinc-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            {/* Date Range */}
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            {/* Export */}
            <button
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : theme === "dark"
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : theme === "dark"
                    ? "bg-gray-600 text-gray-300"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className={`backdrop-blur-sm rounded-2xl shadow-lg border ${
            theme === "dark"
              ? "bg-zinc-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* API Logs */}
          {activeTab === "api" && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <th
                        className={`text-left p-4 font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Timestamp
                      </th>
                      <th
                        className={`text-left p-4 font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Method
                      </th>
                      <th
                        className={`text-left p-4 font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Endpoint
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
                        Response Time
                      </th>
                      <th
                        className={`text-left p-4 font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiLogs.map((log) => (
                      <tr
                        key={log.id}
                        className={`border-b hover:bg-opacity-50 ${
                          theme === "dark"
                            ? "border-gray-700 hover:bg-gray-600"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`p-4 font-mono text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {log.timestamp}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-mono ${getMethodColor(
                              log.method
                            )}`}
                          >
                            {log.method}
                          </span>
                        </td>
                        <td
                          className={`p-4 font-mono text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {log.endpoint}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-mono ${getStatusColor(
                              log.status
                            )}`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td
                          className={`p-4 font-mono text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {log.responseTime}
                        </td>
                        <td
                          className={`p-4 font-mono text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {log.ip}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Chat Logs */}
          {activeTab === "chat" && (
            <div className="p-6">
              <div className="space-y-4">
                {chatLogs.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 rounded-lg border ${
                      theme === "dark"
                        ? "border-gray-600 bg-gray-700/30"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3
                          className={`font-semibold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Session: {chat.sessionId}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {chat.timestamp}
                          </span>
                          <span
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            Customer: {chat.customer}
                          </span>
                        </div>
                      </div>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-gray-600 text-gray-400"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {chat.messages} messages
                        </span>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Duration: {chat.duration}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            chat.resolved
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {chat.resolved ? "Resolved" : "Pending"}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {chat.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Voice Logs */}
          {activeTab === "voice" && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <th
                        className={`text-left p-4 font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Call ID
                      </th>
                      <th
                        className={`text-left p-4 font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Phone Number
                      </th>
                      <th
                        className={`text-left p-4 font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Duration
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
                        Resolution
                      </th>
                      <th
                        className={`text-left p-4 font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Transcript
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {voiceLogs.map((call) => (
                      <tr
                        key={call.id}
                        className={`border-b hover:bg-opacity-50 ${
                          theme === "dark"
                            ? "border-gray-700 hover:bg-gray-600"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`p-4 font-mono text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {call.callId}
                        </td>
                        <td
                          className={`p-4 font-mono ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {call.phoneNumber}
                        </td>
                        <td
                          className={`p-4 font-mono ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {call.duration}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {call.status}
                          </span>
                        </td>
                        <td
                          className={`p-4 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {call.resolution}
                        </td>
                        <td className="p-4">
                          <button
                            className={`text-indigo-600 hover:text-indigo-800 text-sm font-medium`}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
