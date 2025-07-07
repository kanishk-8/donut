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
        "Create powerful customer service agents with our intuitive interface. Build FAQ bots, support agents, and voice assistants in minutes.",
    },
    {
      icon: MessageCircle,
      title: "Voice & Chat Support",
      description:
        "Deploy both voice and chat agents that handle customer inquiries 24/7. Seamless handoff to human agents when needed.",
    },
    {
      icon: Settings,
      title: "Custom Workflows",
      description:
        "Design complex customer journey workflows. Route tickets, escalate issues, and integrate with your existing support systems.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Track customer satisfaction, response times, and agent performance. Get insights to continuously improve your service.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-grade security with end-to-end encryption. GDPR compliant and SOC 2 certified for handling sensitive customer data.",
    },
    {
      icon: Zap,
      title: "Instant Integration",
      description:
        "Embed agents into your website, app, or phone system in minutes. RESTful APIs and SDKs for seamless integration.",
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
            We're building the future of customer service automation. Simple,
            powerful, and designed for every business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </section>
  );
};

export default Features;
