import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./selectStoretable.module.css";
import { MdTableBar } from "react-icons/md";

const tables = [
  { no: 7, image: "/table7.jpg" },
  { no: 8, image: "/table8.jpg" },
];

export default function SelectTable({ tableNo }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleTableSelect = (table) => {
    router.push(`/?tableNo=${table.no}`);
    setOpen(false);
  };

  return (
    open && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Select Table</h2>
          <div className="flex g-20 space-between">
            {tables.map((table) => (
              <div key={table.no} className={styles.tableItem} onClick={() => handleTableSelect(table)}>
                <MdTableBar />
                <h3>Table {table.no}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
}
