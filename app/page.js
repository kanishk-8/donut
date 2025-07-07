import { Navbar } from "../components/landingpage/navbar";
import Hero from "@/components/landingpage/hero";
import ServiceShowcase from "@/components/landingpage/serviceshowcase";
import Features from "@/components/landingpage/features";
import Stats from "@/components/landingpage/stats";
import Testimonials from "@/components/landingpage/testimonials";
import Pricing from "@/components/landingpage/pricing";
import CTA from "@/components/landingpage/cta";
import Footer from "@/components/landingpage/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background decorative elements - now covering the entire page */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-1/4 -left-24 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-3/4 left-1/4 w-48 h-48 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <ServiceShowcase />
        <Features />
        <Stats />
        <Testimonials />
        <Pricing />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
