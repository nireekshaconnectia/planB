// app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "./components/Sidebar";
import ProfileTab from "./components/ProfileTab";
import BookingsTab from "./components/BookingsTab";
import CateringTab from "./components/CateringTab";
import styles from "./dashboard.module.css";

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [cateringOrders, setCateringOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [error, setError] = useState(null);

  // Fetch user data and bookings using JWT token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          router.push("/login?redirectTo=/dashboard");
          return;
        }

        // Fetch user profile
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        
        if (profileRes.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          router.push("/login?redirectTo=/dashboard");
          return;
        }
        
        const profileData = await profileRes.json();
        
        if (profileData.success && profileData.data) {
          setUser(profileData.data);
          // Store in localStorage for backup
          localStorage.setItem("userData", JSON.stringify(profileData.data));
        } else {
          setError("Failed to load user profile");
          return;
        }
        
        // Fetch study room bookings - FIXED ENDPOINT
        try {
          const bookingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room-bookings/my-bookings`, {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          const bookingsData = await bookingsRes.json();
          if (bookingsData.success) {
            setBookings(bookingsData.data || []);
          }
        } catch (err) {
          console.error("Error fetching bookings:", err);
        }

        // Fetch catering orders
        try {
          const cateringRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/catering/orders/user`, {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          const cateringData = await cateringRes.json();
          if (cateringData.success) {
            setCateringOrders(cateringData.data || []);
          }
        } catch (err) {
          console.error("Error fetching catering orders:", err);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleProfileUpdate = (updatedUser) => {
    console.log("Updating user profile in dashboard:", updatedUser);
    setUser(updatedUser);
    // Update localStorage
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  const handlePasswordUpdate = () => {
    console.log("Password updated successfully");
    // Optional: Show a toast notification
  };

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      }
      
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      window.location.href = "/";
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room-bookings/${bookingId}/cancel`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        // Refresh bookings list
        const updatedBookings = bookings.filter(booking => booking._id !== bookingId);
        setBookings(updatedBookings);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={() => window.location.href = "/login"}>
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <Header />
      
      <div className={styles.dashboardWrapper}>
        <Sidebar 
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSignOut={handleSignOut}
        />

        <main className={styles.mainContent}>
          {activeTab === "profile" && (
            <ProfileTab 
              user={user} 
              onProfileUpdate={handleProfileUpdate}
              onPasswordUpdate={handlePasswordUpdate}
            />
          )}
          {activeTab === "bookings" && (
            <BookingsTab 
              bookings={bookings} 
              onCancelBooking={handleCancelBooking}
            />
          )}
          {activeTab === "catering" && <CateringTab cateringOrders={cateringOrders} />}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;