"use client";
import React from "react";
import {
  MessageSquare,
  Phone,
  Clock,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const ServiceShowcase = () => {
  const services = [
    {
      icon: MessageSquare,
      title: "Conversational AI Agents",
      description:
        "Build intelligent chatbots and virtual assistants that understand context, maintain conversations, and learn from interactions.",
      features: [
        "Natural language processing",
        "Context awareness",
        "Multi-language support",
        "Learning capabilities",
      ],
    },
    {
      icon: Phone,
      title: "Voice AI Agents",
      description:
        "Create voice-powered assistants for phone systems, smart devices, and applications with natural speech synthesis.",
      features: [
        "Natural voice synthesis",
        "Real-time processing",
        "Voice recognition",
        "Emotion detection",
      ],
    },
    {
      icon: Clock,
      title: "Task Automation Agents",
      description:
        "Deploy AI agents that handle workflows, data processing, and repetitive tasks across your organization automatically.",
      features: [
        "Workflow automation",
        "Data processing",
        "API integrations",
        "Scheduled tasks",
      ],
    },
  ];

  const integrations = [
    {
      name: "Website Widget",
      description: "Embed agents directly into your site",
    },
    { name: "Mobile Apps", description: "Native SDK for iOS and Android" },
    {
      name: "APIs & Webhooks",
      description: "RESTful APIs for custom integrations",
    },
    {
      name: "Slack & Discord",
      description: "Deploy agents in team communication tools",
    },
    {
      name: "CRM Systems",
      description: "Sync with Salesforce, HubSpot, and more",
    },
    {
      name: "E-commerce",
      description: "Shopify, WooCommerce, and custom stores",
    },
  ];

  return (
    <section className="relative py-20 text-white">
      <div className="container mx-auto px-6">
        {/* Service Types */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Build Any{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
              AI Agent
            </span>{" "}
            You Imagine
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            From customer service to personal assistants, our open-source
            platform provides all the tools you need to create intelligent AI
            agents.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl backdrop-blur-3xl bg-black/20 border border-white/10 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <div className="relative z-10">
                  <service.icon className="w-12 h-12 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-indigo-200 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-indigo-300"
                      >
                        <Zap className="w-4 h-4 mr-2 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">
            Integrate with Your Existing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
              Platform
            </span>
          </h3>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Our AI agents seamlessly integrate with your current tools and
            workflows.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl backdrop-blur-3xl bg-black/20 border border-white/10 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <h4 className="font-bold text-lg mb-2">{integration.name}</h4>
                <p className="text-indigo-200 text-sm">
                  {integration.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceShowcase;
