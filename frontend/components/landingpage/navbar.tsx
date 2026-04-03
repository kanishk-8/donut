"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/context/authcontext";
import { Folder, ArrowUpRight, LogIn, ArrowRight } from "lucide-react";

export const Navbar = () => {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="w-full flex justify-center mt-5 fixed top-0 z-50">
            <div
                className={`flex justify-between items-center px-4 md:px-6 py-2 rounded-full z-10 transition-all duration-300 border ${
                    scrolled
                        ? "w-[90%] md:w-[70%] backdrop-blur-xl bg-card/80 border-border shadow-lg"
                        : "w-[95%] bg-transparent border-transparent"
                }`}
            >
                <div className="text-2xl font-bold flex gap-2 items-center">
                    <Image
                        src={"/2nutIcon.png"}
                        alt="logo"
                        width={56}
                        height={56}
                        className={` transition-all  ${
                            scrolled
                                ? "w-8 h-8 md:w-10 md:h-10"
                                : "w-10 h-10 md:w-14 md:h-14"
                        }`}
                    />
                    <div
                        className={`flex flex-col items-center transition-all duration-300 text-foreground ${
                            scrolled
                                ? "text-xl md:text-3xl"
                                : "text-2xl md:text-4xl"
                        }`}
                    >
                        <span>donut</span>
                        <span
                            className={`text-muted-foreground transition-all duration-300 ${
                                scrolled ? "text-sm" : "text-base"
                            }`}
                        >
                            by me
                        </span>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <Button
                        size="icon"
                        onClick={() =>
                            setTheme(theme === "light" ? "dark" : "light")
                        }
                    >
                        {!mounted ? (
                            <div className="w-6 h-6" />
                        ) : theme === "light" ? (
                            <HugeiconsIcon
                                icon={Moon02Icon}
                                color="currentColor"
                                strokeWidth={3}
                            />
                        ) : (
                            <HugeiconsIcon
                                icon={Sun02Icon}
                                color="currentColor"
                                strokeWidth={3}
                            />
                        )}
                    </Button>
                    {user ? (
                        <Button
                            asChild
                            size={scrolled ? "default" : "lg"}
                            className="font-bold flex items-center gap-1.5 md:h-12 md:px-8"
                        >
                            <Link href="/projects">
                                <span className="hidden sm:inline">
                                    Projects
                                </span>
                                <Folder
                                    className="w-5 h-5 sm:hidden"
                                    strokeWidth={3}
                                />

                                <ArrowUpRight
                                    className="w-4 h-4 ml-1"
                                    strokeWidth={3}
                                />
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            asChild
                            size={scrolled ? "default" : "lg"}
                            className="font-bold flex items-center gap-1.5 md:h-12 md:px-8"
                        >
                            <Link href="/login">
                                <span className="hidden sm:inline">
                                    Sign In
                                </span>
                                <LogIn className="w-5 h-5 sm:hidden" />
                                <ArrowRight
                                    className="w-4 h-4 ml-1 hidden sm:block"
                                    strokeWidth={3}
                                />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
