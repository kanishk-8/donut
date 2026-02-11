"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
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

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const router = useRouter();
    const { signup } = useAuth();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        // Validate password length
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        // Validate terms
        if (!agreedToTerms) {
            setError("Please agree to the Terms of Service and Privacy Policy");
            setIsLoading(false);
            return;
        }

        // Dummy signup logic
        try {
            const result = await signup(
                formData.email,
                formData.password,
                formData.name,
            );

            if (result.success) {
                setSuccessMessage(
                    "Account created succesfully. Redirecting to your workspace...",
                );
                setTimeout(() => {
                    router.push("/projects");
                }, 1500);
            } else {
                setError(result.error || "Failed to create you account");
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Signup exception:", err);
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
                            Start Building{" "}
                            <span className="text-primary">
                                Visual Backends
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                            Join developers who build backends with
                            drag-and-drop nodes. No traditional coding required
                            — just connect and deploy.
                        </p>
                        <div className="space-y-4 text-muted-foreground">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                <span>Create backends in minutes</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                <span>Visual node-based workflows</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                <span>Deploy with one click</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Signup Form */}
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

                        {/* Signup Form */}
                        <Card className="shadow-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    Create your account
                                </CardTitle>
                                <CardDescription>
                                    Start building backends visually today
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Success Message */}
                                {successMessage && (
                                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                                        <p className="text-green-600 dark:text-green-400 text-sm">
                                            {successMessage}
                                        </p>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
                                        <p className="text-destructive text-sm">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="pl-10"
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email Address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="pl-10"
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="pl-10 pr-10"
                                                placeholder="Create a password (min 8 characters)"
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

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="confirmPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="pl-10 pr-10"
                                                placeholder="Confirm your password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword,
                                                    )
                                                }
                                                className="absolute right-3 top-3"
                                                aria-label={
                                                    showConfirmPassword
                                                        ? "Hide confirm password"
                                                        : "Show confirm password"
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Terms and Conditions */}
                                    <div className="flex items-start space-x-2">
                                        <Checkbox
                                            id="terms"
                                            checked={agreedToTerms}
                                            onCheckedChange={(checked) =>
                                                setAgreedToTerms(
                                                    checked === true,
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor="terms"
                                            className="text-sm font-normal leading-tight cursor-pointer"
                                        >
                                            I agree to the{" "}
                                            <Link
                                                href="/terms"
                                                className="text-primary hover:underline"
                                            >
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link
                                                href="/privacy"
                                                className="text-primary hover:underline"
                                            >
                                                Privacy Policy
                                            </Link>
                                        </Label>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isLoading
                                            ? "Creating Account..."
                                            : "Create Account"}
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

                                {/* Sign in link */}
                                <div className="text-center w-full space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Already have an account?
                                    </p>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="lg"
                                        className="w-full"
                                    >
                                        <Link href="/login">
                                            Sign in to your account
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

export default SignupPage;
