import Image from "next/image";
import { Navbar } from "../components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex h-screen flex-col items-center justify-center min-h-screen py-2">
        <Image
          width={500}
          height={500}
          src="/donut.avif"
          alt="hero"
          className="w-[35rem] h-[35rem] animate-spin"
          style={{ animation: "spin 15s linear infinite" }}
        />
      </div>
      <div className="h-screen bg-red-600"></div>
    </>
  );
}
