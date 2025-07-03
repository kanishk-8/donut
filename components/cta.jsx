"use client";
import React from "react";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="relative py-20 text-white">
      <div className="container mx-auto px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Background decoration */}
          <div className="absolute inset-0 rounded-3xl bg-black/20 backdrop-blur-3xl border border-white/10 shadow-2xl"></div>

          <div className="relative z-10 p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
              Join the next generation of builders creating AI-powered
              experiences. Start your journey today - no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
              <Link
                href="/unauthenticated/signup"
                className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-pink-500 rounded-full font-bold text-lg transition-all duration-200 hover:scale-105 text-center backdrop-blur-3xl shadow-2xl"
              >
                Start Free Trial
              </Link>
              <Link
                href="/demo"
                className="px-10 py-4 bg-black/20 border-2 border-white/10 rounded-full font-bold text-lg transition-all duration-200 hover:scale-105 text-center backdrop-blur-3xl shadow-2xl"
              >
                Book a Demo
              </Link>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-indigo-300">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
