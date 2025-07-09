import React, { useRef } from "react";
import styles from "./Receipt.module.css";
import { toPng } from "html-to-image";
import { IoMdDownload } from "react-icons/io";
import { IoIosHome } from "react-icons/io";
import {Link} from "next/link";

const Receipt = ({ order }) => {
  const receiptRef = useRef();

  if (!order) return null;

  const handleDownload = async () => {
    if (!receiptRef.current) return;

    try {
      const dataUrl = await toPng(receiptRef.current, {
        style: {
          fontFamily: "Arial, sans-serif",
        },
        skipFonts: true,
      });

      const link = document.createElement("a");
      link.download = `receipt-${order.orderId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receiptContainer} ref={receiptRef}>
        <h2 className={styles.title}>Payment Receipt</h2>

        <div className={styles.section}>
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <p>
            <strong>Status:</strong> {order.status || "Paid"}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod || "SkipCash"}
          </p>
          <p>
            <strong>Paid On:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className={styles.section}>
          <h3>Items</h3>
          <ul className={styles.itemList}>
            {order.items?.map((item, index) => (
              <li key={index} className={styles.receiptItem}>
                <span>{item.foodName}</span>
                <span>
                  QAR-{Number(item.foodPrice).toFixed(2)} × {item.quantity} =
                  QAR-{Number(item.totalPrice).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.total}>
          <p>
            <strong>Total:</strong> QAR {order.orderTotal}
          </p>

          <button className={styles.downloadButton} onClick={handleDownload}>
            <IoMdDownload />
          </button>
        </div>
        <div className={styles.addtional}><p>Continue at <a href="https://www.planbqa.shop/" target="_blank">planbcafe.qa</a></p></div>
      </div>
    </div>
  );
};

export default Receipt;
