"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/context/authcontext";

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
                className={`flex justify-between items-center px-6 py-2 rounded-full z-10 transition-all duration-300 border ${
                    scrolled
                        ? "w-[70%] backdrop-blur-xl bg-card/80 border-border shadow-lg"
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
                            scrolled ? "w-10 h-10" : "w-14 h-14"
                        }`}
                    />
                    <div
                        className={`flex flex-col items-center transition-all duration-300 text-foreground ${
                            scrolled ? "text-3xl" : "text-4xl"
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
                            size={scrolled ? "lg" : "xl"}
                            className="font-bold"
                        >
                            <Link href="/projects">Go To Dashboard</Link>
                        </Button>
                    ) : (
                        <Button
                            asChild
                            size={scrolled ? "lg" : "xl"}
                            className="font-bold"
                        >
                            <Link href="/login">Sign In</Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
