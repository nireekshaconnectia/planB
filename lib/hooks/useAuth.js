import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAuth(redirectPath) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 🛑 Wait until NextAuth has loaded
    if (status !== "unauthenticated") return;

    // ✅ Only redirect unauthenticated users
    router.push(`/admin`);
  }, [status, router, redirectPath]);

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
