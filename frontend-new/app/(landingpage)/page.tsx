"use client";

import CTA from "@/components/landingpage/cta";
import Footer from "@/components/landingpage/footer";
import Hero from "@/components/landingpage/hero";
import VideoShowcase from "@/components/landingpage/videoshowcase";

const Home = () => {
    return (
        <div>
            <Hero />
            <VideoShowcase />
            <CTA />
            <Footer />
        </div>
    );
};

export default Home;
