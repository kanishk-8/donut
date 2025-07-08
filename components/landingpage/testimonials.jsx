"use client";
import React from "react";
import Image from "next/image";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Co-founder, StartupFlow",
      avatar: "/avatars/alex.jpg",
      content:
        "Donut helped us launch our AI customer support in just 2 days. As a small team, this was exactly what we needed to compete with bigger players.",
    },
    {
      name: "Jordan Smith",
      role: "Founder, LocalBiz",
      avatar: "/avatars/jordan.jpg",
      content:
        "Finally, an AI tool that doesn't require a engineering team! I built our first agent myself and it's handling 70% of our customer inquiries.",
    },
    {
      name: "Sam Taylor",
      role: "CEO, TechStart",
      avatar: "/avatars/sam.jpg",
      content:
        "The simplicity is incredible. We went from idea to deployed AI agent in under an hour. This is the future of no-code automation.",
    },
  ];

  return (
    <section className="relative py-20 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
              Early Adopters
            </span>
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            See how forward-thinking startups and entrepreneurs are using Donut
            to build their AI-first businesses.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl backdrop-blur-3xl bg-black/20 border border-white/10 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-indigo-300 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-indigo-200 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex text-yellow-400 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
