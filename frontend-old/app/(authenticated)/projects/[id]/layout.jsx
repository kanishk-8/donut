"use client";
import React from "react";
import SideBar from "@/components/dashboard/sidebar";
import { useTheme } from "@/context/themecontext";

const Layout = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`flex h-screen ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <SideBar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

export default Layout;
