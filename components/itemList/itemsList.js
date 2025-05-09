"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import QuantitySelector from "@/components/quantitySelector/quantitySelector";
import SkeletonItems from "@/components/skeleton/SkeletonItems"; // ← Make sure this is the correct path
import { CiBoxList, CiGrid2H } from "react-icons/ci";
import Image from 'next/image';


export default function Items() {
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isGridView, setIsGridView] = useState(false);
  const [loading, setLoading] = useState(true); // ← loading state
  const [error, setError] = useState(null);     // ← error state

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchCategoriesAndItems = async () => {
      try {
        setLoading(true);
        const [categoryResponse, menuResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`),
        ]);

        if (!categoryResponse.ok || !menuResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoryResult = await categoryResponse.json();
        const menuResult = await menuResponse.json();

        if (
          categoryResult?.data?.categories?.length > 0 &&
          menuResult?.data?.length > 0
        ) {
          setCategories(categoryResult.data.categories);
          setFoodItems(menuResult.data);
        } else {
          setCategories([]);
          setFoodItems([]);
        }
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndItems();
  }, []);

  const handleQuantityChange = (item, quantity) => {
    if (quantity > 0) {
      dispatch(addToCart({ ...item, quantity }));
    } else {
      dispatch(removeFromCart(item.foodSlug));
    }
  };

  // ✅ SHOW skeleton while loading / error / empty
  if (loading || error || categories.length === 0 || foodItems.length === 0) {
    return <SkeletonItems />;
  }

  // ✅ Main Render if everything loaded successfully
  return (
    <div className="Items-List w-100 flex col g-20">
      <div className="list-header flex space-between">
        <div className="category-title">Menu</div>
        <div className="flex change-view">
          <button onClick={() => setIsGridView(true)}>
            <CiGrid2H />
          </button>
          <button onClick={() => setIsGridView(false)}>
            <CiBoxList />
          </button>
        </div>
      </div>

      {categories.map((category) => {
        const filteredItems = foodItems.filter(
          (item) =>
            item.foodCategory?.toLowerCase() === category.name?.toLowerCase()
        );

        return (
          <div key={category.slug} id={category.slug} className="category-section">
            <div className="category-title">{category.name}</div>

            {filteredItems.length > 0 ? (
              <div className={`food-items flex ${isGridView ? "grid" : "col"}`}>
                {filteredItems.map((item) => (
                  <div
                    className={`item ${isGridView ? "grid-view" : "list"}`}
                    key={item.foodSlug}
                  >
                    <div className="item-image flex">
                      <Image src={item.featureImage} alt={item.foodName} width={100} height={100}/>
                    </div>
                    <div className="item-details">
                      <h3>{item.foodName}</h3>
                      <div className="flex space-between">
                        <div className="item-price">
                          QAR {item.foodPrice?.toFixed(2) || "0.00"}
                        </div>
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
            ) : (
              <p>No items found for this category</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
