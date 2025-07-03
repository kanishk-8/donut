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
      title: "Intelligent Chat Agents",
      description:
        "Deploy AI-powered chat agents that understand context, handle complex queries, and provide instant responses to your customers.",
      features: [
        "Natural language processing",
        "Context awareness",
        "Multi-language support",
        "Seamless handoffs",
      ],
    },
    {
      icon: Phone,
      title: "Voice Support Agents",
      description:
        "Integrate AI voice agents into your phone systems for 24/7 customer support that sounds natural and professional.",
      features: [
        "Natural voice synthesis",
        "Real-time processing",
        "Call routing",
        "Emotion detection",
      ],
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description:
        "Never miss a customer inquiry. Our AI agents work around the clock to provide instant support when your customers need it most.",
      features: [
        "Always online",
        "Instant responses",
        "Global timezone support",
        "Holiday coverage",
      ],
    },
  ];

  const integrations = [
    {
      name: "Website Widget",
      description: "Embed chat directly into your site",
    },
    { name: "Mobile Apps", description: "Native SDK for iOS and Android" },
    { name: "Phone Systems", description: "Integrate with existing PBX" },
    { name: "Help Desk", description: "Connect to Zendesk, Intercom, etc." },
    { name: "CRM", description: "Sync with Salesforce, HubSpot" },
    { name: "E-commerce", description: "Shopify, WooCommerce support" },
  ];

  return (
    <section className="relative py-20 text-white">
      <div className="container mx-auto px-6">
        {/* Service Types */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Complete{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
              Customer Service
            </span>{" "}
            Solution
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            From chat to voice, we provide all the tools you need to deliver
            exceptional customer experiences.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl backdrop-blur-3xl bg-black/20 border border-white/10 hover:bg-black/30 transition-all duration-300 hover:scale-105 hover:border-indigo-400/50 shadow-2xl"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <service.icon className="w-12 h-12 text-indigo-400 mb-4 group-hover:text-pink-400 transition-colors duration-300" />
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl backdrop-blur-3xl bg-black/20 border border-white/10 hover:bg-black/30 transition-all duration-300 hover:border-indigo-400/50 shadow-2xl"
            >
              <h4 className="font-bold text-lg mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                {integration.name}
              </h4>
              <p className="text-indigo-200 text-sm">
                {integration.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceShowcase;
