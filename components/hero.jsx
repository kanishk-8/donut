"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative overflow-hidden text-white min-h-screen flex items-center">
      {/* Donut background - positioned between center and right edge */}
      <div className="absolute top-1/2 right-2/6 transform -translate-y-1/2 translate-x-1/2 z-0">
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-40 blur-2xl animate-pulse"></div>
          <div
            className="absolute -inset-8 rounded-full bg-gradient-to-r from-pink-500/20 to-indigo-500/20 opacity-30 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <Image
            width={600}
            height={600}
            src="/donut.avif"
            alt="background donut"
            className="w-[28rem] md:w-[32rem] lg:w-[36rem] h-auto opacity-30"
            style={{ animation: "spin 30s linear infinite" }}
            priority
          />
        </div>
      </div>

      <div className="container relative mx-auto px-6 h-full flex items-center justify-center z-10">
        {/* Content */}
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
            Build Your First{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
              AI Agent
            </span>{" "}
            in Minutes
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-indigo-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            The simplest way to create intelligent AI assistants. No coding, no
            complexity - just drag, drop, and deploy. Join the AI revolution
            today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <Link
              href="/unauthenticated/signup"
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-pink-500 rounded-full font-bold text-lg transition-all duration-200 hover:scale-105 text-center text-white shadow-2xl"
            >
              Get Started Free
            </Link>
            <Link
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="px-10 py-4 bg-transparent border-2 border-white hover:bg-white/10 rounded-full font-bold text-lg transition-all duration-200 hover:scale-105 text-center backdrop-blur-sm"
            >
              Watch Demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-col items-center">
            <p className="text-sm text-indigo-300 mb-4">
              Join 1,000+ early adopters building the future
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="w-20 h-8 bg-white/20 rounded backdrop-blur-sm"></div>
              <div className="w-20 h-8 bg-white/20 rounded backdrop-blur-sm"></div>
              <div className="w-20 h-8 bg-white/20 rounded backdrop-blur-sm"></div>
              <div className="w-20 h-8 bg-white/20 rounded backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
