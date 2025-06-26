"use client";
import React, { useState } from "react";
import { useTheme } from "@/context/themecontext";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Phone,
  Clock,
  Target,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

const AnalyticsPage = () => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("api_calls");

  const periods = [
    { value: "24h", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
  ];

  const metrics = [
    {
      id: "api_calls",
      name: "API Calls",
      icon: BarChart3,
      value: "12,456",
      change: "+12.5%",
      trend: "up",
    },
    {
      id: "chat_sessions",
      name: "Chat Sessions",
      icon: MessageSquare,
      value: "3,248",
      change: "+8.3%",
      trend: "up",
    },
    {
      id: "voice_minutes",
      name: "Voice Minutes",
      icon: Phone,
      value: "1,847",
      change: "-2.1%",
      trend: "down",
    },
    {
      id: "unique_users",
      name: "Unique Users",
      icon: Users,
      value: "892",
      change: "+15.7%",
      trend: "up",
    },
  ];

  const chartData = {
    api_calls: [
      { date: "Jan 1", value: 1200 },
      { date: "Jan 2", value: 1350 },
      { date: "Jan 3", value: 1100 },
      { date: "Jan 4", value: 1680 },
      { date: "Jan 5", value: 1590 },
      { date: "Jan 6", value: 1750 },
      { date: "Jan 7", value: 1900 },
    ],
    chat_sessions: [
      { date: "Jan 1", value: 450 },
      { date: "Jan 2", value: 520 },
      { date: "Jan 3", value: 380 },
      { date: "Jan 4", value: 620 },
      { date: "Jan 5", value: 580 },
      { date: "Jan 6", value: 690 },
      { date: "Jan 7", value: 750 },
    ],
  };

  const performanceMetrics = [
    {
      label: "Average Response Time",
      value: "1.2s",
      target: "< 2s",
      status: "good",
    },
    {
      label: "Success Rate",
      value: "99.2%",
      target: "> 99%",
      status: "excellent",
    },
    {
      label: "Customer Satisfaction",
      value: "4.8/5",
      target: "> 4.5",
      status: "excellent",
    },
    { label: "Resolution Rate", value: "87%", target: "> 85%", status: "good" },
  ];

  const topEndpoints = [
    { endpoint: "/v1/chat", calls: 8456, percentage: 68, avgTime: "1.1s" },
    {
      endpoint: "/v1/voice/call",
      calls: 2341,
      percentage: 19,
      avgTime: "2.3s",
    },
    { endpoint: "/v1/tickets", calls: 892, percentage: 7, avgTime: "0.8s" },
    { endpoint: "/v1/logs", calls: 767, percentage: 6, avgTime: "0.5s" },
  ];

  const errorAnalysis = [
    { code: "200", count: 11234, percentage: 90.2, label: "Success" },
    { code: "400", count: 456, percentage: 3.7, label: "Bad Request" },
    { code: "429", count: 234, percentage: 1.9, label: "Rate Limited" },
    { code: "500", count: 123, percentage: 1.0, label: "Server Error" },
    { code: "Others", count: 409, percentage: 3.2, label: "Other Errors" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const MetricCard = ({ metric }) => (
    <div
      className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border transition-all duration-200 hover:scale-105 ${
        theme === "dark"
          ? "bg-zinc-800/50 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-full bg-indigo-600 text-white">
          <metric.icon className="w-5 h-5" />
        </div>
        <div
          className={`flex items-center text-sm ${
            metric.trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {metric.trend === "up" ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {metric.change}
        </div>
      </div>
      <h3
        className={`text-lg font-semibold mb-1 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {metric.name}
      </h3>
      <p
        className={`text-3xl font-bold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {metric.value}
      </p>
    </div>
  );

  const SimpleChart = ({ data }) => {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
      <div className="h-64 flex items-end space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-indigo-600 rounded-t"
              style={{
                height: `${(item.value / maxValue) * 200}px`,
                minHeight: "4px",
              }}
            />
            <span
              className={`text-xs mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {item.date}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto min-h-screen ${
        theme === "dark" ? "bg-black" : "bg-gray-50/50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1
                className={`text-3xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Analytics
              </h1>
              <p
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                Monitor your API usage, performance metrics, and customer
                engagement
              </p>
            </div>
            <div className="flex space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
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
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Usage Chart */}
          <div
            className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Usage Trends
              </h2>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="api_calls">API Calls</option>
                <option value="chat_sessions">Chat Sessions</option>
              </select>
            </div>
            <SimpleChart
              data={chartData[selectedMetric] || chartData.api_calls}
            />
          </div>

          {/* Performance Metrics */}
          <div
            className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Performance Metrics
            </h2>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700/30" : "bg-gray-50"
                  }`}
                >
                  <div>
                    <h3
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {metric.label}
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Target: {metric.target}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {metric.value}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        metric.status
                      )}`}
                    >
                      {metric.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Endpoints */}
          <div
            className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Top API Endpoints
            </h2>
            <div className="space-y-4">
              {topEndpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700/30" : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`font-mono font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {endpoint.endpoint}
                    </span>
                    <div className="text-right">
                      <span
                        className={`font-bold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {endpoint.calls.toLocaleString()}
                      </span>
                      <span
                        className={`text-sm ml-2 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        ({endpoint.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div
                      className={`w-full h-2 rounded-full mr-4 ${
                        theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className="h-2 bg-indigo-600 rounded-full"
                        style={{ width: `${endpoint.percentage}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-mono ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {endpoint.avgTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Analysis */}
          <div
            className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Response Code Analysis
            </h2>
            <div className="space-y-3">
              {errorAnalysis.map((error, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700/30" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-1 text-xs rounded font-mono ${
                        error.code === "200"
                          ? "bg-green-100 text-green-800"
                          : error.code.startsWith("4")
                          ? "bg-yellow-100 text-yellow-800"
                          : error.code.startsWith("5")
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {error.code}
                    </span>
                    <span
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {error.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {error.count.toLocaleString()}
                    </span>
                    <span
                      className={`text-sm ml-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      ({error.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div
          className={`mt-8 backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
            theme === "dark"
              ? "bg-zinc-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Real-time Activity
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">23</div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Active Conversations
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Requests This Hour
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Voice Calls in Progress
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
