"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import QuantitySelector from "@/components/quantitySelector/quantitySelector";
import { CiBoxList, CiGrid2H } from "react-icons/ci";

export default function Items() {
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]); // To hold categories fetched from the API
  const [isGridView, setIsGridView] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  // Fetch categories and food items only once
  useEffect(() => {
    const fetchCategoriesAndItems = async () => {
      try {
        // Fetch both categories and menu items
        const [categoryResponse, menuResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey`), // Corrected endpoint for categories
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`),
        ]);

        // Check if responses are successful
        if (!categoryResponse.ok || !menuResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const categoryResult = await categoryResponse.json();
        const menuResult = await menuResponse.json();

        // Log the full response for debugging only once
        console.log('Category Response:', categoryResult);
        console.log('Menu Items:', menuResult.data); // Debugging menu items

        // Check if categories exist and set them
        if (categoryResult && categoryResult.data && categoryResult.data.categories) {
          setCategories(categoryResult.data.categories); // Correct path to categories
        } else {
          console.error("Categories data is missing or incorrect:", categoryResult);
        }

        setFoodItems(menuResult.data); // menuResult.data contains the array of food items
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Only run once when the component mounts
    fetchCategoriesAndItems();
  }, []); // Empty dependency array means this effect only runs once when component mounts

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

      {/* Food Items Rendered by Categories */}
      {categories.length > 0 ? (
        categories.map((category) => {
          // Filter items for the current category
          const filteredItems = foodItems.filter(
            (item) => item.foodCategory.toLowerCase() === category.name.toLowerCase()
          );

          return (
            <div
              key={category.slug}
              id={category.slug} // Set the id to the category's slug for scrolling
              className="category-section"
            >
              {/* Render category name as a heading */}
              <div className="category-title">{category.name}</div>

              {/* Check if there are items for this category */}
              {filteredItems.length > 0 ? (
                <div className={`food-items flex ${isGridView ? "grid" : "col"}`}>
                  {filteredItems.map((item) => (
                    <div
                      className={`item ${isGridView ? "grid-view" : "list"}`}
                      key={item.foodSlug}
                    >
                      <div className="item-image flex">
                        <img src={item.featureImage} alt={item.foodName} />
                      </div>
                      <div className="item-details">
                        <h3>{item.foodName}</h3>
                        <div className="flex space-between">
                          <div className="item-price">
                            QAR {item.foodPrice ? item.foodPrice.toFixed(2) : "0.00"}
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
        })
      ) : (
        <p>Loading items...</p>
      )}
    </div>
  );
}