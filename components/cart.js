"use client";
import { useState, useEffect } from "react";
import QuantitySelector from "./quantitySelector/quantitySelector";
import { FaRegSmileBeam, FaRegSmileWink } from "react-icons/fa";
export default function Cart() {
  const [isOpen, setIsOpen] = useState(false); // Controls popup open state
  const [cartItems, setCartItems] = useState([]); // Cart items state
  const [totalPrice, setTotalPrice] = useState(0); // Total price

  // Sample cart items (this can be dynamic data)
  const sampleItems = [
    { id: 1, name: "Item 1", price: 10.99, quantity: 2 },
    { id: 2, name: "Item 2", price: 20.11, quantity: 1 },
    { id: 3, name: "Item 3", price: 5.5, quantity: 3 },
  ];

  // Function to fetch cart data (this can be dynamic from API or state management)
  const fetchCartData = async () => {
    try {
      const cartData = sampleItems;
      setCartItems(cartData);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // Calculate total price based on cart items
  const calculateTotalPrice = () => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total.toFixed(2)); // Keep 2 decimal places
  };

  // Fetch cart data and calculate total price on component mount
  useEffect(() => {
    fetchCartData();
  }, []);

  // Recalculate total price every time cart items change
  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  return (
    <>
      {/* Full popup container */}
      <div
        className={`popup-container ${isOpen ? "popup-open" : "popup-closed"}`}
      >
        <div className="popup-header">
          <h3>Your Cart</h3>
          <button onClick={() => setIsOpen(false)}>
            <FaRegSmileWink />
          </button>
        </div>
        <div className="popup-content flex col g-20">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="flex space-between">
                  <div className="cart-item-name">
                    <h4>{item.name}</h4>
                  </div>
                  <div className="cart-item-quantity">x {item.quantity}</div>
                  <div className="cart-item-price">QAR {item.price}</div>
                  <div className="cart-item-total">QAR {item.price}</div>
                </div>
                <QuantitySelector />
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
          <h4>Total Price: ${totalPrice}</h4>
        </div>
      </div>

      {/* Bottom minimized preview when popup is closed and cart is not empty */}
      {!isOpen && cartItems.length > 0 && (
        <div className="cart-preview" onClick={() => setIsOpen(true)}>
          <div className="flex">
            <div className="total-items flex g-20">
              <h4>Items in cart :</h4>
              <p>{cartItems.length}</p>
            </div>
            <p>Total: QAR {totalPrice}</p>
          </div>

          {/* Button to open popup */}
          {cartItems.length > 0 && (
            <button className="show-popup-btn" onClick={() => setIsOpen(true)}>
              <FaRegSmileBeam />
            </button>
          )}
        </div>
      )}
    </>
  );
}
