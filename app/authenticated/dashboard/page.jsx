"use client";
import React from "react";
import { Bot, MessageSquare, Brain, Users } from "lucide-react";

const DashboardStats = ({ icon, title, value, description, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full ${bgColor} text-white mr-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-gray-900 mb-1">{value}</span>
        <span className="text-sm text-gray-500">{description}</span>
      </div>
    </div>
  );
};

const DashBoard = () => {
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
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back to your AI Agent Builder dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <DashboardStats key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
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
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{agent.name}</h3>
                  <p className="text-sm text-gray-500">
                    {agent.type} • Created {agent.created}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    agent.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-indigo-600 text-sm font-medium hover:text-indigo-800">
            View all agents →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Response Rate
                </span>
                <span className="text-sm font-medium text-gray-700">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Accuracy
                </span>
                <span className="text-sm font-medium text-gray-700">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: "87%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  User Satisfaction
                </span>
                <span className="text-sm font-medium text-gray-700">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: "95%" }}
                ></div>
              </div>
            </div>
          </div>
          <button className="mt-4 text-indigo-600 text-sm font-medium hover:text-indigo-800">
            View detailed analytics →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
