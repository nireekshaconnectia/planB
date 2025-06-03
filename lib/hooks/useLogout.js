import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function useLogoutRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectTo = searchParams.get("redirectTo") || "/";

    // Safe redirect function (security)
    const safeRedirect = (url) => (url?.startsWith("/") ? url : "/");

    useEffect(() => {
        const logout = async () => {
            try {
                await signOut({
                    redirect: true,
                    callbackUrl: safeRedirect(redirectTo),
                });
            } catch (error) {
                console.error("Logout error:", error);
                router.push(safeRedirect(redirectTo));
            }
        };

        logout();
    }, [redirectTo]);
}