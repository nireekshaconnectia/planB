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
                    <p>12 Bookings</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaUtensils className={styles.icon} />
                <div>
                    <h2>Live Orders</h2>
                    <p>8 Orders</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaUsers className={styles.icon} />
                <div>
                    <h2>New Customers</h2>
                    <p>5 Today</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaBookOpen className={styles.icon} />
                <div>
                    <h2>Total Bookings</h2>
                    <p>128 Bookings</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaClipboardList className={styles.icon} />
                <div>
                    <h2>Today's Orders</h2>
                    <p>21 Orders</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaMoneyBillWave className={styles.icon} />
                <div>
                    <h2>Total Revenue</h2>
                    <p>$4,560</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaStar className={styles.icon} />
                <div>
                    <h2>Avg. Feedback</h2>
                    <p>4.6 / 5</p>
                </div>
            </div>

            <div className={styles.card}>
                <FaBell className={styles.icon} />
                <div>
                    <h2>Support Tickets</h2>
                    <p>2 Open</p>
                </div>
            </div>
        </div>
    );
}