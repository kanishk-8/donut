"use client";
import React from "react";
import { Bot, MessageSquare, Phone, BarChart3, Key, Globe } from "lucide-react";
import { useTheme } from "@/context/themecontext";

const DashboardStats = ({
  icon,
  title,
  value,
  description,
  bgColor,
  theme,
}) => {
  return (
    <div
      className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border transition-all duration-200 hover:scale-105 ${
        theme === "dark"
          ? "bg-zinc-800/50 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full ${bgColor} text-white mr-4`}>
          {icon}
        </div>
        <h3
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
      </div>
      <div className="flex flex-col">
        <span
          className={`text-3xl font-bold mb-1 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </span>
        <span
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {description}
        </span>
      </div>
    </div>
  );
};

const DashBoard = () => {
  const { theme } = useTheme();

  const stats = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "API Calls",
      value: "12,456",
      description: "+12% from last month",
      bgColor: "bg-indigo-600",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Chat Sessions",
      value: "3,248",
      description: "85% resolution rate",
      bgColor: "bg-emerald-600",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Voice Minutes",
      value: "1,847",
      description: "892 calls handled",
      bgColor: "bg-purple-600",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Active Domains",
      value: "5",
      description: "2 pending verification",
      bgColor: "bg-blue-600",
    },
  ];

  return (
    <div
      className={`p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto min-h-screen ${
        theme === "dark" ? "bg-black" : "bg-gray-50/50"
      }`}
    >
      <div className="mb-8">
        <h1
          className={`text-3xl font-bold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Developer Dashboard
        </h1>
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          Monitor your customer service AI integration and API usage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <DashboardStats key={index} {...stat} theme={theme} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Quick Start */}
        <div
          className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
            theme === "dark"
              ? "bg-zinc-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Quick Start
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Get your API key",
                description: "Generate API keys to start integration",
                action: "Generate Key",
                href: "/authenticated/api-keys",
              },
              {
                title: "Add chat widget",
                description: "Embed customer service chat on your website",
                action: "Get Code",
                href: "/authenticated/chat-widget",
              },
              {
                title: "Test API endpoints",
                description: "Try our API in the interactive playground",
                action: "Try Now",
                href: "/authenticated/playground",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-4 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700/30 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div>
                  <h3
                    className={`font-medium mb-1 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
            theme === "dark"
              ? "bg-zinc-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Recent API Activity
          </h2>
          <div className="space-y-4">
            {[
              {
                method: "POST",
                endpoint: "/api/chat/send",
                time: "2 min ago",
                status: "200",
              },
              {
                method: "GET",
                endpoint: "/api/logs/chat",
                time: "5 min ago",
                status: "200",
              },
              {
                method: "POST",
                endpoint: "/api/voice/call",
                time: "12 min ago",
                status: "201",
              },
              {
                method: "GET",
                endpoint: "/api/analytics",
                time: "18 min ago",
                status: "200",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 text-xs rounded font-mono ${
                      activity.method === "POST"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {activity.method}
                  </span>
                  <span
                    className={`font-mono text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {activity.endpoint}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {activity.time}
                  </span>
                  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            className={`mt-4 text-sm font-medium ${
              theme === "dark"
                ? "text-indigo-400 hover:text-indigo-300"
                : "text-indigo-600 hover:text-indigo-800"
            }`}
          >
            View all logs →
          </button>
        </div>
      </div>

      {/* API Usage Chart */}
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
            API Usage Overview
          </h2>
          <select
            className={`px-3 py-2 rounded-lg border text-sm ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">92%</div>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Success Rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">1.2s</div>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Avg Response Time
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">15.6k</div>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Requests
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
