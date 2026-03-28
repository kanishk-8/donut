"use client";
import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import api from "@/lib/api-client";
import { API_CONFIG } from "@/lib/api-config";
import axios from "axios";

interface User {
    id: string;
    email: string;
    name: string;
    bio: string;
    joinDate: string;
    plan: string;
    avatar: string | null;
}

interface AuthApiResponse {
    user: User;
    token?: string;
    refresh_token?: string;
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
            // axios will automatically attempt refresh on 401 and retry original request
            const res = await api.get(API_CONFIG.ENDPOINTS.USER.ME);
            const data = res.data;

            const userInfo = {
                id: data.user.id,
                email: data.user.email,
                name:
                    data.user.username ||
                    data.user.email?.split("@")[0] ||
                    "User",
                bio: data.user.bio || "AI enthusiast and project builder",
                joinDate: new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                }),
                plan: data.user.plan || "Pro Plan",
                avatar: data.user.avatar || null,
            };

            setUser(userInfo);
            localStorage.setItem("donut_user", JSON.stringify(userInfo));
        } catch (err) {
            console.error("checkUser error:", err);
            // If axios error: err.response gives more info
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
            const res = await api.post(API_CONFIG.ENDPOINTS.AUTH.SIGNUP, {
                email,
                password,
                username: name,
            });
            const data = res.data;
            const userInfo = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.username || name,
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
            return { success: true, user: userInfo };
        } catch (err: unknown) {
            console.error("Signup error:", err);
            // Narrow error safely
            let message = "Failed to create account";
            if (axios.isAxiosError(err)) {
                // axios error — read response safely
                message =
                    (err.response?.data as any)?.error ??
                    (err.response?.data as any)?.message ??
                    err.message ??
                    message;
            } else if (err instanceof Error) {
                message = err.message;
            }
            return { success: false, error: message };
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const res = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
                email,
                password,
            });

            const data = res.data;

            const userInfo = {
                id: data.user.id,
                email: data.user.email,
                name:
                    data.user.username ||
                    data.user.email?.split("@")[0] ||
                    "User",
                bio: data.user.bio || "AI enthusiast and project builder",
                joinDate: new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                }),
                plan: data.user.plan || "Pro Plan",
                avatar: data.user.avatar || null,
            };

            setUser(userInfo);
            localStorage.setItem("donut_user", JSON.stringify(userInfo));

            return { success: true, user: userInfo };
        } catch (err: unknown) {
            console.error("Login error:", err);
            let message = "Failed to sign in";
            if (axios.isAxiosError(err)) {
                message =
                    (err.response?.data as any)?.error ??
                    (err.response?.data as any)?.message ??
                    err.message ??
                    message;
            } else if (err instanceof Error) {
                message = err.message;
            }
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
            setUser(null);
            localStorage.removeItem("donut_user");
            return { success: true };
        } catch (err: unknown) {
            console.error("Logout error:", err);
            // If it's an axios error, log the server response for debugging
            if (axios.isAxiosError(err)) {
                console.error("Logout API response:", err.response?.data);
            }
            setUser(null);
            localStorage.removeItem("donut_user");
            return { success: true };
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
