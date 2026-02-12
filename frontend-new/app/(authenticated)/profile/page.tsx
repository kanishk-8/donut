"use client";
import ActivityTracker from "@/components/dashboard/activitytracker";
import { useAuth } from "@/context/authcontext";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    UserIcon,
    Mail01Icon,
    Calendar03Icon,
    Settings02Icon,
    Camera01Icon,
    PencilEdit02Icon,
    Tick02Icon,
    Cancel01Icon,
    Loading03Icon,
} from "@hugeicons/core-free-icons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const page = () => {
    const { user, updateUser } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [profileData, setProfileData] = useState<{
        name: string;
        email: string;
        bio: string;
        joinDate: string;
        plan: string;
        avatar: string | null;
    }>({
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
        updateUser(tempData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempData(profileData);
        setIsEditing(false);
    };

    const handlePhotoUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
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
                const base64String = e.target?.result as string;
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

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen  pt-20 md:pt-26 pb-8">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Profile Card - Fixed */}
                    <div className="lg:w-1/4">
                        <Card className="sticky top-24">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold mb-4">
                                        My Profile
                                    </h1>
                                    {/* Profile Picture */}
                                    <div className="relative inline-block mb-4">
                                        <Avatar
                                            size="lg"
                                            className="w-24 h-24 border-2 border-primary"
                                        >
                                            {profileData.avatar ? (
                                                <AvatarImage
                                                    src={profileData.avatar}
                                                    alt="Profile"
                                                />
                                            ) : null}
                                            <AvatarFallback className="bg-linear-to-r from-primary to-purple-500 text-primary-foreground text-2xl font-bold">
                                                {profileData.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <label
                                            htmlFor="photo-upload"
                                            className={`absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors cursor-pointer ${
                                                uploading
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
                                            {uploading ? (
                                                <HugeiconsIcon
                                                    icon={Loading03Icon}
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <HugeiconsIcon
                                                    icon={Camera01Icon}
                                                    size={16}
                                                />
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
                                    <h2 className="text-xl font-bold mb-1">
                                        {profileData.name}
                                    </h2>
                                    <p className="text-muted-foreground mb-2">
                                        {profileData.email}
                                    </p>
                                    <Badge variant="secondary">
                                        {profileData.plan}
                                    </Badge>
                                </div>

                                {/* Stats */}
                                <div className="mt-6 pt-6 border-t">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl font-bold text-primary">
                                                5
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                API Keys
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-primary">
                                                12.4k
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                API Calls
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content - Scrollable */}
                    <div className="lg:w-3/4 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center">
                                        <HugeiconsIcon
                                            icon={UserIcon}
                                            size={20}
                                            className="mr-2 text-primary"
                                        />
                                        Personal Information
                                    </CardTitle>
                                    {!isEditing ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleEdit}
                                        >
                                            <HugeiconsIcon
                                                icon={PencilEdit02Icon}
                                                size={16}
                                                className="mr-1"
                                            />
                                            Edit
                                        </Button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleSave}
                                                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                            >
                                                <HugeiconsIcon
                                                    icon={Tick02Icon}
                                                    size={16}
                                                    className="mr-1"
                                                />
                                                Save
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleCancel}
                                                className="text-destructive hover:text-destructive/90"
                                            >
                                                <HugeiconsIcon
                                                    icon={Cancel01Icon}
                                                    size={16}
                                                    className="mr-1"
                                                />
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        {isEditing ? (
                                            <Input
                                                id="name"
                                                type="text"
                                                value={tempData.name}
                                                onChange={(e) =>
                                                    setTempData({
                                                        ...tempData,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            <div className="p-3 rounded-md bg-muted border">
                                                {profileData.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email Address
                                        </Label>
                                        <div className="p-3 rounded-md bg-muted border flex items-center">
                                            <HugeiconsIcon
                                                icon={Mail01Icon}
                                                size={16}
                                                className="mr-2 text-muted-foreground"
                                            />
                                            {profileData.email}
                                            <span className="ml-auto text-xs text-muted-foreground">
                                                Not editable
                                            </span>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        {isEditing ? (
                                            <textarea
                                                id="bio"
                                                value={tempData.bio}
                                                onChange={(e) =>
                                                    setTempData({
                                                        ...tempData,
                                                        bio: e.target.value,
                                                    })
                                                }
                                                rows={3}
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
                                            />
                                        ) : (
                                            <div className="p-3 rounded-md bg-muted border">
                                                {profileData.bio}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Member Since</Label>
                                        <div className="p-3 rounded-md bg-muted border flex items-center">
                                            <HugeiconsIcon
                                                icon={Calendar03Icon}
                                                size={16}
                                                className="mr-2 text-muted-foreground"
                                            />
                                            {profileData.joinDate}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <HugeiconsIcon
                                        icon={Settings02Icon}
                                        size={20}
                                        className="mr-2 text-primary"
                                    />
                                    Account Settings
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                                        <div>
                                            <h4 className="font-medium">
                                                Email Notifications
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Receive updates about your API
                                                usage
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                defaultChecked
                                            />
                                            <div className="w-11 h-6 bg-input rounded-full peer peer-focus:ring-4 peer-focus:ring-ring/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border after:border-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                                        <div>
                                            <h4 className="font-medium">
                                                Two-Factor Authentication
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Add an extra layer of security
                                            </p>
                                        </div>
                                        <Button>Enable</Button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                                        <div>
                                            <h4 className="font-medium">
                                                Dark Theme
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Toggle dark mode for the entire
                                                application
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={theme === "dark"}
                                                onChange={(e) =>
                                                    setTheme(
                                                        e.target.checked
                                                            ? "dark"
                                                            : "light",
                                                    )
                                                }
                                            />
                                            <div className="w-11 h-6 bg-input rounded-full peer peer-focus:ring-4 peer-focus:ring-ring/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border after:border-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Tracker */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ActivityTracker />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
