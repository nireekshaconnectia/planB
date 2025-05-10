'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { dashboardCard } from "@/components/admin/dashboardCard/dashboardCard";
import LoginForm from "@/components/admin/components/login/login";

export default function AdminHome() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const t = useTranslations();
    
    if (status === "loading") {
        return <div>{t("loading")}</div>;
    }

    if (!session) {
        return <LoginForm />;
    }

    // If user is logged in, redirect to dashboard
    router.replace("/admin/dashboard");
    return null;
}