import React, { useState } from 'react';
import styles from "./quantitySelector.module.css";

export default function QuantitySelector() {
    const [quantity, setQuantity] = useState(1); // Default quantity is 1

    // Function to increase the quantity
    const handleIncrease = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    // Function to decrease the quantity
    const handleDecrease = () => {
        if (quantity > 1) { // Prevent the quantity from going below 1
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };

    return (
        <div className={styles.quantitySelector}>
            <button onClick={handleDecrease} className={styles.decreaseBtn}>-</button>
            <input
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))} // Allow direct input changes
                className={styles.input}
            />
            <button onClick={handleIncrease} className={styles.increaseBtn}>+</button>
        </div>
    );
};
