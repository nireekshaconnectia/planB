'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./selectStoretable.module.css";
import { MdTableBar } from "react-icons/md";

const tables = [
  { no: 7 },
  { no: 8 },
];

export default function SelectTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderType, setOrderType] = useState(null);

  const handleOrderTypeSelect = (type) => {
    setOrderType(type);
  };

  const handleTableSelect = (tableNo) => {
    if (!orderType) {
      alert("Please select Dine In or Takeaway first.");
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.set('orderType', orderType);
    params.set('table', tableNo);
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className={styles.tableList}>
      <h2>Select your order type and table</h2>

      <div className={styles.orderTypeBtns}>
        <button
          className={`${styles.orderBtn} ${orderType === 'dinein' ? styles.active : ''}`}
          onClick={() => handleOrderTypeSelect('dinein')}
        >
          Dine In
        </button>
        <button
          className={`${styles.orderBtn} ${orderType === 'takeaway' ? styles.active : ''}`}
          onClick={() => handleOrderTypeSelect('takeaway')}
        >
          Takeaway
        </button>
      </div>

      <div className="flex g-20" style={{ marginTop: "20px" }}>
        {tables.map((table) => (
          <div
            key={table.no}
            className={styles.tableItem}
            onClick={() => handleTableSelect(table.no)}
          >
            <MdTableBar size={32} />
            <h3>Table {table.no}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
