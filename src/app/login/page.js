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
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"; // Changed default to dashboard
  const t = useTranslations();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to store auth data
  const storeAuthData = (token, user) => {
    // Store token in localStorage
    localStorage.setItem("authToken", token);
    
    // Store user data if needed
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    }
    
    // Also set cookie for server-side authentication
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`; // 7 days
  };

  // Function to clear auth data (for logout)
  const clearAuthData = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if user is already logged in via Firebase
        // You might want to verify with your backend here
        router.push(redirectTo);
      }
    });
    return () => unsubscribe();
  }, [router, redirectTo]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        // Store the token from response
        if (data.user && data.user.token) {
          storeAuthData(data.user.token, data.user);
        }
        
        // Redirect based on profile completion status
        if (data.user.profileCompleted === false) {
          router.push("/dashboard");
        } else {
          router.push(redirectTo);
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Login error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const firebaseToken = await user.getIdToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        // Store the token from response
        if (data.user && data.user.token) {
          storeAuthData(data.user.token, data.user);
        }
        
        // Redirect based on profile completion status
        if (data.user.profileCompleted === false) {
          router.push("/complete-profile");
        } else {
          router.push(redirectTo);
        }
      } else {
        alert(data.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>{t("login")}</h1>

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