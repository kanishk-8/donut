"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        const userInfo = {
          id: session.user.id,
          email: session.user.email,
          name:
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "User",
          bio: "AI enthusiast and agent builder",
          joinDate: new Date(session.user.created_at).toLocaleDateString(
            "en-US",
            {
              month: "long",
              year: "numeric",
            }
          ),
          plan: "Pro Plan",
          avatar: session.user.user_metadata?.avatar_url || null,
        };
        setUser(userInfo);
        localStorage.setItem("donut_user", JSON.stringify(userInfo));
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        localStorage.removeItem("donut_user");
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const userInfo = {
          id: session.user.id,
          email: session.user.email,
          name:
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "User",
          bio: "AI enthusiast and agent builder",
          joinDate: new Date(session.user.created_at).toLocaleDateString(
            "en-US",
            {
              month: "long",
              year: "numeric",
            }
          ),
          plan: "Pro Plan",
          avatar: session.user.user_metadata?.avatar_url || null,
        };
        setUser(userInfo);
        localStorage.setItem("donut_user", JSON.stringify(userInfo));
      }
    } catch (error) {
      // User is not logged in
      localStorage.removeItem("donut_user");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    try {
      console.log("Attempting signup with:", {
        email,
        name,
      });

      // Create account with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name,
            display_name: name,
          },
          emailRedirectTo: `${window.location.origin}/unauthenticated/login?verified=true`,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      console.log("Account created:", data);

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation required
        return {
          success: true,
          user: data.user,
          needsConfirmation: true,
          message:
            "Please check your email and click the confirmation link to complete your registration.",
        };
      }

      // If user is immediately confirmed (auto-confirm enabled)
      if (data.user && data.session) {
        const userInfo = {
          id: data.user.id,
          email: data.user.email,
          name:
            data.user.user_metadata?.name ||
            data.user.user_metadata?.full_name ||
            name,
          bio: "AI enthusiast and agent builder",
          joinDate: new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          plan: "Pro Plan",
          avatar: data.user.user_metadata?.avatar_url || null,
        };

        setUser(userInfo);
        localStorage.setItem("donut_user", JSON.stringify(userInfo));
        return { success: true, user: userInfo, needsConfirmation: false };
      }

      return { success: true, user: data.user, needsConfirmation: true };
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "Failed to create account";

      if (error.message?.includes("already registered")) {
        errorMessage = "An account with this email already exists";
      } else if (error.message?.includes("Invalid email")) {
        errorMessage = "Invalid email format";
      } else if (error.message?.includes("Password")) {
        errorMessage = "Password should be at least 6 characters";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Attempting login with:", {
        email,
      });

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      console.log("Login successful:", data);

      const userInfo = {
        id: data.user.id,
        email: data.user.email,
        name:
          data.user.user_metadata?.name ||
          data.user.user_metadata?.full_name ||
          data.user.email?.split("@")[0] ||
          "User",
        bio: "AI enthusiast and agent builder",
        joinDate: new Date(data.user.created_at).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        plan: "Pro Plan",
        avatar: data.user.user_metadata?.avatar_url || null,
      };

      setUser(userInfo);
      localStorage.setItem("donut_user", JSON.stringify(userInfo));

      return { success: true, user: userInfo };
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Failed to sign in";

      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password";
      } else if (error.message?.includes("too many requests")) {
        errorMessage = "Too many attempts. Please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout...");

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Supabase logout error:", error);
        // Don't throw here, still clear local state
      }

      console.log("Logout successful");

      // Clear state and localStorage
      setUser(null);
      localStorage.removeItem("donut_user");

      // Clear all Supabase auth tokens from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-") && key.includes("auth")) {
          localStorage.removeItem(key);
        }
      });

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, clear local state
      setUser(null);
      localStorage.removeItem("donut_user");

      // Clear auth tokens
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-") && key.includes("auth")) {
          localStorage.removeItem(key);
        }
      });

      return { success: true }; // Return success to allow redirect
    }
  };

  const updateUser = (updatedData) => {
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

export const useAuth = () => useContext(AuthContext);
