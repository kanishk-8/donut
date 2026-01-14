"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/themecontext";
import { useProject } from "@/context/projectcontext";
import { Plus, FolderOpen, Calendar, ArrowRight, Loader2 } from "lucide-react";

const page = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const {
    projects: Agents,
    loading,
    error,
    createProject,
    fetchProjects,
  } = useProject();

  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    type: "Chatbot",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    if (!newAgent.name.trim()) return;

    try {
      setCreateError("");
      const result = await createProject({
        name: newAgent.name,
        description: newAgent.description,
        type: newAgent.type,
      });

      if (result.success) {
        setNewAgent({ name: "", description: "", type: "Chatbot" });
        setIsCreating(false);
      } else {
        setCreateError(result.error || "Failed to create project");
      }
    } catch (err) {
      console.error("Error:", err);
      setCreateError("Failed to create project");
    }
  };

  const navigateToAgent = (agentId) => {
    router.push(`/authenticated/projects/${agentId}/dashboard`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return theme === "dark"
          ? "bg-green-900/30 text-green-400 border border-green-500/30"
          : "bg-green-100 text-green-800";
      case "Development":
        return theme === "dark"
          ? "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
          : "bg-yellow-100 text-yellow-800";
      default:
        return theme === "dark"
          ? "bg-gray-700/50 text-gray-300 border border-gray-600"
          : "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Chatbot":
        return theme === "dark"
          ? "bg-blue-900/30 text-blue-400 border border-blue-500/30"
          : "bg-blue-100 text-blue-800";
      case "Voice AI":
        return theme === "dark"
          ? "bg-purple-900/30 text-purple-400 border border-purple-500/30"
          : "bg-purple-100 text-purple-800";
      case "API Integration":
        return theme === "dark"
          ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30"
          : "bg-emerald-100 text-emerald-800";
      default:
        return theme === "dark"
          ? "bg-gray-700/50 text-gray-300 border border-gray-600"
          : "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`p-4 md:p-8 pt-24 md:pt-28 overflow-y-auto min-h-screen ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              My Agents
            </h1>
            <p
              className={`text-sm sm:text-base ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Create and manage your AI customer service Agents
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-pink-500 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-medium text-sm sm:text-base w-full sm:w-auto shadow-2xl backdrop-blur-3xl"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="sm:hidden">New Agent</span>
            <span className="hidden sm:inline">Create New Agent</span>
          </button>
        </div>

        {/* Create Agent Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-xl backdrop-blur-3xl p-4 sm:p-6 w-full max-w-md mx-4 border shadow-2xl ${
                theme === "dark"
                  ? "bg-black/20 border-white/10"
                  : "bg-white/90 border-gray-200"
              }`}
            >
              <h2
                className={`text-lg sm:text-xl font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Create New Agent
              </h2>
              {createError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                  {createError}
                </div>
              )}
              <form onSubmit={handleCreateAgent}>
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) =>
                      setNewAgent({ ...newAgent, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base transition-all ${
                      theme === "dark"
                        ? "bg-black/20 border-white/10 text-white placeholder-gray-400"
                        : "bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder="Enter agent name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Agent Type
                  </label>
                  <select
                    value={newAgent.type}
                    onChange={(e) =>
                      setNewAgent({ ...newAgent, type: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base transition-all ${
                      theme === "dark"
                        ? "bg-black/20 border-white/10 text-white"
                        : "bg-white/70 border-gray-200 text-gray-900"
                    }`}
                  >
                    <option value="Chatbot">Chatbot</option>
                    <option value="Voice AI">Voice AI</option>
                    <option value="API Integration">API Integration</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Description
                  </label>
                  <textarea
                    value={newAgent.description}
                    onChange={(e) =>
                      setNewAgent({
                        ...newAgent,
                        description: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base transition-all ${
                      theme === "dark"
                        ? "bg-black/20 border-white/10 text-white placeholder-gray-400"
                        : "bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder="Enter agent description"
                    rows="3"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-pink-500 text-white py-2.5 rounded-full transition-all duration-200 hover:scale-105 text-sm sm:text-base font-medium shadow-2xl backdrop-blur-3xl"
                  >
                    Create Agent
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setCreateError("");
                      setNewAgent({
                        name: "",
                        description: "",
                        type: "Chatbot",
                      });
                    }}
                    className={`flex-1 py-2.5 rounded-full backdrop-blur-sm border-2 transition-all text-sm sm:text-base font-medium hover:scale-105 ${
                      theme === "dark"
                        ? "bg-black/20 border-white/10 text-white hover:bg-black/30"
                        : "bg-white/70 border-gray-300 text-gray-700 hover:bg-white/90"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Agents Grid */}
        {loading ? (
          <div
            className={`text-center py-12 backdrop-blur-3xl rounded-2xl shadow-lg border ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Loading your agents...
            </p>
          </div>
        ) : error ? (
          <div
            className={`text-center py-12 backdrop-blur-3xl rounded-2xl shadow-lg border ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3
              className={`text-xl font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {error}
            </h3>
            <button
              onClick={fetchProjects}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-pink-500 text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105 text-sm font-medium mx-auto"
            >
              Try Again
            </button>
          </div>
        ) : Agents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Agents.map((agent) => (
              <div
                key={agent.id}
                className={`backdrop-blur-3xl rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border transition-all duration-200 hover:scale-105 cursor-pointer ${
                  theme === "dark"
                    ? "bg-black/20 border-white/10"
                    : "bg-white/90 border-gray-200"
                }`}
                onClick={() => navigateToAgent(agent.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-2 sm:p-3 rounded-full bg-indigo-600 text-white`}
                  >
                    <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${getTypeColor(
                        agent.type
                      )}`}
                    >
                      {agent.type}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                        agent.status
                      )}`}
                    >
                      {agent.status}
                    </span>
                  </div>
                </div>

                <h3
                  className={`text-lg sm:text-xl font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {agent.name}
                </h3>

                <p
                  className={`text-sm mb-4 line-clamp-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {agent.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span
                      className={
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }
                    >
                      {new Date(agent.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-12 backdrop-blur-3xl rounded-2xl shadow-lg border ${
              theme === "dark"
                ? "bg-black/20 border-white/10"
                : "bg-white/90 border-gray-200"
            }`}
          >
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3
              className={`text-xl font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No Agents yet
            </h3>
            <p
              className={`mb-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Create your first AI customer service agent to get started
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-pink-500 text-white px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-2 font-medium mx-auto shadow-2xl backdrop-blur-3xl"
            >
              <Plus className="w-5 h-5" />
              Create Your First Agent
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
