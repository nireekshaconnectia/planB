"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./selectStoretable.module.css";

export default function SelectTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tableNo, setTableNo] = useState(null);

  // ✅ Get cafeTable from localStorage (with expiry check)
  useEffect(() => {
    const stored = localStorage.getItem("cafeTableData");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
      const isValid = parsed?.value && Date.now() - parsed.timestamp < SIX_HOURS_MS;

      if (isValid) {
        setTableNo(parsed.value);
      }
    } catch {
      // Ignore errors
    }
  }, []);

  const handleOrderTypeSelect = (type) => {
    if (!tableNo) {
      alert("Table number not found. Please scan the QR again.");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("orderType", type);
    params.set("table", tableNo);
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className={styles.tableList}>
      <h2>Select your order type</h2>

      <div className={styles.orderTypeBtns}>
        <button
          className={styles.orderBtn}
          onClick={() => handleOrderTypeSelect("Dine In")}
        >
          Dine In
        </button>
        <button
          className={styles.orderBtn}
          onClick={() => handleOrderTypeSelect("takeaway")}
        >
          Takeaway
        </button>
      </div>
    </div>
  );
}
