"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./login.module.css";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "@/lib/firebase/firebase";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const t = useTranslations();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to store auth data
  const storeAuthData = (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("authToken", token);
      
      if (user) {
        localStorage.setItem("userData", JSON.stringify(user));
      }
      
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    }
  };

  // Function to clear auth data (for logout)
  const clearAuthData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If user is already logged in via Firebase, get the token and redirect
        try {
          const firebaseToken = await user.getIdToken();
          // Verify with backend or just redirect
          router.push(redirectTo);
        } catch (error) {
          console.error("Error getting Firebase token:", error);
        }
      }
    });
    return () => unsubscribe();
  }, [router, redirectTo]);

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password,
          provider: "email"
        }),
        credentials: "include",
      });

      const data = await res.json();
      
      if (data.success) {
        // Store the JWT token from response
        if (data.user && data.user.token) {
          storeAuthData(data.user.token, data.user);
        }
        
        // Use window.location for hard redirect to avoid RSC issues
        if (data.user.profileCompleted === false) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = redirectTo;
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const firebaseToken = await user.getIdToken();

      // Send Firebase token to backend for Google login
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          firebaseToken,
          email: user.email,
          name: user.displayName,
          provider: "google"
        }),
        credentials: "include",
      });

      const data = await res.json();
      
      if (data.success) {
        // Store the JWT token from response
        if (data.user && data.user.token) {
          storeAuthData(data.user.token, data.user);
        }
        
        // Use window.location for hard redirect to avoid RSC issues
        if (data.user.profileCompleted === false) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = redirectTo;
        }
      } else {
        setError(data.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>{t("login")}</h1>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className={styles.loginForm}>
          <div className={styles.inputWrapper}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={styles.continueButton}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className={styles.googleButton}
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className={styles.googleIcon} 
          />
          Continue with Google
        </button>

        <p className={styles.registerPrompt}>
          Don't have an account?{" "}
          <Link href={`/register?redirectTo=${redirectTo}`} className={styles.registerLink}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;