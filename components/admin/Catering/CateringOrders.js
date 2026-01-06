"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import styles from './CateringOrders.module.css';
import CateringOrderDetails from './CateringOrderDetails';

export default function CateringOrders() {
    const { data: session } = useSession();
    const t = useTranslations();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);

    useEffect(() => {
        fetchCateringOrders();
    }, [session?.user?.token]);

    const fetchCateringOrders = async () => {
        if (!session?.user?.token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
            const res = await fetch(`${baseUrl}/catering-orders`, {
                headers: {
                    'Authorization': `Bearer ${session.user.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('Failed to fetch catering orders');
            }

            const data = await res.json();
            
            if (data.success && Array.isArray(data.data)) {
                setOrders(data.data);
            } else if (Array.isArray(data)) {
                setOrders(data);
            } else if (data.success && data.data && Array.isArray(data.data)) {
                setOrders(data.data);
            } else {
                throw new Error('Invalid data format received');
            }
        } catch (err) {
            console.error('Error fetching catering orders:', err);
            setError(err.message || "Failed to load catering orders");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!session?.user?.token) return;
        
        // Find the order to get the MongoDB _id
        const order = orders.find(o => 
            o.orderId === orderId || 
            o._id === orderId || 
            o.id === orderId
        );
        
        if (!order) {
            alert('Order not found');
            return;
        }
        
        // Use MongoDB _id for the API call (required by the API)
        const mongoId = order._id || order.id;
        if (!mongoId) {
            alert('Order ID not found. Cannot update status.');
            return;
        }
        
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
                // If response is not JSON (like HTML error page)
                const text = await res.text();
                console.error('Non-JSON response:', text);
                throw new Error(`Server error: ${res.status} ${res.statusText}`);
            }

            if (res.ok) {
                // Update local state with the returned order data or just update status
                const updatedOrder = data.data || data;
                setOrders(prevOrders => 
                    prevOrders.map(o => {
                        if (o._id === mongoId || o.id === mongoId || o.orderId === orderId) {
                            return { 
                                ...o, 
                                ...updatedOrder,
                                status: newStatus, 
                                orderStatus: newStatus 
                            };
                        }
                        return o;
                    })
                );
            } else {
                const errorMsg = data.message || data.error || `HTTP ${res.status}`;
                console.error('Failed to update status:', errorMsg);
                alert(errorMsg || 'Failed to update status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status: ' + (err.message || 'Unknown error'));
        }
    };

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

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading catering orders...</div>
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

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Catering Orders</h1>
            
            {orders.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No catering orders found</p>
                </div>
            ) : (
                <div className={styles.ordersList}>
                    {orders.map((order) => {
                        const orderId = order.orderId || order._id || order.id;
                        const status = order.status || order.orderStatus || 'pending';
                        const paymentStatus = order.paymentStatus || order.paymentDetails?.status || order.payment?.status || 'pending';
                        const total = order.total || order.amount || order.amountPaid || order.paymentDetails?.amountPaid || 0;
                        
                        return (
                            <div key={orderId} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <h3 
                                        className={styles.orderTitle}
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowDetailsPopup(true);
                                        }}
                                    >
                                        Order #{orderId}
                                    </h3>
                                    <span 
                                        className={styles.orderStatus}
                                        style={{ color: getStatusColor(status) }}
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
                                        <span>QR {order.subtotal || 0}</span>
                                    </div>
                                    {order.deliveryCharge && (
                                        <div className={styles.priceItem}>
                                            <span>Delivery Charge:</span>
                                            <span>QR {order.deliveryCharge}</span>
                                        </div>
                                    )}
                                    <div className={styles.orderTotal}>
                                        <strong>Total:</strong> QR {total}
                                    </div>
                                </div>

                                {order.specialInstructions && (
                                    <div className={styles.notes}>
                                        <strong>Special Instructions:</strong>
                                        <p>{order.specialInstructions}</p>
                                    </div>
                                )}

                                {order.additionalNote && (
                                    <div className={styles.notes}>
                                        <strong>Additional Notes:</strong>
                                        <p>{order.additionalNote}</p>
                                    </div>
                                )}

                                <div className={styles.statusControls}>
                                    <div className={styles.statusGroup}>
                                        <label>Order Status:</label>
                                        {status === 'completed' || status === 'cancelled' || status === 'delivered' ? (
                                            <div 
                                                className={styles.statusDisplay}
                                                style={{ color: getStatusColor(status) }}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                                            </div>
                                        ) : (
                                            <select 
                                                value={status}
                                                onChange={(e) => {
                                                    updateOrderStatus(orderId, e.target.value);
                                                }}
                                                style={{ color: getStatusColor(status) }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="out_for_delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        )}
                                    </div>

                                    <div className={styles.statusGroup}>
                                        <label>Payment Status:</label>
                                        <div 
                                            className={styles.paymentStatus} 
                                            style={{ color: getStatusColor(paymentStatus) }}
                                        >
                                            {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                                        </div>
                                    </div>
                                </div>

                                {order.createdAt && (
                                    <div className={styles.orderMeta}>
                                        <small>Ordered on: {formatDate(order.createdAt)}</small>
                                    </div>
                                )}
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

