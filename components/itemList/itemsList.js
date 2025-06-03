"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import { setMenuData, setCategoriesData, setLoading, setError } from "@/store/apiSlice";
import QuantitySelector from "@/components/quantitySelector/quantitySelector";
import SkeletonItems from "@/components/skeleton/SkeletonItems";
import { CiBoxList, CiGrid2H } from "react-icons/ci";
import Styles from "./itemslist.module.css";
import Image from 'next/image';

export default function Items() {
  const [isGridView, setIsGridView] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const { menu: foodItems, categories, loading, error } = useSelector((state) => state.apiData);
  const lang = useSelector((state) => state.language.lang);

  useEffect(() => {
    const fetchCategoriesAndItems = async () => {
      try {
        dispatch(setLoading(true));
        
        // Only add language header for Arabic
        const headers = lang === 'ar' ? {
          'Accept-Language': lang
        } : {};

        console.log('Fetching with language:', lang);

        const [categoryResponse, menuResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, { headers }),
        ]);

        if (!categoryResponse.ok || !menuResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoryResult = await categoryResponse.json();
        const menuResult = await menuResponse.json();

        console.log('Category API Response:', categoryResult);
        console.log('Menu API Response:', menuResult);

        if (
          categoryResult?.data?.categories?.length > 0 &&
          menuResult?.data?.length > 0
        ) {
          dispatch(setCategoriesData(categoryResult.data.categories));
          dispatch(setMenuData(menuResult.data));
        } else {
          dispatch(setCategoriesData([]));
          dispatch(setMenuData([]));
        }
      } catch (err) {
        dispatch(setError(err.message || "Unknown error"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCategoriesAndItems();
  }, [dispatch, lang]);

  // Add debug logging for categories
  useEffect(() => {
    console.log('Current categories in Redux:', categories);
  }, [categories]);

  const handleQuantityChange = (item, quantity) => {
    console.log('Adding to cart - Item data:', item);
    console.log('Price type:', typeof item.price, 'Price value:', item.price);
    
    if (!item.price || isNaN(Number(item.price))) {
      console.error('Invalid price for item:', item);
      return;
    }
    
    if (quantity > 0) {
      const cartItem = {
        slug: item.slug,
        name: item.name,
        price: Number(item.price),
        quantity: quantity,
        image: item.image,
        description: item.description,
        categories: item.categories
      };
      console.log('Dispatching to cart:', cartItem);
      dispatch(addToCart(cartItem));
    } else {
      dispatch(removeFromCart(item.slug));
    }
  };

  if (loading || error || categories.length === 0 || foodItems.length === 0) {
    return <SkeletonItems />;
  }

  return (
    <div className="Items-List w-100 flex col g-20">
      <div className="list-header flex space-between">
        <div className={Styles.listHeading}>Menu</div>
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
        const filteredItems = foodItems.filter((item) => {
          return item.categories.some(
            (cat) => cat.slug === category.slug
          );
        });

        return (
          <div key={category.slug} id={category.slug} className="category-section">
            <div className={Styles.category_title}>{category.name}</div>

            {filteredItems.length > 0 ? (
              <div className={`food-items flex ${isGridView ? "grid" : "col"}`}>
                {filteredItems.map((item) => {
                  const cartItem = cart[item.slug];
                  return (
                    <div
                      className={`item ${isGridView ? "grid-view" : "list"}`}
                      key={item.slug}
                    >
                      <div className={"item-image flex"}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={560}
                          height={350}
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
                        />
                      </div>
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <div className="flex space-between">
                          <div className="item-price">
                            QAR {item.price?.toFixed(2) || "0.00"}
                          </div>
                          <QuantitySelector
                            quantity={cartItem?.quantity || 0}
                            onQuantityChange={(qty) =>
                              handleQuantityChange(item, qty)
                            }
                          />
                        </div>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  );
                })}
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
