"use client";
import React from "react";
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
    <div
      className={`flex flex-col h-screen backdrop-blur-3xl w-72 py-4 px-2 ${
        theme === "dark"
          ? "bg-black/50 text-white"
          : "bg-white/50 text-gray-900 border-r border-gray-200"
      }`}
    >
      <div className="px-4 mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
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
            DonutAgentBuilder
          </h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors ${
                  pathname === item.path
                    ? "bg-[#6b46c1] text-white"
                    : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
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
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <Link
            href={"/authenticated/profile"}
            className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
              pathname === "/authenticated/profile"
                ? "bg-[#6b46c1] text-white"
                : theme === "dark"
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
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
                    ? "text-gray-400"
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
  );
};

export default SideBar;
