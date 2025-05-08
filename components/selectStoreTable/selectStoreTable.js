'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./selectStoretable.module.css";
import { MdOutlineTableBar } from "react-icons/md";

const tables = [
  { no: 1 },
  { no: 2 },
  { no: 3 },
  { no: 4 },
  { no: 5 },
  { no: 6 },
  { no: 7 },
  { no: 8 },
  { no: 9 },
  { no: 10 },
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
          className={`${styles.orderBtn} ${orderType === 'DineIn' ? styles.active : ''}`}
          onClick={() => handleOrderTypeSelect('dinein')}
        >
          Dine In
        </button>
        <button
          className={`${styles.orderBtn} ${orderType === 'Takeaway' ? styles.active : ''}`}
          onClick={() => handleOrderTypeSelect('takeaway')}
        >
          Takeaway
        </button>
      </div>

      <div className={styles.tableItems}>
        {tables.map((table) => (
          <div
            key={table.no}
            className={styles.tableItem}
            onClick={() => handleTableSelect(table.no)}
          >
            <MdOutlineTableBar size={50} />
            <h3>Table {table.no}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
