"use client";
import SideBar from "@/components/dashboard/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
    );
};

export default Layout;
