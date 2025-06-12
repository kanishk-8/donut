"use client";
import React from "react";

const Stats = () => {
  const stats = [
    {
      number: "1K+",
      label: "Early Adopters",
      description: "Builders who believe in the vision",
    },
    {
      number: "100K+",
      label: "AI Agents Created",
      description: "And growing fast every day",
    },
    {
      number: "Beta",
      label: "Early Access",
      description: "Join the exclusive beta program",
    },
    {
      number: "24/7",
      label: "Community Support",
      description: "Active founder & community help",
    },
  ];

  return (
    <section className="relative py-20 text-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-4">
                <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300 group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
                  {stat.number}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                {stat.label}
              </h3>
              <p className="text-indigo-200 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
