"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/themecontext";
import { useAuth } from "@/context/authcontext";
import { usePathname } from "next/navigation";
import { ProjectProvider } from "@/context/projectcontext";
import ProjectNav from "@/components/dashboard/projectNav";

const Layout = ({ children }) => {
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect non-authenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (redirect will happen)
  if (!user) {
    return null;
  }

  // Show ProjectNav only on profile and projects list page, not on nested project pages
  const showProjectNav =
    pathname === "/authenticated/profile" ||
    pathname === "/authenticated/projects";

  return (
    <ProjectProvider>
      <div
        className={`${
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        {showProjectNav && <ProjectNav />}
        {children}
      </div>
    </ProjectProvider>
  );
};

export default Layout;
