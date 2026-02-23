"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/authcontext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProjectNav = () => {
    const { user, loading, logout } = useAuth();
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

    // Show loading skeleton while auth is being checked
    if (loading) {
        return (
            <div className="flex items-center justify-between fixed top-0 left-0 w-full z-30 p-2 border-b backdrop-blur-lg bg-background/80">
                {/* Logo Section */}
                <div className="flex items-center px-3 md:px-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
                        <Image
                            src="/2nutIcon.png"
                            alt="Donut Logo"
                            width={32}
                            height={32}
                            className="rounded-full md:w-10 md:h-10"
                        />
                    </div>
                    <h1 className="ml-2 text-lg md:text-xl font-bold">donut</h1>
                </div>

                {/* Loading skeleton for user section */}
                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg bg-background">
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                        <div className="hidden sm:block space-y-1">
                            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-28 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                </div>
            </div>
        );
    }

    // Don't render if no user (shouldn't happen on protected routes, but safety guard)
    if (!user) {
        return null;
    }

    // Generate avatar fallback safely
    const getInitials = (name: string) => {
        if (!name || name.trim().length === 0) return "U";
        return name
            .trim()
            .split(" ")
            .filter((n) => n.length > 0)
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2); // Limit to 2 characters
    };

    return (
        <div className="flex items-center justify-between fixed top-0 left-0 w-full z-30 p-2 border-b backdrop-blur-lg bg-background/80">
            {/* Logo Section */}
            <div className="flex items-center px-3 md:px-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
                    <Image
                        src="/2nutIcon.png"
                        alt="Donut Logo"
                        width={32}
                        height={32}
                        className="rounded-full md:w-10 md:h-10"
                    />
                </div>
                <h1 className="ml-2 text-lg md:text-xl font-bold">donut</h1>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center gap-3">
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 transition-all"
                >
                    <Avatar className="w-8 h-8">
                        <AvatarImage
                            src={user.avatar || undefined}
                            alt={user.name || user.email}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </Link>

                {/* Profile Actions */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Logout</span>
                </Button>
            </div>
        </div>
    );
};

export default ProjectNav;
