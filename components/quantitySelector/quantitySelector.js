import React from "react";
import styles from "./quantitySelector.module.css";

export default function QuantitySelector({ quantity, onQuantityChange }) {
  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className={styles.quantitySelector}>
      <button onClick={handleDecrease} className={styles.decreaseBtn}>-</button>
      <input
        type="number"
        value={quantity}
        min="0"
        onChange={(e) => onQuantityChange(Number(e.target.value))}
        className={styles.input}
      />
      <button onClick={handleIncrease} className={styles.increaseBtn}>+</button>
    </div>
  );
}
