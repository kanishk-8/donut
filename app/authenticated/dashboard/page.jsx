"use client";
import React from "react";
import { Bot, MessageSquare, Brain, Users } from "lucide-react";
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
      icon: <Bot className="w-5 h-5" />,
      title: "Active Agents",
      value: "12",
      description: "3 new this month",
      bgColor: "bg-indigo-600",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Conversations",
      value: "4,325",
      description: "+12% from last month",
      bgColor: "bg-emerald-600",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Automations",
      value: "28",
      description: "5 pending setup",
      bgColor: "bg-purple-600",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Active Users",
      value: "852",
      description: "+18% this week",
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
          Dashboard
        </h1>
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          Welcome back to your AI Agent Builder dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <DashboardStats key={index} {...stat} theme={theme} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            Recent Agents
          </h2>
          <div className="space-y-4">
            {[
              {
                name: "Customer Support Bot",
                type: "Chatbot",
                created: "2 days ago",
                status: "Active",
              },
              {
                name: "Data Analyzer",
                type: "Assistant",
                created: "1 week ago",
                status: "Active",
              },
              {
                name: "Email Automation",
                type: "Custom",
                created: "3 weeks ago",
                status: "Inactive",
              },
            ].map((agent, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                }`}
              >
                <div>
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {agent.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {agent.type} • Created {agent.created}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    agent.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : theme === "dark"
                      ? "bg-gray-600 text-gray-300"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
          <button
            className={`mt-4 text-sm font-medium hover:text-indigo-800 ${
              theme === "dark" ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            View all agents →
          </button>
        </div>

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
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Response Rate
                </span>
                <span
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  92%
                </span>
              </div>
              <div
                className={`w-full rounded-full h-2 ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                }`}
              >
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Accuracy
                </span>
                <span
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  87%
                </span>
              </div>
              <div
                className={`w-full rounded-full h-2 ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                }`}
              >
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: "87%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  User Satisfaction
                </span>
                <span
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  95%
                </span>
              </div>
              <div
                className={`w-full rounded-full h-2 ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                }`}
              >
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: "95%" }}
                ></div>
              </div>
            </div>
          </div>
          <button
            className={`mt-4 text-sm font-medium ${
              theme === "dark"
                ? "text-indigo-400 hover:text-indigo-300"
                : "text-indigo-600 hover:text-indigo-800"
            }`}
          >
            View detailed analytics →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
