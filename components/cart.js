"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart , removeFromCart } from "@/store/cartSlice";
import QuantitySelector from "@/components/quantitySelector/quantitySelector";
import { CiShoppingCart } from "react-icons/ci";
import Backdrop from "@/components/backdrop/backdrop"; // Import Backdrop component

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  // Calculate total price
  const totalPrice = Object.values(cartItems).reduce((acc, item) => acc + item.foodPrice * item.quantity, 0).toFixed(2);

  return (
    <>
    
      <div className={`popup-container ${isOpen ? "popup-open" : "popup-closed"}`}>
        <div className="popup-header">
          <h3>Your Cart</h3>
          <button onClick={() => setIsOpen(false)}>
            <CiShoppingCart />
          </button>
        </div>
        
        <div className="popup-content flex col g-20">
          {Object.keys(cartItems).length > 0 ? (
            Object.values(cartItems).map((item) => (
              <div className="cart-item" key={item.foodSlug}>
                <div className="flex space-between">
                  <div className="cart-item-name">
                    <h4>{item.foodName}</h4>
                  </div>
                  <div className="cart-item-quantity">x {item.quantity}</div>
                  <div className="cart-item-price">QAR {item.foodPrice.toFixed(2)}</div>
                  <QuantitySelector
                    quantity={item.quantity}
                    onQuantityChange={(qty) => {
                      if (qty === 0) {
                        dispatch(removeFromCart(item.foodSlug));
                      } else {
                        dispatch(addToCart({ ...item, quantity: qty }));
                      }
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
          <h4>Total Price: QAR {totalPrice}</h4>
        </div>
      </div>

      {!isOpen && Object.keys(cartItems).length > 0 && (
        <div className="cart-preview" onClick={() => setIsOpen(true)}>
          <div className="flex">
            <div className="total-items flex g-20">
              <h4>Items in cart :</h4>
              <p>{Object.keys(cartItems).length}</p>
            </div>
            <p>Total: QAR {totalPrice}</p>
          </div>
          <button className="show-popup-btn" onClick={() => setIsOpen(true)}>
            <CiShoppingCart />
          </button>
        </div>
      )}
    </>
  );
}
