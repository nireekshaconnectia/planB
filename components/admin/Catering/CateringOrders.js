"use client";
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import styles from './CateringOrders.module.css';
import CateringOrderDetails from './CateringOrderDetails';

export default function CateringOrders() {
    const { data: session, status } = useSession();
    const t = useTranslations();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    const fetchCateringOrders = useCallback(async () => {
        if (!session?.user?.token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
            const res = await fetch(`${baseUrl}/catering-orders`, {
                headers: {
                    'Authorization': `Bearer ${session.user.token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch catering orders');
            }

            const data = await res.json();
            
            // Handle different response formats
            let ordersArray = [];
            if (data.success && Array.isArray(data.data)) {
                ordersArray = data.data;
            } else if (Array.isArray(data)) {
                ordersArray = data;
            } else if (data.data && Array.isArray(data.data)) {
                ordersArray = data.data;
            } else {
                throw new Error('Invalid data format received');
            }

            // Normalize order data
            const normalizedOrders = ordersArray.map(order => ({
                ...order,
                id: order._id || order.id || order.orderId,
                displayId: order.orderId || order._id?.slice(-6) || order.id?.slice(-6),
                status: order.status || order.orderStatus || 'pending',
                paymentStatus: order.paymentStatus || order.paymentDetails?.status || order.payment?.status || 'pending',
                total: order.total || order.amount || order.amountPaid || order.paymentDetails?.amountPaid || 0
            }));

            setOrders(normalizedOrders);
        } catch (err) {
            console.error('Error fetching catering orders:', err);
            setError(err.message || "Failed to load catering orders");
        } finally {
            setLoading(false);
        }
    }, [session?.user?.token]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchCateringOrders();
        } else if (status === 'unauthenticated') {
            setLoading(false);
        }
    }, [status, fetchCateringOrders]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        if (status !== 'authenticated') return;
        
        const interval = setInterval(() => {
            fetchCateringOrders();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchCateringOrders, status]);

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!session?.user?.token) return;
        
        const order = orders.find(o => 
            o.orderId === orderId || 
            o._id === orderId || 
            o.id === orderId
        );
        
        if (!order) {
            alert('Order not found');
            return;
        }
        
        const mongoId = order._id || order.id;
        if (!mongoId) {
            alert('Order ID not found. Cannot update status.');
            return;
        }
        
        setUpdatingStatus(orderId);
        
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
            const url = `${baseUrl}/catering-orders/${mongoId}/status`;
            
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session.user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            let data;
            try {
                data = await res.json();
            } catch (parseError) {
                const text = await res.text();
                console.error('Non-JSON response:', text);
                throw new Error(`Server error: ${res.status} ${res.statusText}`);
            }

            if (res.ok) {
                const updatedOrder = data.data || data;
                setOrders(prevOrders => 
                    prevOrders.map(o => {
                        if (o._id === mongoId || o.id === mongoId || o.orderId === orderId) {
                            return { 
                                ...o, 
                                ...updatedOrder,
                                status: newStatus, 
                                orderStatus: newStatus,
                                updatedAt: new Date().toISOString()
                            };
                        }
                        return o;
                    })
                );
                
                // Show success message
                const successMsg = `Order status updated to ${newStatus.replace(/_/g, ' ')}`;
                console.log(successMsg);
            } else {
                const errorMsg = data.message || data.error || `HTTP ${res.status}`;
                console.error('Failed to update status:', errorMsg);
                alert(errorMsg || 'Failed to update status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status: ' + (err.message || 'Unknown error'));
        } finally {
            setUpdatingStatus(null);
        }
    };

    // Filter and sort orders
    const getFilteredAndSortedOrders = useCallback(() => {
        let filtered = [...orders];

        // Apply status filter
        if (filter !== 'all') {
            filtered = filtered.filter(order => 
                order.status?.toLowerCase() === filter.toLowerCase()
            );
        }

        // Apply search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(order => 
                (order.orderId?.toLowerCase().includes(term)) ||
                (order.user?.name?.toLowerCase().includes(term)) ||
                (order.firstName?.toLowerCase().includes(term)) ||
                (order.customerName?.toLowerCase().includes(term)) ||
                (order.phone?.toLowerCase().includes(term)) ||
                (order.user?.phone?.toLowerCase().includes(term)) ||
                (order.selectedPackage?.toLowerCase().includes(term))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aVal, bVal;
            
            switch(sortBy) {
                case 'createdAt':
                    aVal = new Date(a.createdAt || 0);
                    bVal = new Date(b.createdAt || 0);
                    break;
                case 'deliveryDate':
                    aVal = new Date(a.deliveryDate || 0);
                    bVal = new Date(b.deliveryDate || 0);
                    break;
                case 'total':
                    aVal = a.total || 0;
                    bVal = b.total || 0;
                    break;
                case 'customer':
                    aVal = (a.user?.name || a.firstName || a.customerName || '').toLowerCase();
                    bVal = (b.user?.name || b.firstName || b.customerName || '').toLowerCase();
                    break;
                default:
                    aVal = new Date(a.createdAt || 0);
                    bVal = new Date(b.createdAt || 0);
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    }, [orders, filter, searchTerm, sortBy, sortOrder]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (err) {
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        try {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        } catch (err) {
            return timeString;
        }
    };

    const getStatusColor = (status) => {
        if (!status) return '#666';
        const statusLower = status.toLowerCase();
        const colors = {
            pending: '#FFA500',
            confirmed: '#2196F3',
            preparing: '#FF4500',
            out_for_delivery: '#9C27B0',
            delivered: '#32CD32',
            completed: '#32CD32',
            cancelled: '#DC143C',
            paid: '#32CD32',
            failed: '#DC143C',
            refunded: '#FFA500'
        };
        return colors[statusLower] || '#666';
    };

    const getStatusOptions = (currentStatus) => {
        const allStatuses = [
            'pending', 'confirmed', 'preparing', 'out_for_delivery', 
            'delivered', 'completed', 'cancelled'
        ];
        
        if (currentStatus === 'completed' || currentStatus === 'cancelled') {
            return [currentStatus];
        }
        
        return allStatuses;
    };

    if (status === 'loading' || loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading catering orders...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    Please login to view catering orders
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
                <button onClick={fetchCateringOrders} className={styles.retryButton}>
                    Retry
                </button>
            </div>
        );
    }

    const filteredOrders = getFilteredAndSortedOrders();
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        delivered: orders.filter(o => o.status === 'delivered' || o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0)
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Catering Orders</h1>
                <button onClick={fetchCateringOrders} className={styles.refreshButton}>
                    🔄 Refresh
                </button>
            </div>

            {/* Statistics Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total Orders</h3>
                    <p className={styles.statNumber}>{stats.total}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Pending</h3>
                    <p className={styles.statNumber} style={{ color: '#FFA500' }}>{stats.pending}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Processing</h3>
                    <p className={styles.statNumber} style={{ color: '#2196F3' }}>{stats.confirmed + stats.preparing}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Delivered</h3>
                    <p className={styles.statNumber} style={{ color: '#32CD32' }}>{stats.delivered}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Total Revenue</h3>
                    <p className={styles.statNumber}>QR {stats.totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className={styles.filtersBar}>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Search by order ID, customer name, phone, or package..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="createdAt">Sort by Date</option>
                        <option value="deliveryDate">Sort by Delivery Date</option>
                        <option value="total">Sort by Total</option>
                        <option value="customer">Sort by Customer</option>
                    </select>

                    <button 
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        className={styles.sortButton}
                    >
                        {sortOrder === 'desc' ? '↓' : '↑'}
                    </button>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className={styles.emptyState}>
                    {searchTerm || filter !== 'all' ? (
                        <>
                            <p>No orders match your filters</p>
                            <button onClick={() => {
                                setSearchTerm('');
                                setFilter('all');
                            }} className={styles.clearFiltersButton}>
                                Clear Filters
                            </button>
                        </>
                    ) : (
                        <p>No catering orders found</p>
                    )}
                </div>
            ) : (
                <div className={styles.ordersList}>
                    {filteredOrders.map((order) => {
                        const orderId = order.orderId || order._id || order.id;
                        const status = order.status || order.orderStatus || 'pending';
                        const paymentStatus = order.paymentStatus || order.paymentDetails?.status || order.payment?.status || 'pending';
                        const total = order.total || order.amount || order.amountPaid || order.paymentDetails?.amountPaid || 0;
                        const isUpdating = updatingStatus === orderId;
                        
                        return (
                            <div key={orderId} className={`${styles.orderCard} ${styles[status]}`}>
                                <div className={styles.orderHeader}>
                                    <div className={styles.orderTitleSection}>
                                        <h3 
                                            className={styles.orderTitle}
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowDetailsPopup(true);
                                            }}
                                        >
                                            Order #{order.orderId || order._id?.slice(-6)}
                                        </h3>
                                        <span className={styles.orderDate}>
                                            {formatDate(order.createdAt)}
                                        </span>
                                    </div>
                                    <span 
                                        className={styles.orderStatus}
                                        style={{ backgroundColor: `${getStatusColor(status)}20`, color: getStatusColor(status) }}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                                    </span>
                                </div>

                                <div className={styles.customerInfo}>
                                    <p><strong>Customer:</strong> {order.user?.name || order.firstName || order.customerName || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {order.user?.phone || order.phone || 'N/A'}</p>
                                    {order.email && <p><strong>Email:</strong> {order.user?.email || order.email}</p>}
                                </div>

                                <div className={styles.packageInfo}>
                                    <h4>Package Details</h4>
                                    {order.selectedPackage && (
                                        <p><strong>Package:</strong> {order.selectedPackage}</p>
                                    )}
                                    {order.numberOfPeople && (
                                        <p><strong>Number of People:</strong> {order.numberOfPeople}</p>
                                    )}
                                    {order.selectedOptional && order.selectedOptional.length > 0 && (
                                        <div className={styles.optionalItems}>
                                            <strong>Optional Items:</strong>
                                            <ul>
                                                {Array.isArray(order.selectedOptional) 
                                                    ? order.selectedOptional.map((item, idx) => (
                                                        <li key={idx}>{item}</li>
                                                    ))
                                                    : <li>{order.selectedOptional}</li>
                                                }
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.deliveryInfo}>
                                    <h4>Delivery Information</h4>
                                    {order.deliveryDate && (
                                        <p><strong>Delivery Date:</strong> {formatDate(order.deliveryDate)}</p>
                                    )}
                                    {order.deliveryTime && (
                                        <p><strong>Delivery Time:</strong> {formatTime(order.deliveryTime)}</p>
                                    )}
                                    {order.address && (
                                        <p><strong>Address:</strong> {typeof order.address === 'object' ? order.address.line1 : order.address}</p>
                                    )}
                                    {order.location && (
                                        <p><strong>Location:</strong> {order.location}</p>
                                    )}
                                    {order.detailedAddress && (
                                        <p><strong>Detailed Address:</strong> {order.detailedAddress}</p>
                                    )}
                                </div>

                                <div className={styles.pricingInfo}>
                                    <div className={styles.priceItem}>
                                        <span>Subtotal:</span>
                                        <span>QR {(order.subtotal || 0).toFixed(2)}</span>
                                    </div>
                                    {order.deliveryCharge && (
                                        <div className={styles.priceItem}>
                                            <span>Delivery Charge:</span>
                                            <span>QR {order.deliveryCharge.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className={styles.orderTotal}>
                                        <strong>Total:</strong> QR {total.toFixed(2)}
                                    </div>
                                </div>

                                {order.specialInstructions && (
                                    <div className={styles.notes}>
                                        <strong>Special Instructions:</strong>
                                        <p>{order.specialInstructions}</p>
                                    </div>
                                )}

                                <div className={styles.statusControls}>
                                    <div className={styles.statusGroup}>
                                        <label>Order Status:</label>
                                        {isUpdating ? (
                                            <div className={styles.updatingSpinner}>
                                                <div className={styles.smallSpinner}></div>
                                                <span>Updating...</span>
                                            </div>
                                        ) : (
                                            <select 
                                                value={status}
                                                onChange={(e) => updateOrderStatus(orderId, e.target.value)}
                                                className={styles.statusSelect}
                                                style={{ borderColor: getStatusColor(status) }}
                                                disabled={status === 'completed' || status === 'cancelled'}
                                            >
                                                {getStatusOptions(status).map(opt => (
                                                    <option key={opt} value={opt}>
                                                        {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/_/g, ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    <div className={styles.statusGroup}>
                                        <label>Payment Status:</label>
                                        <div 
                                            className={styles.paymentStatus} 
                                            style={{ color: getStatusColor(paymentStatus), backgroundColor: `${getStatusColor(paymentStatus)}10` }}
                                        >
                                            {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Order Details Popup */}
            <CateringOrderDetails
                isOpen={showDetailsPopup}
                onClose={() => {
                    setShowDetailsPopup(false);
                    setSelectedOrder(null);
                }}
                order={selectedOrder}
            />
        </div>
    );
}