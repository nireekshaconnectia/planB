'use client';
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import QuantitySelector from "@/components/quantitySelector/quantitySelector";
import styles from "./CartCheckoutForm.module.css";
import ConfirmOrder from "./confirm-order/confirmOrder";

export default function CartCheckoutForm() {
  const searchParams = useSearchParams();
  const tableNo = searchParams.get("table");

  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const totalPrice = Object.values(cartItems).reduce((acc, item) => acc + item.foodPrice * item.quantity, 0).toFixed(2);

  return (
    <div className={styles.checkoutForm}>
      <h2>Checkout for Table {tableNo}</h2>

      {Object.keys(cartItems).length > 0 ? (
        <div>
          {Object.values(cartItems).map((item) => (
            <div className="cart-item" key={item.foodSlug}>
              <div className="flex space-between g-20">
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
          ))}
          <div className={styles.total}>
            <h3>Total: QAR {totalPrice}</h3>
            <ConfirmOrder />
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
