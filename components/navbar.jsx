"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
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
    <div className="w-full flex justify-center mt-3 fixed top-0 z-10">
      <div
        className={`w-[65%] flex justify-between items-center px-6 py-2 rounded-full z-10 transition-all duration-300 ${
          scrolled ? "bg-white/20 backdrop-blur-3xl" : "bg-transparent"
        } text-white`}
      >
        <div className="text-2xl font-bold flex flex-col items-center">
          <span className="text-3xl">donut</span>
          <span className="text-sm">by me</span>
        </div>
        {loggedIn ? (
          <Link
            href="/authenticated/dashboard"
            className="rounded-full bg-[#6b46c1] text-white p-3 hover:bg-[#805ad5] transition-all duration-200 hover:scale-105"
          >
            Dashboard
          </Link>
        ) : (
          <button
            onClick={() => setLoggedIn(true)}
            className="rounded-full bg-[#6b46c1] text-white px-5 p-3 hover:bg-[#805ad5] transition-all duration-200 hover:scale-105"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};
