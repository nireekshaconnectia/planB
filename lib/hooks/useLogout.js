// hooks/useLogout.js
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirectTo") || "/";

  const safeRedirect = (url) => (url?.startsWith("/") ? url : "/");

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

  return logout;
}
