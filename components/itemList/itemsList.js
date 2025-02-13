"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import QuantitySelector from "@/components/quantitySelector/quantitySelector";
import { CiBoxList, CiGrid2H } from "react-icons/ci";

const categories = [
  "Breakfast",
  "Hot Drinks",
  "Cold Drinks",
  "All Day Dishes",
  "Salads",
  "Desserts",
  "Ice Creams",
];

export default function Items() {
  const [foodItems, setFoodItems] = useState([]);
  const [isGridView, setIsGridView] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/items.json");
        const data = await response.json();
        setFoodItems(data);
      } catch (error) {
        console.error("Error fetching the data:", error);
      }
    };

    fetchData();
  }, []);

  const handleQuantityChange = (item, quantity) => {
    if (quantity > 0) {
      dispatch(addToCart({ ...item, quantity }));
    } else {
      dispatch(removeFromCart(item.foodSlug));
    }
  };

  return (
    <div className="Items-List w-100 flex col g-20">
      <div className="list-header flex space-between">
        <div className="categorey-title">Menu</div>
        <div className="flex change-view">
          <button onClick={() => setIsGridView(true)}>
            <CiGrid2H />
          </button>
          <button onClick={() => setIsGridView(false)}>
            <CiBoxList />
          </button>
        </div>
      </div>

      {categories.map((category) => (
        <div key={category} id={category.toLowerCase().replace(/\s/g, "-")}>
          <div className="categorey-title">{category}</div>
          <div className={`food-items flex ${isGridView ? "grid" : "col"}`}>
            {foodItems.map((item) => (
              <div className={`item ${isGridView ? "grid-view" : "list"}`} key={item.foodSlug}>
                <div className="item-image flex">
                  <img src={item.featureImage} alt={item.foodName} />
                </div>
                <div className="item-details">
                  <h3>{item.foodName}</h3>
                  <div className="flex space-between">
                    <div className="item-price">QAR {item.foodPrice.toFixed(2)}</div>
                    <QuantitySelector
                      quantity={cart[item.foodSlug]?.quantity || 0}
                      onQuantityChange={(qty) => handleQuantityChange(item, qty)}
                    />
                  </div>
                  <p>{item.foodDescription}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
