"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { addToCart , removeFromCart } from "@/store/cartSlice";
import QuantitySelector from "@/components/quantitySelector/quantitySelector";
import { CiShoppingCart } from "react-icons/ci";
import Backdrop from "@/components/backdrop/backdrop"; // Import Backdrop component
import { useTranslations } from "next-intl";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations(); // Initialize translations

  // Debug logging
  useEffect(() => {
    console.log('Current cart items:', cartItems);
    Object.entries(cartItems).forEach(([slug, item]) => {
      console.log(`Item ${slug}:`, item);
      console.log(`Price for ${slug}:`, item.price, typeof item.price);
    });
  }, [cartItems]);

  // Calculate total price
  const totalPrice = Object.values(cartItems).reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0).toFixed(2);

  return (
    <>
    
      <div className={` ${isOpen ? "popup-open" : "popup-closed"}`}>
      {isOpen && <Backdrop onClick={() => setIsOpen(false)} />}
      <div className="popup-container">
        <div className="popup-header">
          <h3>{t("your-cart")}</h3>
          <button onClick={() => setIsOpen(false)}>
            <CiShoppingCart />
          </button>
        </div>
        
        <div className="popup-content flex col g-20">
          {Object.keys(cartItems).length > 0 ? (
            Object.values(cartItems).map((item) => (
              <div className="cart-item" key={item.slug}>
                <div className="flex space-between g-20 ">
                  <div className="cart-item-name">
                    <h4>{item.name}</h4>
                  </div>
                  <div className="cart-item-quantity">x {item.quantity}</div>
                  <div className="cart-item-price">QAR {(item.price || 0).toFixed(2)}</div>
                  <QuantitySelector
                    quantity={item.quantity}
                    onQuantityChange={(qty) => {
                      if (qty === 0) {
                        dispatch(removeFromCart(item.slug));
                      } else {
                        dispatch(addToCart({ ...item, quantity: qty }));
                      }
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>{t("cart-is-empty")}.</p>
          )}
          <div className="cart-checkout">
              <h4>{t("total-price")}: QAR {totalPrice}</h4>
              <div>
                <button
                  className="checkout-btn"
                  onClick={() => router.push("/checkout")}
                >
                  {t("checkout")}
                </button>
              </div>
            </div>
          
        </div>
        </div>
      </div>

      {!isOpen && Object.keys(cartItems).length > 0 && (
        <div className="cart-preview" onClick={() => setIsOpen(true)}>
          <div className="flex">
            <div className="total-items flex g-20">
              <h4>{t("items-in-cart")} :</h4>
              <p>{Object.keys(cartItems).length}</p>
            </div>
            <p>{t("total")}: QAR {totalPrice}</p>
          </div>
          <button className="show-popup-btn" onClick={() => setIsOpen(true)}>
            <CiShoppingCart />
          </button>
        </div>
      )}
    </>
  );
}
