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
    <div className="w-full flex justify-center mt-3 fixed top-0 z-50">
      <div
        className={`w-[95%] flex justify-between items-center px-6 py-2 rounded-full z-10 transition-all duration-300 border ${
          scrolled
            ? "backdrop-blur-xl bg-black/20 border-gray-700"
            : "bg-transparent border-transparent"
        } text-white`}
      >
        <div className="text-2xl font-bold flex gap-2 items-center">
          <Image src={"/logo.png"} alt="logo" width={40} height={40} />
          <div className="flex flex-col items-center">
            <span className="text-3xl">donut</span>
            <span className="text-sm">by me</span>
          </div>
        </div>
        {user ? (
          <Link
            href="/authenticated/projects"
            className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-5 p-3 hover:from-indigo-700 hover:to-pink-500 transition-all duration-200 hover:scale-105"
          >
            Go To Projects
          </Link>
        ) : (
          <Link
            href={"/unauthenticated/login"}
            className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-5 p-3 hover:from-indigo-700 hover:to-pink-500 transition-all duration-200 hover:scale-105"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};
