'use client';
import {react , useState} from 'react';
import Lottie from "lottie-react"; // Import Lottie
import styles from './paymentSuccess.module.css'; // Custom CSS
import paymentSuccess from '@/assets/images/payment-success.json'; // Image for success
import Receipt from '@/components/checkout/reciept/receipt';
import GuestInfoForm from '../forms/UserForms/GuestInfoForm';

const PaymentSuccess = ({orderData}) => {
  const [showGPopup, setShowGPopup] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
        <Lottie animationData={paymentSuccess} loop={true}/>
        </div>
        
        <h2 className={styles.successTitle}>🎉 Payment Successful!</h2>
        <Receipt order={orderData}/>
        <p className={styles.message}>
          Your order has been placed successfully. We are processing your Order and will notify you shortly.
          for any further assistance, please contact us at <a href="tel:+97430187770">+97 430187770</a>
        </p>
        <GuestInfoForm showGiPopup={showGPopup} closeGiPopup={() => setShowGPopup(false)}/>
      </div>
    </div>
  );
};

export default PaymentSuccess;
