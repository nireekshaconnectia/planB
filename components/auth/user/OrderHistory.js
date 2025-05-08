'use client';
import { useState, useEffect } from 'react';
import styles from './user.module.css';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]); // Ensure default value is an empty array
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const userToken = localStorage.getItem('userToken'); // Get the token from localStorage (replace as needed)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      console.log('API Response Data:', data); // Log the response data to check the structure

      // Now we access the orders from `data.data` instead of `data.orders`
      if (data && Array.isArray(data.data)) {
        setOrders(data.data); // Set orders to the fetched data
      } else {
        setOrders([]); // Set orders to an empty array if data format is incorrect
        throw new Error('Invalid data format');
      }
    } catch (error) {
      setError(error.message);
      setOrders([]); // Ensure orders is set to empty array on error
    } finally {
      setLoading(false); // Set loading state to false after data fetching
    }
  };

  // Fetch orders only once when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []); // Empty dependency array ensures it only runs once

  const toggleDetails = (id) => {
    setSelectedOrderId((prevId) => (prevId === id ? null : id));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.orderHistoryPage}>
      <div className={styles.orderHistoryDetails}>
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div className={styles.orderItem} key={order._id}>
              <div>
                <div className={styles.label}>Order ID</div>
                <p>{order.orderId}</p>
              </div>
              <div>
                <div className={styles.label}>Date</div>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <div className={styles.label}>Total Amount</div>
                <p>{order.orderTotal} QAR</p>
              </div>

              <button
                className={styles.editBtn}
                onClick={() => toggleDetails(order._id)}
              >
                {selectedOrderId === order._id ? 'Hide Details' : 'View Details'}
              </button>

              {/* Show order details if selected */}
              {selectedOrderId === order._id && (
                <div className={styles.orderDetails}>
                  <h4>Items</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className={styles.orderItemRow}>
                      <p>{item.foodName}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: {item.foodPrice}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div>No orders found.</div>
        )}
      </div>
    </div>
  );
}
