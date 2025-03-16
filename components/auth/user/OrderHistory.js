'use client';
import { useState } from 'react';
import styles from './user.module.css';

export default function OrderHistory() {
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState([
    {
      id: '12345',
      date: '2025-03-15',
      totalAmount: '$250.00',
    },
    {
      id: '12346',
      date: '2025-03-14',
      totalAmount: '$180.00',
    },
    {
      id: '12347',
      date: '2025-03-10',
      totalAmount: '$320.00',
    },
  ]);

  const toggleEdit = (id) => {
    setEditing((prev) => !prev); // Toggle edit for the current order
  };

  const handleSave = (id) => {
    // Save logic here (API call etc.)
    setEditing(false);
  };

  return (
    <div className={styles.orderHistoryPage}>
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
              onClick={() => toggleEdit(order.id)}
            >
              {editing ? 'Save' : 'View Details'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
