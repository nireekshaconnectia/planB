"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase/firebase"; // make sure this points to your Firebase init

const auth = getAuth(app);

const useLogoutRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in — sign them out
        await signOut(auth);
      }

      // Redirect to login regardless
      router.push("/login");
    });

    return () => unsubscribe(); // Clean up listener
  }, [router]);
};

export default useLogoutRedirect;