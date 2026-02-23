"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authcontext";

/**
 * Unauthenticated layout
 *
 * This layout surrounds pages in the (unauthenticated) group (e.g. /login, /signup).
 * If a user is already logged in, we redirect them to /projects to prevent
 * access to login/signup pages.
 *
 * Note: This is a client component because it relies on client-side auth state.
 */
export default function UnauthenticatedLayout({ children }) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        // When auth state is known and a user exists, redirect to /projects.
        if (!loading && user) {
            // Replace so the user can't go back to the auth page with the back button.
            router.replace("/projects");
        }
    }, [user, loading, router]);

    // While we don't yet know whether the user is logged in, show a minimal
    // loading UI to prevent flashing the login/signup screen briefly.
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="text-center text-gray-500">
                    Checking authentication…
                </div>
            </div>
        );
    }

    // If user exists, we return null because router.replace will navigate away.
    if (user) return null;

    // Not logged in: render children (login / signup pages)
    return <>{children}</>;
}
