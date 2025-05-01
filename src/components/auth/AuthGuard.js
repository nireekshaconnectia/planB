'use client';
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const isLoginPage = pathname === "/admin/";
    const isAdminRoot = pathname === "/admin/" || pathname === "/admin";

    useEffect(() => {
        if (status === "loading") return;

        // Allow access to /admin/login without session
        if (!session && isLoginPage) {
            return;
        }

        // Redirect unauthenticated users to login
        if (!session) {
            router.push("/admin/");
            return;
        }

        // Handle /admin root route
        if (isAdminRoot) {
            if (session.user.role === "superadmin") {
                router.push("/admin/dashboard/");
                return;
            }
            if (session.user.role === "admin") {
                router.push("/admin/home/");
                return;
            }
        }

        // Example: block admin from accessing superadmin route
        if (pathname.startsWith("/admin/dashboard") && session.user.role !== "superadmin") {
            router.push("/admin/home/");
            return;
        }

        // Add more role-based redirects here if needed
    }, [session, status, pathname, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return children;
}
