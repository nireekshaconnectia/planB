import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./selectStoretable.module.css";
import { HiBuildingStorefront } from "react-icons/hi2";
import { IoArrowBack } from "react-icons/io5"; // Back icon
import { MdTableBar } from "react-icons/md";

const stores = [
  { id: 24, name: "Main Store", address: "123 Market St" },
  { id: 25, name: "Downtown Store", address: "456 Central Ave" },
];

const tables = [
  { no: 7, image: "/table7.jpg" },
  { no: 8, image: "/table8.jpg" },
];

export default function SelectTableStore({ storeId, tableNo }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
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

  const goBack = () => {
    setSelectedStore(null); // Reset selected store
  };

  return (
    open && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          {selectedStore ? (
            <div className={styles.tableList}>
              <button className={styles.backButton} onClick={goBack}>
                <IoArrowBack /> Back
              </button>
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
          ) : (
            <div className={styles.storeList}>
              <h2 className={styles.title}>Select Store</h2>
              <div className="flex g-20 space-between">
                {stores.map((store) => (
                  <div
                    className={styles.store}
                    key={store.id}
                    onClick={() => handleStoreSelect(store)}
                  >
                    <HiBuildingStorefront />
                    <h3>{store.name}</h3>

                    <p>{store.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
