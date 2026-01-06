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
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        pendingBookings: 0,
        pendingOrders: 0,
        liveOrders: 0,
        newCustomers: 0,
        totalBookings: 0,
        todayOrders: 0,
        totalRevenue: 0,
        avgFeedback: 0,
        supportTickets: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to check if date is today
    const isToday = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // Fetch all dashboard data
    const fetchDashboardData = useCallback(async () => {
        if (!session?.user?.token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

            // Fetch all data in parallel
            const [ordersRes, bookingsRes, bookingsStatsRes, customersRes, feedbackRes] = await Promise.allSettled([
                fetch(`${baseUrl}/orders`, {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                }),
                fetch(`${baseUrl}/rooms/admin/bookings`, {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                }),
                fetch(`${baseUrl}/rooms/admin/bookings/statistics`, {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                }),
                fetch(`${baseUrl}/users/customers`, {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                        "Content-Type": "application/json",
                    },
                }),
                fetch(`${baseUrl}/admin/feedback`, {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                }).catch(() => ({ ok: false })), // Feedback endpoint might not exist
            ]);

            // Process orders
            let orders = [];
            if (ordersRes.status === "fulfilled" && ordersRes.value.ok) {
                const ordersData = await ordersRes.value.json();
                if (ordersData.success && Array.isArray(ordersData.data)) {
                    orders = ordersData.data;
                }
            }

            // Process bookings
            let bookings = [];
            if (bookingsRes.status === "fulfilled" && bookingsRes.value.ok) {
                const bookingsData = await bookingsRes.value.json();
                if (bookingsData.success && Array.isArray(bookingsData.data)) {
                    bookings = bookingsData.data;
                }
            }

            // Process bookings statistics
            let bookingsStats = null;
            if (bookingsStatsRes.status === "fulfilled" && bookingsStatsRes.value.ok) {
                bookingsStats = await bookingsStatsRes.value.json();
            }

            // Process customers
            let customers = [];
            if (customersRes.status === "fulfilled" && customersRes.value.ok) {
                const customersData = await customersRes.value.json();
                if (customersData.success && Array.isArray(customersData.data)) {
                    customers = customersData.data;
                }
            }

            // Process feedback (optional)
            let feedback = [];
            if (feedbackRes.status === "fulfilled" && feedbackRes.value && feedbackRes.value.ok) {
                try {
                    const feedbackData = await feedbackRes.value.json();
                    if (feedbackData.success && Array.isArray(feedbackData.data)) {
                        feedback = feedbackData.data;
                    }
                } catch (e) {
                    // Feedback endpoint might not exist or return different format
                    // Feedback endpoint not available
                }
            }

            // Calculate statistics
            // Note: Orders might use 'status' or 'orderStatus', payment might be in 'paymentStatus' or 'payment.status'
            const pendingBookings = bookings.filter(
                (booking) => (booking.status?.toLowerCase() === "pending")
            ).length;

            // Pending orders: orders with pending status
            const pendingOrders = orders.filter(
                (order) => {
                    const status = (order.orderStatus || order.status || "").toLowerCase();
                    return status === "pending";
                }
            ).length;

            // Live orders: pending or cooking orders (check both status and orderStatus fields)
            const liveOrders = orders.filter(
                (order) => {
                    const status = (order.orderStatus || order.status || "").toLowerCase();
                    return status === "pending" || status === "cooking";
                }
            ).length;

            const newCustomers = customers.filter((customer) => isToday(customer.createdAt)).length;

            const totalBookings = bookingsStats?.totalBookings || bookings.length;

            const todayOrders = orders.filter((order) => {
                const orderDate = order.createdAt || order.created_at || order.date;
                return isToday(orderDate);
            }).length;

            // Revenue: Count ALL orders with orderTotal (total revenue from all orders)
            // Use orderTotal, or fallback to paymentDetails.amountPaid if orderTotal is missing
            const totalRevenue = orders
                .reduce((sum, order) => {
                    // Try orderTotal first, then paymentDetails.amountPaid, then 0
                    let total = 0;
                    
                    if (order.orderTotal !== undefined && order.orderTotal !== null && order.orderTotal !== "") {
                        total = typeof order.orderTotal === 'number' 
                            ? order.orderTotal 
                            : parseFloat(order.orderTotal) || 0;
                    } else if (order.paymentDetails?.amountPaid) {
                        total = typeof order.paymentDetails.amountPaid === 'number'
                            ? order.paymentDetails.amountPaid
                            : parseFloat(order.paymentDetails.amountPaid) || 0;
                    } else if (order.payment?.amountPaid) {
                        total = typeof order.payment.amountPaid === 'number'
                            ? order.payment.amountPaid
                            : parseFloat(order.payment.amountPaid) || 0;
                    }
                    
                    return sum + total;
                }, 0);

            // Calculate average feedback
            let avgFeedback = 0;
            if (feedback.length > 0) {
                const totalRating = feedback.reduce((sum, f) => sum + (parseFloat(f.rating) || 0), 0);
                avgFeedback = totalRating / feedback.length;
            }

            // Support tickets (not implemented yet)
            const supportTickets = 0;

            // Debug: Log calculated stats
            const ordersWithTotal = orders.filter(o => o.orderTotal || o.paymentDetails?.amountPaid || o.payment?.amountPaid);
            const revenueBreakdown = {
                totalOrders: orders.length,
                ordersWithTotal: ordersWithTotal.length,
                ordersWithoutTotal: orders.length - ordersWithTotal.length,
                sumOfOrderTotals: orders.reduce((sum, o) => sum + (parseFloat(o.orderTotal) || 0), 0),
                sumOfAmountPaid: orders.reduce((sum, o) => sum + (parseFloat(o.paymentDetails?.amountPaid || o.payment?.amountPaid || 0)), 0),
                sampleOrderTotals: orders.slice(0, 10).map(o => ({
                    orderId: o.orderId,
                    orderTotal: o.orderTotal,
                    amountPaid: o.paymentDetails?.amountPaid || o.payment?.amountPaid,
                    used: o.orderTotal || o.paymentDetails?.amountPaid || o.payment?.amountPaid || 0
                }))
            };

            setStats({
                pendingBookings,
                pendingOrders,
                liveOrders,
                newCustomers,
                totalBookings,
                todayOrders,
                totalRevenue,
                avgFeedback,
                supportTickets,
            });
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.token]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Format currency
    const formatCurrency = (amount) => {
        return `₹${new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)}`;
    };

    if (loading) {
        return (
            <div className={styles.grid}>
                {[...Array(8)].map((_, i) => (
                    <div key={i} className={styles.card}>
                        <div className={styles.skeleton}>Loading...</div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>Error loading dashboard: {error}</div>;
    }

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