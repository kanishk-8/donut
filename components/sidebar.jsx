"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bot,
  Database,
  Settings,
  BarChart2,
  Users,
  Zap,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/authcontext";
import { useTheme } from "@/context/themecontext";

const SideBar = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      path: "/authenticated/dashboard",
    },
    {
      name: "My Agents",
      icon: <Bot className="w-5 h-5" />,
      path: "/authenticated/agents",
    },
    {
      name: "Conversations",
      icon: <MessageSquare className="w-5 h-5" />,
      path: "/authenticated/conversations",
    },
    {
      name: "Knowledge Base",
      icon: <Database className="w-5 h-5" />,
      path: "/authenticated/knowledge",
    },
    {
      name: "Analytics",
      icon: <BarChart2 className="w-5 h-5" />,
      path: "/authenticated/analytics",
    },
    {
      name: "Team",
      icon: <Users className="w-5 h-5" />,
      path: "/authenticated/team",
    },
    {
      name: "Integrations",
      icon: <Zap className="w-5 h-5" />,
      path: "/authenticated/integrations",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/authenticated/settings",
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
        className={`fixed md:static top-0 left-0 z-40 h-full w-72 flex flex-col backdrop-blur-3xl py-4 px-2 transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex md:w-72 md:h-screen border-r ${
          theme === "dark"
            ? "bg-black/20 text-white border-white/10"
            : "bg-white/90 text-gray-900 border-gray-200"
        }`}
      >
        <div className="px-4 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <h1
              className={`ml-2 text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              AgentBuilder
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

        <nav className="flex-1 overflow-y-auto px-2">
          <ul className="space-y-1">
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

        <div className="px-4 py-2">
          <div
            className={`border-t pt-4 ${
              theme === "dark" ? "border-white/10" : "border-gray-200"
            }`}
          >
            <Link
              href={"/authenticated/profile"}
              onClick={() => setOpen(false)}
              className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                pathname === "/authenticated/profile"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-105"
                  : theme === "dark"
                  ? "text-indigo-200 hover:bg-white/10 hover:text-white hover:scale-105"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-105"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
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
              <div className="ml-3">
                <p
                  className={`font-bold ${
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
