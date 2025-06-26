"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Code,
  MessageSquare,
  Phone,
  FileText,
  Settings,
  BarChart3,
  Key,
  Webhook,
  ArrowLeft,
  FolderOpen,
  Book,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/authcontext";
import { useTheme } from "@/context/themecontext";

const SideBar = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const projectId = pathname.split("/")[3]; // Extract project ID from URL

  // Mock project data - in a real app, this would come from an API
  const [projectData, setProjectData] = useState({
    name: "E-commerce Support Bot",
    type: "Chatbot",
    status: "Active",
  });

  // Check if we're in a project context
  const isInProject = pathname.includes("/projects/") && projectId;

  const menuItems = [
    {
      name: "Overview",
      icon: <Home className="w-5 h-5" />,
      path: `/authenticated/projects/${projectId}/dashboard`,
    },
    {
      name: "Knowledge Base",
      icon: <Book className="w-5 h-5" />,
      path: `/authenticated/projects/${projectId}/knowledgebase`,
    },
    {
      name: "API Keys",
      icon: <Key className="w-5 h-5" />,
      path: `/authenticated/projects/${projectId}/api-keys`,
    },
    {
      name: "Playground",
      icon: <Code className="w-5 h-5" />,
      path: `/authenticated/projects/${projectId}/playground`,
    },
    {
      name: "Chat Widget",
      icon: <MessageSquare className="w-5 h-5" />,
      path: `/authenticated/projects/${projectId}/chat-widget`,
    },
    {
      name: "Voice Calls",
      icon: <Phone className="w-5 h-5" />,
      path: `/authenticated/projects/${projectId}/voice-calls`,
    },
    {
      name: "Logs",
      icon: <FileText className="w-5 h-5" />,
      path: `/authenticated/projects/${projectId}/logs`,
    },
    {
      name: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      path: `/authenticated/projects/${projectId}/analytics`,
    },
    {
      name: "Webhooks",
      icon: <Webhook className="w-5 h-5" />,
      path: `/authenticated/projects/${projectId}/webhooks`,
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: `/authenticated/projects/${projectId}/settings`,
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className={`md:hidden fixed top-4 left-4 z-40 backdrop-blur-3xl rounded-full focus:outline-none ${
          theme === "dark"
            ? "bg-black/20 text-white"
            : "bg-white/20 text-gray-800"
        }`}
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Image
          src="/logo.png"
          alt="logo"
          width={40}
          height={40}
          className="rounded-full"
        />
      </button>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-40 h-full w-64 md:w-72 flex flex-col backdrop-blur-3xl py-4 px-2 transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex md:h-screen border-r ${
          theme === "dark"
            ? "bg-black/20 text-white border-white/10"
            : "bg-white/90 text-gray-900 border-gray-200"
        }`}
      >
        <div className="px-3 md:px-4 mb-4 md:mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="logo"
                width={32}
                height={32}
                className="rounded-full md:w-10 md:h-10"
              />
            </div>
            <h1
              className={`ml-2 text-lg md:text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              donut
            </h1>
          </div>
          {/* Close button for mobile */}
          <button
            className={`md:hidden ml-2 p-2 rounded-full focus:outline-none transition-colors duration-200 ${
              theme === "dark"
                ? "hover:bg-white/10 text-white"
                : "hover:bg-gray-200 text-gray-600"
            }`}
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Back to Projects Button - Only show when in project context */}
        {isInProject && (
          <div className="px-4 mb-3">
            <Link
              href="/authenticated/projects"
              className={`flex items-center px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ArrowLeft className="w-3 h-3 mr-1.5" />
              All Projects
            </Link>
          </div>
        )}

        {/* Project Header - Only show when in project context */}
        {isInProject && (
          <div className="px-4 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <FolderOpen className="w-3 h-3 text-white" />
              </div>
              <h2
                className={`font-semibold text-sm ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {projectData.name}
              </h2>
            </div>
            <div className="flex gap-1.5 ml-8">
              <span
                className={`px-1.5 py-0.5 text-xs rounded ${
                  theme === "dark"
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {projectData.type}
              </span>
              <span
                className={`px-1.5 py-0.5 text-xs rounded ${
                  theme === "dark"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {projectData.status}
              </span>
            </div>
          </div>
        )}

        {/* Separator line - Only show when in project context */}
        {isInProject && (
          <div className="px-4 mb-4">
            <div
              className={`border-t ${
                theme === "dark" ? "border-white/10" : "border-gray-200"
              }`}
            ></div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                    pathname === item.path
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                      : theme === "dark"
                      ? "text-indigo-200 hover:bg-white/10 hover:text-white hover:scale-105"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-105"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-3 md:px-4 py-2">
          <div
            className={`border-t pt-3 md:pt-4 ${
              theme === "dark" ? "border-white/10" : "border-gray-200"
            }`}
          >
            <Link
              href={"/authenticated/profile"}
              onClick={() => setOpen(false)}
              className={`flex items-center px-2 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-all duration-200 ${
                pathname === "/authenticated/profile"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-105"
                  : theme === "dark"
                  ? "text-indigo-200 hover:bg-white/10 hover:text-white hover:scale-105"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-105"
              }`}
            >
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </span>
              </div>
              <div className="ml-2 md:ml-3 min-w-0 flex-1">
                <p
                  className={`font-bold text-xs md:text-sm truncate ${
                    pathname === "/authenticated/profile"
                      ? "text-white"
                      : theme === "dark"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {user?.name || user?.email || "User"}
                </p>
                <p
                  className={`text-xs ${
                    pathname === "/authenticated/profile"
                      ? "text-gray-200"
                      : theme === "dark"
                      ? "text-indigo-300"
                      : "text-gray-500"
                  }`}
                >
                  {user?.plan || "Pro Plan"}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
