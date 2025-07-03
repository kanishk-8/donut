"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { account, ID } from "@/lib/appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const session = await account.get();
      if (session) {
        const userInfo = {
          $id: session.$id,
          email: session.email,
          name: session.name || session.email?.split("@")[0] || "User",
          bio: "AI enthusiast and agent builder",
          joinDate: new Date(session.$createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          plan: "Pro Plan",
          avatar: null,
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
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
      });

      // Create account
      const response = await account.create(ID.unique(), email, password, name);
      console.log("Account created:", response);

      // Auto-login after signup using the correct v1.4+ method
      const session = await account.createEmailPasswordSession(email, password);
      console.log("Session created:", session);

      // Get user data and update state
      const userData = await account.get();
      console.log("User data:", userData);

      const userInfo = {
        $id: userData.$id,
        email: userData.email,
        name: userData.name || name,
        bio: "AI enthusiast and agent builder",
        joinDate: new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        plan: "Pro Plan",
        avatar: null,
      };

      setUser(userInfo);
      localStorage.setItem("donut_user", JSON.stringify(userInfo));

      return { success: true, user: userInfo };
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "Failed to create account";

      if (error.code === 409) {
        errorMessage = "An account with this email already exists";
      } else if (error.code === 400) {
        errorMessage = "Invalid email or password format";
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
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
      });

      // Create session using the correct v1.4+ method
      const session = await account.createEmailPasswordSession(email, password);
      console.log("Session created:", session);

      // Get user data
      const userData = await account.get();
      console.log("User data:", userData);

      const userInfo = {
        $id: userData.$id,
        email: userData.email,
        name: userData.name || userData.email?.split("@")[0] || "User",
        bio: "AI enthusiast and agent builder",
        joinDate: new Date(userData.$createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        plan: "Pro Plan",
        avatar: null,
      };

      setUser(userInfo);
      localStorage.setItem("donut_user", JSON.stringify(userInfo));

      return { success: true, user: userInfo };
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Failed to sign in";

      if (error.code === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.code === 429) {
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
      // Delete the current session
      await account.deleteSessions();
      console.log("Logout successful");

      setUser(null);
      localStorage.removeItem("donut_user");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, clear local state
      setUser(null);
      localStorage.removeItem("donut_user");
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
