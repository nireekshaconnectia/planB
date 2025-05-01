'use client';
import { useState, useEffect } from 'react';
import styles from './user.module.css';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Sample effect to simulate fetching order history (replace with actual API call)
  useEffect(() => {
    // In a real app, fetch orders from API here using user token
    const sampleOrders = [
      {
        id: '12345',
        date: '2025-03-15',
        totalAmount: '$250.00',
        items: [
          { name: 'Product A', quantity: 1, price: '$100' },
          { name: 'Product B', quantity: 2, price: '$75' },
        ],
      },
      {
        id: '12346',
        date: '2025-03-14',
        totalAmount: '$180.00',
        items: [
          { name: 'Product C', quantity: 1, price: '$180' },
        ],
      },
      {
        id: '12347',
        date: '2025-03-10',
        totalAmount: '$320.00',
        items: [
          { name: 'Product D', quantity: 2, price: '$160' },
        ],
      },
    ];

    setOrders(sampleOrders);
  }, []);

  const toggleDetails = (id) => {
    setSelectedOrderId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className={styles.orderHistoryPage}>
      <h2 className={styles.sectionTitle}>Order History</h2>

      <div className={styles.orderHistoryDetails}>
        {orders.map((order) => (
          <div className={styles.orderItem} key={order.id}>
            <div>
              <div className={styles.label}>Order ID</div>
              <p>{order.id}</p>
            </div>
            <div>
              <div className={styles.label}>Date</div>
              <p>{order.date}</p>
            </div>
            <div>
              <div className={styles.label}>Total Amount</div>
              <p>{order.totalAmount}</p>
            </div>

            <button
              className={styles.editBtn}
              onClick={() => toggleDetails(order.id)}
            >
              {selectedOrderId === order.id ? 'Hide Details' : 'View Details'}
            </button>

            {/* Show order details if selected */}
            {selectedOrderId === order.id && (
              <div className={styles.orderDetails}>
                <h4>Items</h4>
                {order.items.map((item, index) => (
                  <div key={index} className={styles.orderItemRow}>
                    <p>{item.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: {item.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
