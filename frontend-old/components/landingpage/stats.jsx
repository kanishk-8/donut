"use client";
import React from "react";

const Stats = () => {
  const stats = [
    {
      number: "10K+",
      label: "Developers Using Donut",
      description: "Open-source contributors and users worldwide",
    },
    {
      number: "50K+",
      label: "AI Agents Created",
      description: "Built and deployed by our community",
    },
    {
      number: "100%",
      label: "Open Source",
      description: "No vendor lock-in, ever",
    },
    {
      number: "24/7",
      label: "Community Support",
      description: "Active developer community and resources",
    },
  ];

  return (
    <section className="relative py-20 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group backdrop-blur-3xl bg-black/20 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <div className="relative mb-4">
                  <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300 transition-all duration-300">
                    {stat.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 transition-colors duration-300">
                  {stat.label}
                </h3>
                <p className="text-indigo-200 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
