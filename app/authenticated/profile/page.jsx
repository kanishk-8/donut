"use client";
import ActivityTracker from "@/components/dashboard/activitytracker";
import { useAuth } from "@/context/authcontext";
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Settings,
  Camera,
  Edit2,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { useTheme } from "@/context/themecontext";

const page = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Customer service AI developer",
    joinDate: "January 2024",
    plan: "Professional Plan",
    avatar: null,
  });
  const [tempData, setTempData] = useState(profileData);
  const [uploading, setUploading] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update profileData when user changes
  useEffect(() => {
    if (user && mounted) {
      const updatedData = {
        name: user.name || "John Doe",
        email: user.email || "john.doe@example.com",
        bio: user.bio || "Customer service AI developer",
        joinDate: user.joinDate || "January 2024",
        plan: user.plan || "Professional Plan",
        avatar: user.avatar || null,
      };
      setProfileData(updatedData);
      setTempData(updatedData);
    }
  }, [user, mounted]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleSave = () => {
    setProfileData(tempData);
    updateUser(tempData); // Update user in context and localStorage
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      // Convert file to base64 for storage in localStorage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        const updatedData = { ...profileData, avatar: base64String };
        setProfileData(updatedData);
        setTempData(updatedData);
        updateUser(updatedData);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo");
      setUploading(false);
    }
  };

  const { theme, toggleTheme } = useTheme();

  if (!mounted) {
    return (
      <div
        className={`min-h-screen p-6 flex items-center justify-center ${
          theme === "dark" ? "bg-zinc-900" : "bg-gray-50"
        }`}
      >
        <div className={theme === "dark" ? "text-white" : "text-gray-900"}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-16 md:pt-20 pb-8 ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Card - Fixed */}
          <div className="lg:w-1/4">
            <div
              className={`backdrop-blur-3xl rounded-2xl shadow-lg p-6 border sticky top-24 ${
                theme === "dark"
                  ? "bg-black/20 border-white/10"
                  : "bg-white/90 border-gray-200"
              }`}
            >
              <div className="text-center">
                <h1
                  className={`text-2xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  My Profile
                </h1>
                {/* Profile Picture */}
                <div className="relative inline-block mb-4">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                  <label
                    htmlFor="photo-upload"
                    className={`absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors cursor-pointer ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>

                {/* Profile Info */}
                <h2
                  className={`text-xl font-bold mb-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {profileData.name}
                </h2>
                <p
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }
                >
                  {profileData.email}
                </p>
                <span className="inline-block bg-indigo-600/20 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium border border-indigo-600/30">
                  {profileData.plan}
                </span>
              </div>

              {/* Stats */}
              <div
                className={`mt-6 pt-6 border-t ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">5</p>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      API Keys
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">12.4k</p>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      API Calls
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="lg:w-3/4 space-y-6">
            {/* Personal Information */}
            <div
              className={`backdrop-blur-3xl rounded-2xl shadow-lg p-6 border ${
                theme === "dark"
                  ? "bg-black/20 border-white/10"
                  : "bg-white/90 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className={`text-lg font-semibold flex items-center ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  <User className="w-5 h-5 mr-2 text-indigo-600" />
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.name}
                      onChange={(e) =>
                        setTempData({ ...tempData, name: e.target.value })
                      }
                      className={`w-full p-3 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                        theme === "dark"
                          ? "bg-black/20 border-white/10 text-white"
                          : "bg-white/70 border-gray-200 text-gray-900"
                      }`}
                    />
                  ) : (
                    <p
                      className={`p-3 rounded-lg backdrop-blur-sm ${
                        theme === "dark"
                          ? "bg-white/10 text-gray-200 border border-white/20"
                          : "bg-gray-100/70 text-gray-900 border border-gray-200"
                      }`}
                    >
                      {profileData.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email Address
                  </label>
                  <div
                    className={`p-3 rounded-lg flex items-center backdrop-blur-sm ${
                      theme === "dark"
                        ? "bg-white/10 text-gray-200 border border-white/20"
                        : "bg-gray-100/70 text-gray-900 border border-gray-200"
                    }`}
                  >
                    <Mail
                      className={`w-4 h-4 mr-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    {profileData.email}
                    <span
                      className={`ml-auto text-xs ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Not editable
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={tempData.bio}
                      onChange={(e) =>
                        setTempData({ ...tempData, bio: e.target.value })
                      }
                      rows={3}
                      className={`w-full p-3 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                        theme === "dark"
                          ? "bg-black/20 border-white/10 text-white"
                          : "bg-white/70 border-gray-200 text-gray-900"
                      }`}
                    />
                  ) : (
                    <p
                      className={`p-3 rounded-lg backdrop-blur-sm ${
                        theme === "dark"
                          ? "bg-white/10 text-gray-200 border border-white/20"
                          : "bg-gray-100/70 text-gray-900 border border-gray-200"
                      }`}
                    >
                      {profileData.bio}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Member Since
                  </label>
                  <p
                    className={`p-3 rounded-lg flex items-center backdrop-blur-sm ${
                      theme === "dark"
                        ? "bg-white/10 text-gray-200 border border-white/20"
                        : "bg-gray-100/70 text-gray-900 border border-gray-200"
                    }`}
                  >
                    <Calendar
                      className={`w-4 h-4 mr-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    {profileData.joinDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div
              className={`backdrop-blur-3xl rounded-2xl shadow-lg p-6 border ${
                theme === "dark"
                  ? "bg-black/20 border-white/10"
                  : "bg-white/90 border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-6 flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <Settings className="w-5 h-5 mr-2 text-indigo-600" />
                Account Settings
              </h3>

              <div className="space-y-4">
                <div
                  className={`flex items-center justify-between p-4 rounded-lg backdrop-blur-sm border transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-white/10 border-white/20"
                      : "bg-gray-100/70 border-gray-200"
                  }`}
                >
                  <div>
                    <h4
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Email Notifications
                    </h4>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Receive updates about your API usage
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div
                      className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-600/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 ${
                        theme === "dark"
                          ? "bg-gray-600 after:border-gray-300"
                          : "bg-gray-300 after:border-gray-400"
                      }`}
                    ></div>
                  </label>
                </div>

                <div
                  className={`flex items-center justify-between p-4 rounded-lg backdrop-blur-sm border transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-white/10 border-white/20"
                      : "bg-gray-100/70 border-gray-200"
                  }`}
                >
                  <div>
                    <h4
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Two-Factor Authentication
                    </h4>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Add an extra layer of security
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg">
                    Enable
                  </button>
                </div>
              </div>
            </div>

            {/* Theme Settings */}
            <div
              className={`backdrop-blur-3xl rounded-2xl shadow-lg p-6 border ${
                theme === "dark"
                  ? "bg-black/20 border-white/10"
                  : "bg-white/90 border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-6 flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <Settings className="w-5 h-5 mr-2 text-indigo-600" />
                Theme Settings
              </h3>

              <div className="space-y-4">
                <div
                  className={`flex items-center justify-between p-4 rounded-lg backdrop-blur-sm border transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-white/10 border-white/20"
                      : "bg-gray-100/70 border-gray-200"
                  }`}
                >
                  <div>
                    <h4
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Dark Theme
                    </h4>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Turn on the dark theme across the whole app
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={() => toggleTheme()}
                      className="sr-only peer"
                      checked={theme === "dark"}
                    />
                    <div
                      className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-600/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 ${
                        theme === "dark"
                          ? "bg-gray-600 after:border-gray-300"
                          : "bg-gray-300 after:border-gray-400"
                      }`}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Activity Tracker */}
            <div
              className={`backdrop-blur-3xl rounded-2xl shadow-lg p-6 border ${
                theme === "dark"
                  ? "bg-black/20 border-white/10"
                  : "bg-white/90 border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Recent Activity
              </h3>
              <ActivityTracker />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
