'use client';
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

  const handleTableSelect = (tableNo) => {
    const params = new URLSearchParams(searchParams);
    params.set('table', tableNo); // update "table" param
    router.push(`/checkout?${params.toString()}`); // stay on checkout page but with param added
  };

  return (
    <div className={styles.tableList}>
      <h2>Select a Table</h2>
      <div className="flex g-20">
        {tables.map((table) => (
          <div key={table.no} className={styles.tableItem} onClick={() => handleTableSelect(table.no)}>
            <MdTableBar size={32} />
            <h3>Table {table.no}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
