"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./selectStoretable.module.css";
import { MdOutlineTableBar } from "react-icons/md";

const tables = Array.from({ length: 10 }, (_, i) => ({ no: i + 1 }));

export default function SelectTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderType, setOrderType] = useState(null);

  const handleOrderTypeSelect = (type) => {
    setOrderType(type);

    if (type === "takeaway") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("orderType", type);
      router.push(`/checkout?${params.toString()}`);
    }
  };

  const handleTableSelect = (tableNo) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("orderType", "Dine In");
    params.set("table", tableNo);
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className={styles.tableList}>
      <h2>Select your order type and table</h2>

      <div className={styles.orderTypeBtns}>
        <button
          className={`${styles.orderBtn} ${orderType === "Dine In" ? styles.active : ""}`}
          onClick={() => handleOrderTypeSelect("Dine In")}
        >
          Dine In
        </button>
        <button
          className={`${styles.orderBtn} ${orderType === "takeaway" ? styles.active : ""}`}
          onClick={() => handleOrderTypeSelect("takeaway")}
        >
          Takeaway
        </button>
      </div>

      {orderType === "Dine In" && (
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
      )}
    </div>
  );
}
