"use client";
import React from "react";
import SideBar from "@/components/sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

export default Layout;
