"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/authcontext";
import Image from "next/image";

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        try {
            console.log("Attempting login...");
            const result = await login(email, password);

            if (result.success) {
                console.log("Login successful, redirecting...");
                // Redirect to dashboard after successful login
                router.replace("/projects");
            } else {
                console.error("Login failed:", result.error);
                setError(result.error || "Failed to sign in");
            }
        } catch (err) {
            console.error("Login exception:", err);
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
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
                            <Image
                                src="/logo.png"
                                width={48}
                                height={48}
                                alt="logo"
                            />
                            <h1 className="ml-3 text-3xl font-bold text-white">
                                donut
                            </h1>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Welcome back to{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
                                your dashboard
                            </span>
                        </h2>
                        <p className="text-xl text-indigo-200 mb-8 leading-relaxed">
                            Continue managing your customer service agents and
                            monitor performance. Your AI-powered customer
                            support awaits.
                        </p>
                        <div className="space-y-4 text-indigo-200">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                                <span>
                                    Access your customer service dashboard
                                </span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                                <span>Monitor conversations in real-time</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                                <span>Scale your support automation</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-12 py-6">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo and Header */}
                        <div className="text-center mb-8 lg:hidden">
                            <div className="flex items-center justify-center mb-4">
                                <Image
                                    src="/logo.png"
                                    width={40}
                                    height={40}
                                    alt="logo"
                                />
                                <h1 className="ml-3 text-2xl font-bold text-white">
                                    donut
                                </h1>
                            </div>
                            <h2 className="text-3xl font-bold mb-2 text-white">
                                Welcome back
                            </h2>
                            <p className="text-gray-400">
                                Sign in to your account
                            </p>
                        </div>

                        {/* Login Form */}
                        <div className="backdrop-blur-xl rounded-2xl shadow-2xl p-8 border bg-black/20 border-gray-700">
                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                                    <p className="text-red-400 text-sm">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-6">
                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="login-email"
                                        className="block text-sm font-medium mb-2 text-gray-300"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="login-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (error) setError("");
                                            }}
                                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                                            placeholder="Enter your email"
                                            required
                                            aria-label="Email address"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="login-password"
                                        className="block text-sm font-medium mb-2 text-gray-300"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="login-password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (error) setError("");
                                            }}
                                            className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                                            placeholder="Enter your password"
                                            required
                                            aria-label="Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor="remember-me"
                                            className="ml-2 block text-sm text-gray-300"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-indigo-500 hover:text-indigo-400"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-10 rounded-full font-medium hover:from-indigo-700 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl backdrop-blur-3xl"
                                >
                                    {isLoading ? "Signing In..." : "Sign In"}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative mt-8 mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600/30"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-black/20 backdrop-blur-sm px-4 text-sm text-gray-400 rounded-full">
                                        or
                                    </span>
                                </div>
                            </div>

                            {/* Sign up link */}
                            <div className="text-center">
                                <p className="mb-4 text-sm text-gray-300">
                                    Don't have an account?
                                </p>
                                <Link
                                    href="/signup"
                                    className="w-full inline-block px-10 py-3 bg-black/20 border-2 border-white/10 rounded-full font-medium text-base transition-all duration-200 hover:scale-105 text-center backdrop-blur-3xl shadow-lg text-white"
                                >
                                    Create a new account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
