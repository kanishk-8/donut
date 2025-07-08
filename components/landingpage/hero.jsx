"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative overflow-hidden text-white min-h-screen flex items-center">
      {/* Donut background - responsive positioning */}
      <div className="absolute top-1/2 right-1/4 sm:right-2/6 transform -translate-y-1/2 translate-x-1/2 z-0">
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
            className="w-64 sm:w-80 md:w-[28rem] lg:w-[32rem] xl:w-[36rem] h-auto opacity-50 sm:opacity-60 animate-spin"
            style={{ animation: "spin 30s linear infinite" }}
            priority
          />
        </div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 h-full flex items-center justify-center z-10">
        {/* Content */}
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 sm:mb-8">
            Build Powerful{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
              AI Agents
            </span>{" "}
            for Everyone
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-indigo-200 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Open-source platform to create, deploy, and share intelligent AI
            agents. From customer service to personal assistants - build any AI
            agent with our collaborative, community-driven tools.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 items-center px-4">
            <Link
              href="/unauthenticated/signup"
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-pink-500 rounded-full font-bold text-base sm:text-lg transition-all duration-200 hover:scale-105 text-center text-white shadow-2xl backdrop-blur-3xl"
            >
              Start Building Free
            </Link>
            <Link
              href="https://github.com/your-username/donut"
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-black/20 border-2 border-white/10 hover:bg-black/30 rounded-full font-bold text-base sm:text-lg transition-all duration-200 hover:scale-105 text-center backdrop-blur-3xl shadow-2xl"
            >
              View on GitHub
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 sm:mt-16 flex flex-col items-center">
            <p className="text-xs sm:text-sm text-indigo-300 mb-4 px-4 text-center">
              Join 10,000+ developers building the future of AI
            </p>
            <div className="flex items-center justify-center space-x-4 sm:space-x-8 opacity-60 px-4">
              <div className="w-16 sm:w-20 h-6 sm:h-8 bg-black/20 rounded backdrop-blur-3xl border border-white/10 shadow-lg"></div>
              <div className="w-16 sm:w-20 h-6 sm:h-8 bg-black/20 rounded backdrop-blur-3xl border border-white/10 shadow-lg"></div>
              <div className="w-16 sm:w-20 h-6 sm:h-8 bg-black/20 rounded backdrop-blur-3xl border border-white/10 shadow-lg"></div>
              <div className="hidden xs:block w-16 sm:w-20 h-6 sm:h-8 bg-black/20 rounded backdrop-blur-3xl border border-white/10 shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
