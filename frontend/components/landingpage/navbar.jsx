"use client";
import { useAuth } from "@/context/authcontext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export const Navbar = () => {
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="w-full flex justify-center mt-5 fixed top-0 z-50">
            <div
                className={`flex justify-between items-center px-6 py-2 rounded-full z-10 transition-all duration-300 border ${
                    scrolled
                        ? "w-[70%] backdrop-blur-xl bg-black/20 border-gray-700"
                        : "w-[95%] bg-transparent border-transparent"
                } text-white`}
            >
                <div className="text-2xl font-bold flex gap-2 items-center">
                    <Image
                        src={"/logo.png"}
                        alt="logo"
                        width={56}
                        height={56}
                        className={`animate-spin transition-all duration-300 ${
                            scrolled ? "w-10 h-10" : "w-14 h-14"
                        }`}
                        style={{ animationDuration: "8s" }}
                    />
                    <div
                        className={`flex flex-col items-center transition-all duration-300 ${
                            scrolled ? "text-3xl" : "text-4xl"
                        }`}
                    >
                        <span>donut</span>
                        <span
                            className={`transition-all duration-300 ${
                                scrolled ? "text-sm" : "text-base"
                            }`}
                        >
                            by me
                        </span>
                    </div>
                </div>
                {user ? (
                    <Link
                        href="/authenticated/projects"
                        className={`rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-pink-500 transition-all duration-300 hover:scale-105 ${
                            scrolled
                                ? "px-5 py-3 text-base"
                                : "px-7 py-4 text-lg"
                        }`}
                    >
                        Go To Dashboard
                    </Link>
                ) : (
                    <Link
                        href={"/unauthenticated/login"}
                        className={`rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-pink-500 transition-all duration-300 hover:scale-105 ${
                            scrolled
                                ? "px-5 py-3 text-base"
                                : "px-7 py-4 text-lg"
                        }`}
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );
};
