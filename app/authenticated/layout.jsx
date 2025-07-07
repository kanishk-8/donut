"use client";
import React from "react";
import { useTheme } from "@/context/themecontext";
import { usePathname } from "next/navigation";
import ProjectNav from "@/components/dashboard/projectNav";

const Layout = ({ children }) => {
  const { theme } = useTheme();
  const pathname = usePathname();

  // Show ProjectNav only on profile and projects list page, not on nested project pages
  const showProjectNav =
    pathname === "/authenticated/profile" ||
    pathname === "/authenticated/projects";

  return (
    <div
      className={`${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {showProjectNav && <ProjectNav />}
      {children}
    </div>
  );
};

export default Layout;
