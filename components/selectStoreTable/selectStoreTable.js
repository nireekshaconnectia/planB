import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SelectStoreTable.module.css";

const stores = [
  { id: 24, name: "Main Store", address: "123 Market St" },
  { id: 25, name: "Downtown Store", address: "456 Central Ave" }
];

const tables = [
  { no: 7, image: "/table7.jpg" },
  { no: 8, image: "/table8.jpg" }
];

export default function SelectTableStore({ storeId, tableNo }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    console.log("storeId:", storeId, "tableNo:", tableNo);
    if (!storeId || !tableNo) {
      setOpen(true);
    }
  }, [storeId, tableNo]);

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
  };

  const handleTableSelect = (table) => {
    if (!selectedStore) return;
    setSelectedTable(table);
    router.push(`/?storeId=${selectedStore.id}&tableNo=${table.no}`);
    setOpen(false);
  };

  return (
    open && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Select Store & Table</h2>
          {!selectedStore ? (
            <div className={styles.storeList}>
              {stores.map((store) => (
                <button key={store.id} onClick={() => handleStoreSelect(store)} className={styles.storeButton}>
                  {store.name} - {store.address}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.tableList}>
              {tables.map((table) => (
                <div key={table.no} className={styles.tableItem}>
                  <img src={table.image} alt={`Table ${table.no}`} className={styles.tableImage} />
                  <button onClick={() => handleTableSelect(table)} className={styles.tableButton}>Table {table.no}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  );
}
