// app/dashboard/components/CateringTab.js
"use client";

import Link from "next/link";
import { 
  FaUtensils, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaTimesCircle,
  FaClock
} from "react-icons/fa";
import styles from "../dashboard.module.css";

const CateringTab = ({ cateringOrders }) => {
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

  if (cateringOrders.length === 0) {
    return (
      <div className={styles.cateringSection}>
        <div className={styles.sectionHeader}>
          <h2>Catering Orders</h2>
        </div>
        <div className={styles.emptyState}>
          <FaUtensils className={styles.emptyIcon} />
          <p>You have no catering orders yet.</p>
          <Link href="/catering" className={styles.orderNowButton}>
            Order Catering
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cateringSection}>
      <div className={styles.sectionHeader}>
        <h2>Catering Orders</h2>
      </div>
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
    </div>
  );
};

export default CateringTab;