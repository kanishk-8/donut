"use client";
import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { API_CONFIG, getApiUrl, getAuthHeaders } from "@/lib/api-config";

interface User {
    id: string;
    email: string;
    name: string;
    bio: string;
    joinDate: string;
    plan: string;
    avatar: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (
        email: string,
        password: string,
    ) => Promise<{ success: boolean; user?: User; error?: string }>;
    signup: (
        email: string,
        password: string,
        name: string,
    ) => Promise<{ success: boolean; user?: User; error?: string }>;
    logout: () => Promise<{ success: boolean }>;
    updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkUser = useCallback(async () => {
        try {
            const token = localStorage.getItem("donut_token");
            if (!token) {
                setLoading(false);
                return;
            }

            // Verify token with backend
            const response = await fetch(
                getApiUrl(API_CONFIG.ENDPOINTS.AUTH.ME),
                {
                    method: "GET",
                    headers: getAuthHeaders(),
                },
            );

            if (!response.ok) {
                // Token is invalid or expired
                localStorage.removeItem("donut_token");
                localStorage.removeItem("donut_user");
                setUser(null);
                setLoading(false);
                return;
            }

            const data = await response.json();
            const userInfo = {
                id: data.id,
                email: data.email,
                name: data.name || data.email?.split("@")[0] || "User",
                bio: data.bio || "AI enthusiast and project builder",
                joinDate: new Date(data.created_at).toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        year: "numeric",
                    },
                ),
                plan: data.plan || "Pro Plan",
                avatar: data.avatar || null,
            };
            setUser(userInfo);
            localStorage.setItem("donut_user", JSON.stringify(userInfo));
        } catch (err) {
            console.error("checkUser error:", err);
            localStorage.removeItem("donut_token");
            localStorage.removeItem("donut_user");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Check for existing session on component mount
    useEffect(() => {
        checkUser();
    }, [checkUser]);

    const signup = async (email: string, password: string, name: string) => {
        try {
            console.log("Attempting signup with:", { email, name });

            const response = await fetch(
                getApiUrl(API_CONFIG.ENDPOINTS.AUTH.SIGNUP),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        name,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Signup error:", data);
                return {
                    success: false,
                    error:
                        data.error ||
                        data.message ||
                        "Failed to create account",
                };
            }

            console.log("Account created:", data);

            // Store token and user info
            if (data.token) {
                localStorage.setItem("donut_token", data.token);
            }

            const userInfo = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name || name,
                bio: "AI enthusiast and project builder",
                joinDate: new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                }),
                plan: "Pro Plan",
                avatar: data.user.avatar || null,
            };

            setUser(userInfo);
            localStorage.setItem("donut_user", JSON.stringify(userInfo));

            return {
                success: true,
                user: userInfo,
            };
        } catch (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to create account",
            };
        }
    };

    const login = async (email: string, password: string) => {
        try {
            console.log("Attempting login with:", { email });

            const response = await fetch(
                getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Login error:", data);
                return {
                    success: false,
                    error: data.error || data.message || "Failed to sign in",
                };
            }

            console.log("Login successful:", data);

            // Store token
            if (data.token) {
                localStorage.setItem("donut_token", data.token);
            }

            const userInfo = {
                id: data.user.id,
                email: data.user.email,
                name:
                    data.user.name || data.user.email?.split("@")[0] || "User",
                bio: data.user.bio || "AI enthusiast and project builder",
                joinDate: new Date(data.user.created_at).toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        year: "numeric",
                    },
                ),
                plan: data.user.plan || "Pro Plan",
                avatar: data.user.avatar || null,
            };

            setUser(userInfo);
            localStorage.setItem("donut_user", JSON.stringify(userInfo));

            return { success: true, user: userInfo };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to sign in",
            };
        }
    };

    const logout = async () => {
        try {
            console.log("Attempting logout...");

            const token = localStorage.getItem("donut_token");
            if (token) {
                // Optional: Call backend logout endpoint if you have one
                await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT), {
                    method: "POST",
                    headers: getAuthHeaders(),
                }).catch((err) => console.error("Logout API error:", err));
            }

            console.log("Logout successful");

            // Clear state and localStorage
            setUser(null);
            localStorage.removeItem("donut_token");
            localStorage.removeItem("donut_user");

            return { success: true };
        } catch (error) {
            console.error("Logout error:", error);
            // Even if there's an error, clear local state
            setUser(null);
            localStorage.removeItem("donut_token");
            localStorage.removeItem("donut_user");

            return { success: true }; // Return success to allow redirect
        }
    };

    const updateUser = (updatedData: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem("donut_user", JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider
            value={{ user, login, signup, logout, updateUser, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
