"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import Header from "@/components/layout/Header";
import styles from "./dashboard.module.css";

// Icons (you can replace with your preferred icon library)
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

  // Fetch user data and bookings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user from Firebase
        const currentUser = auth.currentUser;
        if (!currentUser) {
          router.push("/login?redirectTo=/dashboard");
          return;
        }

        // Fetch user profile from your backend
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${await currentUser.getIdToken()}`,
          },
        });
        const profileData = await profileRes.json();

        if (profileData.success) {
          setUser(profileData.data);
        } else {
          // Fallback to Firebase user data
          setUser({
            name: currentUser.displayName || "",
            email: currentUser.email,
            phone: "",
            address: "",
            uid: currentUser.uid,
          });
        }

        // Fetch study room bookings
        const bookingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/user`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${await currentUser.getIdToken()}`,
          },
        });
        const bookingsData = await bookingsRes.json();
        if (bookingsData.success) {
          setBookings(bookingsData.data);
        }

        // Fetch catering orders
        const cateringRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/catering/orders/user`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${await currentUser.getIdToken()}`,
          },
        });
        const cateringData = await cateringRes.json();
        if (cateringData.success) {
          setCateringOrders(cateringData.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Also call your backend logout if needed
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
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
        <p>{t("loading-dashboard") || "Loading your dashboard..."}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <p>{t("redirecting") || "Redirecting to login..."}</p>
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
              <span>{t("profile") || "Profile"}</span>
            </button>
            <button
              className={`${styles.navButton} ${activeTab === "bookings" ? styles.activeNav : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              <FaCalendarAlt />
              <span>{t("room-bookings") || "Room Bookings"}</span>
            </button>
            <button
              className={`${styles.navButton} ${activeTab === "catering" ? styles.activeNav : ""}`}
              onClick={() => setActiveTab("catering")}
            >
              <FaUtensils />
              <span>{t("catering-orders") || "Catering Orders"}</span>
            </button>
          </nav>

          <button className={styles.signOutButton} onClick={handleSignOut}>
            <FaSignOutAlt />
            <span>{t("sign-out") || "Sign Out"}</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {activeTab === "profile" && (
            <div className={styles.profileSection}>
              <div className={styles.sectionHeader}>
                <h2>{t("profile-details") || "Profile Details"}</h2>
                <Link href="/dashboard/edit-profile" className={styles.editButton}>
                  <FaEdit />
                  <span>{t("edit") || "Edit"}</span>
                </Link>
              </div>

              <div className={styles.profileCard}>
                <div className={styles.profileInfo}>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <FaUserCircle />
                      <span>{t("full-name") || "Full Name"}</span>
                    </div>
                    <div className={styles.infoValue}>{user.name || "—"}</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <FaEnvelope />
                      <span>{t("email") || "Email"}</span>
                    </div>
                    <div className={styles.infoValue}>{user.email || "—"}</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <FaPhone />
                      <span>{t("phone") || "Phone Number"}</span>
                    </div>
                    <div className={styles.infoValue}>{user.phone || "—"}</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <FaMapMarkerAlt />
                      <span>{t("address") || "Address"}</span>
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
                <h2>{t("room-bookings") || "Study Room Bookings"}</h2>
              </div>

              {bookings.length === 0 ? (
                <div className={styles.emptyState}>
                  <FaCalendarAlt className={styles.emptyIcon} />
                  <p>{t("no-bookings") || "You have no room bookings yet."}</p>
                  <Link href="/study-room" className={styles.bookNowButton}>
                    {t("book-a-room") || "Book a Room"}
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
                          <strong>{t("duration") || "Duration"}:</strong>
                          <span>{booking.duration} {t("hours") || "hours"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <strong>{t("total") || "Total"}:</strong>
                          <span>{booking.totalPrice || booking.price} QR</span>
                        </div>
                      </div>
                      {booking.status?.toLowerCase() === "pending" && (
                        <div className={styles.bookingActions}>
                          <button className={styles.cancelButton}>
                            {t("cancel") || "Cancel Booking"}
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
                <h2>{t("catering-orders") || "Catering Orders"}</h2>
              </div>

              {cateringOrders.length === 0 ? (
                <div className={styles.emptyState}>
                  <FaUtensils className={styles.emptyIcon} />
                  <p>{t("no-catering-orders") || "You have no catering orders yet."}</p>
                  <Link href="/catering" className={styles.orderNowButton}>
                    {t("order-catering") || "Order Catering"}
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
                          <strong>{t("guests") || "Guests"}:</strong>
                          <span>{order.guestCount || "—"}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <strong>{t("total") || "Total"}:</strong>
                          <span>{order.totalPrice} QR</span>
                        </div>
                      </div>
                      {order.menuItems && order.menuItems.length > 0 && (
                        <div className={styles.menuPreview}>
                          <p className={styles.menuLabel}>{t("selected-items") || "Selected Items"}:</p>
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