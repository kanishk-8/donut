"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Discord, Github, Linkedin, Twitter } from "@hugeicons/core-free-icons";

const Footer = () => {
    const footerLinks = {
        Product: [
            { name: "Features", href: "#features" },
            { name: "Templates", href: "/templates" },
            { name: "Integrations", href: "/integrations" },
            { name: "API Docs", href: "/docs/api" },
            { name: "Roadmap", href: "/roadmap" },
        ],
        Community: [
            { name: "GitHub", href: "https://github.com/your-username/donut" },
            { name: "Discord", href: "/discord" },
            { name: "Discussions", href: "/community" },
            { name: "Contributors", href: "/contributors" },
            { name: "Blog", href: "/blog" },
        ],
        Resources: [
            { name: "Documentation", href: "/docs" },
            { name: "Tutorials", href: "/tutorials" },
            { name: "Examples", href: "/examples" },
            { name: "Self-hosting", href: "/docs/self-hosting" },
            { name: "Migration Guide", href: "/docs/migration" },
        ],
        Legal: [
            { name: "License", href: "/license" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Code of Conduct", href: "/code-of-conduct" },
            { name: "Security", href: "/security" },
        ],
    };

    const socialLinks = [
        { name: "Twitter", href: "#", icon: "twitter" },
        { name: "LinkedIn", href: "#", icon: "linkedin" },
        { name: "GitHub", href: "#", icon: "github" },
        { name: "Discord", href: "#", icon: "discord" },
    ];

    return (
        <footer className="relative border-t">
            <div className="container mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 md:col-span-4">
                        <div className="flex items-center gap-2 mb-6">
                            <Image
                                src="/2nutIcon.png"
                                alt="Donut logo"
                                width={40}
                                height={40}
                            />
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold">
                                    donut
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    by me
                                </span>
                            </div>
                        </div>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            Building the future of AI automation, one agent at a
                            time. Join our community of early adopters and shape
                            the next generation of no-code AI.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <Button
                                    key={social.name}
                                    asChild
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <Link href={social.href}>
                                        <span className="sr-only">
                                            {social.name}
                                        </span>
                                        {social.icon === "twitter" && (
                                            <HugeiconsIcon icon={Twitter} />
                                        )}
                                        {social.icon === "linkedin" && (
                                            <HugeiconsIcon
                                                icon={Linkedin}
                                                color="currentColor"
                                            />
                                        )}
                                        {social.icon === "github" && (
                                            <HugeiconsIcon
                                                icon={Github}
                                                color="currentColor"
                                            />
                                        )}
                                        {social.icon === "discord" && (
                                            <HugeiconsIcon
                                                icon={Discord}
                                                color="currentColor"
                                            />
                                        )}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="font-bold text-lg mb-4">
                                {category}
                            </h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                        © 2024 Donut AI. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm">
                        <Link
                            href="/status"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            System Status
                        </Link>
                        <Link
                            href="/sitemap"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Sitemap
                        </Link>
                        <Link
                            href="/contact"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
