'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { dashboardCard } from "@/components/admin/dashboardCard/dashboardCard";
import LoginForm from "@/components/admin/components/login/login";

export default function AdminHome() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <LoginForm />;
    }

    // If user is logged in, redirect to dashboard
    router.replace("/admin/dashboard");
    return null;
}