import { useEffect, useState } from "react";
import Item from "@/components/item/item";
import QuantitySelector from "@/components/quantitySelector/quantitySelector";
import { CiBoxList } from "react-icons/ci";
import { CiGrid2H } from "react-icons/ci";

export default function Items() {
  const [foodItems, setFoodItems] = useState([]);
  const [isGridView, setIsGridView] = useState(false); // State for toggling views

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/items.json"); // Adjust the path if necessary
        const data = await response.json();
        setFoodItems(data);
      } catch (error) {
        console.error("Error fetching the data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="Items-List w-100 flex col g-20 mt-20">
      <div className="list-header flex space-between">
        <div className="categorey-title">Breakfast</div>
        <div className="flex change-view">
          {/* Grid View Button */}
          <button onClick={() => setIsGridView(true)}>
            <CiGrid2H />
          </button>

          {/* List View Button */}
          <button onClick={() => setIsGridView(false)}>
            <CiBoxList />
          </button>
        </div>
      </div>
      <div>
        <div className={`food-items flex col`}>
          {foodItems.map((item) => (
            <div className={`item ${isGridView ? 'grid-view' : 'list'}`} key={item.foodSlug}>
              <div className="item-image flex">
                <img src={item.featureImage} alt={item.foodName} />
              </div>
              <div className="item-details">
                <h3>{item.foodName}</h3>
                <div className="flex space-between mt-20">
                  <div className="item-price">QAR {item.foodPrice.toFixed(2)}</div>
                  <QuantitySelector />
                </div>
                <p>{item.foodDescription}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
