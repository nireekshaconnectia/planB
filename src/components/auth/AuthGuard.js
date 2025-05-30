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
        console.log('AuthGuard - Current state:', { status, session, pathname });

        if (status === "loading") {
            console.log('AuthGuard - Still loading session');
            return;
        }

        // Allow access to /admin/login without session
        if (!session && isLoginPage) {
            console.log('AuthGuard - On login page, allowing access');
            return;
        }

        // Check for token in session
        if (!session?.user?.token) {
            console.log('AuthGuard - No token found in session:', session);
            router.push("/admin/");
            return;
        }

        // Handle /admin root route
        if (isAdminRoot) {
            if (session.user.role === "superadmin") {
                console.log('AuthGuard - Superadmin, redirecting to dashboard');
                router.push("/admin/dashboard/");
                return;
            }
            if (session.user.role === "admin") {
                console.log('AuthGuard - Admin, redirecting to home');
                router.push("/admin/home/");
                return;
            }
        }

        // Example: block admin from accessing superadmin route
        if (pathname.startsWith("/admin/dashboard") && session.user.role !== "superadmin") {
            console.log('AuthGuard - Non-superadmin trying to access dashboard');
            router.push("/admin/home/");
            return;
        }

        console.log('AuthGuard - Access granted');
    }, [session, status, pathname, router, isLoginPage, isAdminRoot]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    // Only render children if we have a valid session with token
    if (!session?.user?.token) {
        console.log('AuthGuard - No valid session, not rendering children');
        return null;
    }

    console.log('AuthGuard - Rendering children with session:', session);
    return children;
}
