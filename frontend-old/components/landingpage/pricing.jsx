"use client";
import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const Pricing = () => {
    const plans = [
        {
            name: "Community",
            price: "Free",
            period: " Forever",
            description: "Perfect for individuals & open source projects",
            features: [
                "Unlimited local agents",
                "Community support",
                "Access to templates",
                "Self-hosted deployment",
            ],
            popular: false,
        },
        {
            name: "Cloud",
            price: "$19",
            period: "/month",
            description: "Hosted solution for teams",
            features: [
                "Everything in Community",
                "Cloud deployment",
                "Priority support",
                "Advanced analytics",
            ],
            popular: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            description: "For large organizations",
            features: [
                "Everything in Cloud",
                "Custom integrations",
                "Dedicated support",
                "SLA guarantees",
            ],
            popular: false,
        },
    ];

    return (
        <section className="relative py-14 pt-24 text-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Simple{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
                            Pricing
                        </span>
                    </h2>
                    <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
                        Start building for free. Scale with cloud hosting when
                        you're ready. Always open-source, always yours.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-10">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative p-6 rounded-2xl backdrop-blur-3xl border transition-all duration-300 ${
                                    plan.popular
                                        ? "bg-black/30 border-indigo-400/50"
                                        : "bg-black/20 border-white/10"
                                } hover:scale-105`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-5">
                                    <h3 className="text-2xl font-bold mb-2">
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline justify-center mb-2">
                                        <span className="text-5xl font-bold">
                                            {plan.price}
                                        </span>
                                        <span className="text-xl text-indigo-300 ml-1">
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className="text-indigo-200">
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="space-y-2 mb-6">
                                    {plan.features.map(
                                        (feature, featureIndex) => (
                                            <li
                                                key={featureIndex}
                                                className="flex items-center"
                                            >
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span className="text-indigo-200">
                                                    {feature}
                                                </span>
                                            </li>
                                        ),
                                    )}
                                </ul>

                                <Link
                                    href="/signup"
                                    className={`block w-full py-3 px-6 rounded-full font-bold text-center transition-all duration-200 hover:scale-105 ${
                                        plan.popular
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-pink-500 text-white backdrop-blur-3xl shadow-2xl"
                                            : "bg-black/20 border border-white/10 text-white backdrop-blur-3xl shadow-2xl"
                                    }`}
                                >
                                    {plan.name === "Enterprise"
                                        ? "Contact Sales"
                                        : "Get Started"}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-10">
                    <p className="text-indigo-300 mb-4">
                        Community Edition is free forever • Cloud hosting
                        available when you need it
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6">
                        <div className="text-center p-3 bg-black/20 rounded-lg border border-white/10 backdrop-blur-3xl shadow-lg transition-all duration-300 hover:scale-105">
                            <h4 className="font-bold text-indigo-300 mb-1">
                                Self-Hosted Deployment
                            </h4>
                            <p className="text-white text-lg">Always Free</p>
                            <p className="text-sm text-indigo-400">
                                Your infrastructure, your control
                            </p>
                        </div>
                        <div className="text-center p-3 bg-black/20 rounded-lg border border-white/10 backdrop-blur-3xl shadow-lg transition-all duration-300 hover:scale-105">
                            <h4 className="font-bold text-indigo-300 mb-1">
                                Cloud Usage
                            </h4>
                            <p className="text-white text-lg">
                                Pay as you scale
                            </p>
                            <p className="text-sm text-indigo-400">
                                No minimum commitments
                            </p>
                        </div>
                    </div>
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
