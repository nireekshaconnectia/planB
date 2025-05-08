import React from 'react';
import Lottie from "lottie-react"; // Import Lottie
import styles from './paymentSuccess.module.css'; // Custom CSS
import paymentSuccess from '@/assets/images/payment-success.json'; // Image for success

const PaymentSuccess = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
      
        <div className={styles.icon}>
        <Lottie animationData={paymentSuccess} loop={true}/>
        </div>

        <h2 className={styles.successTitle}>🎉 Payment Successful!</h2>
        <p className={styles.message}>
          Your order has been placed successfully. We are processing your payment and will notify you shortly.
        </p>

        <div className={styles.buttons}>
          <button className={styles.button} onClick={() => window.location.href = '/'}>
            Go to Home
          </button>
          <button className={styles.button} onClick={() => window.location.href = '/orders'}>
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
