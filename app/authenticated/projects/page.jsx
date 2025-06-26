"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/themecontext";
import { Plus, FolderOpen, Calendar, ArrowRight } from "lucide-react";

const page = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "E-commerce Support Bot",
      description:
        "AI-powered customer service bot for online store with order tracking and FAQ handling",
      createdAt: "2024-01-15",
      type: "Chatbot",
      status: "Active",
    },
    {
      id: 2,
      name: "Healthcare Assistant",
      description:
        "Voice-enabled assistant for patient appointment scheduling and basic health queries",
      createdAt: "2024-01-20",
      type: "Voice AI",
      status: "Development",
    },
  ]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    type: "Chatbot",
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (newProject.name.trim()) {
      const project = {
        id: Date.now(),
        name: newProject.name,
        description: newProject.description,
        type: newProject.type,
        createdAt: new Date().toISOString().split("T")[0],
        status: "Development",
      };
      setProjects([...projects, project]);
      setNewProject({ name: "", description: "", type: "Chatbot" });
      setIsCreating(false);
    }
  };

  const navigateToProject = (projectId) => {
    router.push(`/authenticated/projects/${projectId}/dashboard`);
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
      className={`p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto min-h-screen ${
        theme === "dark" ? "bg-black" : "bg-gray-50/50"
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
              My Projects
            </h1>
            <p
              className={`text-sm sm:text-base ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Create and manage your AI customer service projects
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="sm:hidden">New Project</span>
            <span className="hidden sm:inline">Create New Project</span>
          </button>
        </div>

        {/* Create Project Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-lg p-4 sm:p-6 w-full max-w-md mx-4 ${
                theme === "dark" ? "bg-zinc-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-lg sm:text-xl font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Create New Project
              </h2>
              <form onSubmit={handleCreateProject}>
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Project Type
                  </label>
                  <select
                    value={newProject.type}
                    onChange={(e) =>
                      setNewProject({ ...newProject, type: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
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
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="Enter project description"
                    rows="3"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-md transition-colors text-sm sm:text-base font-medium"
                  >
                    Create Project
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setNewProject({
                        name: "",
                        description: "",
                        type: "Chatbot",
                      });
                    }}
                    className={`flex-1 py-2.5 rounded-md transition-colors text-sm sm:text-base font-medium ${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                        : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border transition-all duration-200 hover:scale-105 cursor-pointer ${
                  theme === "dark"
                    ? "bg-zinc-800/50 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
                onClick={() => navigateToProject(project.id)}
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
                        project.type
                      )}`}
                    >
                      {project.type}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                <h3
                  className={`text-lg sm:text-xl font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {project.name}
                </h3>

                <p
                  className={`text-sm mb-4 line-clamp-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {project.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span
                      className={
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }
                    >
                      {project.createdAt}
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
            className={`text-center py-12 backdrop-blur-sm rounded-2xl shadow-lg border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3
              className={`text-xl font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No projects yet
            </h3>
            <p
              className={`mb-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Create your first AI customer service project to get started
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
