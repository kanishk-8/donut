"use client";
import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for trying out AI agents",
      features: [
        "1 AI agent",
        "100 conversations/month",
        "Basic templates",
        "Community support",
        "5-minute setup",
      ],
      popular: false,
    },
    {
      name: "Builder",
      price: "$19",
      period: "/month",
      description: "For serious builders and early adopters",
      features: [
        "5 AI agents",
        "2,000 conversations/month",
        "Custom workflows",
        "Priority support",
        "Advanced analytics",
        "API access",
        "Beta features first",
      ],
      popular: true,
    },
    {
      name: "Scale",
      price: "$49",
      period: "/month",
      description: "For growing startups and teams",
      features: [
        "Unlimited AI agents",
        "10,000 conversations/month",
        "Team collaboration",
        "White-label options",
        "Custom integrations",
        "Dedicated support",
        "Early access to new features",
        "1-on-1 onboarding",
      ],
      popular: false,
    },
  ];

  return (
    <section className="relative py-20 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            Choose the perfect plan for your business. Start free and scale as
            you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? "bg-gradient-to-b from-indigo-600/20 to-purple-600/20 border-indigo-400/50 scale-105"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-400/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-xl text-indigo-300 ml-1">
                    {plan.period}
                  </span>
                </div>
                <p className="text-indigo-200">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-indigo-200">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/unauthenticated/signup"
                className={`block w-full py-3 px-6 rounded-full font-bold text-center transition-all duration-200 hover:scale-105 ${
                  plan.popular
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-pink-500 text-white"
                    : "bg-transparent border border-white hover:bg-white/10 text-white"
                }`}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-indigo-300 mb-4">
            All plans include a 14-day free trial
          </p>
          <p className="text-sm text-indigo-400">
            Questions about scaling?{" "}
            <Link
              href="/contact"
              className="text-indigo-300 hover:text-white underline"
            >
              Let's chat about your needs
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
