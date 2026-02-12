"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Home01Icon,
    Book02Icon,
    Settings02Icon,
    ArrowLeft01Icon,
    FolderOpenIcon,
    Cancel01Icon,
    AiNetworkIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useAuth } from "@/context/authcontext";
import { useProject } from "@/context/projectcontext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SideBar = () => {
    const { user } = useAuth();
    const { fetchProject, currentProject } = useProject();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const projectId = pathname.split("/")[3]; // Extract project ID from URL

    // Check if we're in a project context
    const isInProject = pathname.includes("/projects/") && projectId;

    // Fetch project data when projectId changes
    useEffect(() => {
        if (isInProject && projectId) {
            fetchProject(projectId);
        }
    }, [projectId, isInProject, fetchProject]);

    const menuItems = [
        {
            name: "Overview",
            icon: Home01Icon,
            path: `/projects/${projectId}/dashboard`,
        },
        {
            name: "Knowledge Base",
            icon: Book02Icon,
            path: `/projects/${projectId}/knowledgebase`,
        },
        {
            name: "Workflows",
            icon: AiNetworkIcon,
            path: `/projects/${projectId}/workflow`,
        },
        {
            name: "Settings",
            icon: Settings02Icon,
            path: `/projects/${projectId}/settings`,
        },
    ];

    return (
        <>
            {/* Mobile menu button */}
            <Button
                variant="outline"
                size="icon"
                className="md:hidden fixed top-4 left-4 z-40 rounded-full"
                onClick={() => setOpen(true)}
                aria-label="Open sidebar"
            >
                <Image
                    src="/2nutIcon.png"
                    alt="Donut logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
            </Button>
            {/* Overlay for mobile */}
            {open && (
                <button
                    type="button"
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden border-0 p-0 cursor-default"
                    onClick={() => setOpen(false)}
                    onKeyDown={(e) => {
                        if (
                            e.key === "Escape" ||
                            e.key === "Enter" ||
                            e.key === " "
                        ) {
                            e.preventDefault();
                            setOpen(false);
                        }
                    }}
                    aria-label="Close sidebar"
                    tabIndex={0}
                />
            )}
            {/* Sidebar */}
            <div
                className={cn(
                    "fixed md:static top-0 left-0 z-40 h-full w-64 md:w-72 flex flex-col backdrop-blur-lg bg-background/80 py-4 px-2 transition-transform duration-300 md:translate-x-0 border-r",
                    open ? "translate-x-0" : "-translate-x-full",
                    "md:translate-x-0 md:flex md:h-screen",
                )}
            >
                <div className="px-3 md:px-4 mb-4 md:mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
                            <Image
                                src="/2nutIcon.png"
                                alt="Donut logo"
                                width={32}
                                height={32}
                                className="rounded-full md:w-10 md:h-10"
                            />
                        </div>
                        <h1 className="ml-2 text-lg md:text-xl font-bold">
                            donut
                        </h1>
                    </div>
                    {/* Close button for mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden ml-2"
                        onClick={() => setOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <HugeiconsIcon
                            icon={Cancel01Icon}
                            className="w-5 h-5"
                        />
                    </Button>
                </div>

                {/* Back to Projects Button - Only show when in project context */}
                {isInProject && (
                    <div className="px-4 mb-3">
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs h-8"
                        >
                            <Link href="/projects">
                                <HugeiconsIcon
                                    icon={ArrowLeft01Icon}
                                    className="w-3 h-3 mr-1.5"
                                />
                                All Projects
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Project Header - Only show when in project context */}
                {isInProject && currentProject && (
                    <div className="px-4 mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                                <HugeiconsIcon
                                    icon={FolderOpenIcon}
                                    className="w-3 h-3 text-primary-foreground"
                                />
                            </div>
                            <h2 className="font-semibold text-sm">
                                {currentProject.name}
                            </h2>
                        </div>
                        <div className="flex gap-1.5 ml-8">
                            <Badge variant="secondary" className="text-xs">
                                {currentProject.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                {currentProject.status}
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Separator line - Only show when in project context */}
                {isInProject && (
                    <div className="px-4 mb-4">
                        <div className="border-t" />
                    </div>
                )}

                <nav className="flex-1 overflow-y-auto px-3">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Button
                                    asChild
                                    variant={
                                        pathname === item.path
                                            ? "default"
                                            : "ghost"
                                    }
                                    className="w-full justify-start"
                                    onClick={() => setOpen(false)}
                                >
                                    <Link href={item.path}>
                                        <HugeiconsIcon
                                            icon={item.icon}
                                            className="w-5 h-5"
                                        />
                                        <span className="ml-3">
                                            {item.name}
                                        </span>
                                    </Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="px-3 md:px-4 py-2">
                    <div className="border-t pt-3 md:pt-4">
                        <Button
                            asChild
                            variant={
                                pathname === "/profile" ? "default" : "ghost"
                            }
                            className="w-full justify-start"
                            onClick={() => setOpen(false)}
                        >
                            <Link href="/profile">
                                <Avatar className="w-6 h-6 md:w-8 md:h-8">
                                    <AvatarImage
                                        src={user?.avatar ?? undefined}
                                        alt={user?.name || "User profile"}
                                    />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                        {user?.name
                                            ? user.name
                                                  .split(" ")
                                                  .map((n) => n[0])
                                                  .join("")
                                                  .toUpperCase()
                                            : "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-2 md:ml-3 min-w-0 flex-1 text-left">
                                    <p className="font-bold text-xs md:text-sm truncate">
                                        {user?.name || user?.email || "User"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {user?.plan || "Pro Plan"}
                                    </p>
                                </div>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideBar;
