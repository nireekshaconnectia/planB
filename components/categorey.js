// components/Category.js
// import Link from "next/link";
import { useTranslations } from "next-intl";
import { Link, animateScroll as scroll } from "react-scroll"; // Import from react-scroll
import { useEffect, useState } from "react";

const Category = () => {
  const t = useTranslations();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorey`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const result = await response.json();
        setCategories(result.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="categorey-grid" id="categorey-box">
      {categories.map((category) => (
        <div key={category._id} className="categorey-item">
          <Link 
          key={`/#{category.slug}`}
            to={category.slug}
            smooth={true}
            offset={-125} // Adjust for your navbar height
            duration={500} // Duration of the scroll animation (500ms)
          >
            <div
              className="featured-image"
              style={{
                backgroundImage: `url(${category.image})`,
              }}
            />
            <div>
              <h2>{t(category.slug) || category.name}</h2>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Category;