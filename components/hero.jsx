"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative overflow-hidden text-white min-h-screen">
      {/* Donut background */}
      <div className="absolute inset-0 flex justify-center items-center z-0">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full opacity-10 blur-2xl"></div>
          <div
            className="absolute -inset-10 rounded-full opacity-10 blur-3xl"
            style={{ animationDelay: "1s" }}
          ></div>
          <Image
            width={500}
            height={500}
            src="/donut.avif"
            alt="background donut"
            className="w-[25rem] md:w-[30rem] lg:w-[40rem] h-auto animate-spin opacity-30 ml-80"
            style={{ animation: "spin 30s linear infinite" }}
            priority
          />
        </div>
      </div>

      <div className="container relative mx-auto px-6 py-16 md:py-40 flex flex-col items-center justify-center">
        {/* Content */}
        <div className="z-20 md:w-3/4 text-center mb-12 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6">
            Transform Your Business with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
              AI Agents
            </span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Create, customize, and deploy powerful AI assistants for your
            business without writing a single line of code. Save time, reduce
            costs, and enhance customer experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Link
              href="/unauthenticated/signup"
              className="px-8 py-3 bg-[#6b46c1] hover:bg-pink-500 rounded-full font-bold transition-all duration-200 hover:scale-105  text-center"
            >
              Get Started
            </Link>
            <Link
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="px-8 py-3 bg-transparent border border-white hover:bg-white/10 rounded-full font-bold transition-all duration-200 hover:scale-105 text-center"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
