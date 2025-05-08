"use client";
import useLogoutRedirect from "@/lib/auth/useLogoutRedirect";

export default function LogoutPage() {
  useLogoutRedirect();

  return <p>Logging out...</p>; // Optional UI while redirecting
}