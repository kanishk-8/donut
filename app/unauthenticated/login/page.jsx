"use client";
import { useAuth } from "@/context/authcontext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const { login, user } = useAuth();
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const handleLogin = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      login(userName);
      // Redirect to the dashboard after login
      router.replace("/authenticated/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div>
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
      </div>
      {/* Login form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br  opacity-80 pointer-events-none rounded-xl shadow-2xl"></div>
        <form
          onSubmit={handleLogin}
          className="relative bg-white/10 backdrop-blur-3xl bg-opacity-95 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6 border border-indigo-100 "
        >
          <div className="flex flex-col items-center mb-2">
            <span className="inline-block bg-gradient-to-r from-indigo-500 via-pink-400 to-purple-400 bg-clip-text text-transparent text-4xl font-extrabold tracking-tight mb-2">
              Donut
            </span>
            <h2 className="text-xl font-semibold text-indigo-700 mb-1">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-400">Login to your account</p>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-400">Email</span>
            <input
              type="email"
              onChange={(e) => setUserName(e.target.value)}
              className="p-3 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition placeholder:text-gray-400 bg-indigo-50"
              placeholder="Enter your email"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-400">Password</span>
            <input
              type="password"
              className="p-3 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition placeholder:text-gray-400 bg-indigo-50"
              placeholder="Enter your password"
              required
            />
          </label>
          <button
            type="submit"
            className="mt-2 p-3 rounded-xl bg-gradient-to-r from-indigo-500 via-pink-400 to-purple-400 text-white font-bold shadow-md hover:scale-105 transition-transform duration-200 text-center"
          >
            Login
          </button>
          <p className="text-center text-sm mt-2 text-gray-500">
            Don't have an account?{" "}
            <Link
              href={"/unauthenticated/signup"}
              className="text-pink-500 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default page;
