"use client";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import QuantitySelector from "@/components/quantitySelector/quantitySelector";
import styles from "./item.module.css";
import BackButton from "@/components/backbutton/backbutton";
import { useApiData } from "@/lib/hooks/useApiData";

export default function Item({ itemId }) {
  const dispatch = useDispatch();
  const { menu: foodItems, loading, error } = useApiData();
  const cart = useSelector((state) => state.cart.items);

  const currentItem = foodItems.find((item) => item.slug === itemId);

  const handleQuantityChange = (item, quantity) => {
    if (quantity === 0) {
      dispatch(removeFromCart(item.slug));
    } else {
      dispatch(addToCart({ ...item, quantity }));
    }
  };

  if (loading) {
    return (
      <div className={styles.itemContainer}>
        <BackButton />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.itemContainer}>
        <BackButton />
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className={styles.itemContainer}>
        <BackButton />
        <div className="error">Item not found</div>
      </div>
    );
  }

  const cartItem = cart[currentItem.slug];

  return (
    <div className={styles.itemContainer}>
      <BackButton />
      <div className="item grid-view" style={{marginTop: "20px"}}>
        <div className="item-image">
          <Image
            src={currentItem.image || "/placeholder-image.png"}
            alt={currentItem.name}
            width={560}
            height={350}
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        <div className="item-details">
          <h3>{currentItem.name}</h3>
          <p className={styles.description}>{currentItem.description}</p>

          <div className="flex space-between">
            <div className="item-price">
              QAR {currentItem.price?.toFixed(2) || "0.00"}
            </div>
            <QuantitySelector
              quantity={cartItem?.quantity || 0}
              onQuantityChange={(qty) => handleQuantityChange(currentItem, qty)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
