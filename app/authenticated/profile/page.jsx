"use client";
import ActivityTracker from "@/components/activitytracker";
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
} from "lucide-react";

const page = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "AI enthusiast and agent builder",
    joinDate: "January 2024",
    plan: "Pro Plan",
  });
  const [tempData, setTempData] = useState(profileData);

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
        bio: user.bio || "AI enthusiast and agent builder",
        joinDate: user.joinDate || "January 2024",
        plan: user.plan || "Pro Plan",
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-900 p-6 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 mb-6">
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-[#6b46c1] text-white p-2 rounded-full hover:bg-[#5b3ba3] transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile Info */}
                <h2 className="text-xl font-bold text-white mb-1">
                  {profileData.name}
                </h2>
                <p className="text-gray-400 mb-2">{profileData.email}</p>
                <span className="inline-block bg-[#6b46c1]/20 text-[#6b46c1] px-3 py-1 rounded-full text-sm font-medium border border-[#6b46c1]/30">
                  {profileData.plan}
                </span>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#6b46c1]">12</p>
                    <p className="text-sm text-gray-400">Agents Created</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#6b46c1]">89</p>
                    <p className="text-sm text-gray-400">Conversations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#6b46c1]" />
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center text-[#6b46c1] hover:text-[#5b3ba3] transition-colors"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.name}
                      onChange={(e) =>
                        setTempData({ ...tempData, name: e.target.value })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b46c1] text-white"
                    />
                  ) : (
                    <p className="p-3 bg-gray-700/50 rounded-lg text-gray-200">
                      {profileData.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) =>
                        setTempData({ ...tempData, email: e.target.value })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b46c1] text-white"
                    />
                  ) : (
                    <p className="p-3 bg-gray-700/50 rounded-lg flex items-center text-gray-200">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {profileData.email}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={tempData.bio}
                      onChange={(e) =>
                        setTempData({ ...tempData, bio: e.target.value })
                      }
                      rows={3}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b46c1] text-white"
                    />
                  ) : (
                    <p className="p-3 bg-gray-700/50 rounded-lg text-gray-200">
                      {profileData.bio}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Member Since
                  </label>
                  <p className="p-3 bg-gray-700/50 rounded-lg flex items-center text-gray-200">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {profileData.joinDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-[#6b46c1]" />
                Account Settings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">
                      Email Notifications
                    </h4>
                    <p className="text-sm text-gray-400">
                      Receive updates about your agents
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6b46c1]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6b46c1]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-gray-400">
                      Add an extra layer of security
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-[#6b46c1] text-white rounded-lg hover:bg-[#5b3ba3] transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Tracker */}
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-6">
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
