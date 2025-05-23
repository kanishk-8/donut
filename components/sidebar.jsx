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
  PlusCircle,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

const SideBar = () => {
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
    <div className="flex flex-col h-screen bg-gray-900 text-white w-72 py-4 px-2">
      <div className="px-4 mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
            <Image
              src="/logo.png"
              alt="logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <h1 className="ml-2 text-xl font-bold">DonutAgentBuilder</h1>
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
                    ? "bg-indigo-800 text-white"
                    : "text-gray-300 hover:bg-gray-800"
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
        <div className="border-t border-gray-700 pt-4">
          <Link
            href={"/authenticated/profile"}
            className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
              pathname === "/authenticated/profile"
                ? "bg-indigo-800 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold">JD</span>
            </div>
            <div className="ml-3">
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-gray-500">Pro Plan</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
