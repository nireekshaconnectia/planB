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
    <div className="Items-List w-100 flex col g-20">
      <div className="list-header flex space-between" id="breakfast">
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
                <div className="flex space-between">
                  <div className="item-price">QAR {item.foodPrice.toFixed(2)}</div>
                  <QuantitySelector />
                </div>
                <p>{item.foodDescription}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="hot-drinks">
      <div className="categorey-title">Hot Drinks</div>
        <div className={`food-items flex col`}>
          {foodItems.map((item) => (
            <div className={`item ${isGridView ? 'grid-view' : 'list'}`} key={item.foodSlug}>
              <div className="item-image flex">
                <img src={item.featureImage} alt={item.foodName} />
              </div>
              <div className="item-details">
                <h3>{item.foodName}</h3>
                <div className="flex space-between">
                  <div className="item-price">QAR {item.foodPrice.toFixed(2)}</div>
                  <QuantitySelector />
                </div>
                <p>{item.foodDescription}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="cold-drinks">
      <div className="categorey-title">Cold Drinks</div>
        <div className={`food-items flex col`}>
          {foodItems.map((item) => (
            <div className={`item ${isGridView ? 'grid-view' : 'list'}`} key={item.foodSlug}>
              <div className="item-image flex">
                <img src={item.featureImage} alt={item.foodName} />
              </div>
              <div className="item-details">
                <h3>{item.foodName}</h3>
                <div className="flex space-between">
                  <div className="item-price">QAR {item.foodPrice.toFixed(2)}</div>
                  <QuantitySelector />
                </div>
                <p>{item.foodDescription}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
      <div id="all-day-dishes">
      <div className="categorey-title">All Day Dishes</div>
        <div className={`food-items flex col`}>
          {foodItems.map((item) => (
            <div className={`item ${isGridView ? 'grid-view' : 'list'}`} key={item.foodSlug}>
              <div className="item-image flex">
                <img src={item.featureImage} alt={item.foodName} />
              </div>
              <div className="item-details">
                <h3>{item.foodName}</h3>
                <div className="flex space-between ">
                  <div className="item-price">QAR {item.foodPrice.toFixed(2)}</div>
                  <QuantitySelector />
                </div>
                <p>{item.foodDescription}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
      <div id="salads">
      <div className="categorey-title">Salads</div>
        <div className={`food-items flex col`}>
          {foodItems.map((item) => (
            <div className={`item ${isGridView ? 'grid-view' : 'list'}`} key={item.foodSlug}>
              <div className="item-image flex">
                <img src={item.featureImage} alt={item.foodName} />
              </div>
              <div className="item-details">
                <h3>{item.foodName}</h3>
                <div className="flex space-between">
                  <div className="item-price">QAR {item.foodPrice.toFixed(2)}</div>
                  <QuantitySelector />
                </div>
                <p>{item.foodDescription}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
      <div id="desserts">
      <div className="categorey-title">Desserts</div>
        <div className={`food-items flex col`}>
          {foodItems.map((item) => (
            <div className={`item ${isGridView ? 'grid-view' : 'list'}`} key={item.foodSlug}>
              <div className="item-image flex">
                <img src={item.featureImage} alt={item.foodName} />
              </div>
              <div className="item-details">
                <h3>{item.foodName}</h3>
                <div className="flex space-between ">
                  <div className="item-price">QAR {item.foodPrice.toFixed(2)}</div>
                  <QuantitySelector />
                </div>
                <p>{item.foodDescription}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
      <div id="ice-cream">
      <div className="categorey-title">Ice Creams</div>
        <div className={`food-items flex col`}>
          {foodItems.map((item) => (
            <div className={`item ${isGridView ? 'grid-view' : 'list'}`} key={item.foodSlug}>
              <div className="item-image flex">
                <img src={item.featureImage} alt={item.foodName} />
              </div>
              <div className="item-details">
                <h3>{item.foodName}</h3>
                <div className="flex space-between ">
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
