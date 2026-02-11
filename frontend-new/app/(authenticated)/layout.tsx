"use client";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { usePathname } from "next/navigation";
import { ProjectProvider } from "@/context/projectcontext";
import ProjectNav from "@/components/dashboard/projectnav";
import { Loader2 } from "lucide-react";

const Layout = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Redirect non-authenticated users
    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if user is not authenticated (redirect will happen)
    if (!user) {
        return null;
    }

    // Show ProjectNav only on profile and projects list page, not on nested project pages
    const showProjectNav = pathname === "/profile" || pathname === "/projects";

    return (
        <ProjectProvider>
            <div className="min-h-screen bg-background text-foreground">
                {showProjectNav && <ProjectNav />}
                <div className="pt-16 md:pt-20">{children}</div>
            </div>
        </ProjectProvider>
    );
};

export default Layout;
