"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";

// Accept redirect route for logged-in users
export const useRequireAuth = (loggedInRedirect = null) => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Not logged in → redirect to logout
        router.push("/login");
      } else if (loggedInRedirect) {
        // Logged in → redirect to provided route
        router.push(loggedInRedirect);
      }
    });

    return () => unsubscribe();
  }, [router, loggedInRedirect]);
};