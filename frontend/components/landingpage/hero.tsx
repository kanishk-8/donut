"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Hero = () => {
    return (
        <div className="relative overflow-hidden min-h-screen flex items-center ">
            {/* Donut background - responsive positioning */}
            <div className="absolute top-1/2 right-1/4 sm:right-2/6 transform -translate-y-1/2 translate-x-1/2 z-0">
                <Image
                    width={600}
                    height={600}
                    src="/donut.avif"
                    alt="background donut"
                    className="w-64 sm:w-80 md:w-md lg:w-lg xl:w-xl h-auto opacity-20 animate-spin"
                    style={{ animation: "spin 30s linear infinite" }}
                    priority
                />
            </div>

            <div className="container relative mx-auto px-4 sm:px-6 h-full flex items-center justify-center z-10">
                {/* Content */}
                <div className="text-center max-w-5xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 sm:mb-8">
                        Building Backends is as{" "}
                        <span className="text-primary">Simple</span> as Eating a{" "}
                        <span className="text-primary">Donut</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
                        Drag and drop visual nodes to build complete backends.
                        Auth, databases, APIs, AI agents — connect them
                        together, no coding required. Build what used to take
                        weeks in just minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 items-center px-4">
                        <Button
                            asChild
                            size="lg"
                            className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10"
                        >
                            <Link href="/signup">Start Building Free</Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10"
                        >
                            <Link href="https://github.com/your-username/donut">
                                View on GitHub
                            </Link>
                        </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-12 sm:mt-16 flex flex-col items-center">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-4 px-4 text-center">
                            Join developers shipping backends faster than ever
                        </p>
                        <div className="flex items-center justify-center space-x-4 sm:space-x-8 opacity-60 px-4">
                            <Card className="w-16 sm:w-20 h-6 sm:h-8"></Card>
                            <Card className="w-16 sm:w-20 h-6 sm:h-8"></Card>
                            <Card className="w-16 sm:w-20 h-6 sm:h-8"></Card>
                            <Card className="hidden xs:block w-16 sm:w-20 h-6 sm:h-8"></Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
