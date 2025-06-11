"use client";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import {
  setMenuData,
  setCategoriesData,
  setLoading,
  setError,
} from "@/store/apiSlice";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import QuantitySelector from "@/components/quantitySelector/quantitySelector";
import styles from "./item.module.css";
import BackButton from "@/components/backbutton/backbutton";
export default function Item({ itemId }) {
const dispatch = useDispatch();

  const {
    menu: foodItems,
    loading,
    error,
  } = useSelector((state) => state.apiData);
  const cart = useSelector((state) => state.cart.items);
  const lang = useSelector((state) => state.language.lang);
  

  const loadMenuItems = useCallback(async () => {
    if (foodItems.length === 0 && !loading) {
      try {
        dispatch(setLoading(true));

        const headers = lang === "ar" ? { "Accept-Language": lang } : {};

        const [categoryResponse, menuResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, { headers }),
        ]);

        if (!categoryResponse.ok || !menuResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoryResult = await categoryResponse.json();
        const menuResult = await menuResponse.json();

        if (categoryResult?.data?.categories?.length > 0) {
          dispatch(setCategoriesData(categoryResult.data.categories));
        }

        if (menuResult?.data?.length > 0) {
          dispatch(setMenuData(menuResult.data));
        }
      } catch (err) {
        dispatch(setError(err.message || "Unknown error"));
      } finally {
        dispatch(setLoading(false));
      }
    }
  }, [dispatch, foodItems.length, loading, lang]);

  useEffect(() => {
    loadMenuItems();
  }, [loadMenuItems]);

  const item = foodItems.find(
    (item) => item._id === itemId || item.id === itemId || item.slug === itemId
  );

  const cartItem = cart[item?.slug];

  const handleQuantityChange = (item, quantity) => {
    if (!item?.price || isNaN(Number(item.price))) {
      console.error("Invalid price for item:", item);
      return;
    }

    if (quantity > 0) {
      dispatch(
        addToCart({
          slug: item.slug,
          name: item.name,
          price: Number(item.price),
          quantity,
          image: item.image,
          description: item.description,
          categories: item.categories,
        })
      );
    } else {
      dispatch(removeFromCart(item.slug));
    }
  };

  if (loading) return <div className="item loading">Loading menu items...</div>;
  if (error) return <div className="item error">Error: {error}</div>;
  if (foodItems.length === 0)
    return (
      <div className="item error">
        <p>No menu items found in store.</p>
      </div>
    );
  if (!item)
    return (
      <div className="item not-found flex flex-col items-center justify-center" style={{ height: "100vh", color: "#1a1a1a" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "500" }}>404</h1>
        <p>Item not found.</p>
      </div>
    );

  return (
    <div className={styles.itemContainer}>
    <BackButton />
    <div className="item grid-view" style={{marginTop: "20px"}}>
      <div className="item-image">
        <Image
          src={item.image || "/placeholder-image.png"}
          alt={item.name}
          width={560}
          height={350}
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <div className="item-details">
        <h3>{item.name}</h3>
        <p className={styles.description}>{item.description}</p>

        <div className="flex space-between">
          <div className="item-price">
            QAR {item.price?.toFixed(2) || "0.00"}
          </div>
          <QuantitySelector
            quantity={cartItem?.quantity || 0}
            onQuantityChange={(qty) => handleQuantityChange(item, qty)}
          />
        </div>

        {/* {item.nutritionalInfo && (
          <div className="nutritional-info">
            <h4>Nutritional Information</h4>
            <ul>
              <li>Calories: {item.nutritionalInfo.calories || 0}</li>
              <li>Protein: {item.nutritionalInfo.protein || 0}g</li>
              <li>Carbs: {item.nutritionalInfo.carbs || 0}g</li>
              <li>Fat: {item.nutritionalInfo.fat || 0}g</li>
            </ul>
          </div>
        )}

        {item.preparationTime && (
          <div className="preparation-time">
            Preparation Time: {item.preparationTime} minutes
          </div>
        )}

        {item.ingredients?.length > 0 && (
          <div className="ingredients">
            <h4>Ingredients</h4>
            <ul>
              {item.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </div>
    </div>
  );
}
