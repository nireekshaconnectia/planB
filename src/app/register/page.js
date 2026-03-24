"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import BackButton from "@/components/backbutton/backbutton";
import styles from "./register.module.css";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "@/lib/firebase/firebase";

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const t = useTranslations();

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push(redirectTo);
    });
    return () => unsubscribe();
  }, [router, redirectTo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📧 EMAIL REGISTER
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        router.push(redirectTo);
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 GOOGLE REGISTER/LOGIN (Same logic as login)
  const handleGoogleLogin = async () => {
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
        router.push(redirectTo);
      }
    } catch (error) {
      console.error("Google auth error:", error);
      alert("Google authentication failed");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.backButtonWrapper}>
          <BackButton />
        </div>

        <h1 className={styles.registerTitle}>Create Account</h1>

        <form onSubmit={handleEmailRegister} className={styles.registerForm}>
          <div className={styles.inputWrapper}>
            <label className={styles.label}>Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label}>Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="+1 234 567 890"
              value={formData.phone}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label}>Address</label>
            <input
              name="address"
              type="text"
              placeholder="123 Street, City, Country"
              value={formData.address}
              onChange={handleChange}
              className={styles.inputField}
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.continueButton}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button onClick={handleGoogleLogin} className={styles.googleButton}>
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className={styles.googleIcon} 
          />
          Sign up with Google
        </button>

        <p className={styles.loginPrompt}>
          Already have an account?{" "}
          <Link href={`/login?redirectTo=${redirectTo}`} className={styles.loginLink}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;