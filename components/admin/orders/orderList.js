"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';
import styles from './orderList.module.css';

export default function OrderList() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [socket, setSocket] = useState(null);
    const [socketError, setSocketError] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [lastUpdate, setLastUpdate] = useState(null);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    useEffect(() => {
        let newSocket;
        let reconnectTimer;

        const initializeSocket = () => {
            try {
                const socketUrl = process.env.NEXT_SOCKET_URL || 'https://planbapi-8lef5.ondigitalocean.app';
                console.log('Attempting to connect to socket server at:', socketUrl);
                
                // Initialize socket connection with more robust options
                newSocket = io(socketUrl, {
                    cors: {
                        origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://planbqa.shop',
                        methods: ["GET", "POST"]
                    },
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    timeout: 10000,
                    transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket
                    forceNew: true,
                    autoConnect: true
                });

                // Socket event listeners
                newSocket.on('connect', () => {
                    console.log('Socket connected successfully');
                    setConnectionStatus('connected');
                    setSocketError(false);
                    setLastUpdate(new Date());
                    setReconnectAttempts(0);
                    // Join restaurant room
                    newSocket.emit('joinRoom', 'restaurant');
                });

                newSocket.on('connect_error', (err) => {
                    console.error('Socket connection error:', err.message);
                    console.error('Error details:', err);
                    setConnectionStatus('error');
                    setSocketError(true);
                    setReconnectAttempts(prev => prev + 1);
                });

                newSocket.on('disconnect', (reason) => {
                    console.log('Socket disconnected:', reason);
                    setConnectionStatus('disconnected');
                    
                    // Attempt to reconnect if not manually disconnected
                    if (reason !== 'io client disconnect') {
                        if (reconnectAttempts < 5) {
                            console.log(`Attempting to reconnect (${reconnectAttempts + 1}/5)...`);
                            reconnectTimer = setTimeout(() => {
                                initializeSocket();
                            }, 2000);
                        }
                    }
                });

                newSocket.on('reconnect', (attemptNumber) => {
                    console.log('Socket reconnected after', attemptNumber, 'attempts');
                    setConnectionStatus('connected');
                    setSocketError(false);
                });

                newSocket.on('reconnect_error', (err) => {
                    console.error('Socket reconnection error:', err);
                    setConnectionStatus('error');
                });

                newSocket.on('reconnect_failed', () => {
                    console.error('Socket reconnection failed');
                    setConnectionStatus('error');
                    setSocketError(true);
                });

                newSocket.on('error', (err) => {
                    console.error('Socket error:', err);
                    setConnectionStatus('error');
                });

                newSocket.on('newOrder', (data) => {
                    console.log('New order received:', data);
                    handleNewOrder(data);
                    setLastUpdate(new Date());
                });

                newSocket.on('orderUpdate', (data) => {
                    console.log('Order update received:', data);
                    handleOrderUpdate(data);
                    setLastUpdate(new Date());
                });

                newSocket.on('orderStatusChange', (data) => {
                    console.log('Order status change received:', data);
                    handleOrderStatusChange(data);
                    setLastUpdate(new Date());
                });

                setSocket(newSocket);
            } catch (err) {
                console.error('Socket initialization error:', err);
                console.error('Error stack:', err.stack);
                setConnectionStatus('error');
                setSocketError(true);
            }
        };

        initializeSocket();

        // Cleanup on unmount
        return () => {
            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
            }
            if (newSocket) {
                console.log('Cleaning up socket connection');
                newSocket.disconnect();
            }
        };
    }, []);

    // Fallback polling if socket connection fails
    useEffect(() => {
        let pollInterval;
        if (socketError) {
            // Poll every 30 seconds if socket connection fails
            pollInterval = setInterval(fetchOrders, 30000);
        }
        return () => {
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        };
    }, [socketError]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        if (!session?.user?.token) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${session.user.token}`
                }
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setOrders(data.data);
            } else {
                setError(data.message || "Failed to load orders");
            }
        } catch (err) {
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleNewOrder = (orderData) => {
        setOrders(prev => [orderData, ...prev]);
    };

    const handleOrderUpdate = (orderData) => {
        setOrders(prev => prev.map(order => 
            order.orderId === orderData.orderId ? orderData : order
        ));
    };

    const handleOrderStatusChange = (orderData) => {
        console.log('Order status change received:', orderData);
        setOrders(prev => prev.map(order => 
            order.orderId === orderData.orderId ? orderData : order
        ));
        setLastUpdate(new Date());
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!session?.user?.token) return;
        console.log('Updating order status:', { orderId, newStatus });
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session.user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderStatus: newStatus })
            });
            const data = await res.json();
            console.log('Status update response:', data);
            
            if (res.ok && data.success) {
                // Update local state immediately
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.orderId === orderId 
                            ? { ...order, orderStatus: newStatus }
                            : order
                    )
                );
                console.log('Order status updated successfully');
            } else {
                console.error('Failed to update status:', data.message);
                alert(data.message || 'Failed to update status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        }
    };

    const cancelOrder = async (orderId) => {
        if (!session?.user?.token) return;
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.user.token}`
                }
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || 'Failed to cancel order');
            }
        } catch (err) {
            alert('Failed to cancel order');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#FFA500',
            cooking: '#FF4500',
            completed: '#32CD32',
            cancelled: '#DC143C',
            paid: '#32CD32',
            failed: '#DC143C',
            refunded: '#FFA500'
        };
        return colors[status] || '#666';
    };

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.connectionStatus}>
                <div className={styles.statusIndicator}>
                    <span className={styles[connectionStatus]}></span>
                    Connection Status: <span className={styles[connectionStatus]}>{connectionStatus}</span>
                    {reconnectAttempts > 0 && (
                        <span className={styles.reconnectAttempts}>
                            (Attempt {reconnectAttempts}/5)
                        </span>
                    )}
                </div>
                {lastUpdate && (
                    <div className={styles.lastUpdate}>
                        Last Update: {lastUpdate.toLocaleTimeString()}
                    </div>
                )}
            </div>
            {socketError && (
                <div className={styles.socketWarning}>
                    Real-time updates are currently unavailable. Orders will be refreshed every 30 seconds.
                    <br />
                    Please check if the socket server is running at {process.env.NEXT_SOCKET_URL || 'http://localhost:5000'}
                </div>
            )}
            <div className={styles.ordersList}>
                {orders.map(order => (
                    <div key={order.orderId} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                            <h3>Order #{order.orderId}</h3>
                            <span className={styles.orderType}>{order.orderType}</span>
                            {order.tableNumber && (
                                <span className={styles.tableNumber}>Table {order.tableNumber}</span>
                            )}
                        </div>
                        
                        <div className={styles.customerInfo}>
                            <p><strong>Customer:</strong> {order.user.name}</p>
                            <p><strong>Phone:</strong> {order.user.phone}</p>
                            {order.orderType === 'delivery' && (
                                <p><strong>Address:</strong> {order.user.address}</p>
                            )}
                        </div>

                        <div className={styles.itemsList}>
                            {order.items.map((item, index) => (
                                <div key={index} className={styles.orderItem}>
                                    <span>{item.quantity}x {item.foodName}</span>
                                    <span>QR {item.totalPrice}</span>
                                </div>
                            ))}
                            <div className={styles.orderTotal}>
                                <strong>Total:</strong>QR {order.orderTotal}
                            </div>
                        </div>

                        <div className={styles.statusControls}>
                            <div className={styles.statusGroup}>
                                <label>Order Status:</label>
                                {order.orderStatus === 'completed' || order.orderStatus === 'cancelled' ? (
                                    <div 
                                        className={styles.orderStatus}
                                        style={{ color: getStatusColor(order.orderStatus) }}
                                    >
                                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                    </div>
                                ) : (
                                    <select 
                                        value={order.orderStatus}
                                        onChange={(e) => {
                                            console.log('Status change selected:', e.target.value);
                                            updateOrderStatus(order.orderId, e.target.value);
                                        }}
                                        style={{ color: getStatusColor(order.orderStatus) }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="cooking">Cooking</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                )}
                            </div>

                            <div className={styles.statusGroup}>
                                <label>Payment Status:</label>
                                <div className={styles.paymentStatus} style={{ color: getStatusColor(order.paymentStatus) }}>
                                    {order.paymentStatus}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
