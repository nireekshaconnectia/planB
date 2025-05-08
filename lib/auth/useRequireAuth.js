"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase"; // Ensure this is the correct path to your Firebase config

export const useRequireAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/logout");
      }
    });

    return () => unsubscribe();
  }, [router]);
};