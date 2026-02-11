"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/authcontext";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
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
            const result = await login(email, password);

            if (result.success) {
                router.push("/projects");
            } else {
                setError(result.error || "Failed to sign in");
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Login exception:", err);
            setError("An unexpected error occurred");
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Content */}
            <div className="relative z-10 min-h-screen flex">
                {/* Left side - Welcome Section */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-6 bg-muted/50">
                    <div className="max-w-lg mx-auto">
                        <div className="flex items-center mb-8">
                            <Image
                                src="/2nutIcon.png"
                                width={48}
                                height={48}
                                alt="logo"
                            />
                            <h1 className="ml-3 text-3xl font-bold">donut</h1>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Welcome back to{" "}
                            <span className="text-primary">your workspace</span>
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                            Continue building your visual backends with
                            drag-and-drop nodes. Your workflows are waiting.
                        </p>
                        <div className="space-y-4 text-muted-foreground">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                <span>Access your node-based projects</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                <span>Build backends without code</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                <span>Deploy with one click</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
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
                                <h1 className="ml-3 text-2xl font-bold">
                                    donut
                                </h1>
                            </div>
                        </div>

                        {/* Login Form */}
                        <Card className="shadow-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    Welcome back
                                </CardTitle>
                                <CardDescription>
                                    Sign in to your account to continue
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
                                        <p className="text-destructive text-sm">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleLogin}
                                    className="space-y-4"
                                >
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">
                                            Email Address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="login-email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    if (error) setError("");
                                                }}
                                                className="pl-10"
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
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
                                                className="pl-10 pr-10"
                                                placeholder="Enter your password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute right-3 top-3"
                                                aria-label={
                                                    showPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember me & Forgot Password */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="remember-me" />
                                            <Label
                                                htmlFor="remember-me"
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                Remember me
                                            </Label>
                                        </div>
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-primary hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isLoading
                                            ? "Signing In..."
                                            : "Sign In"}
                                    </Button>
                                </form>
                            </CardContent>

                            <CardFooter className="flex flex-col space-y-4">
                                {/* Divider */}
                                <div className="relative w-full">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                            or
                                        </span>
                                    </div>
                                </div>

                                {/* Sign up link */}
                                <div className="text-center w-full space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Don't have an account?
                                    </p>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="lg"
                                        className="w-full"
                                    >
                                        <Link href="/signup">
                                            Create a new account
                                        </Link>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
