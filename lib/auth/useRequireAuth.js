"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, getIdToken, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";

export const useRequireAuth = (loggedInRedirect = null) => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // 🔄 No user, redirect to login
        router.push(
          `/login?redirectTo=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        );
      } else {
        try {
          // 🛡️ Validate token (force refresh = true)
          const token = await getIdToken(user, true);
          if (!token) throw new Error("Invalid token");

          // ✅ Token is valid, user is logged in
          if (loggedInRedirect && router.pathname !== loggedInRedirect) {
            router.push(loggedInRedirect);
          }
        } catch (err) {
          console.warn("❌ Token invalid or expired. Signing out.", err);
          await signOut(auth);
          router.push(
            `/logout?redirectTo=${encodeURIComponent(
              window.location.pathname + window.location.search
            )}`
          );
        }
      }
    });

    return () => unsubscribe();
  }, [router, loggedInRedirect]);
};
