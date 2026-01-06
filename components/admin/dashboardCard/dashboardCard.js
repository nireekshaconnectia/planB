"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import styles from "./dashboardCard.module.css";
import {
    FaClock,
    FaUsers,
    FaUtensils,
    FaBookOpen,
    FaShoppingCart,
    FaStar,
    FaBell,
    FaMoneyBillWave,
    FaClipboardList,
} from "react-icons/fa";

export default function DashboardCard() {
    return (
        <div className={styles.grid}>
            <div className={styles.card}>
                <FaClock className={styles.icon} />
                <div>
                    <h2>Pending Bookings</h2>
                    <p>{stats.pendingBookings} {stats.pendingBookings === 1 ? "Booking" : "Bookings"}</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaUtensils className={styles.icon} />
                <div>
                    <h2>Live Orders</h2>
                    <p>{stats.liveOrders} {stats.liveOrders === 1 ? "Order" : "Orders"}</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaUsers className={styles.icon} />
                <div>
                    <h2>New Customers</h2>
                    <p>{stats.newCustomers} Today</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaBookOpen className={styles.icon} />
                <div>
                    <h2>Total Bookings</h2>
                    <p>{stats.totalBookings} {stats.totalBookings === 1 ? "Booking" : "Bookings"}</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaClipboardList className={styles.icon} />
                <div>
                    <h2>Today&apos;s Orders</h2>
                    <p>{stats.todayOrders} {stats.todayOrders === 1 ? "Order" : "Orders"}</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaMoneyBillWave className={styles.icon} />
                <div>
                    <h2>Total Revenue</h2>
                    <p>{formatCurrency(stats.totalRevenue)}</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaStar className={styles.icon} />
                <div>
                    <h2>Avg. Feedback</h2>
                    <p>{stats.avgFeedback > 0 ? `${stats.avgFeedback.toFixed(1)} / 5` : "N/A"}</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaBell className={styles.icon} />
                <div>
                    <h2>Support Tickets</h2>
                    <p>{stats.supportTickets} {stats.supportTickets === 1 ? "Open" : "Open"}</p>
                </div>
            </div>
        </div>
    );
}
