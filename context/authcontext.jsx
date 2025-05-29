"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("donut_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    const userInfo = {
      email: userData.email || userData,
      name: userData.name || userData.email?.split("@")[0] || "User",
      bio: userData.bio || "AI enthusiast and agent builder",
      joinDate:
        userData.joinDate ||
        new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      plan: userData.plan || "Pro Plan",
      avatar: userData.avatar || null,
    };
    setUser(userInfo);
    localStorage.setItem("donut_user", JSON.stringify(userInfo));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("donut_user");
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("donut_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
