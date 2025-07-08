"use client";
import React, { useState } from "react";
import { Play, Volume2, Maximize, Clock } from "lucide-react";

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
    <section className="relative py-20 text-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            See{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
              Donut
            </span>{" "}
            in Action
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            Watch how our open-source platform empowers developers to build,
            deploy, and share AI agents without limitations.
          </p>
        </div>

        {/* Main Video Section with Side Navigation */}
        <div className="mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-10 lg:items-start">
              {/* Video Playlist - Top on Mobile, Left on Desktop */}
              <div className="lg:col-span-1 order-1 lg:order-1">
                <h3 className="text-xl font-bold mb-6 text-center lg:text-left">
                  Demo Videos
                </h3>
                {/* Mobile: horizontal scroll, Desktop: vertical stack */}
                <div className="lg:aspect-video w-full">
                  <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible lg:h-full gap-3 pb-4 lg:pb-0">
                    {videos.map((video, index) => (
                      <div
                        key={video.id}
                        className={`group cursor-pointer p-4 rounded-xl backdrop-blur-3xl border transition-all duration-300 hover:scale-105 lg:flex-1 min-w-[250px] lg:min-w-0 lg:min-h-[100px] flex flex-col justify-between transform-gpu ${
                          index === currentVideo
                            ? "bg-indigo-500/20 border-indigo-400/50"
                            : "bg-black/20 border-white/10"
                        }`}
                        onClick={() => setCurrentVideo(index)}
                      >
                        <div className="flex-1">
                          <h4 className="font-bold mb-1 text-base leading-tight">
                            {video.title}
                          </h4>
                          <p className="text-sm text-indigo-200 leading-tight overflow-hidden">
                            {video.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-indigo-300 mt-2 flex-shrink-0">
                          <Clock className="w-4 h-4" />
                          {video.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Video Player - Bottom on Mobile, Right on Desktop */}
              <div className="lg:col-span-3 order-2 lg:order-2">
                <div className="relative aspect-video rounded-2xl overflow-hidden backdrop-blur-3xl bg-black/20 border border-white/10 shadow-2xl">
                  {/* Video Thumbnail/Player */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer">
                        <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2">
                        {videos[currentVideo].title}
                      </h3>
                      <p className="text-indigo-200 mb-4 text-sm md:text-base px-4 md:px-0">
                        {videos[currentVideo].description}
                      </p>
                      <div className="flex items-center justify-center gap-4 text-sm text-indigo-300">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {videos[currentVideo].duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Volume2 className="w-4 h-4" />
                          HD Quality
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-3xl border border-white/20 flex items-center justify-center hover:scale-110 transition-all duration-200">
                        <Play className="w-5 h-5 text-white" />
                      </button>
                      <div className="flex-1 h-2 bg-white/20 rounded-full mx-4">
                        <div className="h-full w-1/3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                      </div>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-3xl border border-white/20 flex items-center justify-center hover:scale-110 transition-all duration-200">
                      <Maximize className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
