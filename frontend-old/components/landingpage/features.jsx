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
        "Create powerful AI agents with our intuitive visual interface. Build chatbots, voice assistants, and automation agents in minutes.",
    },
    {
      icon: MessageCircle,
      title: "Multi-Modal Support",
      description:
        "Deploy both voice and chat agents that can handle text, speech, images, and documents across multiple channels.",
    },
    {
      icon: Settings,
      title: "Open Source & Extensible",
      description:
        "Full access to source code. Customize, extend, and contribute to the platform. No vendor lock-in, ever.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Track agent performance, user interactions, and system metrics. Get insights to continuously improve your agents.",
    },
    {
      icon: Shield,
      title: "Privacy-First Design",
      description:
        "Self-host your agents or use our cloud. End-to-end encryption and GDPR compliance for handling sensitive data.",
    },
    {
      icon: Zap,
      title: "Community Driven",
      description:
        "Share agents, templates, and integrations with the community. Learn from others and contribute your innovations.",
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
            The first truly open-source platform for building AI agents. Simple,
            powerful, and designed for the community.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl backdrop-blur-3xl bg-black/20 border border-white/10 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <div className="relative z-10">
                  <feature.icon className="w-12 h-12 text-indigo-400 mb-4 transition-colors duration-300" />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-indigo-200 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
