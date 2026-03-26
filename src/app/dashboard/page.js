"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Header from "@/components/layout/Header";
import styles from "./dashboard.module.css";

// Icons
import {
  FaUserCircle,
  FaSignOutAlt,
  FaCalendarAlt,
  FaUtensils,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaEdit,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

const DashboardPage = () => {
  const router = useRouter();
  const t = useTranslations();
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
        // Get token from localStorage
        const token = localStorage.getItem("authToken");
        
        console.log("Token found:", token ? "Yes" : "No");
        
        if (!token) {
          console.log("No token found, redirecting to login");
          router.push("/login?redirectTo=/dashboard");
          return;
        }

        // Fetch user profile from your backend
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        
        console.log("Profile response status:", profileRes.status);
        
        if (profileRes.status === 401) {
          // Token is invalid or expired
          console.log("Token invalid, clearing storage and redirecting");
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          router.push("/login?redirectTo=/dashboard");
          return;
        }
        
        const profileData = await profileRes.json();
        console.log("Profile data:", profileData);

        if (profileData.success && profileData.user) {
          setUser(profileData.user);
        } else {
          setError("Failed to load user profile");
          return;
        }

        // Fetch study room bookings
        try {
          const bookingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/user`, {
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

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      // Call your backend logout
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      }
      
      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      
      // Clear cookie
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      // Still clear local data and redirect
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      window.location.href = "/";
    }
  };

  const getBookingStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
        return <FaCheckCircle className={styles.statusIconConfirmed} />;
      case "pending":
        return <FaHourglassHalf className={styles.statusIconPending} />;
      case "cancelled":
        return <FaTimesCircle className={styles.statusIconCancelled} />;
      default:
        return <FaClock className={styles.statusIconDefault} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
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
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.userAvatar}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.avatarImage} />
            ) : (
              <FaUserCircle className={styles.avatarIcon} />
            )}
            <h3 className={styles.userName}>{user.name || user.email}</h3>
            <p className={styles.userEmail}>{user.email}</p>
          </div>

          <nav className={styles.sidebarNav}>
            <button
              className={`${styles.navButton} ${activeTab === "profile" ? styles.activeNav : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FaUserCircle />
              <span>Profile</span>
            </button>
            <button
              className={`${styles.navButton} ${activeTab === "bookings" ? styles.activeNav : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              <FaCalendarAlt />
              <span>Room Bookings</span>
            </button>
            <button
              className={`${styles.navButton} ${activeTab === "catering" ? styles.activeNav : ""}`}
              onClick={() => setActiveTab("catering")}
            >
              <FaUtensils />
              <span>Catering Orders</span>
            </button>
          </nav>

          <button className={styles.signOutButton} onClick={handleSignOut}>
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {activeTab === "profile" && (
            <div className={styles.profileSection}>
              <div className={styles.sectionHeader}>
                <h2>Profile Details</h2>
                <Link href="/dashboard/edit-profile" className={styles.editButton}>
                  <FaEdit />
                  <span>Edit</span>
                </Link>
              </div>

              <div className={styles.profileCard}>
                <div className={styles.profileInfo}>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <FaUserCircle />
                      <span>Full Name</span>
                    </div>
                    <div className={styles.infoValue}>{user.name || "—"}</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <FaEnvelope />
                      <span>Email</span>
                    </div>
                    <div className={styles.infoValue}>{user.email || "—"}</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <FaPhone />
                      <span>Phone Number</span>
                    </div>
                    <div className={styles.infoValue}>{user.phone || "—"}</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <FaMapMarkerAlt />
                      <span>Address</span>
                    </div>
                    <div className={styles.infoValue}>{user.address || "—"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className={styles.bookingsSection}>
              <div className={styles.sectionHeader}>
                <h2>Study Room Bookings</h2>
              </div>

              {bookings.length === 0 ? (
                <div className={styles.emptyState}>
                  <FaCalendarAlt className={styles.emptyIcon} />
                  <p>You have no room bookings yet.</p>
                  <Link href="/study-room" className={styles.bookNowButton}>
                    Book a Room
                  </Link>
                </div>
              ) : (
                <div className={styles.bookingsList}>
                  {bookings.map((booking) => (
                    <div key={booking._id} className={styles.bookingCard}>
                      <div className={styles.bookingHeader}>
                        <h3>{booking.roomName || "Study Room"}</h3>
                        <div className={styles.bookingStatus}>
                          {getBookingStatusIcon(booking.status)}
                          <span className={styles.statusText}>
                            {booking.status || "Confirmed"}
                          </span>
                        </div>
                      </div>
                      <div className={styles.bookingDetails}>
                        <div className={styles.detailItem}>
                          <FaCalendarAlt />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <FaClock />
                          <span>
                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Duration:</strong>
                          <span>{booking.duration} hours</span>
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Total:</strong>
                          <span>{booking.totalPrice || booking.price} QR</span>
                        </div>
                      </div>
                      {booking.status?.toLowerCase() === "pending" && (
                        <div className={styles.bookingActions}>
                          <button className={styles.cancelButton}>
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "catering" && (
            <div className={styles.cateringSection}>
              <div className={styles.sectionHeader}>
                <h2>Catering Orders</h2>
              </div>

              {cateringOrders.length === 0 ? (
                <div className={styles.emptyState}>
                  <FaUtensils className={styles.emptyIcon} />
                  <p>You have no catering orders yet.</p>
                  <Link href="/catering" className={styles.orderNowButton}>
                    Order Catering
                  </Link>
                </div>
              ) : (
                <div className={styles.ordersList}>
                  {cateringOrders.map((order) => (
                    <div key={order._id} className={styles.orderCard}>
                      <div className={styles.orderHeader}>
                        <h3>{order.packageName || "Catering Order"}</h3>
                        <div className={styles.orderStatus}>
                          {getBookingStatusIcon(order.status)}
                          <span className={styles.statusText}>
                            {order.status || "Confirmed"}
                          </span>
                        </div>
                      </div>
                      <div className={styles.orderDetails}>
                        <div className={styles.detailItem}>
                          <FaCalendarAlt />
                          <span>{formatDate(order.eventDate)}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Guests:</strong>
                          <span>{order.guestCount || "—"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <strong>Total:</strong>
                          <span>{order.totalPrice} QR</span>
                        </div>
                      </div>
                      {order.menuItems && order.menuItems.length > 0 && (
                        <div className={styles.menuPreview}>
                          <p className={styles.menuLabel}>Selected Items:</p>
                          <div className={styles.menuTags}>
                            {order.menuItems.slice(0, 3).map((item, idx) => (
                              <span key={idx} className={styles.menuTag}>
                                {item.name}
                              </span>
                            ))}
                            {order.menuItems.length > 3 && (
                              <span className={styles.menuTagMore}>
                                +{order.menuItems.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;