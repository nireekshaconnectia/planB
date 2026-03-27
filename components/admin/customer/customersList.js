"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import styles from './customersList.module.css';

export default function CustomersList() {
    const { data: session } = useSession();
    const t = useTranslations();
    const [customers, setCustomers] = useState([]);
    const [customerStats, setCustomerStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, []);

const fetchCustomerStatistics = async (customerId) => {
    if (!session?.user?.token) return;
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
        // Fix: Use admin route with customer ID
        const apiUrl = `${baseUrl}/${customerId}/statistics`;
        
        const res = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${session.user.token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        if (data.success) {
            setCustomerStats(prev => ({
                ...prev,
                [customerId]: data.data
            }));
        }
    } catch (err) {
        console.error(`Error fetching statistics for customer ${customerId}:`, err);
    }
};

const fetchCustomers = async () => {
    if (!session?.user?.token) return;
    setLoading(true);
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
        // Fix: Use admin route for getting all users
        const apiUrl = `${baseUrl}/admin`;
        
        const res = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${session.user.token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.success) {
            setCustomers(data.data);
            // Fetch statistics for each customer
            data.data.forEach(customer => {
                fetchCustomerStatistics(customer._id);
            });
        } else {
            setError(data.message || t("failedToLoadCustomers"));
        }
    } catch (err) {
        console.error('Error fetching customers:', err);
        setError(t("failedToLoadCustomers"));
    } finally {
        setLoading(false);
    }
};

    const filteredCustomers = customers.filter(customer => 
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>{t("loadingCustomers")}</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{t("customerList")}</h2>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder={t("searchCustomersPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.customersList}>
                {filteredCustomers.map(customer => {
                    const stats = customerStats[customer._id] || {};
                    return (
                        <div key={customer._id} className={styles.customerCard}>
                            <div className={styles.customerHeader}>
                                <h3>{customer.name}</h3>
                               
                            </div>

                            <div className={styles.customerInfo}>
                                <div className={styles.infoGroup}>
                                    <label>{t("contactDetails")}:</label>
                                    <p><strong>{t("phone")}:</strong> {customer.phone}</p>
                                    <p><strong>{t("email")}:</strong> {customer.email || t("notProvided")}</p>
                                </div>

                                <div className={styles.infoGroup}>
                                    <label>{t("orderStatistics")}:</label>
                                    <p><strong>{t("totalOrders")}:</strong> {stats.totalOrders || 0}</p>
                                    <p><strong>{t("totalSpent")}:</strong> ₹{stats.totalSpent || 0}</p>
                                    <p><strong>{t("lastOrder")}:</strong> {stats.lastOrderDate ? new Date(stats.lastOrderDate).toLocaleDateString() : t("noOrdersYet")}</p>
                                </div>

                                <div className={styles.infoGroup}>
                                    <label>{t("address")}:</label>
                                    <p>{customer.address || t("noAddressProvided")}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
