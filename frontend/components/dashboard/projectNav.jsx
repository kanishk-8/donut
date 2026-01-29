"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";
import { useTheme } from "@/context/themecontext";
import { useAuth } from "@/context/authcontext";

const ProjectNav = () => {
    const { theme } = useTheme();
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
            // Even if there's an error, redirect to home
            router.push("/");
        }
    };

    return (
        <div
            className={`flex items-center justify-between fixed top-0 left-0 w-full z-30 p-2 border-b backdrop-blur-3xl ${
                theme === "dark"
                    ? "bg-black/20 border-white/10"
                    : "bg-white/90 border-gray-200"
            }`}
        >
            {/* Logo Section */}
            <div className="flex items-center px-3 md:px-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
                    <Image
                        src="/logo.png"
                        alt="Donut Logo"
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

            {/* User Profile Section */}
            <div className="flex items-center gap-3">
                <Link href="/profile">
                    <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105 ${
                            theme === "dark"
                                ? "bg-white/10 border border-white/10 hover:bg-white/20"
                                : "bg-gray-100 border border-gray-200 hover:bg-gray-200"
                        }`}
                    >
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center overflow-hidden">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xs font-semibold text-white">
                                    {user?.name
                                        ? user.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                              .toUpperCase()
                                        : "U"}
                                </span>
                            )}
                        </div>
                        <div className="hidden sm:block">
                            <p
                                className={`text-sm font-medium ${
                                    theme === "dark"
                                        ? "text-white"
                                        : "text-gray-900"
                                }`}
                            >
                                {user?.name || "John Doe"}
                            </p>
                            <p
                                className={`text-xs ${
                                    theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                }`}
                            >
                                {user?.email || "john@example.com"}
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Profile Actions */}
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium ${
                        theme === "dark"
                            ? "hover:bg-red-500/20 text-red-400 hover:text-red-300"
                            : "hover:bg-red-50 text-red-600 hover:text-red-700"
                    }`}
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default ProjectNav;
