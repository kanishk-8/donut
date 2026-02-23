"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const CTA = () => {
    return (
        <section className="relative py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    <Card className="relative max-w-4xl mx-auto text-center shadow-2xl">
                        <div className="p-12">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Ready to Build the Future?
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Join the next generation of builders creating
                                AI-powered experiences. Start your journey today
                                - no credit card required.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
                                <Button
                                    asChild
                                    size="lg"
                                    className="text-lg px-10"
                                >
                                    <Link href="/signup">
                                        Start Building Free
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="text-lg px-10"
                                >
                                    <a
                                        href="https://github.com/your-username/donut"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Source Code
                                    </a>
                                </Button>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    No credit card required
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    Free forever
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    Open source
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default CTA;
