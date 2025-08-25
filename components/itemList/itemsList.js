"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import QuantitySelector from "@/components/quantitySelector/quantitySelector";
import SkeletonItems from "@/components/skeleton/SkeletonItems";
import { CiBoxList, CiGrid2H } from "react-icons/ci";
import Styles from "./itemslist.module.css";
import Image from "next/image";
import Link from "next/link";
import { useApiData } from "@/lib/hooks/useApiData";
import { useTranslations } from "next-intl";
export default function Items() {
  const [isGridView, setIsGridView] = useState(true);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const { menu: foodItems, categories, loading, error } = useApiData();
  const t = useTranslations();

  const handleQuantityChange = (item, quantity) => {
    if (quantity === 0) {
      dispatch(removeFromCart(item.slug));
    } else {
      dispatch(addToCart({ ...item, quantity }));
    }
  };

  if (loading) {
    return <SkeletonItems />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!categories || categories.length === 0) {
    return <div>No categories found</div>;
  }

  return (
    <div className="Items-List w-100 flex col g-20">
      <div className="list-header flex space-between">
        <div className={Styles.listHeading}>{t("menu")}</div>
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
          return item.categories.some((cat) => cat.slug === category.slug);
        });

        return (
          <div
            key={category.slug}
            id={category.slug}
            className="category-section"
          >
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
                      <Link href={`/menu/${item.slug}`}>
                        <div className={"item-image flex"}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={560}
                            height={350}
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                          />
                        </div>
                      </Link>

                      <div className="item-details">
                        <Link href={`/menu/${item.slug}`}>
                          <h3>{item.name}</h3>
                        </Link>
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
                        <Link href={`/menu/${item.slug}`}>
                          <p>{item.description}</p>
                        </Link>
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
