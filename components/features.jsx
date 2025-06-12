"use client";
import React from "react";
import {
  Rocket,
  MessageCircle,
  Settings,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Rocket,
      title: "No-Code Agent Builder",
      description:
        "Create powerful AI agents with our intuitive drag-and-drop interface. No programming experience required.",
    },
    {
      icon: MessageCircle,
      title: "Natural Conversations",
      description:
        "Build agents that understand context and maintain engaging conversations with your customers.",
    },
    {
      icon: Settings,
      title: "Custom Workflows",
      description:
        "Design complex automation workflows that integrate seamlessly with your existing business processes.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Track performance metrics and gain valuable insights into your agent's interactions and effectiveness.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-grade security with end-to-end encryption and compliance with industry standards.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Deploy agents instantly with our optimized infrastructure and lightning-fast response times.",
    },
  ];

  return (
    <section className="relative py-20 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
              Donut
            </span>
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            We're building the future of AI automation. Simple, powerful, and
            designed for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-indigo-400/50"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <feature.icon className="w-12 h-12 text-indigo-400 mb-4 group-hover:text-pink-400 transition-colors duration-300" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-indigo-200 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
