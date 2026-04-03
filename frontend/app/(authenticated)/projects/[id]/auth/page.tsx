// frontend/app/(authenticated)/projects/[id]/auth/page.tsx
"use client";
import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Copy } from "lucide-react";

const MOCK_USERS = [
    {
        id: "1",
        email: "alice@example.com",
        provider: "email",
        createdAt: "2024-03-30",
    },
    {
        id: "2",
        email: "bob@gmail.com",
        provider: "google",
        createdAt: "2024-03-29",
    },
    {
        id: "3",
        email: "carol@github.com",
        provider: "github",
        createdAt: "2024-03-28",
    },
];

const MOCK_SERVICE = {
    id: "auth_123456",
    name: "My Auth Service",
    apiKey: "pk_live_abc123xyz456",
    endpoint: "https://api.donut.dev/auth",
    createdAt: "2024-03-30",
};

export default function AuthServicePage() {
    const [enabled, setEnabled] = useState(false);
    const [enabling, setEnabling] = useState(false);
    const [copied, setCopied] = useState<null | "apiKey" | "endpoint">(null);
    const [providers, setProviders] = useState({
        email: true,
        google: false,
        github: false,
    });

    // Simulate enabling the service
    const handleEnable = () => {
        setEnabling(true);
        setTimeout(() => {
            setEnabled(true);
            setEnabling(false);
        }, 1000);
    };

    const handleCopy = (value: string, type: "apiKey" | "endpoint") => {
        navigator.clipboard.writeText(value);
        setCopied(type);
        setTimeout(() => setCopied(null), 1200);
    };

    const handleProviderToggle = (provider: keyof typeof providers) => {
        setProviders((prev) => ({ ...prev, [provider]: !prev[provider] }));
    };

    return (
        <div className="min-h-screen w-full bg-muted/50 flex flex-col">
            {/* Sticky header */}
            <header className="sticky top-0 z-10 bg-background/80 border-b px-8 py-6 flex flex-col gap-1 shadow-sm">
                <h1 className="text-3xl font-bold tracking-tight">
                    Authentication Service
                </h1>
                <p className="text-muted-foreground text-base">
                    Add secure authentication to your app. Enable and configure
                    providers, manage users, and get integration instructions.
                </p>
            </header>
            <main className="flex-1 flex flex-col w-full">
                {!enabled ? (
                    <section className="flex-1 flex flex-col items-center justify-center">
                        <Card className="w-full max-w-lg shadow-lg">
                            <CardHeader>
                                <CardTitle>Enable Auth Service</CardTitle>
                                <CardDescription>
                                    Enable the Auth Service to allow your users
                                    to sign up and log in to your app.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Alert>
                                    <AlertTitle>
                                        Auth Service is not enabled
                                    </AlertTitle>
                                    <AlertDescription>
                                        Click below to enable authentication for
                                        this project.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button
                                    size="lg"
                                    className="w-48"
                                    onClick={handleEnable}
                                    disabled={enabling}
                                >
                                    {enabling
                                        ? "Enabling..."
                                        : "Enable Auth Service"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </section>
                ) : (
                    <section className="flex-1 flex flex-col px-8 py-8">
                        <Tabs
                            defaultValue="users"
                            className="w-full flex-1 flex flex-col"
                        >
                            <TabsList className="mb-8 w-fit">
                                <TabsTrigger value="users">Users</TabsTrigger>
                                <TabsTrigger value="integration">
                                    Integration
                                </TabsTrigger>
                                <TabsTrigger value="providers">
                                    Providers
                                </TabsTrigger>
                            </TabsList>
                            <div className="flex-1 flex flex-col">
                                {/* USERS TAB */}
                                <TabsContent value="users" className="flex-1">
                                    <Card className="w-full h-full">
                                        <CardHeader>
                                            <CardTitle>
                                                Registered Users
                                            </CardTitle>
                                            <CardDescription>
                                                Manage and view users who have
                                                signed up to your app.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="rounded border bg-muted overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="py-2 px-3 text-left font-semibold">
                                                                Email
                                                            </th>
                                                            <th className="py-2 px-3 text-left font-semibold">
                                                                Provider
                                                            </th>
                                                            <th className="py-2 px-3 text-left font-semibold">
                                                                Joined
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {MOCK_USERS.map(
                                                            (user) => (
                                                                <tr
                                                                    key={
                                                                        user.id
                                                                    }
                                                                    className="border-b last:border-b-0"
                                                                >
                                                                    <td className="py-2 px-3">
                                                                        {
                                                                            user.email
                                                                        }
                                                                    </td>
                                                                    <td className="py-2 px-3 capitalize">
                                                                        {
                                                                            user.provider
                                                                        }
                                                                    </td>
                                                                    <td className="py-2 px-3">
                                                                        {
                                                                            user.createdAt
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                {/* INTEGRATION TAB */}
                                <TabsContent
                                    value="integration"
                                    className="flex-1"
                                >
                                    <Card className="w-full h-full">
                                        <CardHeader>
                                            <CardTitle>Integration</CardTitle>
                                            <CardDescription>
                                                API keys, endpoints, and
                                                quickstart code for integrating
                                                authentication.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label>API Key</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            value={
                                                                MOCK_SERVICE.apiKey
                                                            }
                                                            readOnly
                                                        />
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleCopy(
                                                                    MOCK_SERVICE.apiKey,
                                                                    "apiKey",
                                                                )
                                                            }
                                                            aria-label="Copy API Key"
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </Button>
                                                        {copied ===
                                                            "apiKey" && (
                                                            <span className="text-xs text-green-600 ml-2">
                                                                Copied!
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label>Auth Endpoint</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            value={
                                                                MOCK_SERVICE.endpoint
                                                            }
                                                            readOnly
                                                        />
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleCopy(
                                                                    MOCK_SERVICE.endpoint,
                                                                    "endpoint",
                                                                )
                                                            }
                                                            aria-label="Copy Endpoint"
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </Button>
                                                        {copied ===
                                                            "endpoint" && (
                                                            <span className="text-xs text-green-600 ml-2">
                                                                Copied!
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <Label>Quickstart</Label>
                                                    <pre className="bg-muted rounded p-4 text-sm overflow-x-auto">
                                                        {`// Example: Authenticate a user
fetch("${MOCK_SERVICE.endpoint}/login", {
  method: "POST",
  headers: { "Authorization": "Bearer ${MOCK_SERVICE.apiKey}", "Content-Type": "application/json" },
  body: JSON.stringify({ email: "user@example.com", password: "password" })
}).then(res => res.json()).then(console.log);`}
                                                    </pre>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                {/* PROVIDERS TAB */}
                                <TabsContent
                                    value="providers"
                                    className="flex-1"
                                >
                                    <Card className="w-full h-full">
                                        <CardHeader>
                                            <CardTitle>
                                                Authentication Providers
                                            </CardTitle>
                                            <CardDescription>
                                                Enable or disable authentication
                                                methods for your users.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-col gap-6">
                                                <div>
                                                    <Label className="text-base mb-2">
                                                        Providers
                                                    </Label>
                                                    <div className="flex flex-col gap-4 mt-2">
                                                        <div className="flex items-center justify-between">
                                                            <span>
                                                                Email & Password
                                                            </span>
                                                            <Switch
                                                                checked={
                                                                    providers.email
                                                                }
                                                                onCheckedChange={() =>
                                                                    handleProviderToggle(
                                                                        "email",
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span>Google</span>
                                                            <Switch
                                                                checked={
                                                                    providers.google
                                                                }
                                                                onCheckedChange={() =>
                                                                    handleProviderToggle(
                                                                        "google",
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span>GitHub</span>
                                                            <Switch
                                                                checked={
                                                                    providers.github
                                                                }
                                                                onCheckedChange={() =>
                                                                    handleProviderToggle(
                                                                        "github",
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <Alert>
                                                    <AlertTitle>
                                                        Note
                                                    </AlertTitle>
                                                    <AlertDescription>
                                                        Provider toggles are for
                                                        demo only. In a real
                                                        service, you’d configure
                                                        OAuth credentials here.
                                                    </AlertDescription>
                                                </Alert>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </section>
                )}
            </main>
        </div>
    );
}
