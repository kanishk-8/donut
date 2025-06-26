"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Bot, Mail, Lock, User } from "lucide-react";
import Image from "next/image";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup form submitted:", formData);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background decorative elements */}
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
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Welcome Section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-6">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center mb-8">
              <Image src="/logo.png" width={48} height={48} alt="logo" />
              <h1 className="ml-3 text-3xl font-bold text-white">donut</h1>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Supercharge Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
                Customer Service
              </span>
            </h2>
            <p className="text-xl text-indigo-200 mb-8 leading-relaxed">
              Deploy intelligent customer service agents that handle queries,
              solve problems, and provide 24/7 support. Voice & chat agents
              ready in minutes.
            </p>
            <div className="space-y-4 text-indigo-200">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                <span>Deploy chat & voice agents instantly</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span>Join 500+ businesses served</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                <span>24/7 customer support automation</span>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Right side - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-12 py-6">
          <div className="w-full max-w-md">
            {/* Mobile Logo and Header */}
            <div className="text-center mb-8 lg:hidden">
              <div className="flex items-center justify-center mb-4">
                <Image src="/logo.png" width={40} height={40} alt="logo" />
                <h1 className="ml-3 text-2xl font-bold text-white">donut</h1>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white">
                Create your account
              </h2>
              <p className="text-gray-400">
                Start building intelligent customer service agents today
              </p>
            </div>

            {/* Signup Form */}
            <div className="backdrop-blur-xl rounded-2xl shadow-2xl p-8 border bg-black/20 border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-indigo-500 hover:text-indigo-400"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-indigo-500 hover:text-indigo-400"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Create Account
                </button>
              </form>

              {/* Sign in link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-300">
                  Already have an account?{" "}
                  <Link
                    href="/unauthenticated/login"
                    className="text-indigo-500 hover:text-indigo-400 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
