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

  // Function to get token from localStorage or cookies
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      // Try to get from localStorage first
      const token = localStorage.getItem("authToken");
      if (token) return token;
      
      // Try to get from cookies
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token') {
          return value;
        }
      }
    }
    return null;
  };

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If user is already logged in via Firebase, redirect
        try {
          router.push(redirectTo);
        } catch (error) {
          console.error("Error redirecting:", error);
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

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      // Get existing token if any (though login shouldn't require it)
      const existingToken = getAuthToken();
      
      const headers = {
        "Content-Type": "application/json"
      };
      
      // Add token if it exists (to satisfy backend middleware)
      if (existingToken) {
        headers["Authorization"] = `Bearer ${existingToken}`;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ 
          email: email.trim(), 
          password,
          provider: "email"
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store the JWT token from response
        if (data.user && data.user.token) {
          storeAuthData(data.user.token, data.user);
        }
        
        // Redirect based on profile completion
        if (data.user.profileCompleted === false) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = redirectTo;
        }
      } else {
        // Handle specific error messages
        if (response.status === 401) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(data.message || "Login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
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

      // Get existing token if any
      const existingToken = getAuthToken();
      
      const headers = {
        "Content-Type": "application/json"
      };
      
      // Add token if it exists
      if (existingToken) {
        headers["Authorization"] = `Bearer ${existingToken}`;
      }

      // Send Firebase token to backend for Google login
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ 
          firebaseToken,
          email: user.email,
          name: user.displayName,
          provider: "google"
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store the JWT token from response
        if (data.user && data.user.token) {
          storeAuthData(data.user.token, data.user);
        }
        
        // Redirect based on profile completion
        if (data.user.profileCompleted === false) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = redirectTo;
        }
      } else {
        setError(data.message || "Google login failed. Please try again.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/popup-blocked') {
        setError("Popup was blocked. Please allow popups for this site and try again.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError("Login cancelled. Please try again.");
      } else {
        setError("Google login failed. Please try again.");
      }
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
              autoComplete="email"
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
              autoComplete="current-password"
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
          type="button"
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