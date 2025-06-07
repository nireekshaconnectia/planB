"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase/firebase";

const auth = getAuth(app);

const useLogoutRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectTo = searchParams.get("redirectTo") || "/";

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await signOut(auth);
      }

      // ✅ Redirect to login and forward the original redirectTo param
      router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    });

    return () => unsubscribe();
  }, [router, searchParams]);
};

export default useLogoutRedirect;
