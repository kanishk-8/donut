"use client";
import { useState } from "react";
import { Play, Volume2, Maximize, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const VideoShowcase = () => {
    const [currentVideo, setCurrentVideo] = useState(0);

    const videos = [
        {
            id: "agent-builder",
            title: "Build Your First AI Agent",
            description: "Visual no-code builder in action",
            duration: "3:45",
            thumbnail: "/thumbnails/agent-builder.jpg",
            videoUrl: "/videos/agent-builder-demo.mp4",
        },
        {
            id: "deployment",
            title: "Deploy & Integrate",
            description: "One-click deployment to any platform",
            duration: "2:30",
            thumbnail: "/thumbnails/deployment.jpg",
            videoUrl: "/videos/deployment-demo.mp4",
        },
        {
            id: "collaboration",
            title: "Community Collaboration",
            description: "Fork, contribute, and share agents",
            duration: "4:20",
            thumbnail: "/thumbnails/collaboration.jpg",
            videoUrl: "/videos/collaboration-demo.mp4",
        },
        {
            id: "customization",
            title: "Advanced Customization",
            description: "Extend with custom code and plugins",
            duration: "5:15",
            thumbnail: "/thumbnails/customization.jpg",
            videoUrl: "/videos/customization-demo.mp4",
        },
    ];

    return (
        <section className="relative py-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        See <span className="text-primary">Donut</span> in
                        Action
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Watch how our open-source platform empowers developers
                        to build, deploy, and share AI agents without
                        limitations.
                    </p>
                </div>

                {/* Main Video Section with Side Navigation */}
                <div className="mb-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-10 lg:items-start">
                            {/* Video Playlist - Top on Mobile, Left on Desktop */}
                            <div className="lg:col-span-1 order-1 lg:order-1">
                                {/* Mobile: horizontal scroll, Desktop: vertical stack */}
                                <div className="lg:aspect-video w-full">
                                    <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible lg:h-full gap-3 pb-4 lg:pb-0">
                                        {videos.map((video, index) => (
                                            <button
                                                key={video.id}
                                                type="button"
                                                className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 hover:scale-105 lg:flex-1 min-w-[250px] lg:min-w-0 flex flex-col justify-between transform-gpu text-left ${
                                                    index === currentVideo
                                                        ? "border-primary bg-accent"
                                                        : "border-border bg-card"
                                                }`}
                                                onClick={() =>
                                                    setCurrentVideo(index)
                                                }
                                                aria-label={`Play ${video.title}`}
                                            >
                                                <div className="flex-1">
                                                    <h4 className="font-bold mb-1 text-base leading-tight">
                                                        {video.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground leading-tight">
                                                        {video.description}
                                                    </p>
                                                </div>
                                                <div className="mt-2 shrink-0">
                                                    <Badge
                                                        variant="secondary"
                                                        className="gap-1 h-6 flex items-center"
                                                    >
                                                        <Clock className="w-4 h-4" />
                                                        {video.duration}
                                                    </Badge>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Video Player - Bottom on Mobile, Right on Desktop */}
                            <div className="lg:col-span-3 order-2 lg:order-2">
                                <Card className="relative aspect-video overflow-hidden shadow-2xl">
                                    <CardContent className="absolute inset-0 bg-muted/50 flex items-center justify-center p-0">
                                        <div className="text-center p-6">
                                            <Button
                                                size="icon"
                                                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full"
                                                aria-label={`Play ${videos[currentVideo].title}`}
                                            >
                                                <Play className="w-6 h-6 md:w-8 md:h-8 ml-1" />
                                            </Button>
                                            <h3 className="text-xl md:text-2xl font-bold mb-2">
                                                {videos[currentVideo].title}
                                            </h3>
                                            <p className="text-muted-foreground mb-4 text-sm md:text-base px-4 md:px-0">
                                                {
                                                    videos[currentVideo]
                                                        .description
                                                }
                                            </p>
                                            <div className="flex items-center justify-center gap-4 text-sm">
                                                <Badge
                                                    variant="outline"
                                                    className="gap-1"
                                                >
                                                    <Clock className="w-4 h-4" />
                                                    {
                                                        videos[currentVideo]
                                                            .duration
                                                    }
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className="gap-1"
                                                >
                                                    <Volume2 className="w-4 h-4" />
                                                    HD Quality
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>

                                    {/* Video Controls Overlay */}
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="w-10 h-10 rounded-full shrink-0"
                                                aria-label="Play video"
                                            >
                                                <Play className="w-5 h-5" />
                                            </Button>
                                            <div className="flex-1 h-2 bg-secondary rounded-full">
                                                <div className="h-full w-1/3 bg-primary rounded-full" />
                                            </div>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="w-10 h-10 rounded-full shrink-0"
                                            aria-label="Toggle fullscreen"
                                        >
                                            <Maximize className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoShowcase;
